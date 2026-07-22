import type { Metadata } from "next";
import { ActiveDashboard } from "@/components/dashboard/ActiveDashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default function ActiveDashboardPage() {
  return <ActiveDashboard />;
}
