# SABI FIT: Project Spec (v1, lean)

> **SABI FIT** is a personal gym app: plan your training day, log sets, see progress.
> This document is the source of truth for Claude Code. Read it fully before writing code.
> The UI reference is the **"SABI FIT UI"** canvas (13 phone screens). Build screens to match it.
> **Keep it lean:** if something isn't in this spec, don't build it. Ask first.

---

## 1. What the app does

I train a different muscle group each day: **Chest, Biceps, Arms, Shoulders, Back, Legs**.
I mostly use a **25 kg dumbbell** (curls, hammer curls, sometimes chest) and **bodyweight** moves (push-ups, current max 30 in one set).

1. **Create an account / log in** (email + password). My workouts are saved to my account, so they're on any device I log in from. Other people who open the link create their own account and only see their own data.
2. **Pick today's day** (e.g. Friday → Chest).
3. **Plan it:** the plan is pre-filled with the exercises (and set counts) from my **last workout of that same day type**. I can add or remove exercises and change set counts.
4. **Train:** log each set (reps, plus kg for weighted exercises). Ticking a set starts the rest timer. Each set shows what I did last time.
5. **Finish:** see a summary with any new bests. The workout is saved, and it becomes the starting plan for the next time I pick that day.
6. **Look back:** History (list of workouts) and Progress (best per exercise + chart).

Progress logic:
- **Bodyweight** exercises (push-ups): progress = **most reps in one set**.
- **Weighted** exercises (25 kg dumbbell): progress = **heaviest weight**, then **most reps at that weight** (shown as `25 kg × 12`). With a fixed dumbbell, progress mostly shows up as more reps.

---

## 2. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | Hosted on **Vercel**. |
| Language | **TypeScript** | `strict: true`. |
| Styling | **Tailwind CSS** | Colours and fonts as CSS variables (see §8). |
| Animation | **GSAP** + `@gsap/react` (`useGSAP`) | A few purposeful moments only (see §8). |
| Auth + database | **Supabase** (free tier): Auth + Postgres | Use `@supabase/supabase-js` and `@supabase/ssr` (cookie-based sessions for the App Router). |
| Live state | **Zustand** (`persist` → localStorage) | The **active workout** and the **rest timer**. Survives reloads and bad gym signal. |
| Icons | **react-icons**: Feather set (`react-icons/fi`) | One icon set only. Import per icon. |
| Dates | **date-fns** | |
| Charts | **One hand-made SVG line chart component** | No chart library needed for one chart. |
| Package manager | pnpm | |

About tokens: Supabase signs users in and keeps the session (a JWT) in cookies. We never create or read JWTs by hand.

Env vars (`.env.local`, and in Vercel project settings): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never commit them.

Not in v1: social login (Google etc.), offline install (PWA), chart libraries, end-to-end tests, Dexie/IndexedDB.

---

## 3. Screens (match the canvas)

**Public landing page**

| # | Route | Screen | What's on it |
|---|---|---|---|
| L | `/` | **Landing** | Nav (logo, "How it works", "The founder", **Open the app**). Hero: "Know your numbers. Beat your last session." + phone mockup of a workout with a NEW BEST card. Lime band of day names. "How it works": 3 steps. **Founder section**: my photo (`public/founder.jpg`, shown as a black & lime duotone with CSS `grayscale` + lime `mix-blend-mode: multiply`), "Founder & Lead Dev" sticker, why I built it (first person), name + role "Founder & Lead Developer", stack chips, GitHub + Portfolio links, meaning of "Sabi". Lime CTA panel "Your next session starts here." Footer: "© 2026 SABI FIT. Designed & built by Ayomide. All rights reserved." Fully responsive (desktop + phone). All CTAs → `/welcome`, or `/app` if already logged in. |

**Account (logged out)**

