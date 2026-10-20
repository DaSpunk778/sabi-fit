import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { TabBar } from "@/components/ui/TabBar";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
      <>
        <ComingSoon title="Progress" tab />
        <TabBar active="progress" />
      </>
    );
}
