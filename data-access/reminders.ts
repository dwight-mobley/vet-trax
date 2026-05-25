import { getRecordsByColumn, getSingleRecordByColumn } from "./base-queries";

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
