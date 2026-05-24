import { Pet } from "@/schemas/pet";
import Image from "next/image";
import Link from "next/link";

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <div className="max-w-2xl bg-background-paper border border-text-disabled rounded-large shadow-sm overflow-hidden flex flex-col">
      <Link href={`/pets/${pet.id}`} className="h-40 bg-background w-full object-cover">
        {pet.image ?
        <Image src={pet.image} alt={pet.name} width={500} height={500} className="h-full w-full object-cover" />
        : <div className="h-full w-full flex items-center justify-center text-text-disabled">No Image</div>
        }
      </Link>

      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-text-primary capitalize">{pet.name}</h2>
          <span className="bg-secondary text-secondary-contrast text-xs font-medium px-2.5 py-0.5 rounded-small capitalize">{pet.type}</span>
        </div>

        <div className="text-sm text-text-secondary space-y-1 mb-4 grow">
          {pet.breed && (
            <p>
              <span className="font-medium text-text-primary">Breed:</span> {pet.breed}
            </p>
          )}
          {pet.color && (
            <p>
              <span className="font-medium text-text-primary">Color:</span> {pet.color}
            </p>
          )}
          {pet.weight && (
            <p>
              <span className="font-medium text-text-primary">Weight:</span> {pet.weight} lbs
            </p>
          )}
          {pet.height && (
            <p>
              <span className="font-medium text-text-primary">Height:</span> {pet.height} lbs
            </p>
          )}
        </div>

        {pet.notes && <div className="mt-auto pt-4 border-t border-text-disabled text-sm text-text-secondary italic">&quot;{pet.notes}&quot;</div>}
      </div>
    </div>
  );
}
