import type { Request, Response } from 'express'
import { z } from 'zod'
import { HttpError } from '../lib/http-error'
import services from '../services'

const revokeSchema = z.object({
    revocationToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/)
})

const collectionSchema = z.object({
    files: z.array(z.object({
        id: z.string().regex(/^[A-Za-z0-9_-]{16}$/),
        revocationToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/)
    })).min(2).max(1000)
})

export async function createCollection(req: Request, res: Response) {
    const result = collectionSchema.safeParse(req.body)
    if (!result.success) throw new HttpError(400, 'At least two completed files are required')
    res.status(201).json(await services.files.createCollection(result.data.files))
}

// GET /api/files/:id
export async function info(req: Request<{ id: string }>, res: Response) {
    const password = typeof req.query.password === 'string' ? req.query.password : undefined
    res.json(await services.files.info(req.params.id, req.query.expires, req.query.signature, password))
}

// GET /api/files/:id/download
export async function download(req: Request<{ id: string }>, res: Response) {
    // app.ts tells Express to trust the proxy in front of us, so req.ip is the
    // address the person is really coming from and not Fly's own.
    const visitor = { address: req.ip ?? '', userAgent: req.get('user-agent') ?? null }
    const password = typeof req.query.password === 'string' ? req.query.password : undefined

    // A redirect, not a proxy. The browser follows it to the bucket and pulls
    // the bytes from there, so this machine carries none of the traffic.
    res.redirect(302, await services.files.downloadUrl(req.params.id, req.query.expires, req.query.signature, visitor, password))
}

// Preview uses a distinct endpoint so previewing never creates a download log.
export async function preview(req: Request<{ id: string }>, res: Response) {
    const password = typeof req.query.password === 'string' ? req.query.password : undefined
    res.redirect(302, await services.files.previewUrl(req.params.id, req.query.expires, req.query.signature, password))
}

// POST /api/files/:id/revoke
export async function revoke(req: Request<{ id: string }>, res: Response) {
    const result = revokeSchema.safeParse(req.body)
    if (!result.success) {
        throw new HttpError(400, 'A valid revocation token is required')
    }
    await services.files.revoke(req.params.id, result.data.revocationToken)
    res.status(204).end()
}

export async function downloadCollectionFile(req: Request<{ id: string; fileId: string }>, res: Response) {
    const visitor = { address: req.ip ?? '', userAgent: req.get('user-agent') ?? null }
    const password = typeof req.query.password === 'string' ? req.query.password : undefined
    res.redirect(302, await services.files.collectionDownloadUrl(
        req.params.id,
        req.params.fileId,
        req.query.expires,
        req.query.signature,
        visitor,
        password
    ))
}