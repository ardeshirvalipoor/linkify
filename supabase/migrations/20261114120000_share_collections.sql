-- Share links that hold several files.
--
-- Each file in a queue is uploaded and finished on its own, with its own row in
-- files. A collection then joins them under a new share id, with its own expiry,
-- password hash and revocation token, so one link can be sent for all of them.

create table public.share_collections (
    id text primary key,
    expires_at timestamptz not null,
    password_hash text,
    revocation_token_hash text not null,
    revoked_at timestamptz,
    created_at timestamptz not null default now()
);

-- Which files a collection holds, and in what order the download page lists them.
create table public.share_collection_files (
    collection_id text not null references public.share_collections on delete cascade,
    file_id text not null references public.files on delete cascade,
    position integer not null,
    primary key (collection_id, file_id),
    unique (collection_id, position)
);

create index share_collection_files_file_id_idx on public.share_collection_files (file_id);

-- The same closed door as every other table: no policies, so Supabase's public
-- REST API sees nothing. Our server connects as the owner and is not affected.
alter table public.share_collections enable row level security;
alter table public.share_collection_files enable row level security;
