-- 1. Add name columns to public.users for relational availability
alter table public.users 
add column if not exists first_name text,
add column if not exists last_name text;

-- 2. Add unique constraint to clients to allow efficient syncing per user
do $$ 
begin 
    if not exists (select 1 from pg_constraint where conname = 'clients_owner_id_key') then
        alter table public.clients add constraint clients_owner_id_key unique (owner_id);
    end if;
end $$;

-- 3. Unified sync function for both new users and profile updates
create or replace function public.handle_user_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  company_name_val text;
begin
  -- Sync to public.users table
  insert into public.users (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'client')
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name;

  -- Sync to public.clients table (Company)
  company_name_val := new.raw_user_meta_data ->> 'company';
  
  if company_name_val is not null and company_name_val != '' then
    insert into public.clients (company_name, owner_id)
    values (company_name_val, new.id)
    on conflict (owner_id) do update set
      company_name = excluded.company_name;
  end if;

  return new;
end;
$$;

-- 4. Re-setup triggers
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_updated on auth.users;

-- Trigger on INSERT (Signup)
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_user_sync();

-- Trigger on UPDATE (Profile change)
create trigger on_auth_user_updated
  after update on auth.users
  for each row
  when (old.raw_user_meta_data is distinct from new.raw_user_meta_data or old.email is distinct from new.email)
  execute function public.handle_user_sync();
