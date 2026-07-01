import MedicalRecordForm from "@/components/forms/MedicalRecordForm";
import BackButton from "@/components/ui/BackButton";
import { getMedicalRecordById } from "@/data-access/medical-records";
import { getUserPets } from "@/data-access/pets";
import { MedicalRecordWithPet } from "@/schemas/medical-records";
import { requireUser } from "@/utils/supabase/auth";




export default async function EditRecordPage({params}:{params:Promise<{id:string}>}){
    const searchParams = await params;
    const record: MedicalRecordWithPet = await getMedicalRecordById(searchParams.id);
    const user = await requireUser()
    const pets = await getUserPets(user.id)


    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
            <BackButton />
            <h1 className="text-3xl font-bold text-text-primary">Edit Medical Record</h1>
            <MedicalRecordForm initialData={record} pets={pets} recordId={record.id as string} />
        </div>

    )
}