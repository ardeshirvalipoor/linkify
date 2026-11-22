alter table public.share_collections
    add column if not exists live boolean not null default true;
