-- USERS (extends Supabase auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text check (role in ('admin','client')) default 'client',
  created_at timestamp default now()
);

alter table public.users enable row level security;

create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "admins_select_all" on public.users for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- CLIENT COMPANIES
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  owner_id uuid references public.users(id) on delete cascade,
  created_at timestamp default now()
);

alter table public.clients enable row level security;

create policy "clients_select_own" on public.clients for select using (owner_id = auth.uid());
create policy "clients_insert_own" on public.clients for insert with check (owner_id = auth.uid());
create policy "clients_update_own" on public.clients for update using (owner_id = auth.uid());
create policy "clients_delete_own" on public.clients for delete using (owner_id = auth.uid());
create policy "admins_select_all_clients" on public.clients for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "admins_manage_all_clients" on public.clients for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- AUTOMATIONS
create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_type text check (
    service_type in ('workflow_automation','lead_handling','support_agent')
  ),
  status text check (
    status in ('active','paused','completed')
  ) default 'active',
  client_id uuid references public.clients(id) on delete cascade,
  start_date timestamp default now(),
  end_date timestamp
);

alter table public.automations enable row level security;

create policy "automations_select_own" on public.automations for select using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "automations_insert_own" on public.automations for insert with check (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "automations_update_own" on public.automations for update using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "automations_delete_own" on public.automations for delete using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "admins_manage_all_automations" on public.automations for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- LEADS
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  name text,
  email text,
  status text check (
    status in ('new','contacted','qualified','closed')
  ) default 'new',
  created_at timestamp default now()
);

alter table public.leads enable row level security;

create policy "leads_select_own" on public.leads for select using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "leads_insert_own" on public.leads for insert with check (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "leads_update_own" on public.leads for update using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "leads_delete_own" on public.leads for delete using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "admins_manage_all_leads" on public.leads for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- AI SUPPORT AGENTS
create table if not exists public.support_agents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  agent_name text not null,
  status text check (
    status in ('active','inactive')
  ) default 'active',
  conversations_handled integer default 0
);

alter table public.support_agents enable row level security;

create policy "support_agents_select_own" on public.support_agents for select using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "support_agents_insert_own" on public.support_agents for insert with check (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "support_agents_update_own" on public.support_agents for update using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "support_agents_delete_own" on public.support_agents for delete using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "admins_manage_all_support_agents" on public.support_agents for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- ANALYTICS (Dashboard KPI metrics)
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  revenue_generated numeric default 0,
  outreach_done integer default 0,
  automations_completed integer default 0,
  created_at timestamp default now()
);

alter table public.analytics enable row level security;

create policy "analytics_select_own" on public.analytics for select using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "analytics_insert_own" on public.analytics for insert with check (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "analytics_update_own" on public.analytics for update using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "analytics_delete_own" on public.analytics for delete using (
  client_id in (select id from public.clients where owner_id = auth.uid())
);
create policy "admins_manage_all_analytics" on public.analytics for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- TRIGGER: Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'client')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
