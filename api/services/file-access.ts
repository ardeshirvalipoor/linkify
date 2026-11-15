// The checks and steps shared by every way to a file: its own link, and a link
// that holds several files. This is not a service of its own. files.ts and
// collections.ts both use it, which is why it is not listed in index.ts.

import { createHmac } from 'node:crypto'
import { config } from '../config'
import * as db from '../lib/db'
import { objectKey } from '../lib/file-id'
import { HttpError } from '../lib/http-error'
import { verifyPassword } from '../lib/share-link'
import * as storage from '../lib/storage'

export interface FileInfo {
    id: string
    fileName: string
    contentType: string
    size: number
    protected: boolean
}

// Who is asking. The handler digs these out of the request, because nothing in
// the services knows what an Express request is.
export interface Visitor {
    address: string
    userAgent: string | null
}

// A link without a password hash lets everyone in. One with a hash needs the
// matching password.
export function requirePassword(passwordHash: string | null, password?: string): void {
    if (!passwordHash) return
    if (typeof password !== 'string' || password.length === 0) {
        throw new HttpError(401, 'This file is password protected')
    }

    if (!verifyPassword(password, passwordHash)) {
        throw new HttpError(401, 'This password is not correct')
    }
}

// Records the download, then signs a short-lived URL straight to the bucket.
//
// An uncounted download is better than a download that does not happen, so a
// failure to record it is written to the log and then forgotten. Every other
// error in the services is allowed to reach the person.
export async function countedDownloadUrl(id: string, fileName: string, visitor: Visitor): Promise<string> {
    try {
        await db.recordDownload(id, hashAddress(visitor.address), visitor.userAgent)
    } catch (error) {
        console.error('Could not record the download', error)
    }
    return storage.presignDownloadUrl(objectKey(id), fileName)
}

// Recover a useful browser media type when the uploader reported a generic type.
export function previewContentType(contentType: string, fileName: string): string {
    if (contentType !== 'application/octet-stream') return contentType

    const extension = fileName.toLowerCase().split('.').pop()
    const knownTypes: Record<string, string> = {
        bmp: 'image/bmp',
        gif: 'image/gif',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        webp: 'image/webp',
        pdf: 'application/pdf',
        m4v: 'video/mp4',
        mov: 'video/quicktime',
        mp4: 'video/mp4',
        ogv: 'video/ogg',
        webm: 'video/webm'
    }
    return extension ? knownTypes[extension] ?? contentType : contentType
}

// This hashes the visitor's address before writing a download row, so the
// database stores only a stable fingerprint and never the raw IP.
function hashAddress(address: string): string {
    return createHmac('sha256', config.tokenSecret)
        .update(`linkify-address-v1:${address}`)
        .digest('base64url')
}
