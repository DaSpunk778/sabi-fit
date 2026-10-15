import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Exercise progress" };

export default function ExerciseProgressPage() {
  return <ComingSoon title="Exercise progress" />;
}
