import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";
import { logOut } from "@/app/(auth)/actions";
import { Card } from "@/components/ui/Card";
import { IconLink } from "@/components/ui/IconLink";
import { getAccount } from "@/lib/data/profiles";
import { LogOutButton } from "./LogOutButton";
import { NameEditor } from "./NameEditor";

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
          <NameEditor name={account.name} email={account.email} />
        <Card className="mt-2 overflow-hidden">
          <form action={logOut}>
            <LogOutButton />
          </form>
        </Card>
      </div>
    </main>
  );
}
