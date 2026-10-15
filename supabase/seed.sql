-- Built-in exercises (user_id = null, visible to everyone).
-- Safe to run more than once: exercises that already exist are skipped.

insert into public.exercises (name, muscle, kind, default_weight_kg)
select seed.name, seed.muscle, seed.kind, seed.default_weight_kg
from (
  values
    -- Chest
    ('Push-ups',                             'chest',     'bodyweight', null::numeric),
    ('Wide Push-ups',                        'chest',     'bodyweight', null),
    ('Diamond Push-ups',                     'chest',     'bodyweight', null),
    ('Decline Push-ups',                     'chest',     'bodyweight', null),
    ('Dumbbell Floor Press',                 'chest',     'weighted',   25),
    ('Dumbbell Fly',                         'chest',     'weighted',   25),
    ('Dumbbell Pullover',                    'chest',     'weighted',   25),
    ('Bench Press',                          'chest',     'weighted',   null),
    -- Biceps
    ('Dumbbell Curl',                        'biceps',    'weighted',   25),
    ('Hammer Curl',                          'biceps',    'weighted',   25),
    ('Concentration Curl',                   'biceps',    'weighted',   25),
    ('Chin-ups',                             'biceps',    'bodyweight', null),
    -- Arms (triceps & forearms)
    ('Overhead Dumbbell Triceps Extension',  'arms',      'weighted',   25),
    ('Dumbbell Wrist Curl',                  'arms',      'weighted',   25),
    ('Dips',                                 'arms',      'bodyweight', null),
    ('Close-grip Push-ups',                  'arms',      'bodyweight', null),
    -- Shoulders
    ('Dumbbell Shoulder Press',              'shoulders', 'weighted',   null),
    ('Lateral Raise',                        'shoulders', 'weighted',   null),
    ('Front Raise',                          'shoulders', 'weighted',   null),
    ('Pike Push-ups',                        'shoulders', 'bodyweight', null),
    -- Back
    ('One-arm Dumbbell Row',                 'back',      'weighted',   25),
    ('Dumbbell Shrug',                       'back',      'weighted',   25),
    ('Pull-ups',                             'back',      'bodyweight', null),
    ('Superman Hold',                        'back',      'bodyweight', null),
    -- Legs
    ('Goblet Squat',                         'legs',      'weighted',   25),
    ('Dumbbell Romanian Deadlift',           'legs',      'weighted',   25),
    ('Dumbbell Lunges',                      'legs',      'weighted',   25),
    ('Bodyweight Squats',                    'legs',      'bodyweight', null),
    ('Calf Raises',                          'legs',      'bodyweight', null)
) as seed (name, muscle, kind, default_weight_kg)
where not exists (
  select 1
  from public.exercises e
  where e.user_id is null and e.name = seed.name
);
