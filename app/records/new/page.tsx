import { requireUser } from "@/utils/supabase/auth";
import MedicalRecordForm from "@/components/forms/MedicalRecordForm";
import { getUserPets } from "@/data-access/pets";
import BackButton from "@/components/ui/BackButton";

export default async function NewMedicalRecordPage() {
  const user = await requireUser();

  const pets = await getUserPets(user.id);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto ">
      <BackButton href="/records" pageTitle="Medical Records" />
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Add Medical Record</h1>
      <div>
        <MedicalRecordForm pets={pets} />
      </div>
    </div>
  );
}
