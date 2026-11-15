// A finished file: what it is, where the browser can fetch it from, and deleting
// it once its link runs out.

import * as db from '../lib/db'
import { isFileId, objectKey } from '../lib/file-id'
import * as storage from '../lib/storage'
import { HttpError } from '../lib/http-error'
import { verifyShareLink } from '../lib/share-link'
import { hashRevocationToken } from '../lib/share-revocation'
import * as collections from './collections'
import { countedDownloadUrl, FileInfo, previewContentType, requirePassword, Visitor } from './file-access'

// What the download page shows before anyone commits to a one gigabyte download.
// A link can also hold several files, and then the answer lists them.
export async function info(id: string, expiry: unknown, signature: unknown, password?: string): Promise<FileInfo | collections.CollectionInfo> {
    verifyShareLink(id, expiry, signature)

    const collection = await collections.info(id, password)
    if (collection) return collection

    const file = await readFileInfo(id)
    requirePassword(file.passwordHash, password)

    return {
        id: file.id,
        fileName: file.fileName,
        contentType: file.contentType,
        size: file.size,
        protected: file.protected
    }
}

// A short-lived URL straight to the bucket. The same checks as info() come first,
// so a dead link gets a clear error instead of a redirect to a URL that fails oddly.
export async function downloadUrl(id: string, expiry: unknown, signature: unknown, visitor: Visitor, password?: string): Promise<string> {
    verifyShareLink(id, expiry, signature)

    const file = await readFileInfo(id)
    requirePassword(file.passwordHash, password)

    return countedDownloadUrl(id, file.fileName, visitor)
}

// Types a browser can only show as a picture, a video or a PDF. Anything else,
// SVG and HTML included, could run as a web page on the storage domain, so it is
// never shown inline. The uploader chooses the type, so this is an exact match.
const INLINE_TYPES = new Set([
    'image/avif', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/ogg', 'video/quicktime', 'video/webm',
    'application/pdf'
])

// Preview access validates the same share link and password but deliberately
// avoids recording a download.
export async function previewUrl(id: string, expiry: unknown, signature: unknown, password?: string): Promise<string> {
    verifyShareLink(id, expiry, signature)

    const file = await readFileInfo(id)
    requirePassword(file.passwordHash, password)

    // Any other type goes out as a download. An <img> tag still shows an SVG
    // sent this way, because it ignores the download header.
    if (!INLINE_TYPES.has(file.contentType)) return storage.presignDownloadUrl(objectKey(id), file.fileName)
    return storage.presignPreviewUrl(objectKey(id), file.fileName, file.contentType)
}

// Deletes the bytes of every file whose link has run out. The row stays, marked
// deleted, as the record that the file was once here.
export async function deleteExpired(): Promise<number> {
    const ids = await db.expiredFileIds()
    for (const id of ids) {
        await storage.deleteFile(objectKey(id))
        await db.markFileDeleted(id)
    }
    return ids.length
}

// Revokes a single file's link, or a link that holds several files together
// with every file in it.
export async function revoke(id: string, revocationToken: string): Promise<void> {
    if (!isFileId(id)) {
        throw new HttpError(404, 'This revocation token is not valid for this file')
    }

    if (await collections.revoke(id, revocationToken)) return

    const before = await db.revocationState(id)
    if (before && (before.deletedAt || before.revokedAt)) {
        return
    }

    if (!await db.revokeFile(id, hashRevocationToken(revocationToken))) {
        throw new HttpError(404, 'This revocation token is not valid for this file')
    }
}

async function readFileInfo(id: string): Promise<FileInfo & { passwordHash: string | null }> {
    if (!isFileId(id)) throw new HttpError(404, 'This link does not point at a file')

    const file = await db.findFile(id)
    if (!file) throw new HttpError(404, 'This file is not here any more')
    if (file.revokedAt) throw new HttpError(410, 'This share link has been revoked')
    return {
        id,
        fileName: file.fileName,
        contentType: previewContentType(file.contentType, file.fileName),
        size: file.size,
        protected: Boolean(file.passwordHash),
        passwordHash: file.passwordHash
    }
}
