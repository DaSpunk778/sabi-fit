-- Creates a profiles row for any account that doesn't have one.
-- Accounts made before the sign-up trigger (0001_init.sql) existed have no
-- row, so their name can't be shown or edited. This copies the name they
-- signed up with, or "Athlete" if there isn't one.
-- Run after 0001_init.sql. Safe to run more than once.

insert into public.profiles (id, name)
select
  u.id,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'name'), ''), 'Athlete')
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);
