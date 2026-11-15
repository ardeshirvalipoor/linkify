// The one connection to Postgres. Only the other files in this folder use it.

import postgres from 'postgres'
import { config } from '../../config'

export const sql = postgres(config.databaseUrl, {
    // Supabase's pooler gives each query whichever connection is free, so a
    // statement prepared on one connection is not there on the next one. Turning
    // prepared statements off is what the pooler asks of every client.
    prepare: false,

    // Our machine handles small messages and nothing else, so a handful of
    // connections is plenty, and letting them go quickly suits a Fly machine
    // that stops when nobody is using it.
    max: 5,
    idle_timeout: 30
})
