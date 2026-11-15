// Several files, sent one after another, then shared under one link.
//
// Each file goes through sendFile() on its own, so each one resumes the same way
// a single upload does. No file is finished until every file has been sent.
// Finishing is what starts a link's lifetime, so a long queue, or a pause in the
// middle of one, does not eat into it. When more than one file has finished, the
// server joins them into one link.
//
// Nothing here touches the screen. The page passes in callbacks and decides for
// itself what to draw.

import * as api from './api'
import { finishFile, sendFile, UploadReport } from './upload'
import { fingerprint } from './upload-store'

// The server enforces both of these too. Checking here turns a file away before
// any of it is sent.
export const MAX_FILE_SIZE = 1024 * 1024 * 1024
export const MAX_FILES = 100

// 'complete' means every part is in storage. The file itself is finished, and
// gets its link, at the end of the run.
export type ItemStatus = 'queued' | 'uploading' | 'paused' | 'complete' | 'failed'

export interface QueueItem {
    file: File
    status: ItemStatus
    // Set once every part is in storage.
    token?: string
    // Set once the file is finished.
    link?: api.ShareLink
}

export interface RunOptions {
    expiresIn: api.LinkExpiry
    password?: string
    onItem(item: QueueItem): void
    onStatus(message: string): void
    onProgress(report: UploadReport): void
}

export interface RunResult {
    // True when the person paused. Running again carries on where this stopped.
    paused: boolean
    // The link for every finished file, when at least one finished.
    link?: api.ShareLink
    // The last thing that went wrong, when something did.
    error?: string
}

// What add() turned away, so the page can say why.
export interface Refused {
    tooLarge?: File
    tooMany: boolean
}

export function createUploadQueue() {
    const items: QueueItem[] = []
    let controller: AbortController | null = null

    // Adds the files that can go. A file the queue already holds is skipped.
    function add(files: File[]): Refused {
        const refused: Refused = { tooMany: false }
        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) refused.tooLarge ??= file
            else if (items.some(item => fingerprint(item.file) === fingerprint(file))) continue
            else if (items.length >= MAX_FILES) refused.tooMany = true
            else items.push({ file, status: 'queued' })
        }
        return refused
    }

    async function run(options: RunOptions): Promise<RunResult> {
        // One signal for the whole run, so a pause between two files counts too.
        const current = new AbortController()
        controller = current
        let error: string | undefined
        const set = (item: QueueItem, status: ItemStatus) => {
            item.status = status
            options.onItem(item)
        }

        try {
            for (const item of items) {
                if (item.token) continue
                if (current.signal.aborted) break
                set(item, 'uploading')
                try {
                    item.token = await sendFile(item.file, { onStatus: options.onStatus, onProgress: options.onProgress, signal: current.signal })
                    set(item, 'complete')
                } catch (problem) {
                    if (current.signal.aborted) {
                        set(item, 'paused')
                        break
                    }
                    error = describe(problem)
                    set(item, 'failed')
                }
            }
            if (current.signal.aborted && items.some(item => !item.token)) return { paused: true }

            for (const item of items) {
                if (!item.token || item.link) continue
                try {
                    item.link = await finishFile(item.file, item.token, options.onStatus, options.expiresIn, options.password)
                } catch (problem) {
                    // Send it again next time, because the storage may have let its parts go.
                    item.token = undefined
                    error = describe(problem)
                    set(item, 'failed')
                }
            }

            const finished = items.flatMap(item => item.link ? [item.link] : [])
            if (finished.length < 2) return { paused: false, link: finished[0], error }
            const link = await api.createShareCollection(finished.map(({ id, revocationToken }) => ({ id, revocationToken })))
            return { paused: false, link, error }
        } catch (problem) {
            return { paused: false, error: describe(problem) }
        } finally {
            controller = null
        }
    }

    return {
        items: items as readonly QueueItem[],
        add,
        run,
        // Stops the file being sent. Its stored parts stay for the next run.
        pause: () => controller?.abort(),
        running: () => controller !== null,
        clear: () => { items.length = 0 }
    }
}

function describe(problem: unknown): string | undefined {
    return problem instanceof Error ? problem.message : undefined
}
