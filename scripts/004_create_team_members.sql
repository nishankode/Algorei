-- Create the team_members table to link users to client companies
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role text check (role in ('admin', 'member', 'viewer')) default 'member',
  created_at timestamp with time zone default now(),
  unique(client_id, user_id)
);

-- Enable RLS
alter table public.team_members enable row level security;

-- Policies for team_members
-- 1. Users can see their own team memberships
create policy "team_members_select_own" on public.team_members
  for select using (auth.uid() = user_id);

-- 2. Owners/Admins of the client company can see all team members
create policy "team_members_select_company" on public.team_members
  for select using (
    exists (
      select 1 from public.clients 
      where id = team_members.client_id 
      and owner_id = auth.uid()
    )
  );

-- 3. Owners/Admins of the client company can manage (invite/remove) team members
create policy "team_members_all_company_owner" on public.team_members
  for all using (
    exists (
      select 1 from public.clients 
      where id = team_members.client_id 
      and owner_id = auth.uid()
    )
  );

-- 4. Global admins can manage everything
create policy "admins_manage_all_team_members" on public.team_members
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
