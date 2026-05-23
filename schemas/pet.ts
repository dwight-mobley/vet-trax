import {z} from "zod";
import { publicPetsInsertSchema} from "./database"

export type Pet = z.infer<typeof publicPetsInsertSchema>

//Creation Schema and Type
export const PetCreateFormSchema = publicPetsInsertSchema.omit({owner_id: true, created_at: true, updated_at: true})
export type PetCreateForm = z.infer<typeof PetCreateFormSchema>

//Update Schema and Type
export const PetUpdateFormSchema = publicPetsInsertSchema.partial().omit({owner_id: true, created_at: true, updated_at: true})
export type PetUpdateForm = z.infer<typeof PetUpdateFormSchema>