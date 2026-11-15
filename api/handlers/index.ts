// One way in to every handler, so the routes read handlers.uploads.start.

import * as uploads from './uploads'
import * as files from './files'
import * as collections from './collections'

export default {
    uploads,
    files,
    collections
}
