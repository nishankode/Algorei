-- 008_fix_rls_recursion.sql
-- Fixes the "infinite recursion" error in public.users RLS policies.

-- 1. Create a security-definer function to check admin status
-- This function runs with the privileges of the creator (postgres) and ignores RLS, breaking the recursion.
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 
    from public.users 
    where id = auth.uid() 
      and role = 'admin'
  );
end;
$$;

-- 2. Drop the recursive policy
drop policy if exists "admins_select_all" on public.users;
drop policy if exists "admins_select_all_clients" on public.clients;
drop policy if exists "admins_manage_all_clients" on public.clients;

-- 3. Re-create policies using the helper function
create policy "admins_select_all" on public.users 
  for select using (is_admin());

create policy "admins_select_all_clients" on public.clients 
  for select using (is_admin());

create policy "admins_manage_all_clients" on public.clients 
  for all using (is_admin());

-- 4. Simplified user visibility policy (already handled by 005 but ensuring consistency)
drop policy if exists "users_select_by_email" on public.users;
create policy "users_select_visibility" on public.users 
  for select using (
    auth.uid() = id -- Own record
    or is_admin()   -- Admins see all
    or auth.role() = 'authenticated' -- Everyone else can search by email (via frontend logic)
  );
