-- 013_allow_members_select_colleagues.sql
-- Allows team members to see other members of the same company.

create policy "team_members_select_colleagues" on public.team_members
  for select using (
    is_team_member(client_id)
  );
