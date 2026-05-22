import {z} from "zod";

export const ReminderSchema = z.object({
    id: z.uuid({message: "Invalid reminder id format."}),
    petId: z.uuid({message: "Invalid pet id format."}),
    title: z.string().min(2, {message: "Title must be at least 2 characters long."}),
    description: z.string().optional(),
    date: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate) && parsedDate >= Date.now();
    }, {message: "Invalid date. Must be a valid date in the future."}),
    repeat: z.enum(["none", "daily", "weekly", "monthly", "yearly"]),
    nextOccurrence: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, {message: "Invalid date format."}),
    updatedAt: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, {message: "Invalid date format."}),
    createdAt: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, {message: "Invalid date format."}),
});

export type Reminder = z.infer<typeof ReminderSchema>;