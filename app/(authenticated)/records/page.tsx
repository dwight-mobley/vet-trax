import { requireUser } from "@/utils/supabase/auth";

import { getUserMedicalRecords } from "@/data-access/medical-records";
import { MedicalRecordWithPet } from "@/schemas/medical-records";
import MedicalRecordsTable from "@/components/medical-records/MedicalRecordTable";
import Link from "next/link";

export default async function NewMedicalRecordPage() {
  const user = await requireUser();

  const records: MedicalRecordWithPet[] = await getUserMedicalRecords(user.id);

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between w-100">
         <h2 className="text-2xl font-bold text-text-primary mb-6">Medical Records</h2>
          <Link href="/records/new"  className="rounded-medium bg-primary px-4 py-3 text-md font-semibold text-white hover:bg-primary-dark"> + New Record</Link>

      </div>
        <MedicalRecordsTable records={records} />

    </div>
  );
}
