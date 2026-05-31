import { getUserPets } from '@/data-access/pets';
import { getUserReminders } from '@/data-access/reminders';
import { requireUser } from '@/utils/supabase/auth';
import Link from 'next/link';
import React from 'react';

async function DashboardPage() {
  const user = await requireUser();
  const reminders = await getUserReminders(user.id);
  const pets = await getUserPets(user.id);

  const upcomingReminders = reminders
    .filter((reminder) => {
      const reminderDate = new Date(reminder.due_date);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      return reminderDate <= thirtyDaysFromNow;
    })
    .sort(
      (a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <header>
          <h1 className="text-3xl font-bold text-text-primary">
            Welcome back!
          </h1>
          <p className="text-text-secondary mt-1">
            Here is what&apos;s happening with your pets today.
          </p>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Pets Overview (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-background-paper rounded-large p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Your Pets</h2>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  + Add Pet
                </button>
              </div>

              {pets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <Link href={`/pets/${pet.id}`}
                      key={pet.id}
                      className="p-4 rounded-medium border border-gray-100 hover:border-primary-light transition-colors flex items-center space-x-4"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary-light/20 flex items-center justify-center text-primary font-bold text-lg">
                        {pet.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{pet.name}</h3>
                        <p className="text-sm text-text-secondary capitalize">{pet.breed || 'Pet'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <p>You haven&apos;t added any pets yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Upcoming Reminders */}
          <div className="space-y-6">
            <section className="bg-background-paper rounded-large p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Upcoming</h2>
                <span className="bg-secondary-light/20 text-secondary-dark text-xs font-bold px-2 py-1 rounded-small">
                  30 Days
                </span>
              </div>

              {upcomingReminders.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingReminders.map((reminder) => {
                    // Calculate if it's overdue, due soon (warning), or standard (info)
                    const isOverdue = new Date(reminder.due_date) < new Date();
                    const statusColor = isOverdue ? 'text-status-critical' : 'text-status-warning';
                    const dotColor = isOverdue ? 'bg-status-critical' : 'bg-status-warning';

                    return (
                      <li
                        key={reminder.id}
                        className="flex items-start p-3 rounded-medium bg-background hover:bg-gray-50 transition-colors"
                      >
                        <div className={`mt-1.5 h-2 w-2 rounded-full ${dotColor} shrink-0`} />
                        <div className="ml-3 flex gap-3">
                          <p className="text-sm font-medium text-text-primary">
                            {reminder.pet.name}
                          </p>
                          <p className="text-sm font-medium text-text-primary">
                            {reminder.title}
                          </p>
                          <p className={`text-xs mt-0.5 ${isOverdue ? statusColor : 'text-text-secondary'}`}>
                            {new Date(reminder.due_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8 bg-background rounded-medium border border-dashed border-gray-200">
                  <p className="text-sm text-text-secondary">You&apos;re all caught up!</p>
                  <p className="text-xs text-text-disabled mt-1">No reminders for the next 30 days.</p>
                </div>
              )}
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;