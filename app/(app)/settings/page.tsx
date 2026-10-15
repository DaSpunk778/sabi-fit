import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FiChevronLeft, FiLogOut, FiUser } from "react-icons/fi";
import { logOut } from "@/app/(auth)/actions";
import { Card } from "@/components/ui/Card";
import { IconLink } from "@/components/ui/IconLink";
import { getAccount } from "@/lib/data/profiles";

export const metadata: Metadata = { title: "Settings" };

// Account + Log out only for now. Rest time, sound, vibration and
// "Download my data" arrive with the Settings milestone.
export default async function SettingsPage() {
  const account = await getAccount();
  if (!account) redirect("/welcome");

  return (
    <main className="flex-1 pb-9">
      <header className="flex items-center gap-3 px-5 pt-4 pb-3">
        <IconLink href="/app" aria-label="Back">
          <FiChevronLeft size={20} />
        </IconLink>
        <h1 className="display text-[34px] leading-none">Settings</h1>
      </header>

      <div className="flex flex-col gap-2.5 px-5 pt-1">
        <h2 className="label mt-2">Account</h2>
        <Card className="flex items-center gap-3.5 p-4">
          <span className="inline-flex size-13 flex-none items-center justify-center rounded-full bg-accent text-bg">
            <FiUser size={24} strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <b className="block truncate text-[17px]">{account.name}</b>
            <span className="block truncate text-sm text-muted">
              {account.email}
            </span>
          </span>
        </Card>

        <Card className="mt-2 overflow-hidden">
          <form action={logOut}>
            <button
              type="submit"
              className="flex min-h-14 w-full items-center gap-3 px-4 text-left font-bold text-[#FF8A8A] hover:bg-raised"
            >
              <FiLogOut size={20} />
              Log out
            </button>
          </form>
        </Card>
      </div>
    </main>
  );
}
