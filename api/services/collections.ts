// A link that holds several files. The upload page asks for one once every file
// in a queue has finished, and the download page lists what it holds.
//
// The id of a collection is a share id like any other, so GET /api/files/:id and
// revoking go through files.ts, which asks here first.

import { MAX_FILES_PER_LINK } from '../config'
import * as db from '../lib/db'
import { newFileId } from '../lib/file-id'
import { HttpError } from '../lib/http-error'
import { createShareLink, verifyShareLink } from '../lib/share-link'
import { createRevocationToken, hashRevocationToken } from '../lib/share-revocation'
import { countedDownloadUrl, FileInfo, previewContentType, requirePassword, Visitor } from './file-access'

export interface CollectionInfo {
    id: string
    files: FileInfo[]
    protected: boolean
    live: boolean
}

// A finished file, with the revocation token that came back when it finished.
export interface CollectionMember {
    id: string
    revocationToken: string
}

// A live link holds even one file, because others may add more to it later.
export async function create(members: CollectionMember[], live: boolean): Promise<{ id: string; url: string; revocationToken: string }> {
    const ids = members.map(member => member.id)
    if (ids.length < 1 || ids.length > MAX_FILES_PER_LINK || new Set(ids).size !== ids.length) {
        throw new HttpError(400, `A share link holds from 1 to ${MAX_FILES_PER_LINK} different files`)
    }

    const id = newFileId()
    const revocationToken = createRevocationToken()
    const expiresAt = await db.createShareCollection(id, members.map(member => ({
        id: member.id,
        revocationTokenHash: hashRevocationToken(member.revocationToken)
    })), hashRevocationToken(revocationToken), live)
    if (!expiresAt) throw new HttpError(400, 'These files cannot share one link')

    return { id, url: createShareLink(id, Math.floor(expiresAt.getTime() / 1000)), revocationToken }
}

// What the download page shows for a link that holds several files, or null
// when the id belongs to a single file. The caller has checked the signature.
export async function info(id: string, password?: string): Promise<CollectionInfo | null> {
    const collection = await db.findShareCollection(id)
    if (!collection) return null

    const files = await liveFiles(collection, password)
    const isProtected = Boolean(collection.passwordHash)
    return {
        id,
        protected: isProtected,
        live: collection.live,
        files: files.map(file => ({
            id: file.id,
            fileName: file.fileName,
            contentType: previewContentType(file.contentType, file.fileName),
            size: file.size,
            protected: isProtected
        }))
    }
}

// One file out of the collection, as a short-lived URL straight to the bucket.
export async function downloadUrl(id: string, fileId: string, expiry: unknown, signature: unknown, visitor: Visitor, password?: string): Promise<string> {
    verifyShareLink(id, expiry, signature)

    const collection = await db.findShareCollection(id)
    if (!collection) throw new HttpError(404, 'This share link does not hold several files')

    const file = (await liveFiles(collection, password)).find(file => file.id === fileId)
    if (!file) throw new HttpError(404, 'This file is not in this share link')
    return countedDownloadUrl(file.id, file.fileName, visitor)
}

// The live link a new file wants to join, after the checks a visitor gets. The
// upload asks this before it glues the file's parts together.
export async function joinable(id: string, expiry: unknown, signature: unknown, password?: string): Promise<db.ShareCollectionRow> {
    verifyShareLink(id, expiry, signature)

    const collection = await db.findShareCollection(id)
    if (!collection) throw new HttpError(404, 'This share link does not hold several files')
    if (collection.revokedAt) throw new HttpError(410, 'This share link has been revoked')
    if (collection.expiresAt.getTime() <= Date.now()) throw new HttpError(410, 'This share link has expired')
    if (!collection.live) throw new HttpError(403, 'This share link does not accept new files')
    requirePassword(collection.passwordHash, password)
    return collection
}

// Puts a finished file into the link. The link may have filled up or closed
// since joinable() said yes. The file then keeps the link's deadline, so the
// cleanup still removes it.
export async function add(collection: db.ShareCollectionRow, fileId: string): Promise<void> {
    if (!await db.addShareCollectionFile(collection.id, fileId, collection.passwordHash, MAX_FILES_PER_LINK)) {
        throw new HttpError(409, 'This share link is full or no longer accepts files')
    }
}

// True when the id and token belong to a collection, which is now revoked.
export async function revoke(id: string, revocationToken: string): Promise<boolean> {
    return db.revokeShareCollection(id, hashRevocationToken(revocationToken))
}

// The files a visitor may have, after the same checks a single file's link gets.
async function liveFiles(collection: db.ShareCollectionRow, password?: string): Promise<db.ShareCollectionFileRow[]> {
    if (collection.revokedAt) throw new HttpError(410, 'This share link has been revoked')
    if (collection.expiresAt.getTime() <= Date.now()) throw new HttpError(410, 'This share link has expired')
    requirePassword(collection.passwordHash, password)

    const files = await db.shareCollectionFiles(collection.id)
    if (files.length === 0) throw new HttpError(404, 'These files are not here any more')
    return files
}
