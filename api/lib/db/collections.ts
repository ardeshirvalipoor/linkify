// Share links that hold several files. A collection has its own id, signed
// link, password and revocation token, and a list of files that were each
// finished on their own first.

import { sql } from './client'

export interface ShareCollectionRow {
    id: string
    expiresAt: Date
    passwordHash: string | null
    revokedAt: Date | null
    live: boolean
}

export interface ShareCollectionFileRow {
    id: string
    fileName: string
    contentType: string
    size: number
}

// A file to join, with the hash of the revocation token that came back when it
// finished. Holding that token is what proves the caller uploaded the file.
export interface CollectionMember {
    id: string
    revocationTokenHash: string
}

// Joins finished files under one new id. Answers null when any of them cannot be
// joined: it is gone, revoked or expired, or it came with the wrong token. The
// files must also share one password, because the link has only one.
//
// The link lasts as long as its newest file, and the older files are kept until
// then, so the link gets the whole lifetime the uploader chose. Each file's own
// link still stops on time, because its expiry is signed into it.
export async function createShareCollection(id: string, members: CollectionMember[], revocationTokenHash: string): Promise<Date | null> {
    const ids = members.map(member => member.id)

    return sql.begin(async transaction => {
        const rows = await transaction`
            select id, revocation_token_hash, password_hash, expires_at
            from files
            where id in ${transaction(ids)}
                and status = 'ready'
                and deleted_at is null
                and revoked_at is null
                and expires_at > now()
        `
        const found = new Map(rows.map(row => [row.id, row]))
        if (members.some(member => found.get(member.id)?.revocation_token_hash !== member.revocationTokenHash)) return null

        const passwordHash: string | null = rows[0].password_hash
        if (rows.some(row => row.password_hash !== passwordHash)) return null

        const expiresAt = new Date(Math.max(...rows.map(row => row.expires_at.getTime())))

        await transaction`
            insert into share_collections (id, expires_at, password_hash, revocation_token_hash)
            values (${id}, ${expiresAt}, ${passwordHash}, ${revocationTokenHash})
        `
        await transaction`
            insert into share_collection_files
            ${transaction(ids.map((fileId, position) => ({ collection_id: id, file_id: fileId, position })))}
        `
        await transaction`
            update files
            set expires_at = ${expiresAt}
            where id in ${transaction(ids)} and expires_at < ${expiresAt}
        `
        return expiresAt
    })
}

// The collection at this id, revoked or not. The id of a single file answers null.
export async function findShareCollection(id: string): Promise<ShareCollectionRow | null> {
    const [row] = await sql`
    select id, expires_at, password_hash, revoked_at
    from share_collections
    where id = ${id}
`
if (!row) return null
return {
    id: row.id,
    expiresAt: row.expires_at,
    passwordHash: row.password_hash,
    revokedAt: row.revoked_at,
    live: true
}
}

// The files a collection still holds, in the order they were queued. A file that
// was revoked or deleted on its own drops out of the list.
export async function shareCollectionFiles(id: string): Promise<ShareCollectionFileRow[]> {
    const rows = await sql`
        select files.id, files.file_name, files.content_type, files.size
        from share_collection_files
        join files on files.id = share_collection_files.file_id
        where share_collection_files.collection_id = ${id}
            and files.status = 'ready'
            and files.deleted_at is null
            and files.revoked_at is null
        order by share_collection_files.position
    `
    return rows.map(row => ({
        id: row.id,
        fileName: row.file_name,
        contentType: row.content_type,
        size: Number(row.size)
    }))
}

// Revokes the link and every file in it, so the files' own links stop too. As
// with revokeFile(), the deadline moves to now so the next cleanup deletes the
// bytes, and asking twice is safe.
export async function revokeShareCollection(id: string, revocationTokenHash: string): Promise<boolean> {
    return sql.begin(async transaction => {
        const [row] = await transaction`
            update share_collections
            set revoked_at = coalesce(revoked_at, now()), expires_at = least(expires_at, now())
            where id = ${id} and revocation_token_hash = ${revocationTokenHash}
            returning id
        `
        if (!row) return false
        await transaction`
            update files
            set revoked_at = coalesce(revoked_at, now()), expires_at = least(expires_at, now())
            where id in (
                select file_id from share_collection_files where collection_id = ${id}
            )
        `
        return true
    })
}
// Adds one finished file to a collection that still accepts files. The file takes
// the collection's password and deadline, so the whole link expires together.
export async function addShareCollectionFile(
    collectionId: string,
    fileId: string,
    passwordHash: string | null
): Promise<{ expiresAt: Date } | null> {
    return sql.begin(async transaction => {
        const [collection] = await transaction`
            select id, expires_at, password_hash
            from share_collections
            where id = ${collectionId} and revoked_at is null and expires_at > now()
        `
        if (!collection || collection.password_hash !== passwordHash) return null

        const [position] = await transaction`
            select coalesce(max(position), -1) + 1 as position
            from share_collection_files
            where collection_id = ${collectionId}
        `
        await transaction`
            insert into share_collection_files (collection_id, file_id, position)
            values (${collectionId}, ${fileId}, ${position.position})
            on conflict (collection_id, file_id) do nothing
        `
        await transaction`
            update files
            set password_hash = ${passwordHash}, expires_at = ${collection.expires_at}
            where id in (${fileId}) and status = 'ready' and deleted_at is null and revoked_at is null
        `
        return { expiresAt: collection.expires_at }
    })
}