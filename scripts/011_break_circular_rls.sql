-- 011_break_circular_rls.sql
-- Fixes the "infinite recursion detected in policy for relation clients" error.

-- 1. Create security-definer functions to break the recursion
-- These functions ignore RLS, allowing safe checks across related tables.

create or replace function public.is_team_member(check_client_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 
    from public.team_members 
    where client_id = check_client_id 
      and user_id = auth.uid()
  );
end;
$$;

create or replace function public.is_client_owner(check_client_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 
    from public.clients 
    where id = check_client_id 
      and owner_id = auth.uid()
  );
end;
$$;

-- 2. Clean up and re-create client policies
drop policy if exists "clients_select_invited" on public.clients;
create policy "clients_select_invited" on public.clients 
  for select using (is_team_member(id));

-- 3. Clean up and re-create team_members policies
drop policy if exists "team_members_select_company" on public.team_members;
create policy "team_members_select_company" on public.team_members
  for select using (is_client_owner(client_id));

drop policy if exists "team_members_all_company_owner" on public.team_members;
create policy "team_members_all_company_owner" on public.team_members
  for all using (is_client_owner(client_id));
