import { getUserReminders } from "@/data-access/reminders";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { ReminderFilterBar } from "@/components/reminders/ReminderFilterBar";
import ReminderTable from "@/components/reminders/ReminderTable";
import ReminderMobileList from "@/components/reminders/ReminderMobileList";

export default async function ReminderPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const supabase = await createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <div className="p-6">Please log in.</div>;

  const reminders = await getUserReminders(user.id);

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
    })
    // Fix for  record history type
    .map((r) => ({ ...r, completed_at: null }));

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Upcoming Reminders</h1>
        <Link href="/reminders/new" className="w-full rounded-medium bg-primary px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-dark sm:w-auto">
          + New Reminder
        </Link>
      </div>
      {/* History Navigation */}
      <div className="mb-6">
        <Link href="/reminders/completed" className="rounded-medium bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          View Completed Reminders
        </Link>
      </div>

      <div className="mb-6">
        <ReminderFilterBar />
      </div>
      <div className="md:hidden">
        <ReminderMobileList reminders={processedReminders} />
      </div>
      <div className="hidden md:block">
        <ReminderTable reminders={processedReminders} history={false} />
      </div>
    </div>
  );
}
