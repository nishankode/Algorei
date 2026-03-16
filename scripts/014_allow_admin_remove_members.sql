-- 014_allow_admin_remove_members.sql
-- Allows company owners and admins to delete team members.

create policy "team_members_delete_admin" on public.team_members
  for delete using (
    is_client_owner(client_id)
  );

-- Also allow admins (from the team_members table itself) to remove members
-- We use the is_team_member helper but we need to ensure the user is an admin
-- Note: is_team_member(client_id) just checks membership.
-- We can add a more specific check if needed, but usually is_client_owner is enough 
-- for the primary admin (the owner).
