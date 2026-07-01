import { Reminder } from "@/types/reminder";
import { ReminderItem } from "./ReminderItem";
import { dateCalculator, parseDateKeyAsLocalDate } from "@/utils/tools/dates";

export function ReminderDatePin({
  dateKey,
  reminders,
  defaultOpen = false,
  overdue = false,
}: {
  dateKey: string;
  reminders: Reminder[];
  defaultOpen?: boolean;
  overdue?: boolean;
}) {
  const date = parseDateKeyAsLocalDate(dateKey);
  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const pinDateState = dateCalculator(dateKey);

  let pinDateBadgeStyle =
    "bg-gray-50 text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700";
  if (pinDateState.status === "past") {
    pinDateBadgeStyle =
      "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800/50";
  } else if (pinDateState.status === "today") {
    pinDateBadgeStyle =
      "bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800/50";
  } else if (pinDateState.status === "near") {
    pinDateBadgeStyle =
      "bg-amber-50/50 text-amber-600 ring-1 ring-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/30";
  }

  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-gray-100 bg-white/90 shadow-sm transition-all open:border-gray-200 open:shadow-md hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900/80 dark:open:border-gray-700"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${overdue ? "bg-red-500" : "bg-emerald-500"
              }`}
          />
          <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {dateLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${pinDateBadgeStyle}`}
          >
            {pinDateState.date}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${overdue
              ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}
          >
            {reminders.length} {reminders.length === 1 ? "item" : "items"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180 dark:text-gray-500"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </summary>

      <ul className="border-t border-gray-100 bg-gray-50/40 px-2 py-1 dark:border-gray-800 dark:bg-gray-900/40">
        {reminders.map((reminder) => (
          <ReminderItem key={reminder.id} reminder={reminder} />
        ))}
      </ul>
    </details>
  );
}