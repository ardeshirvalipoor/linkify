-- One privacy-preserving view row per visit to a share link.
-- IP addresses are hashed by the application before reaching this table.
create table public.link_views (
    id bigint generated always as identity primary key,
    link_id text not null,
    viewed_at timestamptz not null default now(),
    ip_hash text
);

create index link_views_link_id_idx
    on public.link_views (link_id, viewed_at desc);

create index link_views_ip_hash_idx
    on public.link_views (ip_hash);

alter table public.link_views enable row level security;
