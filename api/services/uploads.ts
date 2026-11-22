// The rules of an upload: how it starts, how it resumes, when it is finished.
//
// The service layer knows nothing about Express. It takes plain values, talks to
// the storage, and returns plain values. That is what makes it easy to read on
// its own and easy to test later.

import { MAX_FILE_SIZE, PART_SIZE, config } from '../config'
import { newFileId, objectKey } from '../lib/file-id'
import * as db from '../lib/db'
import * as storage from '../lib/storage'
import { readUploadToken, writeUploadToken } from '../lib/upload-token'
import { HttpError } from '../lib/http-error'
import { createShareLink, hashPassword, LinkExpiry, shareLinkExpiresAt } from '../lib/share-link'
import { createRevocationToken, hashRevocationToken } from '../lib/share-revocation'
import * as collections from './collections'

// Upload setup contains only file details; password protection is chosen when
// the upload finishes so it works the same for fresh and resumed uploads.
export interface NewUpload {
    fileName: string
    contentType: string
    size: number
}

export interface StartedUpload {
    token: string
    partSize: number
    totalParts: number
}

// Step one. Reserve a place in the bucket and hand the browser a token that
// stands for this upload from now on.
export async function start(file: NewUpload): Promise<StartedUpload> {
    if (file.size > MAX_FILE_SIZE) {
        throw new HttpError(413, `Files can be at most ${MAX_FILE_SIZE / (1024 * 1024 * 1024)} GB`)
    }

    const id = newFileId()

    // The row goes in before anything reaches R2. If this fails, nothing was
    // created and the person sees an error. The other order would leave parts in
    // the bucket that no row points at, which is the one mess we cannot find later.
    await db.insertFile(id, file)

    const uploadId = await storage.createMultipartUpload(objectKey(id), file.fileName, file.contentType)

    return {
        token: writeUploadToken({ id, uploadId, fileName: file.fileName, contentType: file.contentType, size: file.size }),
        partSize: PART_SIZE,
        totalParts: countParts(file.size)
    }
}

// Step two, asked once when an upload begins or begins again. The browser uses
// the answer to skip everything the storage already has.
export async function uploadedParts(token: string): Promise<storage.StoredPart[]> {
    const upload = readUploadToken(token)
    return storage.listParts(objectKey(upload.id), upload.uploadId)
}

// Step three, asked once per part. We only sign the URL; the bytes go straight
// from the browser to the bucket.
export async function partUrl(token: string, partNumber: number): Promise<string> {
    const upload = readUploadToken(token)
    const totalParts = countParts(upload.size)

    if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > totalParts) {
        throw new HttpError(400, `Part number must be a whole number between 1 and ${totalParts}`)
    }

    return storage.presignPartUrl(objectKey(upload.id), upload.uploadId, partNumber)
}

// Step four. Glue the parts together and return the link to share. A file can
// also join a live link that someone else made, and then it gets that link.
export async function finish(
    token: string,
    expiresIn: LinkExpiry,
    password?: string,
    collectionId?: string,
    expiry?: unknown,
    signature?: unknown
): Promise<{ id: string; url: string; revocationToken: string }> {
    const upload = readUploadToken(token)
    const key = objectKey(upload.id)

    // A file for a live link is checked against that link first. A refused file
    // then stays an unfinished upload, which the bucket's lifecycle rule removes.
    // Refusing it after the parts were glued would leave a whole file in the
    // bucket that no cleanup ever deletes.
    const collection = collectionId ? await collections.joinable(collectionId, expiry, signature, password) : null

    // We ask the bucket what it has rather than trusting a list sent by the
    // browser. The bucket is the only place that knows for certain, and its
    // answer already carries the ETags that the next call needs.
    const parts = await storage.listParts(key, upload.uploadId)
    const missing = missingParts(parts, countParts(upload.size))
    if (missing.length > 0) {
        throw new HttpError(409, `${missing.length} part(s) never arrived, starting with part ${missing[0]}`)
    }

    // A presigned URL does not limit how many bytes a part holds, so the size
    // limit is really enforced here. We refuse without aborting: the upload never
    // becomes a file, and the bucket's lifecycle rule removes its parts.
    const storedBytes = parts.reduce((total, part) => total + part.size, 0)
    if (storedBytes !== upload.size) {
        throw new HttpError(400, 'The uploaded parts do not match the size of this file')
    }

    await storage.completeMultipartUpload(key, upload.uploadId, parts)

    // R2 first, then the row. If this second call fails the bytes are safe and
    // the row is merely out of date, which can be repaired. The other order would
    // announce a file that is not there.
    // Store only the final password hash in the files row; a resumed upload can
    // therefore use the password entered at the moment it is completed.
    // The row and the share link get the same expiry, and the cleanup reads it
    // from the row. The revocation capability is returned once and only its hash
    // is persisted. A file that joins a live link takes that link's password and
    // deadline instead.
    let passwordHash = password?.trim() ? hashPassword(password.trim()) : null
    let expiresAt = shareLinkExpiresAt(expiresIn)
    if (collection) {
        passwordHash = collection.passwordHash
        expiresAt = Math.floor(collection.expiresAt.getTime() / 1000)
    }
    const revocationToken = createRevocationToken()

    await db.markFileReady(upload.id, passwordHash, new Date(expiresAt * 1000), hashRevocationToken(revocationToken))
    if (collection) await collections.add(collection, upload.id)

    return { id: upload.id, url: createShareLink(collection?.id ?? upload.id, expiresAt), revocationToken }
}

// Give up on an upload and let the storage throw away the parts it collected.
// R2 also answers yes when the upload had already finished, and the file stays
// in the bucket, so this call cannot tell us which case we are in. The row can.
export async function cancel(token: string): Promise<void> {
    const upload = readUploadToken(token)
    await storage.abortMultipartUpload(objectKey(upload.id), upload.uploadId)
    await db.markUploadCancelled(upload.id)
}

// Every part is PART_SIZE except the last, which holds the remainder.
function countParts(size: number): number {
    return Math.ceil(size / PART_SIZE)
}

function missingParts(parts: storage.StoredPart[], totalParts: number): number[] {
    const arrived = new Set(parts.map(part => part.partNumber))
    const missing: number[] = []

    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        if (!arrived.has(partNumber)) missing.push(partNumber)
    }

    return missing
}
