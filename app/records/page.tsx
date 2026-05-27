import { requireUser } from "@/utils/supabase/auth";

import { getUserMedicalRecords } from "@/data-access/medical-records";
import { MedicalRecordWithPet } from "@/schemas/medical-records";
import MedicalRecordsTable from "@/components/medical-records/MedicalRecordTable";

export default async function NewMedicalRecordPage() {
  const user = await requireUser();

  const records: MedicalRecordWithPet[] = await getUserMedicalRecords(user.id);

  return (
    <div className="w-full max-w-6xl mx-auto">

      <h1 className="mb-6 text-2xl font-bold text-text-primary">
        Medical Records
      </h1>
    <MedicalRecordsTable records={records}/>
    </div>
  );
}
