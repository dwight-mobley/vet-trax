import { ReminderHistory } from "@/schemas/reminder";
import { dateCalculator, dateFormatter } from "@/utils/tools";

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

export default function PetReminderHistoryTable({
    reminders,
}: {
    reminders: ReminderHistory[];
}) {
    if (reminders.length === 0) {
        return (
            <div className="rounded-large border border-text-disabled/30 bg-background-paper p-6 text-sm text-text-secondary">
                No completed reminder history for this pet.
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-3 md:hidden">
                {reminders.map((reminder) => {
                    const dueDate = dateCalculator(reminder.due_date ?? undefined);
                    const dueDateStyles =
                        dueDate.status === "upcoming"
                            ? "text-text-primary"
                            : dueDate.status === "near"
                                ? "text-amber-600"
                                : "text-red-600";

                    return (
                        <article
                            key={reminder.id}
                            className="rounded-large border border-slate-200 bg-background-paper p-4 shadow-sm"
                        >
                            <div className="mb-2 flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold text-text-primary">{reminder.title}</p>
                                <span
                                    className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${getCategoryStyles(reminder.category)}`}
                                >
                                    {reminder.category ?? "other"}
                                </span>
                            </div>
                            <div className="space-y-1 text-xs">
                                <p className={dueDateStyles}>Due: {dueDate.date}</p>
                                <p className="text-text-secondary">Completed: {dateFormatter(reminder.completed_at ?? reminder.date_completed ?? undefined)}</p>
                                <p className="text-text-secondary">{reminder.description || "-"}</p>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="hidden overflow-x-auto rounded-large border border-slate-200 bg-background-paper shadow-sm md:block">
                <table className="w-full text-left text-sm text-text-primary">
                    <thead className="bg-slate-50 text-xs uppercase text-text-secondary">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Completed</th>
                            <th className="px-6 py-4">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reminders.map((reminder) => {
                            const dueDate = dateCalculator(reminder.due_date ?? undefined);
                            const dueDateStyles =
                                dueDate.status === "upcoming"
                                    ? ""
                                    : dueDate.status === "near"
                                        ? "text-amber-500"
                                        : "text-red-500";

                            return (
                                <tr key={reminder.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-semibold">{reminder.title}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${getCategoryStyles(reminder.category)}`}
                                        >
                                            {reminder.category ?? "other"}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 ${dueDateStyles}`}>{dueDate.date}</td>
                                    <td className="px-6 py-4">
                                        {dateFormatter(
                                            reminder.completed_at ?? reminder.date_completed ?? undefined
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {reminder.description || "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
