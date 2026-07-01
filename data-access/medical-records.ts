import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getSingleRecordByColumn } from "./base-queries";
import { MedicalRecordWithPet } from "@/schemas/medical-records";


export async function getUserMedicalRecords(userId: string) {
    const supabase = await createClient(await cookies());
    const {data, error} = await supabase
        .from("medical_records")
        .select("*, pet:pets(name, owner_id)")
        .eq("pets.owner_id", userId)
        .order("date", { ascending: false });
    if (error) {
        console.log("Error fetching medical records:", error);
        return [];
    }
    return data as MedicalRecordWithPet[];
}

export async function getMedicalRecordById(recordId: string) {
    const supabase = await createClient(await cookies());
    const { data, error } = await supabase
        .from("medical_records")
        .select("*, pet:pets(name, owner_id)")
        .eq("id", recordId)
        .single();
    if (error) {
        console.log("Error fetching medical record:", error);
        throw new Error("Medical record not found");
    }
    return data as MedicalRecordWithPet;
}

export async function getPetMedicalRecords(petId: string, userId: string) {
    const supabase = await createClient(await cookies());
    const { data, error } = await supabase
        .from("medical_records")
        .select("*, pet:pets(name, owner_id)")
        .eq("pet_id", petId)
        .eq("pets.owner_id", userId)
        .order("date", { ascending: false });

    if (error) {
        console.log("Error fetching pet medical records:", error);
        return [];
    }

    return data as MedicalRecordWithPet[];
}