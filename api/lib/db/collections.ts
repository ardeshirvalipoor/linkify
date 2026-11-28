// Share links that hold several files. A collection has its own id, signed
// link, password and revocation token, and a list of files that were each
// finished on their own first.

import { sql } from './client'

export interface ShareCollectionRow {
    id: string
    name: string | null
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
    source: 'shared' | 'received'
}

export interface ShareCollectionActivityRow {
    id: number
    action: string
    fileId: string | null
    details: string | null
    createdAt: Date
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
//
// A live link also lets anyone who has it add files later.
export async function createShareCollection(id: string, name: string | null, members: CollectionMember[], revocationTokenHash: string, live: boolean): Promise<Date | null> {
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
            insert into share_collections (id, name, expires_at, password_hash, revocation_token_hash, live)
            values (${id}, ${name}, ${expiresAt}, ${passwordHash}, ${revocationTokenHash}, ${live})
        `
        await transaction`
            insert into share_collection_files
            ${transaction(ids.map((fileId, position) => ({ collection_id: id, file_id: fileId, position, source: 'shared' })))}
        `
        await transaction`
            update files
            set expires_at = ${expiresAt}
            where id in ${transaction(ids)} and expires_at < ${expiresAt}
        `
        await transaction`
            insert into share_collection_activity (collection_id, action, details)
            values (${id}, 'exchange_created', ${live ? 'Live exchange opened' : 'Exchange created'})
        `
        return expiresAt
    })
}

// The collection at this id, revoked or not. The id of a single file answers null.
export async function findShareCollection(id: string): Promise<ShareCollectionRow | null> {
    const [row] = await sql`
        select id, name, expires_at, password_hash, revoked_at, live
        from share_collections
        where id = ${id}
    `
    if (!row) return null
    return {
        id: row.id,
        name: row.name,
        expiresAt: row.expires_at,
        passwordHash: row.password_hash,
        revokedAt: row.revoked_at,
        live: row.live
    }
}

// The files a collection still holds, in the order they were queued. A file that
// was revoked or deleted on its own drops out of the list.
export async function shareCollectionFiles(id: string): Promise<ShareCollectionFileRow[]> {
    const rows = await sql`
        select files.id, files.file_name, files.content_type, files.size, share_collection_files.source
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
        size: Number(row.size),
        source: row.source
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
        await transaction`
            insert into share_collection_activity (collection_id, action, details)
            values (${id}, 'exchange_closed', 'Exchange closed')
        `
        return true
    })
}

// Adds one finished file to a live collection that is not full. The file takes
// the collection's password and deadline, so the whole link expires together.
// Locking the collection's row makes two files added at once queue up, so they
// never take the same position or push the link past its limit.
export async function addShareCollectionFile(
    collectionId: string,
    fileId: string,
    passwordHash: string | null,
    maxFiles: number
): Promise<{ expiresAt: Date } | null> {
    return sql.begin(async transaction => {
        const [collection] = await transaction`
            select id, expires_at, password_hash
            from share_collections
            where id = ${collectionId} and live and revoked_at is null and expires_at > now()
            for update
        `
        if (!collection || collection.password_hash !== passwordHash) return null

        const [held] = await transaction`
            select count(*)::int as count, coalesce(max(position), -1) + 1 as position
            from share_collection_files
            where collection_id = ${collectionId}
        `
        if (held.count >= maxFiles) return null

        await transaction`
            insert into share_collection_files (collection_id, file_id, position, source)
            values (${collectionId}, ${fileId}, ${held.position}, 'received')
            on conflict (collection_id, file_id) do nothing
        `
        await transaction`
            update files
            set password_hash = ${passwordHash}, expires_at = ${collection.expires_at}
            where id = ${fileId} and status = 'ready' and deleted_at is null and revoked_at is null
        `
        await transaction`
            insert into share_collection_activity (collection_id, action, file_id, details)
            values (${collectionId}, 'received_file', ${fileId}, 'Incoming file received')
        `
        return { expiresAt: collection.expires_at }
    })
}

export async function exchangeDashboard(id: string, revocationTokenHash: string): Promise<{
    collection: ShareCollectionRow
    shared: ShareCollectionFileRow[]
    received: ShareCollectionFileRow[]
    activity: ShareCollectionActivityRow[]
} | null> {
    const [row] = await sql`
        select id, name, expires_at, password_hash, revoked_at, live
        from share_collections
        where id = ${id} and revocation_token_hash = ${revocationTokenHash}
    `
    if (!row) return null

    const collection: ShareCollectionRow = {
        id: row.id,
        name: row.name,
        expiresAt: row.expires_at,
        passwordHash: row.password_hash,
        revokedAt: row.revoked_at,
        live: row.live
    }
    const files = await shareCollectionFiles(id)
    const activityRows = await sql`
        select id, action, file_id, details, created_at
        from share_collection_activity
        where collection_id = ${id}
        order by created_at desc
        limit 100
    `
    return {
        collection,
        shared: files.filter(file => file.source === 'shared'),
        received: files.filter(file => file.source === 'received'),
        activity: activityRows.map(row => ({
            id: Number(row.id),
            action: row.action,
            fileId: row.file_id,
            details: row.details,
            createdAt: row.created_at
        }))
    }
}

export async function deleteReceivedExchangeFile(id: string, fileId: string, revocationTokenHash: string): Promise<boolean> {
    return sql.begin(async transaction => {
        const [collection] = await transaction`
            select id from share_collections
            where id = ${id} and revocation_token_hash = ${revocationTokenHash}
        `
        if (!collection) return false

        const [removed] = await transaction`
            delete from share_collection_files
            where collection_id = ${id}
                and file_id = ${fileId}
                and source = 'received'
            returning file_id
        `
        if (!removed) return false

        await transaction`
            update files
            set revoked_at = coalesce(revoked_at, now()), expires_at = least(expires_at, now())
            where id = ${fileId}
        `
        await transaction`
            insert into share_collection_activity (collection_id, action, file_id, details)
            values (${id}, 'deleted_received', ${fileId}, 'Incoming file removed')
        `
        return true
    })
}

// A null password hash keeps the password the link has. The lifetime is never
// changed here, because the link's expiry is signed into its address.
export async function updateExchangeSettings(
    id: string,
    revocationTokenHash: string,
    name: string | null,
    live: boolean,
    passwordHash: string | null
): Promise<boolean> {
    return sql.begin(async transaction => {
        const [row] = await transaction`
            update share_collections
            set name = ${name}, live = ${live}, password_hash = coalesce(${passwordHash}, password_hash)
            where id = ${id} and revocation_token_hash = ${revocationTokenHash}
            returning id
        `
        if (!row) return false
        if (passwordHash) {
            await transaction`
                update files
                set password_hash = ${passwordHash}
                where id in (
                    select file_id from share_collection_files where collection_id = ${id}
                )
            `
        }
        await transaction`
            insert into share_collection_activity (collection_id, action, details)
            values (${id}, 'settings_updated', ${live ? 'Incoming uploads enabled' : 'Incoming uploads closed'})
        `
        return true
    })
}
