import { Router } from 'express'
import handlers from '../handlers'

export const fileRoutes = Router()

// Joins files that have each finished into one share link.
fileRoutes.post('/collections', handlers.collections.create)
fileRoutes.get('/:id', handlers.files.info)
fileRoutes.post('/:id/revoke', handlers.files.revoke)
fileRoutes.post('/:id/view', handlers.files.recordView)
fileRoutes.get('/:id/analytics', handlers.files.analytics)
// Keep inline previews separate from downloads so page visits are not counted.
fileRoutes.get('/:id/preview', handlers.files.preview)
fileRoutes.get('/:id/download', handlers.files.download)
// One file out of a link that holds several.
fileRoutes.get('/:id/items/:fileId/download', handlers.collections.download)
