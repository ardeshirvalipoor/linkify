// Every call the browser makes to our own server, in one place, with types.
//
// baseline's `http` returns the status instead of throwing on a failure, so
// unwrap() below turns a failed response into an Error carrying the message the
// server wrote. That way the pages can just try/catch.

import { http } from '@codesuma/baseline'

// The browser and server share the same accepted link-lifetime values.
export type LinkExpiry = '1h' | '1d' | '1w'

export interface StartedUpload {
    token: string
    partSize: number
    totalParts: number
}

export interface UploadedPart {
    partNumber: number
    etag: string
    size: number
}

// A share link, and the token that lets its uploader revoke it. Finishing one
// file returns one, and so does joining several files into one link.
export interface ShareLink {
    id: string
    url: string
    revocationToken: string
}

export class ApiError extends Error {
    constructor(public readonly status: number, message: string) {
        super(message)
        this.name = 'ApiError'
    }
}

// The browser API reports whether a file is protected and accepts a password
// when completing an upload.
export interface FileInfo {
    id: string
    fileName: string
    contentType: string
    size: number
    protected: boolean
    source?: 'shared' | 'received'
}

// A link that holds several files. The server checks its password once for all.
export interface CollectionInfo {
    id: string
    name: string | null
    files: FileInfo[]
    sharedFiles: FileInfo[]
    receivedFiles: FileInfo[]
    protected: boolean
    live: boolean
}

export interface ExchangeActivity {
    id: number
    action: string
    fileId: string | null
    details: string | null
    createdAt: string
}

export interface ExchangeDashboard {
    name: string | null
    live: boolean
    expiresAt: string
    protected: boolean
    sharedFiles: FileInfo[]
    receivedFiles: FileInfo[]
    activity: ExchangeActivity[]
}

export type ShareInfo = FileInfo | CollectionInfo

export interface LinkAnalytics {
    views: number
    uniqueVisitors: number
    downloads: number
    expiresAt: string
}

export async function startUpload(file: File): Promise<StartedUpload> {
    return unwrap<StartedUpload>(await http.post('/api/uploads', {
        fileName: file.name,
        // An unknown type is normal for files with no extension.
        contentType: file.type || 'application/octet-stream',
        size: file.size
    }))
}

export async function uploadedParts(token: string): Promise<UploadedPart[]> {
    const body = unwrap<{ parts: UploadedPart[] }>(await http.get(`/api/uploads/${token}/parts`))
    return body.parts
}

export async function partUrl(token: string, partNumber: number): Promise<string> {
    const body = unwrap<{ url: string }>(await http.get(`/api/uploads/${token}/parts/${partNumber}/url`))
    return body.url
}

// Completion carries the latest password choice, including when reusing a saved token.
export async function finishUpload(
    token: string,
    expiresIn: LinkExpiry,
    password?: string,
    liveExchange?: { id: string; expires: string; signature: string }
): Promise<{ id: string; url: string; revocationToken: string }> {
    return unwrap(await http.post(`/api/uploads/${token}/complete`, {
        expiresIn,
        password,
        collectionId: liveExchange?.id,
        expires: liveExchange?.expires,
        signature: liveExchange?.signature
    }))
}

export async function revokeShareLink(id: string, revocationToken: string): Promise<void> {
    unwrap(await http.post(`/api/files/${id}/revoke`, { revocationToken }))
}

export async function recordLinkView(id: string, shareUrl: URL): Promise<void> {
    unwrap(await http.post(`/api/files/${id}/view?${shareUrl.searchParams.toString()}`))
}

export async function getLinkAnalytics(id: string, shareUrl: URL): Promise<LinkAnalytics> {
    return unwrap<LinkAnalytics>(await http.get(`/api/files/${id}/analytics?${shareUrl.searchParams.toString()}`))
}

// Joins finished files into one link. Each file's own revocation token proves
// that this browser uploaded it. A live link lets anyone who has it add files.
export async function createShareCollection(files: { id: string; revocationToken: string }[], live: boolean, name?: string): Promise<ShareLink> {
    return unwrap(await http.post('/api/files/collections', { files, live, name }))
}

export async function getExchangeDashboard(id: string, revocationToken: string): Promise<ExchangeDashboard> {
    return unwrap<ExchangeDashboard>(await http.post(`/api/files/${id}/dashboard`, { revocationToken }))
}

export async function deleteExchangeReceivedFile(id: string, fileId: string, revocationToken: string): Promise<void> {
    unwrap(await http.post(`/api/files/${id}/items/${fileId}/delete`, { revocationToken }))
}

export async function updateExchangeSettings(
    id: string,
    revocationToken: string,
    settings: { name: string | null; live: boolean; password?: string }
): Promise<void> {
    unwrap(await http.post(`/api/files/${id}/settings`, { revocationToken, ...settings }))
}

export async function cancelUpload(token: string): Promise<void> {
    unwrap(await http.delete(`/api/uploads/${token}`))
}

export async function fileInfo(id: string, password?: string, shareUrl?: URL): Promise<ShareInfo> {
    const query = new URLSearchParams(shareUrl?.search ?? window.location.search)
    // Passwords must be entered in the viewer, never inherited from a copied URL.
    query.delete('password')
    if (password) query.set('password', password)
    return unwrap<ShareInfo>(await http.get(`/api/files/${id}?${query.toString()}`))
}

// The counted download of one file in a link that holds several.
export function collectionFileDownloadUrl(collectionId: string, fileId: string, shareUrl: URL, password?: string): string {
    const query = new URLSearchParams(shareUrl.search)
    query.delete('password')
    if (password) query.set('password', password)
    return `/api/files/${collectionId}/items/${fileId}/download?${query.toString()}`
}

function unwrap<T>(response: { status: number; data: any }): T {
    if (response.status >= 200 && response.status < 300) return response.data as T
    throw new ApiError(response.status, response.data?.error || `The server answered ${response.status}`)
}
