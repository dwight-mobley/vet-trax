import {z} from "zod";
import { publicReminderHistoryInsertSchema, publicRemindersInsertSchema } from "./database"
import { Pet } from "./pet";



export const CreateReminderFormSchema = z.object({
  pet_ids: z.array(z.string()).min(1, "Please select at least one pet."),
  title: z.string().min(1, "Title is required."),
  category: z.enum(["vaccination", "appointment", "medication", "test", "other"]),
  due_date: z.string().min(1, "Due date is required."),
  description: z.string().optional(),
  is_recurring: z.boolean(),
  recurrence_interval: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === "" || val === null || val === undefined) return null;
      return Number(val);
    }),

  recurrence_period: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.is_recurring) {
    if (!data.recurrence_interval) {
      ctx.addIssue({
        code: "custom",
        message: "Interval is required for recurring tasks",
        path: ["recurrence_interval"],
      });
    }
    if (!data.recurrence_period) {
      ctx.addIssue({
        code: "custom",
        message: "Period is required",
        path: ["recurrence_period"],
      });
    }
  }
});

export type CreateReminderFormInput = z.input<typeof CreateReminderFormSchema>;
export type CreateReminderFormData = z.output<typeof CreateReminderFormSchema>;


export type ReminderUpdate = Partial<CreateReminderFormInput> & { id: string };

export type Reminder = z.infer<typeof publicRemindersInsertSchema> & { pet: Pet | null, completed_at: string | null | undefined };
export type ReminderHistory = z.infer<typeof publicReminderHistoryInsertSchema> & { pet: Pet | null, date_completed: string | null, due_date: string | null, completed_at: string | null | undefined };


