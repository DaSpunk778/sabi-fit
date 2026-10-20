import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { TabBar } from "@/components/ui/TabBar";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return (
    <>
      <ComingSoon title="History" tab />
      <TabBar active="history" />
    </>
  );
}
