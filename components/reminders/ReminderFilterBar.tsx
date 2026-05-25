"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ReminderFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUpdate = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete(key);
    else params.set(key, value);
    router.push(`/reminders?${params.toString()}`);
  };

  return (
    <div className="flex gap-4">
      <select
        defaultValue={searchParams.get("sort") || "due_date"}
        onChange={(e) => handleUpdate("sort", e.target.value)}
        className="rounded-medium border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
      >
        <option value="due_date">Sort: Due Date</option>
        <option value="title">Sort: Title</option>
        <option value="pet">Sort: Pet Name</option>
      </select>

      <select
        defaultValue={searchParams.get("category") || "all"}
        onChange={(e) => handleUpdate("category", e.target.value)}
        className="rounded-medium border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
      >
        <option value="all">All Categories</option>
        <option value="vaccination">Vaccination</option>
        <option value="appointment">Appointment</option>
        <option value="medication">Medication</option>
        <option value="test">Test</option>
      </select>
    </div>
  );
}