-- 012_allow_user_accept_invite.sql
-- Allows invited users to update their own status to 'active'.

create policy "team_members_update_own_status" on public.team_members
  for update using (
    auth.uid() = user_id 
    and status = 'invited'
  )
  with check (
    status = 'active'
  );
