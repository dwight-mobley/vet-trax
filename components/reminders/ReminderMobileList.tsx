import Link from "next/link";
import { Reminder } from "@/schemas/reminder";
import { dateCalculator, dateFormatter } from "@/utils/tools";
import MarkReminderCompleteButton from "../ui/MarkReminderCompleteButton";
import DeleteReminderButton from "../ui/DeleteReminderButton";

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

export default function ReminderMobileList({ reminders }: { reminders: Reminder[] }) {
    if (reminders.length === 0) {
        return (
            <div className="rounded-large border border-slate-200 bg-background-paper p-4 text-sm text-text-secondary">
                No records
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {reminders.map((reminder) => {
                const dueDate = dateCalculator(reminder.due_date as string);
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
                            <div>
                                <p className="text-sm font-semibold text-text-primary">{reminder.title}</p>
                                <p className="text-xs text-text-secondary">{reminder.pet?.name || "Unknown pet"}</p>
                            </div>
                            <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${getCategoryStyles(
                                    reminder.category
                                )}`}
                            >
                                {reminder.category || "other"}
                            </span>
                        </div>

                        <div className="mb-3 space-y-1 text-xs">
                            <p className={dueDateStyles}>Due: {dueDate.date}</p>
                            <p className="text-text-secondary">
                                Last completed: {dateFormatter(reminder.date_completed ?? reminder.completed_at ?? undefined)}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <Link href={`/reminders/edit/${reminder.id}`} className="text-primary hover:underline">
                                Edit
                            </Link>
                            <MarkReminderCompleteButton reminderId={reminder.id as string} />
                            <DeleteReminderButton reminderId={reminder.id as string} history={false} />
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
