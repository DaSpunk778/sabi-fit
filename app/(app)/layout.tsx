import { ActiveWorkoutHydration } from "@/components/ActiveWorkoutHydration";
import { TimeZoneSync } from "@/components/TimeZoneSync";
import { getTimeZone } from "@/lib/timezone";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const timeZone = await getTimeZone();

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-120 flex-col bg-bg">
      {children}
      <TimeZoneSync serverTimeZone={timeZone} />
      <ActiveWorkoutHydration />
    </div>
  );
}
