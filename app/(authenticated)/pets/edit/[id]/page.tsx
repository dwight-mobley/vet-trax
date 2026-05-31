import EditPetForm from "@/components/forms/EditPetForm";
import { getPetById } from "@/data-access/pets";
import  Link from "next/link";

export default async function EditPetPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  const pet = await getPetById(id)
  if (!pet) {
    return <p className="text-status-critical">Pet not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
        {/* Back Navigation */}
            <div className="mb-6">
                <Link href={`/pets/${pet.id}`} className="text-primary hover:text-primary-dark hover:underline text-sm font-medium transition-colors inline-flex items-center">
                    &larr; Back to Pet
                </Link>
            </div>
      <h1 className="text-2xl font-semibold mb-6">Edit {pet.name}</h1>


      <EditPetForm pet={pet} />
    </div>
  );
}
