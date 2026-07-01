import { MedicalRecordWithPet } from '@/schemas/medical-records';
import { dateFormatter } from '@/utils/tools'
import Link from 'next/link';
import DeleteMedicalRecordButton from '../ui/DeleteMedicalRecordButton';





//  Reusable Status Badge Component
const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-small ${active
        ? 'bg-primary text-white'
        : 'bg-background text-text-disabled'
      }`}
  >
    {label}
  </span>
);

export default function MedicalRecordsTable({ records }: { records: MedicalRecordWithPet[] }) {
  if (records.length === 0) {
    return (
      <div className="rounded-large border border-text-disabled/30 bg-background-paper p-6 text-center text-text-secondary">
        No medical records found.
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 md:hidden">
        {records.map((record) => (
          <article
            key={record.id}
            className="rounded-large border border-text-disabled/30 bg-background-paper p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">{record.pet.name}</p>
                <p className="text-xs text-text-secondary">{dateFormatter(record.date)}</p>
              </div>
              <Link href={`/records/${record.id}`} className="text-sm font-medium text-primary hover:underline">
                View
              </Link>
            </div>

            <p className="mb-3 text-sm text-text-primary">{record.description || "-"}</p>

            <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-text-secondary">
              <p>Vet: {record.vet || "-"}</p>
              <p>Weight: {record.weight ? `${record.weight} lbs` : "--"}</p>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge active={record.coggins} label="Coggins" />
              <StatusBadge active={record.trimmed} label="Trimmed" />
              <StatusBadge active={record.wormed} label="Wormed" />
              <StatusBadge active={record.yearly_vaccines} label="Vaccines" />
            </div>

            <div className="text-sm">
              <DeleteMedicalRecordButton recordId={record.id as string} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-large border border-text-disabled/30 bg-background-paper shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">

            {/* Table Header */}
            <thead className="bg-primary text-primary-contrast">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold rounded-tl-large">Date</th>
                <th scope="col" className="px-6 py-4 font-semibold">Pet Name</th>
                <th scope="col" className="px-6 py-4 font-semibold">Description</th>
                <th scope="col" className="px-6 py-4 font-semibold">Vet</th>
                <th scope="col" className="px-6 py-4 font-semibold">Weight</th>
                <th scope="col" className="px-6 py-4 font-semibold ">Checklist</th>
                <th scope="col" className="px-6 py-4 font-semibold rounded-tr-large"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-text-disabled/30">
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-background transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-text-secondary">
                    {dateFormatter(record.date)}
                  </td>
                  <td className="px-6 py-4 font-medium text-text-primary">
                    {record.pet.name}
                  </td>
                  <td className="px-6 py-4 text-text-primary">
                    {record.description}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {record.vet}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {record.weight ? `${record.weight} lbs` : '--'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <StatusBadge active={record.coggins} label="Coggins" />
                      <StatusBadge active={record.trimmed} label="Trimmed" />
                      <StatusBadge active={record.wormed} label="Wormed" />
                      <StatusBadge active={record.yearly_vaccines} label="Vaccines" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/records/${record.id}`}>View</Link>
                      |
                      <DeleteMedicalRecordButton recordId={record.id as string} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}