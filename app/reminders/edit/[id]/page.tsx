import CreateReminderForm from "@/components/forms/CreateReminderForm";
import { getUserPets } from "@/data-access/pets";
import { getReminderById } from "@/data-access/reminders";
import { requireUser } from "@/utils/supabase/auth";

import  Link from "next/link";

export default async function EditPetPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  const userId = (await requireUser()).id
  const pets = await getUserPets(userId);
  const reminder = await getReminderById(id);


  if (!reminder) {
    return <p className="text-status-critical">Pet not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
        {/* Back Navigation */}
            <div className="mb-6">
                <Link href={`/reminders/`} className="text-primary hover:text-primary-dark hover:underline text-sm font-medium transition-colors inline-flex items-center">
                    &larr; Back to Reminders
                </Link>
            </div>
      <h1 className="text-2xl font-semibold mb-6">Edit {reminder.pet!.name}</h1>


      <CreateReminderForm pets={pets} reminder={{...reminder, completed_at:null} } />
    </div>
  );
}
