// The only module in the project that talks to Postgres.
//
// The database is hosted by Supabase, which is ordinary Postgres with a REST API
// and an accounts system built around it. We use none of that from here. This is
// a plain connection and hand-written SQL, in the same spirit as
// api/lib/storage.ts: the rest of the app calls these functions and never sees
// a query.
//
// The database holds no file bytes and no upload state. R2 still holds the
// bytes, and the signed upload token still carries an upload in progress. These
// tables are the index: which files exist, which links hold several of them, and
// who has downloaded them.

export * from './files'
export * from './collections'
