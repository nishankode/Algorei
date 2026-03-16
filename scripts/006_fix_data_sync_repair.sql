-- 006_fix_data_sync_repair.sql
-- This script repairs existing data and ensures all users are properly linked to their companies.

-- 1. Ensure public.users contains all auth users
insert into public.users (id, email, first_name, last_name, role)
select 
    id, 
    email, 
    raw_user_meta_data ->> 'first_name',
    raw_user_meta_data ->> 'last_name',
    coalesce(raw_user_meta_data ->> 'role', 'client')
from auth.users
on conflict (id) do update set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    role = excluded.role;

-- 2. Clean up any duplicate client records before applying unique constraint
-- (In case there are multiple companies for one owner, we keep the newest one)
delete from public.clients a using public.clients b
where a.owner_id = b.owner_id and a.created_at < b.created_at;

-- 3. Ensure the unique constraint on owner_id exists
do $$ 
begin 
    if not exists (select 1 from pg_constraint where conname = 'clients_owner_id_key') then
        alter table public.clients add constraint clients_owner_id_key unique (owner_id);
    end if;
end $$;

-- 4. Backfill public.clients for anyone with a company name in their metadata
insert into public.clients (company_name, owner_id)
select 
    raw_user_meta_data ->> 'company',
    id
from auth.users
where raw_user_meta_data ->> 'company' is not null 
  and raw_user_meta_data ->> 'company' != ''
on conflict (owner_id) do update set
    company_name = excluded.company_name;

-- 5. Add a default team member entry for every owner if not exists
insert into public.team_members (client_id, user_id, role)
select 
    c.id,
    c.owner_id,
    'admin'
from public.clients c
on conflict (client_id, user_id) do nothing;
