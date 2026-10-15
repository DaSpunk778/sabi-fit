import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return <ComingSoon title="History" tab />;
}
