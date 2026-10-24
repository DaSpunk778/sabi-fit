import type { MonthStage } from "@/lib/stats";
import s from "./StreakPill.module.css";

const OUTER =
  "M12 1.5c1 3.3 4.7 5.2 5.7 8.8.9 3.4-.6 6.8-3.3 8.3-1 .6-2.2.9-3.4.9-3.7 0-6.5-2.9-6.5-6.4 0-2.7 1.4-4.2 2.7-5.8.3 1.6 1 2.7 2.2 3.3C9 7.4 10.4 4.3 12 1.5z";
const INNER =
  "M12.3 10.6c.6 1.7 2.5 2.7 2.5 4.8 0 1.7-1.3 3-2.8 3s-2.7-1.2-2.7-2.7c0-1.4.8-2.1 1.5-2.9.2.6.5 1 1 1.3-.1-1.2.1-2.3.5-3.5z";

type StreakPillProps = {
  /** Days left in the month after today (lib/stats daysLeftInMonth). */
  daysLeft: number;
  stage: MonthStage;
};

function countdown(daysLeft: number) {
  if (daysLeft === 0) return "Last day";
  return daysLeft === 1 ? "1 day to go" : `${daysLeft} days to go`;
}

// Counts down to the end of the month. The colour comes from the CSS class
// for the stage: grey early on, blue in week 3, red in the last stretch.
export function StreakPill({ daysLeft, stage }: StreakPillProps) {
  return (
    <span className={`${s.pill} ${s[stage]}`}>
      <svg className={s.svg} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path className={s.outer} d={OUTER} />
        <path className={s.inner} d={INNER} />
      </svg>
      {countdown(daysLeft)}
    </span>
  );
}
