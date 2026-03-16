-- 010_allow_invited_client_view.sql
-- Allows users with pending invitations to see the company name they were invited to.

create policy "clients_select_invited" on public.clients 
  for select using (
    id in (
      select client_id from public.team_members 
      where user_id = auth.uid()
    )
  );
