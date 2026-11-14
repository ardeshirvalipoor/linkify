create table public.share_collections (
    id text primary key,
    expires_at timestamptz not null,
    password_hash text,
    revocation_token_hash text not null,
    revoked_at timestamptz,
    created_at timestamptz not null default now()
);

create table public.share_collection_files (
    collection_id text not null references public.share_collections on delete cascade,
    file_id text not null references public.files on delete cascade,
    position integer not null,
    primary key (collection_id, file_id),
    unique (collection_id, position)
);

create index share_collection_files_file_id_idx on public.share_collection_files (file_id);

alter table public.share_collections enable row level security;
alter table public.share_collection_files enable row level security;