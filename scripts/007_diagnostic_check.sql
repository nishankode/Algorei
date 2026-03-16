-- 007_diagnostic_check.sql
-- Run this to see exactly what is in your database for your account.

-- 1. Check your user record in public.users
select id, email, first_name, last_name, role 
from public.users 
where email = 'mnsn.n006@gmail.com';

-- 2. Check if a client record exists for your ID
select id, company_name, owner_id, created_at
from public.clients 
where owner_id = (select id from public.users where email = 'mnsn.n006@gmail.com');

-- 3. Check if you are in the team_members table
select * 
from public.team_members 
where user_id = (select id from public.users where email = 'mnsn.n006@gmail.com');

-- 4. Check the person you are trying to invite
select id, email, first_name, last_name 
from public.users 
where email = 'mdnishan006@gmail.com';
