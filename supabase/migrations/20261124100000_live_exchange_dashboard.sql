alter table public.share_collections
    add column if not exists name text;

alter table public.share_collection_files
    add column if not exists source text not null default 'shared'
        check (source in ('shared', 'received'));

create table if not exists public.share_collection_activity (
    id bigint generated always as identity primary key,
    collection_id text not null references public.share_collections on delete cascade,
    action text not null,
    file_id text,
    details text,
    created_at timestamptz not null default now()
);

create index if not exists share_collection_activity_collection_id_idx
    on public.share_collection_activity (collection_id, created_at desc);

alter table public.share_collection_activity enable row level security;
