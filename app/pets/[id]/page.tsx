import { notFound } from "next/navigation";
import Link from "next/link";
import { getPetById } from "@/data-access/pets";
import { requireUser } from "@/utils/supabase/auth";
import { deletePet } from "@/actions/pet-actions";
import { DeletePetButton } from "@/components/ui/DeletePetButton";
import Image from "next/image";

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

  const age: number | string = pet.birth_date ? new Date().getFullYear() - new Date(pet.birth_date!).getFullYear() || "less than 1": "_";

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-12 border">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/pets" className="text-primary hover:text-primary-dark hover:underline text-sm font-medium transition-colors inline-flex items-center">
          &larr; Back to Pets
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-background-paper border border-text-disabled rounded-large shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 md:p-8 flex justify-between items-start border-b border-text-disabled">
          <div className="flex gap-6">
            <div>
              <h1 className="text-4xl font-bold text-text-primary capitalize mb-2">{pet.name}</h1>
              <span className="bg-secondary text-secondary-contrast text-sm font-semibold px-3 py-1 rounded-medium capitalize inline-block">{pet.type}</span>
            </div>
            <div>
              {pet.image ? (
                <Image src={pet.image} alt={pet.name} width={100} height={100} objectFit="contain" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-text-disabled">
                  <span className="text-lg font-medium">No Image Uploaded</span>
                </div>
              )}
            </div>
          </div>

          <Link href={`/pets/edit/${pet.id}`} className="text-primary hover:text-primary-dark font-medium px-4 py-2 border border-primary rounded-medium transition-colors hover:bg-background">
            Edit Pet
          </Link>
        </div>

        {/* Details Grid */}
        <div className="p-6 md:p-8 grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Birth Date</p>
            <p className="text-lg text-text-primary font-medium">{pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Age</p>
            <p className="text-lg text-text-primary font-medium">{age || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Breed</p>
            <p className="text-lg text-text-primary font-medium">{pet.breed || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Color</p>
            <p className="text-lg text-text-primary font-medium">{pet.color || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Weight</p>
            <p className="text-lg text-text-primary font-medium">{pet.weight ? `${pet.weight} lbs` : "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Height</p>
            <p className="text-lg text-text-primary font-medium">{pet.height ? `${pet.height}` : "—"}</p>
          </div>
        </div>

        {/* Notes Section */}
        <div className="p-6 md:p-8 bg-background border-t border-text-disabled">
          <p className="text-sm font-medium text-text-secondary mb-3">Medical / Care Notes</p>
          {pet.notes ? <div className="bg-background-paper p-4 rounded-medium border border-text-disabled text-text-primary italic">{pet.notes}</div> : <p className="text-text-disabled italic">No notes added for this pet.</p>}
        </div>
      </div>
      <DeletePetButton petId={pet.id} />
    </div>
  );
}
