// app/reminders/new/page.tsx
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import CreateReminderForm from "@/components/forms/CreateReminderForm";

import { getUserPets } from "@/data-access/pets";

export default async function NewReminderPage() {
  const supabase = await createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();

  const pets = await getUserPets(user!.id)

  if (!pets || pets.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center text-text-primary">
        You need to add a pet before you can create a reminder!
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Create a Reminder</h1>
      <CreateReminderForm pets={pets} />
    </div>
  );
}