-- 009_add_team_member_status.sql
-- Adds invitation status tracking to the team_members table.

-- 1. Add status column with default 'invited'
alter table public.team_members 
add column if not exists status text check (status in ('invited', 'active')) default 'invited';

-- 2. Update existing entries to 'active' (these are current owners/members)
update public.team_members set status = 'active' where status is null;

-- 3. Update the unique constraint logic (optional, keeping it as is for now)

-- 4. Ensure RLS allows users to see their own pending invitations
create policy "team_members_view_pending_invites" on public.team_members
  for select using (auth.uid() = user_id and status = 'invited');
