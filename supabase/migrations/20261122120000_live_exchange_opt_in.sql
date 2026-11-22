-- Letting others add files to a link is now the uploader's choice, and it starts
-- off. The column first arrived defaulting to on, so every link made before this
-- one was never asked. Those links are closed.
alter table public.share_collections
    alter column live set default false;

update public.share_collections
    set live = false;
