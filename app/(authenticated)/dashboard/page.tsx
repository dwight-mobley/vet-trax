import React from "react";
import Link from "next/link";
import { Reminder } from "@/types/reminder";

import { IconCheckCircle, IconDog, IconPaw, IconPlus } from "@/components/ui/icons";
import { parseDateKeyAsLocalDate } from "@/utils/tools/dates";
import {DashboardPetCard} from "@/components/cards/DashboardPetCard";
import { ReminderDatePin } from "@/components/reminders/ReminderDatePin";
import { getUserPets } from "@/data-access/pets";
import { getUserReminders } from "@/data-access/reminders";
import {parseDbDate } from "@/utils/tools";
import { requireUser } from "@/utils/supabase/auth";



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

  for (const r of reminders) {
    const d = parseDbDate(r.due_date);
    if (!d) continue;

    if (d < now) overdue.push(r);
    else if (d <= todayEnd) today.push(r);
    else if (d <= sevenDays) thisWeek.push(r);
  }

  return { overdue, today, thisWeek };
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function groupRemindersByDate(reminders: Reminder[]) {
  const grouped = new Map<string, Reminder[]>();

  for (const reminder of reminders) {
    const due = parseDbDate(reminder.due_date);
    if (!due) continue;

    const key = getLocalDateKey(due);
    const existing = grouped.get(key);

    if (existing) {
      existing.push(reminder);
    } else {
      grouped.set(key, [reminder]);
    }
  }

  return grouped;
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
        href="/pets/new"
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
      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">No reminders in the last or next 30 days.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────────

async function DashboardPage() {
  const user = await requireUser();
  const reminders = await getUserReminders(user.id);
  const pets = await getUserPets(user.id);

  // Filter reminders in a symmetric window (last 30 days + next 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const windowedReminders = reminders
    .filter((r) => {
      const due = parseDbDate(r.due_date);
      if (!due) return false;
      return due >= thirtyDaysAgo && due <= thirtyDaysFromNow;
    })
    .sort((a, b) => {
      const dueA = parseDbDate(a.due_date);
      const dueB = parseDbDate(b.due_date);
      if (!dueA || !dueB) return 0;
      return dueA.getTime() - dueB.getTime();
    });

  const overdueReminders = windowedReminders.filter((r) => {
    const due = parseDbDate(r.due_date);
    return due ? due < now : false;
  });

  const nonOverdueUpcomingReminders = windowedReminders.filter((r) => {
    const due = parseDbDate(r.due_date);
    return due ? due >= now : false;
  });

  const overdueReminderPins = Array.from(
    groupRemindersByDate(overdueReminders).entries()
  ).sort(
    ([a], [b]) =>
      parseDateKeyAsLocalDate(b).getTime() - parseDateKeyAsLocalDate(a).getTime()
  );

  const upcomingReminderPins = Array.from(
    groupRemindersByDate(nonOverdueUpcomingReminders).entries()
  ).sort(
    ([a], [b]) =>
      parseDateKeyAsLocalDate(a).getTime() - parseDateKeyAsLocalDate(b).getTime()
  );

  const { overdue, today, thisWeek } = categorizeReminders(windowedReminders);

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
              href="/pets/new"
              className="mt-3 inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-200/60 active:scale-[0.97] sm:mt-0 dark:shadow-emerald-900/30"
            >
              <IconPlus />
              Add Pet
            </Link>
          </div>
        </header>
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
                      <DashboardPetCard key={pet.id} pet={pet} />
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
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/60 shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Upcoming
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 ring-1 ring-amber-200/70 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800/40">
                  Last 30 / Next 30
                </span>
              </div>

              <div className="p-6">
                {windowedReminders.length > 0 ? (
                  <div className="space-y-4">
                    {overdueReminderPins.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2 px-1">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                            Overdue
                          </p>
                        </div>
                        <div className="space-y-2">
                          {overdueReminderPins.map(([dateKey, dateReminders], index) => (
                            <ReminderDatePin
                              key={`overdue-${dateKey}`}
                              dateKey={dateKey}
                              reminders={dateReminders}
                              overdue
                              defaultOpen={index === 0}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {upcomingReminderPins.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2 px-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                            Upcoming Dates
                          </p>
                        </div>
                        <div className="space-y-2">
                          {upcomingReminderPins.map(([dateKey, dateReminders], index) => (
                            <ReminderDatePin
                              key={`upcoming-${dateKey}`}
                              dateKey={dateKey}
                              reminders={dateReminders}
                              defaultOpen={overdueReminderPins.length === 0 && index === 0}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
