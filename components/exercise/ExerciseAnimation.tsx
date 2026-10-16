import type { CSSProperties, ReactNode } from "react";
import type { ExerciseMotion } from "@/types";
import s from "./ExerciseAnimation.module.css";

type ExerciseAnimationProps = {
  /** Which looping figure to show. `null`/undefined shows a still dumbbell. */
  motion?: ExerciseMotion | null;
  /** Outer tile size in px (the figure is drawn at ~83% of it). Default 48. */
  size?: number;
  /** Stop the loop (e.g. tile off-screen, or a "still" setting). */
  paused?: boolean;
  /** Override the lime, e.g. '#9AA0A6' for a disabled row. */
  color?: string;
  className?: string;
};

/**
 * Small looping demo of an exercise. Pure CSS animation on inline SVG, no
 * hooks or state, so it works in Server and Client Components alike.
 * Decorative only (aria-hidden): the exercise name next to it carries the meaning.
 */
export function ExerciseAnimation({
  motion,
  size = 48,
  paused = false,
  color,
  className,
}: ExerciseAnimationProps) {
  const figure = size * (40 / 48);
  const style = color ? ({ "--ex-accent": color } as CSSProperties) : undefined;

  return (
    <span
      className={[s.tile, paused && s.paused, className]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <svg className={s.svg} width={figure} height={figure} viewBox="0 0 48 48">
        {motion ? FIGURES[motion] : STILL}
      </svg>
    </span>
  );
}

const cx = (...c: string[]) => c.join(" ");

/* Each figure: 48×48 viewBox. Lines use .fig (lime stroke), heads/dumbbells use .solid. */
const FIGURES: Record<ExerciseMotion, ReactNode> = {
  /* Side view, plank on the floor. Body pivots on the feet; arm shortens. */
  pushup: (
    <>
      <line className={s.floor} x1="4" y1="39" x2="46" y2="39" />
      <g className={cx(s.mv, s.puBody)}>
        <line className={s.fig} x1="40" y1="37" x2="14" y2="26" />
        <circle className={s.solid} cx="9" cy="23" r="3.5" />
      </g>
      <line className={cx(s.fig, s.mv, s.puArm)} x1="14" y1="37" x2="14" y2="26" />
    </>
  ),

  /* Lying on the floor/bench, pressing a dumbbell straight up. */
  press: (
    <>
      <line className={s.floor} x1="4" y1="40" x2="46" y2="40" />
      <line className={s.fig} x1="12" y1="36" x2="40" y2="36" />
      <line className={s.fig} x1="40" y1="36" x2="44" y2="40" />
      <circle className={s.solid} cx="7" cy="35" r="3.5" />
      <line className={cx(s.fig, s.mv, s.prArm)} x1="22" y1="36" x2="22" y2="16" />
      <rect className={cx(s.solid, s.mv, s.prDb)} x="15" y="12" width="14" height="4" rx="2" />
    </>
  ),

  /* Lying, straight arm swings the dumbbell back over the head. */
  pullover: (
    <>
      <line className={s.floor} x1="4" y1="40" x2="46" y2="40" />
      <line className={s.fig} x1="12" y1="36" x2="40" y2="36" />
      <line className={s.fig} x1="40" y1="36" x2="44" y2="40" />
      <circle className={s.solid} cx="7" cy="35" r="3.5" />
      <g className={cx(s.mv, s.pvArm)}>
        <line className={s.fig} x1="22" y1="36" x2="22" y2="16" />
        <rect className={s.solid} x="15" y="12" width="14" height="4" rx="2" />
      </g>
    </>
  ),

  /* Front view, both arms open outwards. */
  fly: (
    <>
      <circle className={s.solid} cx="24" cy="17" r="4" />
      <line className={s.fig} x1="24" y1="25" x2="24" y2="42" />
      <line className={s.fig} x1="17" y1="26" x2="31" y2="26" />
      <g className={cx(s.mv, s.flL)}>
        <line className={s.fig} x1="17" y1="26" x2="20" y2="10" />
        <circle className={s.solid} cx="20" cy="9" r="3" />
      </g>
      <g className={cx(s.mv, s.flR)}>
        <line className={s.fig} x1="31" y1="26" x2="28" y2="10" />
        <circle className={s.solid} cx="28" cy="9" r="3" />
      </g>
    </>
  ),

  /* Side view standing, forearm curls up from the elbow. */
  curl: (
    <>
      <line className={s.floor} x1="4" y1="44" x2="46" y2="44" />
      <circle className={s.solid} cx="24" cy="8" r="3.5" />
      <line className={s.fig} x1="24" y1="13" x2="24" y2="30" />
      <line className={s.fig} x1="24" y1="30" x2="20" y2="43" />
      <line className={s.fig} x1="24" y1="30" x2="28" y2="43" />
      <line className={s.fig} x1="25" y1="15" x2="29" y2="25" />
      <g className={cx(s.mv, s.cuArm)}>
        <line className={s.fig} x1="29" y1="25" x2="29" y2="34" />
        <rect className={s.solid} x="25" y="34" width="8" height="3.5" rx="1.75" />
      </g>
    </>
  ),

  /* Front view standing, dumbbells pressed overhead and lowered. */
  overhead_press: (
    <>
      <line className={s.floor} x1="4" y1="44" x2="46" y2="44" />
      <circle className={s.solid} cx="24" cy="10" r="3.5" />
      <line className={s.fig} x1="24" y1="15" x2="24" y2="31" />
      <line className={s.fig} x1="24" y1="31" x2="19" y2="43" />
      <line className={s.fig} x1="24" y1="31" x2="29" y2="43" />
      <line className={s.fig} x1="15" y1="17" x2="33" y2="17" />
      <g className={cx(s.mv, s.ohArms)}>
        <line className={s.fig} x1="15" y1="17" x2="15" y2="5" />
        <line className={s.fig} x1="33" y1="17" x2="33" y2="5" />
      </g>
      <g className={cx(s.mv, s.ohDb)}>
        <rect className={s.solid} x="11" y="1.5" width="8" height="3.5" rx="1.75" />
        <rect className={s.solid} x="29" y="1.5" width="8" height="3.5" rx="1.75" />
      </g>
    </>
  ),

  /* Bent-over side view, arm rows the dumbbell up. */
  row: (
    <>
      <line className={s.floor} x1="4" y1="44" x2="46" y2="44" />
      <circle className={s.solid} cx="9" cy="17" r="3.5" />
      <line className={s.fig} x1="30" y1="27" x2="13" y2="20" />
      <line className={s.fig} x1="30" y1="27" x2="33" y2="43" />
      <line className={s.fig} x1="30" y1="27" x2="26" y2="43" />
      <line className={cx(s.fig, s.mv, s.rwArm)} x1="14" y1="21" x2="14" y2="34" />
      <rect className={cx(s.solid, s.mv, s.rwDb)} x="10" y="34" width="8" height="3.5" rx="1.75" />
    </>
  ),

  /* Side view, hips sit back and down; shin stays put. */
  squat: (
    <>
      <line className={s.floor} x1="4" y1="44" x2="46" y2="44" />
      <line className={s.fig} x1="22" y1="43" x2="26" y2="33" />
      <line className={s.fig} x1="22" y1="43" x2="28" y2="43" />
      <g className={cx(s.mv, s.sqThigh)}>
        <line className={s.fig} x1="26" y1="33" x2="24" y2="21" />
        <g className={cx(s.mv, s.sqTorso)}>
          <line className={s.fig} x1="24" y1="21" x2="24" y2="10" />
          <circle className={s.solid} cx="24" cy="5.5" r="3.5" />
        </g>
      </g>
    </>
  ),
};

/* Fallback for exercises without a motion yet: a still dumbbell. */
const STILL = (
  <>
    <line className={s.fig} x1="14" y1="24" x2="34" y2="24" />
    <rect className={s.solid} x="8" y="16" width="6" height="16" rx="2" />
    <rect className={s.solid} x="34" y="16" width="6" height="16" rx="2" />
  </>
);
