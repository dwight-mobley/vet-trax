// app/pets/page.tsx
import { getUserPets } from "@/data-access/pets";
import { requireUser } from "@/utils/supabase/auth";
import Link from "next/link";

export default async function PetsPage() {
    const user = await requireUser();
    console.log(user.id)
    const pets = await getUserPets(user.id);

    return (
        <main className="max-w-5xl mx-auto p-6 md:p-12">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">My Pets</h1>
                <Link
                    href="/pets/new"
                    className="bg-primary text-primary-contrast px-4 py-2 rounded-medium hover:bg-primary-dark transition"
                >
                    + Add Pet
                </Link>
            </header>

            {pets.length === 0 ? (
                <div className="bg-background-paper border-2 border-dashed border-text-disabled rounded-large p-12 text-center">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">No pets found</h2>
                    <p className="text-text-secondary">You haven&apos;t added any furry (or scaly) friends yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                        <div
                            key={pet.id}
                            className="bg-background-paper border border-text-disabled rounded-large shadow-sm overflow-hidden flex flex-col"
                        >
                            <Link href={`/pets/${pet.id}`} className="h-40 bg-background w-full object-cover">
                                {pet.image ? (
                                    <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-text-disabled">
                                        No Image
                                    </div>
                                )}
                            </Link>

                            <div className="p-5 flex flex-col grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-text-primary capitalize">
                                        {pet.name}
                                    </h2>
                                    <span className="bg-secondary text-secondary-contrast text-xs font-medium px-2.5 py-0.5 rounded-small capitalize">
                                        {pet.type}
                                    </span>
                                </div>

                                <div className="text-sm text-text-secondary space-y-1 mb-4 grow">
                                    {pet.breed && <p><span className="font-medium text-text-primary">Breed:</span> {pet.breed}</p>}
                                    {pet.color && <p><span className="font-medium text-text-primary">Color:</span> {pet.color}</p>}
                                    {pet.weight && <p><span className="font-medium text-text-primary">Weight:</span> {pet.weight} lbs</p>}
                                </div>

                                {pet.notes && (
                                    <div className="mt-auto pt-4 border-t border-text-disabled text-sm text-text-secondary italic">
                                        &quot;{pet.notes}&quot;
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}