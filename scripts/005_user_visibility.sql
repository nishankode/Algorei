-- Allow authenticated users to search for other users by email (required for team invites)
create policy "users_select_by_email" on public.users
  for select using (auth.role() = 'authenticated');
