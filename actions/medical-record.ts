"use server";

import { cookies } from "next/headers";
import {createClient} from "@/utils/supabase/server";
import { MedicalRecordCreateForm, MedicalRecordCreateFormSchema, MedicalRecordUpdateForm, MedicalRecordUpdateFormSchema } from "@/schemas/medical-records";

export const addMedicalRecord = async (formData: MedicalRecordCreateForm) => {
    // Validate form data
    const validated = MedicalRecordCreateFormSchema.safeParse(formData);
    if (!validated.success) {
        console.log("Validation errors:", validated.error.format());
        return { success: false, message: "Invalid form data." };
    }
    //Create Supabase client and insert data
    const supabase = createClient(await cookies());
    const { error } = await supabase.from("medical_records").insert(formData);
    if (error) {
        console.log("Supabase insert error:", error);
        return { success: false, message: "Failed to add medical record." };
    }
    return { success: true, message: "Medical record added successfully." };
};

export const editMedicalRecord = async (id: string, formData: MedicalRecordUpdateForm) => {
    // Validate form data
    const validated = MedicalRecordUpdateFormSchema.safeParse(formData);
    if (!validated.success) {
        console.log("Validation errors:", validated.error.format());
        return { success: false, message: "Invalid form data." };
    }
    //Create Supabase client and update data
    const supabase = createClient(await cookies());
    const { error } = await supabase.from("medical_records").update({ ...formData }).eq("id", id);
    if (error) {
        console.log("Supabase update error:", error);
        return { success: false, message: "Failed to update medical record." };
    }
    return { success: true, message: "Medical record updated successfully." };
};

export const deleteMedicalRecord = async (id: string) => {
    const supabase = createClient(await cookies());
    const { error } = await supabase.from("medical_records").delete().eq("id", id);
    if (error) {
        console.log("Supabase delete error:", error);
        return { success: false, message: "Failed to delete medical record." };
    }
    return { success: true, message: "Medical record deleted successfully." };
};