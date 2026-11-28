// Links that hold several files. The routes live beside the other file routes,
// because a collection's id is a share id like any other.

import type { Request, Response } from 'express'
import { z } from 'zod'
import { MAX_FILES_PER_LINK } from '../config'
import { HttpError } from '../lib/http-error'
import services from '../services'

const createSchema = z.object({
    files: z.array(z.object({
        id: z.string().regex(/^[A-Za-z0-9_-]{16}$/),
        revocationToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/)
    })).min(1).max(MAX_FILES_PER_LINK),
    // Whether anyone holding the link may add files to it.
    live: z.boolean().default(false),
    name: z.string().trim().max(100).optional()
})

const revocationSchema = z.object({
    revocationToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/)
})

const settingsSchema = revocationSchema.extend({
    name: z.string().trim().max(100).nullable().optional(),
    live: z.boolean(),
    // Left out, the link keeps the password it has.
    password: z.string().trim().min(6).max(128).optional()
})

// POST /api/files/collections
export async function create(req: Request, res: Response) {
    const result = createSchema.safeParse(req.body)
    if (!result.success) throw new HttpError(400, `A share link holds from 1 to ${MAX_FILES_PER_LINK} finished files`)
    res.status(201).json(await services.collections.create(result.data.files, result.data.live, result.data.name))
}

// GET /api/files/:id/items/:fileId/download
export async function download(req: Request<{ id: string; fileId: string }>, res: Response) {
    const visitor = { address: req.ip ?? '', userAgent: req.get('user-agent') ?? null }
    const password = typeof req.query.password === 'string' ? req.query.password : undefined
    res.redirect(302, await services.collections.downloadUrl(req.params.id, req.params.fileId, req.query.expires, req.query.signature, visitor, password))
}

export async function dashboard(req: Request<{ id: string }>, res: Response) {
    const result = revocationSchema.safeParse(req.body)
    if (!result.success) throw new HttpError(400, 'A valid revocation token is required')
    const dashboard = await services.collections.dashboard(req.params.id, result.data.revocationToken)
    if (!dashboard) throw new HttpError(404, 'This exchange dashboard is not available')
    res.json(dashboard)
}

export async function deleteReceived(req: Request<{ id: string; fileId: string }>, res: Response) {
    const result = revocationSchema.safeParse(req.body)
    if (!result.success) throw new HttpError(400, 'A valid revocation token is required')
    await services.collections.deleteReceived(req.params.id, req.params.fileId, result.data.revocationToken)
    res.status(204).end()
}

export async function updateSettings(req: Request<{ id: string }>, res: Response) {
    const result = settingsSchema.safeParse(req.body)
    if (!result.success) throw new HttpError(400, 'Invalid exchange settings')
    await services.collections.updateSettings(
        req.params.id,
        result.data.revocationToken,
        result.data.name ?? null,
        result.data.live,
        result.data.password
    )
    res.status(204).end()
}
