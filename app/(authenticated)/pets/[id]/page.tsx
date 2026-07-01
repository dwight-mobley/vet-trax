import { notFound } from "next/navigation";
import Link from "next/link";
import { getPetById } from "@/data-access/pets";
import { getPetReminderHistory, getPetUpcomingReminders } from "@/data-access/reminders";
import { getPetMedicalRecords } from "@/data-access/medical-records";
import { requireUser } from "@/utils/supabase/auth";
import { DeletePetButton } from "@/components/ui/DeletePetButton";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton";
import PetHistoryTabs from "@/components/pets/history/PetHistoryTabs";

export default async function PetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await params and user
  const resolvedParams = await params;
  const user = await requireUser();


  // 2. Fetch the pet
  const pet = await getPetById(resolvedParams.id);

  // 3. Security Check: If pet doesn't exist, OR the user doesn't own it, show 404
  if (!pet || pet.owner_id !== user.id) {
    notFound();
  }

  const [upcomingReminders, reminderHistory, medicalRecordHistory] = await Promise.all([
    getPetUpcomingReminders(pet.id, user.id),
    getPetReminderHistory(pet.id, user.id),
    getPetMedicalRecords(pet.id, user.id),
  ]);

  const age: number | string = pet.birth_date ? new Date().getFullYear() - new Date(pet.birth_date!).getFullYear() || "less than 1" : "_";

  return (
    <div className="mx-auto w-full max-w-6xl border p-4 sm:p-6 md:p-10 lg:p-12">
      {/* Back Navigation */}
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-large border border-text-disabled bg-background-paper shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-text-disabled p-4 sm:p-6 md:flex-row md:items-start md:justify-between md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="order-2 sm:order-1">
              <h1 className="mb-2 text-3xl font-bold capitalize text-text-primary sm:text-4xl">{pet.name}</h1>
              <span className="inline-block rounded-medium bg-secondary px-3 py-1 text-sm font-semibold capitalize text-secondary-contrast">{pet.type}</span>
            </div>

            <div className="order-1 h-20 w-20 overflow-hidden rounded-medium border border-text-disabled/40 bg-background sm:order-2 sm:h-24 sm:w-24 md:h-28 md:w-28">
              {pet.image ? (
                <Image src={pet.image} alt={pet.name} width={112} height={112} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-text-disabled">
                  <span className="px-2 text-center text-xs font-medium sm:text-sm">No Image</span>
                </div>
              )}
            </div>
          </div>

          <Link href={`/pets/edit/${pet.id}`} className="w-full rounded-medium border border-primary px-4 py-2 text-center font-medium text-primary transition-colors hover:bg-background hover:text-primary-dark sm:w-auto">
            Edit Pet
          </Link>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 sm:p-6 md:p-8">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Birth Date</p>
            <p className="text-base font-medium text-text-primary sm:text-lg">{pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Age</p>
            <p className="text-base font-medium text-text-primary sm:text-lg">{age || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Breed</p>
            <p className="text-base font-medium text-text-primary sm:text-lg">{pet.breed || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Color</p>
            <p className="text-base font-medium text-text-primary sm:text-lg">{pet.color || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Weight</p>
            <p className="text-base font-medium text-text-primary sm:text-lg">{pet.weight ? `${pet.weight} lbs` : "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Height</p>
            <p className="text-base font-medium text-text-primary sm:text-lg">{pet.height ? `${pet.height}` : "—"}</p>
          </div>
        </div>

        {/* Notes Section */}
        <div className="border-t border-text-disabled bg-background p-4 sm:p-6 md:p-8">
          <p className="text-sm font-medium text-text-secondary mb-3">Medical / Care Notes</p>
          {pet.notes ? <div className="bg-background-paper p-4 rounded-medium border border-text-disabled text-text-primary italic">{pet.notes}</div> : <p className="text-text-disabled italic">No notes added for this pet.</p>}
        </div>
      </div>

      <PetHistoryTabs
        upcomingReminders={upcomingReminders}
        reminderHistory={reminderHistory}
        medicalRecordHistory={medicalRecordHistory}
      />

      <DeletePetButton petId={pet.id} />
    </div>
  );
}
