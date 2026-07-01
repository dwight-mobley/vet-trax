import { Reminder } from "@/types/reminder";
import { dateCalculator, parseDbDate } from "@/utils/tools";



 export function IconCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

export function ReminderItem({ reminder }: { reminder: Reminder }) {
  const now = new Date();
  const due = parseDbDate(reminder.due_date);
  if (!due) return null;

  const isOverdue = due < now;
  const dueState = dateCalculator(reminder.due_date);

  // Urgency styling
  let dotColor: string;
  let badgeLabel = dueState.date;
  let badgeStyle: string;

  if (dueState.status === "past") {
    dotColor = "bg-red-500";
    badgeStyle =
      "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800/50";
  } else if (dueState.status === "today") {
    dotColor = "bg-amber-500";
    badgeStyle =
      "bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800/50";
  } else if (dueState.status === "near") {
    dotColor = "bg-amber-400";
    badgeStyle =
      "bg-amber-50/50 text-amber-600 ring-1 ring-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/30";
  } else {
    dotColor = "bg-emerald-400";
    badgeStyle =
      "bg-gray-50 text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700";
  }

  // Keep hard-overdue items visually urgent even if relative text comes from helper.
  if (isOverdue) {
    dotColor = "bg-red-500";
  }

  return (
    <li className="group flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor} shadow-sm`} />
      <div className="flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {reminder?.pet?.name || ''}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {reminder.title}
        </span>
        <span
          className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeStyle}`}
        >
          <IconCalendar />
          {badgeLabel}
        </span>
      </div>
    </li>
  );
}