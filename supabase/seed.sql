-- Built-in exercises (user_id = null, visible to everyone).
-- Run after the migrations (0002 adds the motion column).
-- Safe to run more than once: exercises that already exist are skipped.

insert into public.exercises (name, muscle, kind, default_weight_kg, motion)
select seed.name, seed.muscle, seed.kind, seed.default_weight_kg, seed.motion
from (
  values
    -- Chest
    ('Push-ups',                             'chest',     'bodyweight', null::numeric, 'pushup'::text),
    ('Wide Push-ups',                        'chest',     'bodyweight', null,          'pushup'),
    ('Diamond Push-ups',                     'chest',     'bodyweight', null,          'pushup'),
    ('Decline Push-ups',                     'chest',     'bodyweight', null,          'pushup'),
    ('Dumbbell Floor Press',                 'chest',     'weighted',   25,            'press'),
    ('Dumbbell Fly',                         'chest',     'weighted',   25,            'fly'),
    ('Dumbbell Pullover',                    'chest',     'weighted',   25,            'pullover'),
    ('Bench Press',                          'chest',     'weighted',   null,          'press'),
    -- Biceps
    ('Dumbbell Curl',                        'biceps',    'weighted',   25,            'curl'),
    ('Hammer Curl',                          'biceps',    'weighted',   25,            'curl'),
    ('Concentration Curl',                   'biceps',    'weighted',   25,            'curl'),
    ('Chin-ups',                             'biceps',    'bodyweight', null,          null),
    -- Arms (triceps & forearms)
    ('Overhead Dumbbell Triceps Extension',  'arms',      'weighted',   25,            null),
    ('Dumbbell Wrist Curl',                  'arms',      'weighted',   25,            null),
    ('Dips',                                 'arms',      'bodyweight', null,          null),
    ('Close-grip Push-ups',                  'arms',      'bodyweight', null,          'pushup'),
    -- Shoulders
    ('Dumbbell Shoulder Press',              'shoulders', 'weighted',   null,          'overhead_press'),
    ('Lateral Raise',                        'shoulders', 'weighted',   null,          null),
    ('Front Raise',                          'shoulders', 'weighted',   null,          null),
    ('Pike Push-ups',                        'shoulders', 'bodyweight', null,          'pushup'),
    -- Back
    ('One-arm Dumbbell Row',                 'back',      'weighted',   25,            'row'),
    ('Dumbbell Shrug',                       'back',      'weighted',   25,            null),
    ('Pull-ups',                             'back',      'bodyweight', null,          null),
    ('Superman Hold',                        'back',      'bodyweight', null,          null),
    -- Legs
    ('Goblet Squat',                         'legs',      'weighted',   25,            'squat'),
    ('Dumbbell Romanian Deadlift',           'legs',      'weighted',   25,            null),
    ('Dumbbell Lunges',                      'legs',      'weighted',   25,            null),
    ('Bodyweight Squats',                    'legs',      'bodyweight', null,          'squat'),
    ('Calf Raises',                          'legs',      'bodyweight', null,          null)
) as seed (name, muscle, kind, default_weight_kg, motion)
where not exists (
  select 1
  from public.exercises e
  where e.user_id is null and e.name = seed.name
);
