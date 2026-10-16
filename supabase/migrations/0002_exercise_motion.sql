-- Adds an optional animation to each exercise (components/exercise).
-- NULL = not set: the app falls back to its built-in name list, then a still dumbbell.
-- Run after 0001_init.sql. Safe to run more than once.

alter table public.exercises
  add column if not exists motion text
  check (motion in ('pushup','press','pullover','fly','curl','overhead_press','row','squat'));

-- Fill it in for the built-in exercises (user_id is null).
update public.exercises set motion = 'pushup'
  where user_id is null and name in ('Push-ups','Wide Push-ups','Diamond Push-ups','Decline Push-ups','Close-grip Push-ups','Pike Push-ups');
update public.exercises set motion = 'press'
  where user_id is null and name in ('Dumbbell Floor Press','Bench Press');
update public.exercises set motion = 'pullover'
  where user_id is null and name = 'Dumbbell Pullover';
update public.exercises set motion = 'fly'
  where user_id is null and name = 'Dumbbell Fly';
update public.exercises set motion = 'curl'
  where user_id is null and name in ('Dumbbell Curl','Hammer Curl','Concentration Curl');
update public.exercises set motion = 'overhead_press'
  where user_id is null and name = 'Dumbbell Shoulder Press';
update public.exercises set motion = 'row'
  where user_id is null and name = 'One-arm Dumbbell Row';
update public.exercises set motion = 'squat'
  where user_id is null and name in ('Goblet Squat','Bodyweight Squats');
