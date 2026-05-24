// app/pets/page.tsx
import PetCard from "@/components/cards/PetCard";
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
                       <PetCard key={pet.id} pet={pet}/>
                    ))}
                </div>
            )}
        </main>
    );
}