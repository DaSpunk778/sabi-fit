import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Welcome" };

const pills = ["Plan your day", "Log sets", "See progress"];

export default function WelcomePage() {
  return (
    <main className="flex flex-1 flex-col px-6 pt-8 pb-9">
      <div className="relative flex flex-1 flex-col items-center justify-center text-center">
        {/* Progress ring behind the logo, sitting a little above centre */}
        <svg
          width="520"
          height="520"
          viewBox="0 0 520 520"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-[calc(50%+29px)]"
        >
          <circle
            cx="260"
            cy="260"
            r="230"
            fill="none"
            stroke="var(--color-surface)"
            strokeWidth="40"
          />
          <circle
            cx="260"
            cy="260"
            r="230"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="40"
            strokeLinecap="round"
            strokeDasharray="1050 1445"
            transform="rotate(-90 260 260)"
            opacity=".9"
          />
        </svg>

        <div className="relative flex flex-col items-center">
          <Logo size={72} />
          <h1 className="display mt-5 text-[84px] leading-[.85] italic">
            Sabi
            <br />
            <span className="text-accent">Fit</span>
          </h1>
          <p className="mt-4.5 max-w-65 text-[17px] font-semibold">
            Know your numbers.
            <br />
            Beat your last session.
          </p>
        </div>
      </div>

      <ul className="relative mb-6 flex justify-center gap-2">
        {pills.map((pill) => (
          <li
            key={pill}
            className="inline-flex h-8.5 items-center rounded-full border border-line bg-surface px-3.5 text-[13px] font-bold whitespace-nowrap text-[#C9CDD1]"
          >
            {pill}
          </li>
        ))}
      </ul>

      <div className="relative flex flex-col gap-3">
        <ButtonLink href="/signup">Create account</ButtonLink>
        <ButtonLink href="/login" variant="secondary">
          I already have an account
        </ButtonLink>
      </div>
    </main>
  );
}
