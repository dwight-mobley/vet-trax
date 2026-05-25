"use server";

import { getReminderById } from "@/data-access/reminders";
import { CreateReminderFormInput, CreateReminderFormSchema, ReminderUpdate } from "@/schemas/reminder";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

// Helper function for calculating the next due date based on the recurrence pattern
type RecurrencePeriod = "days" | "weeks" | "months" | "years";

export async function calculateNewDueDate(interval: number, period: RecurrencePeriod): Promise<Date> {
  const today = new Date();

  switch (period) {
    case "days":
      today.setDate(today.getDate() + interval);
      break;
    case "weeks":
      today.setDate(today.getDate() + interval * 7);
      break;
    case "months":
      today.setMonth(today.getMonth() + interval);
      break;
    case "years":
      today.setFullYear(today.getFullYear() + interval);
      break;
    default:
      throw new Error(`Invalid period: ${period}`);
  }

  return today;
}
export const AddReminders = async (data: CreateReminderFormInput) => {
  const supabase = await createClient(await cookies());
  // Validate incoming data

  const validated = CreateReminderFormSchema.safeParse(data);
  if (!validated.success) {
    console.log("Validation errors:", z.treeifyError(validated.error));
    return { success: false, message: "Invalid form data." };
  }

  // Create an array of individual records to insert
  const insertPayload = data.pet_ids.map((petId) => ({
    pet_id: petId,
    title: data.title,
    category: data.category,
    due_date: data.due_date,
    description: data.description || null,
    is_recurring: data.is_recurring,
    recurrence_interval: data.recurrence_interval || null,
    recurrence_period: data.recurrence_period || null,
  }));

  // Perform a bulk insert to Supabase
  const { error } = await supabase.from("reminders").insert(insertPayload);
  if (error) {
    console.log("Supabase insert error:", error);
    return { success: false, message: "Failed to save reminder." };
  }
  return { success: true, message: "Reminder created successfully." };
};

export const UpdateReminder = async (data: ReminderUpdate) => {
  const supabase = await createClient(await cookies());

  // Validate incoming data
  const validated = CreateReminderFormSchema.safeParse(data);
  if (!validated.success) {
    console.log("Validation errors:", z.treeifyError(validated.error));
    return { success: false, message: "Invalid form data." };
  }

  //Extract the pet Id from the data
  const { pet_ids, ...cleanedData } = data;
  const pet_id = pet_ids ? pet_ids[0] : undefined;

  // Create the payload for update
  const payload = { ...cleanedData, pet_id };
  console.log("Update payload:", payload);

  const { error } = await supabase.from("reminders").update(payload).eq("id", payload.id);
  if (error) {
    console.log("Supabase update error:", error);
    return { success: false, message: "Failed to update reminder." };
  }
  return { success: true, message: "Reminder updated successfully." };
};

export const deleteReminder = async (reminderId: string) => {
  const supabase = await createClient(await cookies());
  const { error, status } = await supabase.from("reminders").delete().eq("id", reminderId);
  console.log("Delete result:", { error, status });
  if (error) {
    console.log("Supabase delete error:", error);
    return { success: false, message: "Failed to delete reminder." };
  }
  return { success: true, message: "Reminder deleted successfully." };
};

export const markReminderComplete = async (reminderId: string) => {
  const supabase = await createClient(await cookies());
  const reminder = await getReminderById(reminderId);
  if (!reminder) {
    console.log("Reminder not found for ID:", reminderId);
    return { success: false, message: "Reminder not found." };
  }
  //Check if the reminder is recurring. If it is, calculate the new due date and update the record. If not, just mark it as completed.
  let error = null;
  if (reminder.is_recurring) {
   const newDueDate = await calculateNewDueDate(reminder.recurrence_interval!, reminder.recurrence_period! as RecurrencePeriod);
   console.log("Calculated new due date:", newDueDate);
   const { error: updateError } = await supabase.from("reminders").update({ due_date: newDueDate.toISOString(), date_completed: new Date().toISOString() }).eq("id", reminderId);
   error = updateError;
  } else {
    const { error: updateError } = await supabase.from("reminders").update({ date_completed: new Date().toISOString() }).eq("id", reminderId);
    error = updateError;
  }
  if (error) {
    console.log("Supabase update error:", error);
    return { success: false, message: "Failed to mark reminder as complete." };
  }
// Log the completion in the reminder_history table
const {pet_id, title, category, description} = reminder;
  const { error: logError } = await supabase.from("reminder_history").insert({ pet_id, title, category, notes:description, completed_at: new Date().toISOString() });
  console.log("Mark complete result:", logError);
  if (error || logError) {
    console.log("Supabase update error:", error || logError);
    return { success: false, message: "Failed to mark reminder as complete." };
  }
  return { success: true, message: "Reminder marked as complete." };
};

//REMINDER HISTORY
export const deleteReminderHistory = async (reminderId: string) => {
  const supabase = await createClient(await cookies());
  const { error, status } = await supabase.from("reminder_history").delete().eq("id", reminderId);
  console.log("Delete result:", { error, status });
  if (error) {
    console.log("Supabase delete error:", error);
    return { success: false, message: "Failed to delete reminder." };
  }
  return { success: true, message: "Reminder deleted successfully." };
};
