import type { Metadata } from "next";
import { AdminPortal } from "@/components/admin/admin-portal";

export const metadata: Metadata = {
  title: "Admin workspace",
  description: "Protected editor workspace for the BIT Patna energy audit dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPortal />;
}
