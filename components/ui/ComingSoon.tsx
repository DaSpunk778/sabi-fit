import { FiChevronLeft } from "react-icons/fi";
import { IconLink } from "@/components/ui/IconLink";

type ComingSoonProps = {
  title: string;
  /** Tab screens have the tab bar instead of a back button */
  tab?: boolean;
};

// Stand-in for screens that haven't been built yet.
export function ComingSoon({ title, tab = false }: ComingSoonProps) {
  return (
    <main className={`flex-1 px-5 pt-4 ${tab ? "pb-25" : "pb-9"}`}>
      <header className="flex items-center gap-3">
        {!tab && (
          <IconLink href="/app" aria-label="Back">
            <FiChevronLeft size={20} />
          </IconLink>
        )}
        <h1 className="display text-[34px] leading-none">{title}</h1>
      </header>
      <p className="mt-4 text-muted">This screen hasn&apos;t been built yet.</p>
    </main>
  );
}
