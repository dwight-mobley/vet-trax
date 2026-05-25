import { getUserReminders } from "@/data-access/reminders";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { dateCalculator, dateFormatter } from "@/utils/tools";
import { ReminderFilterBar } from "@/components/reminders/ReminderFilterBar";

import DeleteReminderButton from "@/components/ui/DeleteReminderButton";
import MarkReminderCompleteButton from "@/components/ui/MarkReminderCompleteButton";
import { da } from "zod/locales";



const getCategoryStyles = (category?: string | null) => {
  switch (category) {
    case "vaccination":
      return "bg-status-info/10 text-status-info border-status-info/20";
    case "appointment":
      return "bg-primary/10 text-primary border-primary/20";
    case "medication":
      return "bg-secondary/10 text-secondary-dark border-secondary/20";
    case "test":
      return "bg-status-warning/10 text-status-warning border-status-warning/20";
    default:
      return "bg-slate-100 text-text-secondary border-slate-200";
  }
};

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
    });

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Upcoming Reminders</h1>
        <Link href="/reminders/new" className="rounded-medium bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          + New Reminder
        </Link>
      </div>

      <div className="mb-6">
        <ReminderFilterBar />
      </div>

      <div className="overflow-x-auto rounded-large border border-slate-200 bg-background-paper shadow-sm">
        <table className="w-full text-left text-sm text-text-primary">
          <thead className="bg-slate-50 text-xs uppercase text-text-secondary">
            <tr>
              <th className="px-6 py-4">Pet</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Last Completed</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processedReminders.map((reminder) => {
              const dueDate = dateCalculator(reminder.due_date)
              const dueDateStyles = dueDate.status === "upcoming" ? '' : dueDate.status === "near" ? 'text-amber-500' : 'text-red-500'
              return(
              <tr key={reminder.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium">{reminder.pet.name}</td>
                <td className="px-6 py-4 font-semibold">{reminder.title}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${getCategoryStyles(reminder.category)}`}>{reminder.category}</span>
                </td>
                <td className={`px-6 py-4 ${dueDateStyles}`}>{dueDate.date}</td>
                <td className="px-6 py-4">{dateFormatter(reminder?.date_completed ?? undefined)}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/reminders/edit/${reminder.id}`} className="text-primary hover:underline">
                    Edit
                  </Link>{" "}
                  <span className="px-3">|</span>
                  <MarkReminderCompleteButton reminderId={reminder.id} />
                  <span className="px-3">|</span>
                  <DeleteReminderButton reminderId={reminder.id} />
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
