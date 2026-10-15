import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return <ComingSoon title="Progress" tab />;
}
