import {z} from "zod";
import { publicPetsInsertSchema} from "./database"

export type Pet = z.infer<typeof publicPetsInsertSchema>

//Creation Schema and Type
export const PetCreateFormSchema = publicPetsInsertSchema.omit({owner_id: true, created_at: true, updated_at: true}).extend({
    birth_date: z.string().nullable().transform((val) => val === "" ? null : val),
    weight: z.number().nullable().transform((val) => val === null || val <= 0 ? null : val),
    height: z.float32().nullable().transform((val) => val === null || val <= 0 ? null : val),
})

export type PetCreateForm = z.infer<typeof PetCreateFormSchema>

//Update Schema and Type
export const PetUpdateFormSchema = PetCreateFormSchema.partial();
export type PetUpdateForm = z.infer<typeof PetUpdateFormSchema>