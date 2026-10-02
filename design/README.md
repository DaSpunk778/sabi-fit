# SABI FIT: Design reference

These are the approved UI designs. Build the real app to match them.
Read `GYM_TRACKER_SPEC.md` (project root) for behaviour and data; use this folder for **how it looks**.

- `screenshots/`: what each screen should look like (phone screens at 390 px wide, shown at 2×; landing at 1440 px plus a mobile version). **Look at these first.**
- `screens/`: the same screens as plain HTML + CSS. Use them for exact colours, spacing, font sizes, radii and copy. Open any file in a browser to view it; the links between screens work.
- `screens/founder.jpg`: founder photo for the landing page. Copy it to `public/founder.jpg`.

These HTML files are **mockups, not app code**. Don't copy them into the app as-is. Rebuild them as Next.js + Tailwind components (shared Button, Card, Chip, TabBar, etc.). The data shown is sample data.

| File | Screen | Route |
|---|---|---|
| 00-landing | Landing page (public) | `/` |
| 01-welcome | Welcome | `/welcome` |
| 02-signup | Create account | `/signup` |
| 03-login | Log in | `/login` |
| 04-today | Today (pick your day) | `/app` |
| 05-plan-day | Plan chest day | `/plan/[dayType]` |
| 06-add-exercises | Add exercises | `/plan/[dayType]/add` |
| 07-workout | Workout in progress | `/workout` |
| 08-rest-timer | Rest timer | `/workout/rest` |
| 09-summary | Workout done | `/workout/[id]/summary` |
| 10-history | History | `/history` |
| 11-progress | Progress | `/progress` |
| 12-exercise-progress | One exercise's progress | `/progress/[exerciseId]` |
| 13-settings | Settings & log out | `/settings` |

## Design tokens
| Token | Value |
|---|---|
| Background | `#0B0C0E` |
| Surface (cards) | `#15171A` |
| Raised (inputs/secondary buttons) | `#1E2125` |
| Border | `#24282D` / `#2A2E33` |
| Text | `#F2F3F1` |
| Muted text | `#9AA0A6` |
| Accent (lime) | `#C8F135` |
| Danger | `#FF7A7A` |
| Display font | Barlow Condensed 700/800, uppercase (wordmark + big headings in italic) |
| Body font | Manrope 400–800 |
| Card radius | 18 px · Buttons 14–16 px · Chips 999 px |
| Min tap target | 44 px |

Icons in the mockups are hand-drawn SVGs in the Feather style. In the app, use `react-icons/fi` (Feather) equivalents.
