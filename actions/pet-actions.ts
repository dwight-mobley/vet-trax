"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/utils/supabase/auth";
import { PetCreateFormSchema, type PetCreateForm, PetUpdateFormSchema, type PetUpdateForm } from "@/schemas/pet";

export async function addPet(formData: PetCreateForm) {
  console.log("Adding New Pet with data:", formData);
  // 1. Securely get the authenticated user
  const user = await requireUser();
  const supabase = createClient(await cookies());

  //3. Validate Form Data
  const validatedFields = PetCreateFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    console.log("Validation errors:", validatedFields.error.format());
    return { success: false, message: "Invalid form data provided." };
  }

  // 4. Insert into database
  const { error } = await supabase.from("pets").insert({
    ...validatedFields.data,
    owner_id: user.id,
  });

  if (error) {
    console.log(error);
    return { success: false, message: "Failed to add pet. Please try again." };
  }

  // 4. Purge the cache for the pets page so the new pet appears immediately
  revalidatePath("/pets");

  // 5. Redirect back to the pets dashboard
  redirect("/pets");
}

export async function updatePet(petId: string, formData: PetUpdateForm) {
  const user = await requireUser();
  const supabase = createClient(await cookies());

  // Validate incoming data
  const validated = PetUpdateFormSchema.safeParse(formData);
  if (!validated.success) {
    console.log("Validation errors:", validated.error.format());
    return { success: false, message: "Invalid form data." };
  }

  const { error } = await supabase
    .from("pets")
    .update({
      ...validated.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", petId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, message: "Failed to update pet." };
  }
  revalidatePath("/pets");
  return { success: true, message: "Pet updated successfully." };
}

export const deletePet = async (petId: string) => {
  const user = await requireUser();
  const supabase = createClient(await cookies());

  const { error } = await supabase
    .from("pets")
    .delete()
    .eq("id", petId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, message: "Failed to delete pet." };
  }

  revalidatePath("/pets");
  redirect("/pets");
};
