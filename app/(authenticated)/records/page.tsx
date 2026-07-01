import { requireUser } from "@/utils/supabase/auth";

import { getUserMedicalRecords } from "@/data-access/medical-records";
import { MedicalRecordWithPet } from "@/schemas/medical-records";
import MedicalRecordsTable from "@/components/medical-records/MedicalRecordTable";
import Link from "next/link";

export default async function NewMedicalRecordPage() {
  const user = await requireUser();

  const records: MedicalRecordWithPet[] = await getUserMedicalRecords(user.id);

  return (
    <div className="mx-auto w-full max-w-8xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Medical Records</h2>
        <Link href="/records/new" className="w-full rounded-medium bg-primary px-4 py-3 text-center text-md font-semibold text-white hover:bg-primary-dark sm:w-auto"> + New Record</Link>
      </div>
      <MedicalRecordsTable records={records} />
    </div>
  );
}
