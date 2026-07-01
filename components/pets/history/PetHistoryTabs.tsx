"use client";

import { useMemo, useState } from "react";
import { Reminder, ReminderHistory } from "@/schemas/reminder";
import { MedicalRecordWithPet } from "@/schemas/medical-records";
import PetReminderHistoryTable from "@/components/pets/history/PetReminderHistoryTable";
import PetMedicalRecordHistoryTable from "@/components/pets/history/PetMedicalRecordHistoryTable";
import PetUpcomingReminderTable from "@/components/pets/history/PetUpcomingReminderTable";

type TabKey = "upcoming" | "history" | "medical";

export default function PetHistoryTabs({
    upcomingReminders,
    reminderHistory,
    medicalRecordHistory,
}: {
    upcomingReminders: Reminder[];
    reminderHistory: ReminderHistory[];
    medicalRecordHistory: MedicalRecordWithPet[];
}) {
    const [activeTab, setActiveTab] = useState<TabKey>("upcoming");

    const tabMeta = useMemo(
        () => [
            { key: "upcoming" as const, label: "Upcoming Reminders", count: upcomingReminders.length },
            { key: "history" as const, label: "Reminder History", count: reminderHistory.length },
            { key: "medical" as const, label: "Medical Record History", count: medicalRecordHistory.length },
        ],
        [upcomingReminders.length, reminderHistory.length, medicalRecordHistory.length]
    );

    return (
        <section className="mt-8">
            <div className="mb-4 flex flex-wrap gap-2 rounded-large border border-text-disabled/30 bg-background-paper p-2">
                {tabMeta.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center gap-2 rounded-medium px-4 py-2 text-sm font-semibold transition-colors ${isActive
                                    ? "bg-primary text-white"
                                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                                }`}
                        >
                            {tab.label}
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white/20 text-white" : "bg-background text-text-secondary"
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {activeTab === "upcoming" && <PetUpcomingReminderTable reminders={upcomingReminders} />}
            {activeTab === "history" && <PetReminderHistoryTable reminders={reminderHistory} />}
            {activeTab === "medical" && <PetMedicalRecordHistoryTable records={medicalRecordHistory} />}
        </section>
    );
}
