import { createClient } from "@/utils/supabase/server";
import { getRecordsByColumn, getSingleRecordByColumn } from "./base-queries";
import { cookies } from "next/headers";

export const getUserReminders = async (userId: string) => {
  const pets = await getRecordsByColumn("pets", "owner_id", userId);
  if(!pets || pets.length === 0) {
    return [];
  }
  const reminderPromises = pets.map((pet) => getRecordsByColumn("reminders", "pet_id", pet.id));
  const remindersNested = await Promise.all(reminderPromises);
  const reminders = remindersNested.map((reminderList, index) =>
    reminderList.map((reminder) => ({ ...reminder, pet: pets[index] }))
  ).flat();
  return reminders;
};

export const getReminderById = async (reminderId: string) => {
  const reminder = await getSingleRecordByColumn("reminders", "id", reminderId);
  if (!reminder) {
    return null;
  }
  const pet = await getSingleRecordByColumn("pets", "id", reminder.pet_id);
  return { ...reminder, pet };
};

export const getUserReminderHistory = async (userId: string) => {
  console.log("Fetching reminder history for user:", userId);
  const supabase = await createClient(await cookies());
  const { data: history, error } = await supabase
    .from("reminder_history")
    .select("*, pets(name, owner_id)")
    .eq("pets.owner_id", userId)
    .order("completed_at", { ascending: false });
  if (error) {
    console.log("Error fetching reminder history:", error);
    return [];
  }

  const reminders = history.map((record) => (
    {...record, pet: record.pets}
  ));
  return reminders;
}
