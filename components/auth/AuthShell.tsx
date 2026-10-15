import { FiChevronLeft } from "react-icons/fi";
import { Wordmark } from "@/components/brand/Wordmark";
import { IconLink } from "@/components/ui/IconLink";

type AuthShellProps = {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
};

// Shared frame for Create account and Log in: back button, wordmark, heading.
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="flex flex-1 flex-col px-6 pt-4 pb-9">
      <header className="flex items-center justify-between">
        <IconLink href="/welcome" aria-label="Back">
          <FiChevronLeft size={20} />
        </IconLink>
        <Wordmark className="text-xl" />
        <span className="w-11" />
      </header>

      <h1 className="display mt-8 text-5xl leading-[.95]">{title}</h1>
      <p className="mt-2.5 text-muted">{subtitle}</p>

      {children}
    </main>
  );
}
