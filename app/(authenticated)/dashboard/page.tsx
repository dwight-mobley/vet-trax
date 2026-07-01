import { getUserPets } from "@/data-access/pets";
import { getUserReminders } from "@/data-access/reminders";
import { requireUser } from "@/utils/supabase/auth";
import Link from "next/link";
import React from "react";

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────

interface Pet {
  id: string;
  name: string;
  breed?: string | null;
  species?: string | null;
  avatar_url?: string | null;
}

interface Reminder {
  id: string;
  title: string;
  due_date: string;
  pet: { name: string };
}

interface DashboardData {
  user: { id: string; email?: string };
  reminders: Reminder[];
  pets: Pet[];
}

// ─────────────────────────────────────────────────
// Helper: group reminders by urgency
// ─────────────────────────────────────────────────

function categorizeReminders(reminders: Reminder[]) {
  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const sevenDays = new Date();
  sevenDays.setDate(now.getDate() + 7);

  const overdue: Reminder[] = [];
  const today: Reminder[] = [];
  const thisWeek: Reminder[] = [];
  const upcoming: Reminder[] = [];

  for (const r of reminders) {
    const d = new Date(r.due_date);
    if (d < now) overdue.push(r);
    else if (d <= todayEnd) today.push(r);
    else if (d <= sevenDays) thisWeek.push(r);
    else upcoming.push(r);
  }

  return { overdue, today, thisWeek, upcoming };
}

// ─────────────────────────────────────────────────
// SVG Icons (inline — no external dependency)
// ─────────────────────────────────────────────────

function IconPaw() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconDog() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1 1 1 1s-.559 1.076-.5 2c.083 1.314 1.666 2.121 2.5 2.5" />
      <path d="M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.08.703-1 1-1 1s.559 1.076.5 2c-.083 1.314-1.666 2.121-2.5 2.5" />
      <path d="M6 19v3" />
      <path d="M18 19v3" />
      <path d="M8 15h.01" />
      <path d="M16 15h.01" />
      <path d="M9 18a3.5 3.5 0 0 0 6 0" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

// ─────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────

function PetsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 p-4 text-emerald-500 dark:from-emerald-900/30 dark:to-teal-900/20 dark:text-emerald-400">
        <IconDog />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No pets yet</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
        Add your first pet to start tracking their care, reminders, and more.
      </p>
      <Link
        href="/pets/add"
        className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-200/60 active:scale-[0.97] dark:shadow-emerald-900/30"
      >
        <IconPlus />
        Add Your First Pet
      </Link>
    </div>
  );
}

function RemindersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="mb-3 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 p-3 text-amber-500 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-400">
        <IconCheckCircle />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">All caught up!</p>
      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">No reminders for the next 30 days.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
      {/* Color accent stripe */}
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${color}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            {value}
          </p>
        </div>
        <div className={`rounded-xl ${color.replace("bg-gradient-to-r", "bg-gradient-to-br").replace("from-", "from-").replace("via-", "via-").replace("to-", "to-")} p-2.5 text-white opacity-80`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Pet Card
// ─────────────────────────────────────────────────

function PetCard({ pet }: { pet: Pet }) {
  // Gradient palette based on pet name's first letter
  const gradients = [
    "from-emerald-500 to-teal-400",
    "from-sky-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-rose-500 to-pink-400",
    "from-amber-500 to-orange-400",
    "from-indigo-500 to-blue-400",
  ];
  const gradient = gradients[pet.name.charCodeAt(0) % gradients.length];

  return (
    <Link
      href={`/pets/${pet.id}`}
      className="group relative flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      {/* Avatar */}
      <div
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-lg font-bold text-white shadow-inner`}
      >
        {pet.name.charAt(0).toUpperCase()}
        {/* Online indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 dark:border-gray-900" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors dark:text-gray-100 dark:group-hover:text-emerald-400">
          {pet.name}
        </h3>
        <p className="text-sm text-gray-500 capitalize dark:text-gray-400">
          {pet.breed || pet.species || "Pet"}
        </p>
      </div>

      {/* Chevron */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-gray-300 transition-all group-hover:text-gray-500 group-hover:translate-x-0.5 dark:text-gray-600 dark:group-hover:text-gray-400"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}

// ─────────────────────────────────────────────────
// Reminder Item
// ─────────────────────────────────────────────────

function ReminderItem({ reminder }: { reminder: Reminder }) {
  const now = new Date();
  const due = new Date(reminder.due_date);
  const isOverdue = due < now;
  const isToday =
    due.toDateString() === now.toDateString();
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Urgency styling
  let dotColor: string;
  let badgeLabel: string;
  let badgeStyle: string;

  if (isOverdue) {
    dotColor = "bg-red-500";
    badgeLabel = "Overdue";
    badgeStyle =
      "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800/50";
  } else if (isToday) {
    dotColor = "bg-amber-500";
    badgeLabel = "Today";
    badgeStyle =
      "bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800/50";
  } else if (diffDays <= 3) {
    dotColor = "bg-amber-400";
    badgeLabel = `${diffDays}d`;
    badgeStyle =
      "bg-amber-50/50 text-amber-600 ring-1 ring-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/30";
  } else {
    dotColor = "bg-emerald-400";
    badgeLabel = due.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    badgeStyle =
      "bg-gray-50 text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700";
  }

  return (
    <li className="group flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor} shadow-sm`} />
      <div className="flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {reminder.pet.name}
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

// ─────────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────────

async function DashboardPage() {
  const user = await requireUser();
  const reminders = await getUserReminders(user.id);
  const pets = await getUserPets(user.id);

  // Filter reminders within 30 days
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const upcomingReminders = reminders
    .filter((r) => new Date(r.due_date) <= thirtyDaysFromNow)
    .sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );

  const { overdue, today, thisWeek } = categorizeReminders(upcomingReminders);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pb-12 dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <header className="mb-8 animate-[fadeIn_0.4s_ease-out]">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                Welcome back
                <span className="ml-2 inline-block animate-[wave_2s_ease-in-out_infinite] origin-[70%_70%]">
                  👋
                </span>
              </h1>
              <p className="mt-1.5 text-base text-gray-500 dark:text-gray-400">
                Here&apos;s what&apos;s happening with your pets.
              </p>
            </div>
            <Link
              href="/pets/add"
              className="mt-3 inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-200/60 active:scale-[0.97] sm:mt-0 dark:shadow-emerald-900/30"
            >
              <IconPlus />
              Add Pet
            </Link>
          </div>
        </header>

        {/* ─── Stats Row ─── */}
        <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-[fadeIn_0.5s_ease-out]">
          <StatCard
            label="Total Pets"
            value={pets.length}
            icon={<IconPaw />}
            color="from-emerald-400 via-teal-400 to-cyan-400"
          />
          <StatCard
            label="Due Today"
            value={today.length}
            icon={<IconBell />}
            color="from-amber-400 via-orange-400 to-red-400"
          />
          <StatCard
            label="This Week"
            value={thisWeek.length + today.length}
            icon={<IconCalendar />}
            color="from-violet-400 via-purple-400 to-fuchsia-400"
          />
          <StatCard
            label="Overdue"
            value={overdue.length}
            icon={<IconBell />}
            color="from-rose-400 via-pink-400 to-red-400"
          />
        </section>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ─── Left: Pets ─── */}
          <div className="lg:col-span-2 animate-[fadeIn_0.6s_ease-out]">
            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Your Pets
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {pets.length} {pets.length === 1 ? "pet" : "pets"}
                </span>
              </div>

              <div className="p-6">
                {pets.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {pets.map((pet) => (
                      <PetCard key={pet.id} pet={pet} />
                    ))}
                  </div>
                ) : (
                  <PetsEmptyState />
                )}
              </div>
            </section>
          </div>

          {/* ─── Right: Reminders ─── */}
          <div className="animate-[fadeIn_0.7s_ease-out]">
            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Upcoming
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  30 Days
                </span>
              </div>

              <div className="p-6">
                {upcomingReminders.length > 0 ? (
                  <ul className="-mx-3 divide-y divide-gray-50 dark:divide-gray-800">
                    {upcomingReminders.map((reminder) => (
                      <ReminderItem key={reminder.id} reminder={reminder} />
                    ))}
                  </ul>
                ) : (
                  <RemindersEmptyState />
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;