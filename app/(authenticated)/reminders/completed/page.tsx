import { getUserReminderHistory } from "@/data-access/reminders";
import Link from "next/link";
import { ReminderFilterBar } from "@/components/reminders/ReminderFilterBar";
import ReminderTable from "@/components/reminders/ReminderTable";
import ReminderMobileList from "@/components/reminders/ReminderMobileList";
import { requireUser } from "@/utils/supabase/auth";

export default async function ReminderPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const user = await requireUser();

  const reminders = await getUserReminderHistory(user.id);

  // Apply Filtering & Sorting
  const categoryFilter = (params.category as string) || "all";
  const sort = (params.sort as string) || "due_date";

  const processedReminders = [...reminders]
    .filter((r) => categoryFilter === "all" || r.category === categoryFilter)
    .sort((a, b) => {
      if (sort === "due_date") return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "pet") return a.pet.name.localeCompare(b.pet.name);
      return 0;
    });

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/reminders" className="text-primary hover:text-primary-dark hover:underline text-sm font-medium transition-colors inline-flex items-center">
          &larr; Back to Reminders
        </Link>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Completed Reminders</h1>
      </div>

      <div className="mb-6">
        <ReminderFilterBar basePath="/reminders/completed" />
      </div>

      <div className="md:hidden">
        <ReminderMobileList reminders={processedReminders} history={true} />
      </div>
      <div className="hidden md:block">
        <ReminderTable reminders={processedReminders} history={true} />
      </div>
    </div>
  );
}