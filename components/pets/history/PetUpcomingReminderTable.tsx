import { Reminder } from "@/schemas/reminder";
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

export default function PetUpcomingReminderTable({
    reminders,
}: {
    reminders: Reminder[];
}) {
    if (reminders.length === 0) {
        return (
            <div className="rounded-large border border-text-disabled/30 bg-background-paper p-6 text-sm text-text-secondary">
                No upcoming reminders for this pet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-large border border-slate-200 bg-background-paper shadow-sm">
            <table className="w-full text-left text-sm text-text-primary">
                <thead className="bg-slate-50 text-xs uppercase text-text-secondary">
                    <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4">Last Completed</th>
                        <th className="px-6 py-4">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {reminders.map((reminder) => {
                        const dueDate = dateCalculator(reminder.due_date as string);
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
                                    {dateFormatter(reminder.date_completed ?? reminder.completed_at ?? undefined)}
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
    );
}
