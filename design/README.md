# SABI FIT: Design reference (updated 23 Oct 2026)

These are the approved UI designs. Build the app to match them.
Read `GYM_TRACKER_SPEC.md` (project root) for behaviour and data; use this folder for **how it looks and moves**.

- `screenshots/`: what each screen looks like. Phone screens are 390 px wide, shown at 2×. Animations are shown at their **final frame**. **Look at these first.**
- `screens/`: the same screens as plain HTML + CSS. Open any file in a browser to see it live, **with its animations playing**. Links between screens work, so you can tap through the Wrapped story. Use them for exact colours, spacing, sizes, copy and animation timings.
- `screens/founder.jpg`: founder photo for the landing page. Copy it to `public/founder.jpg`.

These HTML files are **mockups, not app code**. Rebuild them as Next.js + Tailwind components (shared Button, Card, Chip, TabBar, etc.). All numbers and names shown are sample data.

## What changed since the 2 Oct version
- **Today:** greeting with avatar ("Good evening, Ayomide"), weekly streak pill, and a lime **"October wrapped"** banner that opens Wrapped.
- **Today · before** (new): the same screen mid-month, before a streak exists. This is the empty or early state.
- **Add exercises:** each exercise row has a small looping animation (see `exercise-animation/HANDOFF.md` if you have it).
- **Landing:** natural-colour founder photo with a lime frame, plus a dedicated **mobile** layout.
- **Flow map** (new): how every screen connects, and the build order.
- **SABI FIT Wrapped** (new): 7-slide monthly story + 1080×1350 share card. Details below.

## Screens

| File | Screen | Route |
|---|---|---|
| 00-landing | Landing page, desktop | `/` |
| 00b-landing-mobile | Landing page, phone layout | `/` (≤ 900 px) |
| 01-welcome | Welcome | `/welcome` |
| 02-signup | Create account | `/signup` |
| 03-login | Log in | `/login` |
| 04-today | Today (pick your day) + Wrapped banner | `/app` |
| 04b-today-before | Today, mid-month, no streak yet | `/app` (state) |
| 05-plan-day | Plan chest day | `/plan/[dayType]` |
| 06-add-exercises | Add exercises (animated figures) | `/plan/[dayType]/add` |
| 07-workout | Workout in progress | `/workout` |
| 08-rest-timer | Rest timer | `/workout/rest` |
| 09-summary | Workout done | `/workout/[id]/summary` |
| 10-history | History | `/history` |
| 11-progress | Progress | `/progress` |
| 12-exercise-progress | One exercise's progress | `/progress/[exerciseId]` |
| 13-settings | Settings & log out | `/settings` |
| 14 → 20 wrapped-* | Wrapped slides 1–7 | `/wrapped/[yyyy-mm]` |
| 21-share-card-1080x1350 | The shareable image | `/wrapped/[yyyy-mm]/card` (image) |
| 99-flow-map | Screen flow & build order | reference only |

## SABI FIT Wrapped

A monthly story the user opens from the Today banner (show the banner during the first week of the next month). Full-screen, one slide at a time.

**Shell, same on every slide:** 7 progress segments along the top (past = full, current = filling over ~7 s, future = empty), "SABI FIT · WRAPPED" label, ✕ close → Today. Tap the right 70 % of the screen for next, the left 30 % for back, swipe on phones. The current slide auto-advances when its segment fills. Each slide's entrance replays when you land on it.

| # | Slide | Background | What it shows | Motion |
|---|---|---|---|---|
| 1 | Intro | Black, faint outlined "OCT" | "Your October, wrapped." + the user's name | Headline lines rise in; name drops in **letter by letter** on tiles (~0.13 s stagger) |
| 2 | Showing up | Black / lime | Sessions count, month calendar, longest streak | Count **rolls up** like an odometer; trained days fill in **day by day**; streak days get a white outline; streak card rises |
| 3 | Total volume | Danfo yellow `#FFC20E`, black stripes at the bottom | Σ weight × reps for the month + a fun comparison | Number **rolls up digit by digit**; a rule draws in; comparison icons pop in one by one |
| 4 | Your split | Black | Sessions per day type | Bars **race**: another day leads mid-way, then the winner overtakes; winner bar is lime with a "Winner" flag |
| 5 | PR moment | Lime | Biggest jump vs last month | Old value gets struck through; new number **snaps up** with an overshoot; "+5 kg" sticker pops on; ring burst behind |
| 6 | Personality | Off-white `#F2F3F1` | A label from habits | Stamp **slams down** (big → small, rotate) with a tiny screen shake; 3 reasons rise in |
| 7 | Share | Black | The share card, scaled down | Card deals in at an angle; buttons **Share to X**, **Save image**, **Replay** |

**Volume comparison.** Pick the unit so the count lands between 2 and 30: okada ≈ 110 kg, danfo ≈ 1,500 kg, BRT bus ≈ 13,000 kg. Round down and show "about". Example: 28,750 kg ≈ 19 danfo buses.

**Personality labels** (first one that matches wins; tune freely): Early Bird (≥ 60 % of sessions before 9 am), Night Owl (≥ 60 % after 8 pm), "[Day] Day Loyalist" (one day type ≥ 25 % of sessions), Never Skips (no gap over 2 days), Weekend Warrior (≥ 50 % on Sat/Sun), otherwise Showing Up.

**PR rule.** Biggest increase in max weight per exercise vs the previous month. If no weight went up (fixed dumbbell), use the biggest increase in best reps instead. Show the runner-up underneath.

**Share card.** 1080 × 1350 px, same data as the slides. Generate it as an image (Next.js OG image route or `html-to-image`). "Share to X" opens X's share intent with the image or a link; "Save image" downloads the PNG.

**Animation notes.** The mockups use CSS keyframes so they play in a browser. In the app, use GSAP: one `gsap.timeline()` per slide (`SplitText` for the name, tweened numbers for the counters, staggers for the calendar and buses). Respect `prefers-reduced-motion` by jumping straight to the final frame.

## Design tokens
| Token | Value |
|---|---|
| Background | `#0B0C0E` |
| Surface (cards) | `#15171A` |
| Raised (inputs, secondary buttons) | `#1E2125` |
| Border | `#24282D` / `#2A2E33` |
| Text | `#F2F3F1` |
| Muted text | `#9AA0A6` |
| Accent (lime) | `#C8F135` |
| Wrapped extra: danfo yellow | `#FFC20E` |
| Danger | `#FF7A7A` |
| Display font | Barlow Condensed 700/800, uppercase; italic for the wordmark, headings and big numbers |
| Body font | Manrope 400–800 |
| Card radius | 18 px · Buttons 14–16 px · Chips 999 px |
| Min tap target | 44 px |

Icons in the mockups are hand-drawn SVGs in the Feather style. In the app, use `react-icons/fi` (Feather) equivalents.
