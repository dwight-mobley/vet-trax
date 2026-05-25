import React from "react";
import MarkReminderCompleteButton from "../ui/MarkReminderCompleteButton";
import DeleteReminderButton from "../ui/DeleteReminderButton";

import { Reminder, ReminderHistory } from "@/schemas/reminder";
import { dateCalculator, dateFormatter } from "@/utils/tools";
import Link from "next/link";

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

function ReminderTable({ reminders, history = false }: { reminders: Reminder[] | ReminderHistory[]; history: boolean }) {
  if (reminders.length === 0) {
    return <div>No Records</div>;
  }
  return (
    <div className="overflow-x-auto rounded-large border border-slate-200 bg-background-paper shadow-sm">
      <table className="w-full text-left text-sm text-text-primary">
        <thead className="bg-slate-50 text-xs uppercase text-text-secondary">
          <tr>
            <th className="px-6 py-4">Pet</th>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Category</th>
            {!history && <th className="px-6 py-4">Due Date</th>}
            <th className="px-6 py-4">{!history ? "Last Completed" : "Completed"}</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reminders.map((reminder) => {
              const dueDate = dateCalculator(reminder.due_date as string) ;
              const dueDateStyles = dueDate.status === "upcoming" ? "" : dueDate.status === "near" ? "text-amber-500" : "text-red-500";
            return (
              <tr key={reminder.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium">{reminder.pet!.name}</td>
                <td className="px-6 py-4 font-semibold">{reminder.title}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${getCategoryStyles(reminder.category)}`}>{reminder.category}</span>
                </td>
                {!history && <td className={`px-6 py-4 ${dueDateStyles}`}>{dueDate.date}</td>}
                {!history && <td className="px-6 py-4">{dateFormatter(reminder?.date_completed ?? reminder?.completed_at ?? undefined)}</td>}
                <td className="px-6 py-4 text-right">
                  {!history && (
                    <>
                      <Link href={`/reminders/edit/${reminder.id}`} className="text-primary hover:underline">
                        Edit
                      </Link>{" "}
                      <span className="px-3">|</span>
                      <MarkReminderCompleteButton reminderId={reminder.id as string} />
                      <span className="px-3">|</span>
                    </>
                  )}
                  <DeleteReminderButton reminderId={reminder.id as string} history={history} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ReminderTable;