| # | Route | Screen | What's on it |
|---|---|---|---|
| A | `/welcome` | **Welcome** | SABI FIT logo + wordmark, tagline "Know your numbers. Beat your last session.", buttons **Create account** and **I already have an account**. |
| B | `/signup` | **Create account** | Name, Email, Password (show/hide, min 8 chars); **Create account**; link to Log in. On success → Today. |
| C | `/login` | **Log in** | Email, Password (show/hide); "Forgot password?" (Supabase reset email); inline error "Email or password is wrong. Try again."; **Log in**; link to Create account. |

**App (logged in).** Bottom tab bar with 3 tabs: **Today · History · Progress**. Settings is an icon on Today.

| # | Route | Screen | What's on it |
|---|---|---|---|
| 1 | `/app` | **Today** | SABI FIT wordmark + settings icon; date + "What are we training today?"; this-week strip (days trained, labelled by day type); 6 day tiles with "Last: N days ago" (the one trained longest ago is highlighted **Suggested**); "Your bests" (2 top exercises). If a workout is in progress, show a **Resume** banner at the top. |
| 2 | `/plan/[dayType]` | **Plan day** | Note "Copied from your last chest day (date)"; exercises with a sets stepper (−/+) and remove (×); "+ Add chest exercise"; fixed bottom button "Start chest day · N sets". No previous workout → start empty and open the picker. |
| 3 | `/plan/[dayType]/add` (or a bottom sheet) | **Add exercises** | Search; muscle filter chips (default: today's day type); checklist (exercises already in the plan are ticked and disabled); "Create your own exercise"; bottom button "Add N exercises". |
| 4 | `/workout` | **Workout in progress** | Header: day name, elapsed time, sets done / total, **Finish**. One card per exercise. Bodyweight rows: Set · Last time · Reps · ✓. Weighted rows: Set · Last time · kg · Reps · ✓. "NEW BEST" badge on a set that beats the record. "+ Add set", "+ Add exercise". Floating rest bar while resting. |
| 5 | `/workout/rest` (or full-screen overlay) | **Rest timer** | Big countdown with a progress ring; "Up next: Push-ups · Set 3 · Last time 22"; **+15s** and **Skip rest**. |
| 6 | `/workout/[id]/summary` | **Workout done** | "N new bests" badge; Sets, Time, total bodyweight reps, total dumbbell kg; "vs last chest day" list; note "Saved. Next chest day will start with these exercises."; **Done**. |
| 7 | `/history` | **History** | Day-type filter chips; workouts grouped by week (date, "Chest day", minutes, sets, first exercise names, "N BEST" badge). Tap → that workout's summary (reuse screen 6). Delete from there. |
| 8 | `/progress` | **Progress** | Two stat tiles (workouts and new bests in the last 30 days); muscle filter chips; exercises with current best, change, tiny sparkline. |
| 9 | `/progress/[exerciseId]` | **Exercise progress** | Current best; optional **goal** (e.g. 40 push-ups) with progress bar; SVG line chart of best set per session (last 8) with the goal as a dashed line; every session's sets. Edit button to set the goal. |
| D | `/settings` | **Settings** | Account card (name, email, edit name); rest time stepper; sound and vibration switches; **Download my data (.json)**; **Log out** → Welcome. |

**Route protection:** Next.js `middleware.ts` refreshes the Supabase session. `/` (landing) is always public. Not logged in → redirect any app route to `/welcome`. Logged in → redirect `/welcome`, `/signup`, `/login` to `/app`. After sign-up or log-in → `/app`.

Note: the other app routes in this table (`/plan`, `/workout`, `/history`, `/progress`, `/settings`) stay as listed; they're protected the same way.

---

## 4. Database (Supabase Postgres)

Three tables. Everything else (history, bests, charts, "last time") is calculated in TypeScript from `workouts`.

```sql
-- One row per user, created on sign-up (trigger on auth.users, or insert right after signUp)
create table profiles (
  id            uuid primary key references auth.users on delete cascade,
  name          text not null,
  rest_seconds  int  not null default 90,
  sound         bool not null default true,
  vibration     bool not null default true,
  created_at    timestamptz not null default now()
);

-- Built-in exercises have user_id = null; custom ones belong to a user
create table exercises (
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
create table workouts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  day_type    text not null check (day_type in ('chest','biceps','arms','shoulders','back','legs')),
  started_at  timestamptz not null,
  ended_at    timestamptz not null,
  exercises   jsonb not null   -- WorkoutExercise[] (see types below)
);
create index on workouts (user_id, day_type, ended_at desc);
```

**Row Level Security (must be on for every table):**
- `profiles`: a user can select/update only `id = auth.uid()`.
- `exercises`: select where `user_id is null or user_id = auth.uid()`; insert/update/delete only `user_id = auth.uid()`.
- `workouts`: select/insert/update/delete only `user_id = auth.uid()`.

This is what makes sure nobody else can ever see my workouts.

Note: a user's `goal_reps` on a built-in exercise needs a per-user value. Simplest v1 approach: when I set a goal on a built-in exercise, create my own copy of that exercise and use it from then on. (Or add a small `exercise_goals` table later.)

TypeScript types (`src/types.ts`):
```ts
type DayType = 'chest' | 'biceps' | 'arms' | 'shoulders' | 'back' | 'legs';
type ExerciseKind = 'weighted' | 'bodyweight';

interface WorkoutSet { reps: number | null; weightKg: number | null; done: boolean; }
interface WorkoutExercise { exerciseId: string; sets: WorkoutSet[]; }
interface ActiveWorkout { dayType: DayType; startedAt: string; exercises: WorkoutExercise[]; } // Zustand only
```

Rule: components don't call Supabase directly. Put queries in small functions in `src/lib/data/` (e.g. `getLastWorkout(dayType)`, `saveWorkout(active)`, `getExercises(muscle)`).

### Seed exercises (SQL seed, `user_id = null`)
- **Chest:** Push-ups, Wide Push-ups, Diamond Push-ups, Decline Push-ups (bodyweight); Dumbbell Floor Press, Dumbbell Fly, Dumbbell Pullover (weighted, 25 kg); Bench Press (weighted)
- **Biceps:** Dumbbell Curl, Hammer Curl, Concentration Curl (weighted, 25 kg); Chin-ups (bodyweight)
- **Arms** (triceps & forearms): Overhead Dumbbell Triceps Extension, Dumbbell Wrist Curl (weighted, 25 kg); Dips, Close-grip Push-ups (bodyweight)
- **Shoulders:** Dumbbell Shoulder Press, Lateral Raise, Front Raise (weighted); Pike Push-ups (bodyweight)
- **Back:** One-arm Dumbbell Row, Dumbbell Shrug (weighted, 25 kg); Pull-ups, Superman Hold (bodyweight)
- **Legs:** Goblet Squat, Dumbbell Romanian Deadlift, Dumbbell Lunges (weighted, 25 kg); Bodyweight Squats, Calf Raises (bodyweight)

Keep SQL in `supabase/migrations/` (schema + RLS) and `supabase/seed.sql`.

---

## 5. Behaviour rules

**Auth**
- Sign up with `supabase.auth.signUp({ email, password, options: { data: { name } } })`, then create the `profiles` row.
- For development, turn **off** "Confirm email" in Supabase so sign-up logs straight in. (Can turn on later.)
- Log out with `supabase.auth.signOut()` → `/welcome`. Logging out also clears the local Zustand stores.

**Plan pre-fill**
- On `/plan/[dayType]`: fetch my latest workout with that `day_type`. Copy its exercise list and **number of sets** per exercise. Sets start empty.
- No previous workout → empty plan; open the picker filtered to that muscle.

**Active workout (lives on the phone until Finish)**
- Starting creates an `ActiveWorkout` in the Zustand store (persisted to localStorage). Weighted sets pre-fill `weightKg` from `default_weight_kg`.
- Every change updates the store immediately, so closing the browser or losing signal mid-workout loses nothing. On open, if an active workout exists, Today shows **Resume**.
- Only one active workout at a time.

**Logging**
- "Last time" = the same set number from my latest saved workout containing that exercise (blank if none). Use it as the input placeholder.
- Ticking ✓ marks the set done, copies values into the next empty set as placeholders, and **starts the rest timer**.
- A set that beats the exercise's best shows **NEW BEST** with a small GSAP pop.

**Bests**
- Bodyweight: best = max `reps` in any single done set.
- Weighted: best = highest `weightKg`; tie-break by most `reps` at that weight. Display `25 kg × 12`.
- "New best" = better than the best from all **earlier** saved workouts.

**Finish**
- Drop sets that aren't done; drop exercises with no done sets.
- Nothing done → ask "Discard this workout?" instead.
- Insert into `workouts`. **Only clear the local active workout after the insert succeeds.** If it fails (no signal), show "Couldn't save. Check your connection." with **Try again**; the workout stays safe on the phone.
- Summary totals: sets done; total reps on bodyweight exercises; Σ (weightKg × reps) on weighted exercises; duration.

**Suggested day**
- On Today, highlight the day type with the oldest last workout (never done counts as oldest).

**Rest timer** (`src/lib/timer.ts` + Zustand store)
- Store `endsAt` (epoch ms), not a counting-down number. Remaining = `endsAt - Date.now()`. This stays correct when the phone locks.
- Update with `requestAnimationFrame` (or `gsap.ticker`); recompute on `visibilitychange`.
- `+15s` → `endsAt += 15000`. Skip → clear.
- At 0: short beep (Web Audio API) and `navigator.vibrate(200)` if enabled (only while the page is open; that's fine).

**Download my data**
- Settings → downloads `{ profile, exercises (my custom ones), workouts }` as JSON.

---

## 6. Folder structure

```
middleware.ts                      # session refresh + route protection
supabase/
  migrations/                      # schema + RLS
  seed.sql                         # built-in exercises
src/
  app/
    page.tsx                       # public landing page
    (auth)/welcome/page.tsx
    (auth)/signup/page.tsx
    (auth)/login/page.tsx
    (app)/layout.tsx               # tab bar
    (app)/app/page.tsx             # Today
    (app)/plan/[dayType]/page.tsx
    (app)/plan/[dayType]/add/page.tsx
    (app)/workout/page.tsx
    (app)/workout/[id]/summary/page.tsx
    (app)/history/page.tsx
    (app)/progress/page.tsx
    (app)/progress/[exerciseId]/page.tsx
    (app)/settings/page.tsx
    layout.tsx, globals.css
  components/
    brand/     # Logo, Wordmark
    ui/        # Button, Card, Chip, Stepper, TabBar, Badge, TextField
    workout/   # ExerciseCard, SetRow, RestBar, RestTimerScreen
    progress/  # LineChart (SVG), Sparkline
  lib/
    supabase/  # client.ts (browser), server.ts (server components)
    data/      # profiles.ts, exercises.ts, workouts.ts
    stats.ts   # bests, totals, "last time", suggested day (pure functions)
    timer.ts   # pure timer maths
    gsap.ts
  stores/
    activeWorkout.ts
    timer.ts
  types.ts
```

---

## 7. Brand

- **Name:** SABI FIT ("sabi" = to know / be skilled).
- **Wordmark:** "SABI FIT" in Barlow Condensed 700 *italic*, uppercase; "SABI" in white, "FIT" in lime.
- **Logo mark:** lime rounded square (radius ≈ 28% of size) with a black dumbbell glyph (Feather-style stroke). Use it for the favicon and app icon too.
- **Tagline:** "Know your numbers. Beat your last session."

## 8. Look & feel

- **Dark only.** Background `#0B0C0E`, cards `#15171A`, borders `#24282D`, text `#F2F3F1`, muted `#9AA0A6`, accent **lime `#C8F135`** (primary buttons, done sets, bests, timer). Danger `#FF7A7A`.
- **Fonts** (via `next/font/google`): **Barlow Condensed** 700 (incl. italic) uppercase for headings and big numbers; **Manrope** for everything else.
- Numbers use `tabular-nums`.
- Mobile first (390 px wide). Tap targets ≥ 44 px. Main actions in the bottom half. On desktop, centre the app at max 480 px wide.
- Form fields: 56 px tall, lime 2 px border on focus, labels above in small uppercase.
- **GSAP moments only:** (1) set ✓ pop, (2) NEW BEST badge burst, (3) rest-timer ring drain + pulse in the last 3 s, (4) count-up numbers on the summary. Use `useGSAP` with a scope ref; respect `prefers-reduced-motion`.

---

## 9. Build plan

Do one milestone at a time. Stop after each one so I can review and test it.

1. **Setup:** Next.js + TS + Tailwind + fonts + colour variables; logo/wordmark components; app shell with 3-tab bar; empty pages for every route.
2. **Supabase + auth:** create project; migrations (tables + RLS) and seed; Supabase clients; middleware; Welcome, Create account, Log in, Log out. Test: two different accounts can't see each other's data.
3. **Today + Plan + Add exercises:** day tiles, suggested day, plan pre-fill, sets stepper, picker, create custom exercise.
4. **Workout logging:** active-workout store, log sets, "last time" values, add set/exercise, finish (save to Supabase with retry), discard, resume after reload.
5. **Rest timer:** timestamp-based timer, rest bar, full-screen view, beep + vibrate.
6. **Summary + bests:** best calculation, NEW BEST badges, summary screen.
7. **History:** grouped list, filter chips, open a past workout, delete.
8. **Progress:** exercise list with sparklines, exercise page with SVG chart and goal.
9. **Settings:** rest time, sound, vibration, edit name, download my data.
10. **Landing page + GSAP polish** (the 4 moments in §8, plus a hero entrance and scroll reveals on the landing page). **Deploy to Vercel.**

After milestone 6, I'll use the app at the gym for a week before going further.

## 10. Done when…
- [ ] I can create an account, log out, and log back in.
- [ ] A second test account sees **none** of my workouts.
- [ ] I can pick Chest on Friday, get last chest day's exercises, start, log every set and finish, on my phone, without friction.
- [ ] Closing the browser mid-workout and reopening resumes exactly where I was.
- [ ] Losing signal when I tap Finish doesn't lose the workout; Try again saves it.
- [ ] Logging in on my laptop shows the same history as my phone.
- [ ] Rest timer is still correct after locking the phone for 2 minutes.
- [ ] "Last time" values and bests are correct for both push-ups and 25 kg dumbbell exercises.
- [ ] No TypeScript errors; lint passes.

## 11. Later (not v1)
Google sign-in · email confirmation · bodyweight log · stopwatch / interval timers · offline install (PWA) · light theme · kg/lb switch · supersets · plate/warm-up calculators · per-user goals table.

## 12. Decision log
| Date | Decision | Reason |
|---|---|---|
| 2026-10-02 | App name: **SABI FIT** | Owner's choice |
| 2026-10-02 | Public landing page at `/` with founder section; app at `/app` | Shows ownership and the story behind the project; doubles as a portfolio piece |
| 2026-10-02 | Accounts + database with **Supabase** (Auth + Postgres + RLS) | Workouts saved per user, available on any device; other users only see their own data |
| 2026-10-02 | Active workout kept on the phone (Zustand + localStorage) until Finish | Survives reloads and bad gym signal; one database write per workout |
| 2026-10-02 | Workout sets stored as `jsonb` on the workout row | Simplest model; all stats calculated in TypeScript |
| 2026-10-02 | Day-type flow instead of routines/programs | Matches how I train; plan = copy of last same-day workout |
| 2026-10-02 | Only weighted + bodyweight exercise kinds | Covers 25 kg dumbbell work and push-ups |
| 2026-10-02 | Supabase handles JWT sessions in cookies | No hand-written token code |
| 2026-10-02 | react-icons (Feather), hand-made SVG chart | Personal preference; one chart doesn't need a library |
| 2026-10-02 | "Arms" day = triceps & forearms | Biceps has its own day |
