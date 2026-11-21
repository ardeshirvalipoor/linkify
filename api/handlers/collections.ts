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
    })).min(1).max(MAX_FILES_PER_LINK)
})

// POST /api/files/collections
export async function create(req: Request, res: Response) {
    const result = createSchema.safeParse(req.body)
    if (!result.success) throw new HttpError(400, `A share link holds from 1 to ${MAX_FILES_PER_LINK} finished files`)
    res.status(201).json(await services.collections.create(result.data.files))
}

// GET /api/files/:id/items/:fileId/download
export async function download(req: Request<{ id: string; fileId: string }>, res: Response) {
    const visitor = { address: req.ip ?? '', userAgent: req.get('user-agent') ?? null }
    const password = typeof req.query.password === 'string' ? req.query.password : undefined
    res.redirect(302, await services.collections.downloadUrl(req.params.id, req.params.fileId, req.query.expires, req.query.signature, visitor, password))
}
