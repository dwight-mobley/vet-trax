import  AddPetForm from "@/components/forms/AddPetForm";
import { requireUser } from "@/utils/supabase/auth";

import Link from "next/link";

export default async function NewPetPage() {
    await requireUser();

    return (
        <main className="max-w-xl mx-auto p-6 md:p-12">
            <div className="mb-6">
                <Link href="/pets" className="text-primary hover:text-primary-dark hover:underline text-sm font-medium transition-colors">
                    &larr; Back to Pets
                </Link>
                <h1 className="text-3xl font-bold text-text-primary mt-4">Add a New Pet</h1>
                <p className="text-text-secondary mt-1">Enter your pet&apos;s details below.</p>
            </div>

            <AddPetForm />
        </main>
    );
}