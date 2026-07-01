import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import { ModalProvider } from "@/context/ModalContext";
import { requireUser } from "@/utils/supabase/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — PetCare",
  description: "Manage your pets, track reminders, and stay on top of care.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <ModalProvider>
      <DashboardLayoutClient user={user}>
        {/* Subtle top accent bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
        <div className="pt-1">{children}</div>
      </DashboardLayoutClient>
    </ModalProvider>
  );
}