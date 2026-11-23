// One row per file, and one row per download of it.

import { sql } from './client'

export interface NewFile {
    fileName: string
    contentType: string
    size: number
}

// Written the moment an upload starts, before anything exists in R2. The row
// says somebody intends to put a file at this id. It stays in status
// 'uploading' until every part has arrived.
export async function insertFile(id: string, file: NewFile): Promise<void> {
    await sql`
        insert into files (id, file_name, content_type, size)
        values (${id}, ${file.fileName}, ${file.contentType}, ${file.size})
    `
}

// The parts are glued together and the object is whole. Only now is there a real
// file at this id.
// Completion saves the final optional password hash, the link's expiry and
// the revocation token hash alongside the ready status.
export async function markFileReady(id: string, passwordHash: string | null, expiresAt: Date, revocationTokenHash: string): Promise<void> {
    await sql`
        update files
        set status = 'ready', completed_at = now(), password_hash = ${passwordHash}, expires_at = ${expiresAt},
            revocation_token_hash = ${revocationTokenHash}
        where id = ${id}
    `
}

// The link ran out and the bytes were deleted. We keep the row rather than
// removing it, so a link that once worked can later be told apart from one that
// never did.
export async function markFileDeleted(id: string): Promise<void> {
    await sql`
        update files
        set deleted_at = now()
        where id = ${id}
    `
}

// The person gave up before the upload finished. A finished file is left alone,
// because the expiry cleanup skips deleted rows and would never remove its bytes.
export async function markUploadCancelled(id: string): Promise<void> {
    await sql`
        update files
        set deleted_at = now()
        where id = ${id} and status = 'uploading'
    `
}

// Files whose link has run out but whose bytes have not been deleted yet.
export async function expiredFileIds(): Promise<string[]> {
    const rows = await sql`
        select id from files
        where expires_at <= now() and deleted_at is null
    `
    return rows.map(row => row.id)
}

export interface FileRow {
    id: string
    fileName: string
    contentType: string
    size: number
    // Password verification uses this hash without reading it from object storage.
    passwordHash: string | null
    revokedAt: Date | null
}

// The one question a share link asks: is there a file at this id that somebody
// is allowed to have? A row that is still uploading, and a row that was
// cancelled, both answer no, the same as an id that was never used.
export async function findFile(id: string): Promise<FileRow | null> {
    const [row] = await sql`
        select id, file_name, content_type, size, password_hash, revoked_at
        from files
        where id = ${id} and status = 'ready' and deleted_at is null
    `
    if (!row) return null

    // Postgres hands a bigint over as a string, because the largest one does not
    // fit in a JavaScript number. Ours is a gigabyte at most, so it fits easily.
    return {
        id: row.id,
        fileName: row.file_name,
        contentType: row.content_type,
        size: Number(row.size),
        passwordHash: row.password_hash,
        revokedAt: row.revoked_at
    }
}

export interface RevocationState {
    deletedAt: Date | null
    revokedAt: Date | null
}

export async function revocationState(id: string): Promise<RevocationState | null> {
    const [row] = await sql`
        select deleted_at, revoked_at
        from files
        where id = ${id}
            and status = 'ready'
    `
    if (!row) return null
    return {
        deletedAt: row.deleted_at,
        revokedAt: row.revoked_at
    }
}

// The raw revocation token never reaches the database. The update also makes
// repeated revocation requests safe while rejecting unrelated credentials.
export async function revokeFile(id: string, revocationTokenHash: string): Promise<boolean> {
    const [row] = await sql`
        with match as (
            select id
            from files
            where id = ${id}
                and status = 'ready'
                and revocation_token_hash = ${revocationTokenHash}
        )
        update files
        set revoked_at = coalesce(revoked_at, now()),
            expires_at = least(expires_at, now())
        from match
        where files.id = match.id
            and files.deleted_at is null
        returning files.id
    `
    if (row) return true

    const [deleted] = await sql`
        select id
        from files
        where id = ${id}
            and status = 'ready'
            and deleted_at is not null
            and revocation_token_hash = ${revocationTokenHash}
    `
    return Boolean(deleted)
}

// One row per download, and a running total kept on the file itself.
//
// The two statements are not wrapped in a transaction. If the second one fails
// the total sits one behind, which nobody will notice, and the downloads table
// still holds the truth the total can be rebuilt from.
export async function recordDownload(id: string, ipHash: string, userAgent: string | null): Promise<void> {
    await sql`
        insert into downloads (file_id, ip_hash, user_agent)
        values (${id}, ${ipHash}, ${userAgent})
    `
    await sql`
        update files
        set download_count = download_count + 1
        where id = ${id}
    `
}

export interface LinkAnalytics {
    views: number
    uniqueVisitors: number
    downloads: number
    expiresAt: Date
}

export async function recordLinkView(id: string, ipHash: string): Promise<void> {
    await sql`
        insert into link_views (link_id, ip_hash)
        values (${id}, ${ipHash})
    `
}

export async function linkAnalytics(id: string): Promise<LinkAnalytics | null> {
    const [collection] = await sql`
        select id, expires_at
        from share_collections
        where id = ${id}
    `

    if (collection) {
        const [row] = await sql`
            with member_downloads as (
                select downloads.ip_hash
                from downloads
                join share_collection_files on share_collection_files.file_id = downloads.file_id
                where share_collection_files.collection_id = ${id}
            ),
            visitors as (
                select ip_hash from link_views where link_id = ${id}
                union all
                select ip_hash from member_downloads
            )
            select
                (select count(*)::int from link_views where link_id = ${id}) as views,
                (select count(*)::int from (select distinct ip_hash from visitors where ip_hash is not null) as distinct_visitors) as unique_visitors,
                (select count(*)::int from member_downloads) as downloads
        `
        if (!row) return null
        return {
            views: row.views,
            uniqueVisitors: row.unique_visitors,
            downloads: row.downloads,
            expiresAt: collection.expires_at
        }
    }

    const [file] = await sql`
        select id, expires_at
        from files
        where id = ${id} and status = 'ready' and deleted_at is null
    `
    if (!file) return null

    const [row] = await sql`
        with visitors as (
            select ip_hash from link_views where link_id = ${id}
            union all
            select ip_hash from downloads where file_id = ${id}
        )
        select
            (select count(*)::int from link_views where link_id = ${id}) as views,
            (select count(*)::int from (select distinct ip_hash from visitors where ip_hash is not null) as distinct_visitors) as unique_visitors,
            (select count(*)::int from downloads where file_id = ${id}) as downloads
    `
    return {
        views: row.views,
        uniqueVisitors: row.unique_visitors,
        downloads: row.downloads,
        expiresAt: file.expires_at
    }
}
