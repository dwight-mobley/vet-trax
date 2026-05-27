import {z} from "zod";
import { publicMedicalRecordsInsertSchema} from "./database"

export type MedicalRecord = z.infer<typeof publicMedicalRecordsInsertSchema>

//Creation Schema and Type
export const MedicalRecordCreateFormSchema = publicMedicalRecordsInsertSchema.omit({id:true}).extend({
    date: z.string().nullable().transform((val) => val === "" ? null : val),
    weight: z.number().nullable().transform((val) => val === null || val <= 0  ? null : val),
    height: z.number().nullable().transform((val) => val === null || val <= 0  ? null : val),
})

export type MedicalRecordCreateForm = z.infer<typeof MedicalRecordCreateFormSchema>

//Update Schema and Type
export const MedicalRecordUpdateFormSchema = MedicalRecordCreateFormSchema.partial();
export type MedicalRecordUpdateForm = z.infer<typeof MedicalRecordUpdateFormSchema>

export type MedicalRecordWithPet = MedicalRecord & {pet: {name: string; owner_id: string; }}