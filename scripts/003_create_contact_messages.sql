-- Create contact messages table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company text,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Allow anyone to insert (Public Contact Form)
create policy "allow_public_insert" on public.contact_messages
  for insert with check (true);

-- Allow admins to read all messages
create policy "admins_select_all_messages" on public.contact_messages
  for select using (
    exists (
      select 1 from public.users 
      where id = auth.uid() and role = 'admin'
    )
  );
