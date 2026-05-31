import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import { ModalProvider } from "@/context/ModalContext";
import { requireUser } from "@/utils/supabase/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await requireUser();
  return (
    <ModalProvider>
      <DashboardLayoutClient user={user}> {children}</DashboardLayoutClient>
    </ModalProvider>
  );
}
