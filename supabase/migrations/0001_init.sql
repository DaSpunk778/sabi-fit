-- SABI FIT schema + Row Level Security.
-- Safe to run more than once: it only creates what is missing.
-- Run it in the Supabase SQL editor (or `supabase db push`), then run seed.sql.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per user, created on sign-up by the trigger below
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  name          text not null,
  rest_seconds  int  not null default 90,
  sound         bool not null default true,
  vibration     bool not null default true,
  created_at    timestamptz not null default now()
);

-- Built-in exercises have user_id = null; custom ones belong to a user
create table if not exists public.exercises (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users on delete cascade,
  name               text not null,
  muscle             text not null check (muscle in ('chest','biceps','arms','shoulders','back','legs')),
  kind               text not null check (kind in ('weighted','bodyweight')),
  default_weight_kg  numeric,
  goal_reps          int,
  created_at         timestamptz not null default now()
);

-- Only finished workouts are saved here
create table if not exists public.workouts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  day_type    text not null check (day_type in ('chest','biceps','arms','shoulders','back','legs')),
  started_at  timestamptz not null,
  ended_at    timestamptz not null,
  exercises   jsonb not null   -- WorkoutExercise[] (see types.ts)
);

create index if not exists workouts_user_day_ended_idx
  on public.workouts (user_id, day_type, ended_at desc);

-- ---------------------------------------------------------------------------
-- Profile row on sign-up
-- ---------------------------------------------------------------------------

-- The app signs up with options.data.name; copy it into profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), 'Athlete'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security: nobody can ever see another user's data
-- ---------------------------------------------------------------------------

alter table public.profiles  enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts  enable row level security;

-- profiles: a user can read and update only their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- exercises: read built-ins + your own; write only your own
drop policy if exists "exercises_select_builtin_or_own" on public.exercises;
create policy "exercises_select_builtin_or_own" on public.exercises
  for select to authenticated
  using (user_id is null or user_id = (select auth.uid()));

drop policy if exists "exercises_insert_own" on public.exercises;
create policy "exercises_insert_own" on public.exercises
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "exercises_update_own" on public.exercises;
create policy "exercises_update_own" on public.exercises
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "exercises_delete_own" on public.exercises;
create policy "exercises_delete_own" on public.exercises
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- workouts: everything is limited to your own rows
drop policy if exists "workouts_select_own" on public.workouts;
create policy "workouts_select_own" on public.workouts
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "workouts_insert_own" on public.workouts;
create policy "workouts_insert_own" on public.workouts
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "workouts_update_own" on public.workouts;
create policy "workouts_update_own" on public.workouts
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "workouts_delete_own" on public.workouts;
create policy "workouts_delete_own" on public.workouts
  for delete to authenticated
  using (user_id = (select auth.uid()));
