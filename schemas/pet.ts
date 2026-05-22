import {z} from "zod";

export const PetSchema = z.object({
    id: z.uuid({message: "Invalid pet id format."}),
    name: z.string().min(2),
    type: z.enum(["cat", "dog", "rabbit", "hamster", "horse", "other"]),
    breed: z.string().optional(),
    birthDate: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate) && parsedDate <= Date.now();
    }, {message: "Invalid birth date. Must be a valid date in the past."}),
    ownerId: z.uuid({message: "Invalid owner id format."}),
    color: z.string().optional(),
    weight: z.number().positive().optional(),
    height: z.number().positive().optional(),
    notes: z.string().optional(),
})