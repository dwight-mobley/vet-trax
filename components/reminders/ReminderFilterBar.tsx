"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ReminderFilterBar({ basePath = "/reminders" }: { basePath?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUpdate = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete(key);
    else params.set(key, value);
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <select
        defaultValue={searchParams.get("sort") || "due_date"}
        onChange={(e) => handleUpdate("sort", e.target.value)}
        className="w-full rounded-medium border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm sm:w-auto"
      >
        <option value="due_date">Sort: Due Date</option>
        <option value="title">Sort: Title</option>
        <option value="pet">Sort: Pet Name</option>
      </select>

      <select
        defaultValue={searchParams.get("category") || "all"}
        onChange={(e) => handleUpdate("category", e.target.value)}
        className="w-full rounded-medium border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm sm:w-auto"
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