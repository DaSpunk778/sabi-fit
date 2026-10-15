import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { DAY_TYPES, type DayType } from "@/types";

export const metadata: Metadata = { title: "Plan" };

export default async function PlanDayPage({
  params,
}: PageProps<"/plan/[dayType]">) {
  const { dayType } = await params;
  if (!DAY_TYPES.includes(dayType as DayType)) notFound();

  return <ComingSoon title={`Plan ${dayType} day`} />;
}
