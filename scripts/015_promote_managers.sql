-- 015_promote_managers.sql
-- Promotes the leadership team to the global 'admin' role for platform oversight.

UPDATE public.users
SET role = 'admin'
WHERE email IN (
  'nishannprof006@gmail.com',
  'mdnishan006@gmail.com'
);

-- Note: You can add other email addresses (CEO, CTO) to this list as needed.
