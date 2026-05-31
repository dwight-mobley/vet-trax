// components/forms/CreateReminderForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateReminderFormSchema, CreateReminderFormInput, Reminder, ReminderUpdate } from "@/schemas/reminder";
import { useModal } from "@/context/ModalContext";

import { useRouter } from "next/navigation";
import { AddReminders, UpdateReminder } from "@/actions/reminder-actions";

interface Pet {
  id: string;
  name: string;
}

interface Props {
  pets: Pet[];
  reminder?: Reminder;
}

export default function CreateReminderForm({ pets, reminder }: Props) {
  const { showSuccess, showError } = useModal();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateReminderFormInput>({
    resolver: zodResolver(CreateReminderFormSchema),
    defaultValues: {
      pet_ids: reminder ? [reminder.pet_id] : [],
      category: reminder?.category || "vaccination",
      title: reminder?.title,
      is_recurring: reminder?.is_recurring || false,
      due_date: reminder?.due_date,
      recurrence_interval: reminder?.recurrence_interval || null,
      recurrence_period: reminder?.recurrence_period || "days",
    },
  });

  const isRecurring = watch("is_recurring");
  const selectedPets = watch("pet_ids");

  // Helper to toggle pets in the array
  const togglePet = (petId: string) => {
    const current = new Set(selectedPets);
    if (current.has(petId)) {
      current.delete(petId);
    } else {
      current.add(petId);
    }
    setValue("pet_ids", Array.from(current), { shouldValidate: true });
  };

  const onSubmit = async (data: CreateReminderFormInput | ReminderUpdate) => {
    if (reminder) {
      const { success, message } = await UpdateReminder({ ...data, id: reminder.id } as ReminderUpdate);
      if (!success) {
        showError("Failed To Update Reminder", message);
        return;
      }
      showSuccess("Updated Reminder", message);
    } else {
      const { success, message } = await AddReminders(data as CreateReminderFormInput);
      if (!success) {
        showError("Error Adding Reminder(s)", message);
      }
      showSuccess("Reminders Created!", `Successfully scheduled for ${data.pet_ids!.length} pet(s).`);
    }
    router.push("/reminders");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-large bg-background-paper p-6 shadow-sm border border-slate-100">
      {/* 1. Multi-Select Pets */}
      <div className="flex flex-col gap-3">
        <label className="mb-2 block text-sm font-semibold text-text-primary">Apply to which pets?</label>
        {reminder && <small className="text-red-600">Pets cannot be changed on update. You must delete the reminder and make a new one.</small>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {pets.map((pet) => {
            const isSelected = selectedPets.includes(pet.id);
            return (
              <button
                type="button"
                key={pet.id}
                disabled={reminder ? true : false}
                onClick={() => togglePet(pet.id)}
                className={`flex items-center justify-center rounded-medium border p-3 text-sm font-medium transition-colors ${isSelected ? "border-primary bg-primary/10 text-primary" : "border-slate-200 bg-slate-50 text-text-secondary hover:bg-slate-100"}`}>
                {pet.name}
              </button>
            );
          })}
        </div>
        {errors.pet_ids && <p className="mt-1 text-sm text-status-critical">{errors.pet_ids.message}</p>}
      </div>

      {/* 2. Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-sm font-medium text-text-primary">Title</label>
          <input {...register("title")} className="w-full rounded-medium border border-slate-200 p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g., Rabies Shot" />
          {errors.title && <p className="mt-1 text-xs text-status-critical">{errors.title.message}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-sm font-medium text-text-primary">Category</label>
          <select {...register("category")} className="w-full rounded-medium border border-slate-200 p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white capitalize">
            <option value="vaccination">Vaccination</option>
            <option value="appointment">Appointment</option>
            <option value="medication">Medication</option>
            <option value="test">Test</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-sm font-medium text-text-primary">Due Date</label>
          <input type="date" {...register("due_date")} className="w-full rounded-medium border border-slate-200 p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          {errors.due_date && <p className="mt-1 text-xs text-status-critical">{errors.due_date.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text-primary">Notes / Description</label>
        <textarea {...register("description")} rows={3} className="w-full rounded-medium border border-slate-200 p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Any additional details..." />
      </div>

      {/* 3. Recurrence Logic */}
      <div className="rounded-medium border border-slate-100 bg-slate-50 p-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" {...register("is_recurring")} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
          <span className="font-medium text-text-primary">This is a recurring task</span>
        </label>

        {isRecurring && (
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Repeat every</span>
            <input type="number" {...register("recurrence_interval")} className="w-20 rounded-medium border border-slate-200 p-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g., 6" />
            <select {...register("recurrence_period")} className="rounded-medium border border-slate-200 p-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white">
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
        )}
        {errors.recurrence_interval && <p className="mt-1 text-xs text-status-critical">{errors.recurrence_interval.message}</p>}
        {errors.recurrence_period && <p className="mt-1 text-xs text-status-critical">{errors.recurrence_period.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-medium bg-primary py-3 font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
        {isSubmitting ? "Saving..." : reminder ? "Update Reminder" : "Create Reminder"}
      </button>
    </form>
  );
}
