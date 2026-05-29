import { MedicalRecordWithPet } from '@/schemas/medical-records';
import {dateFormatter} from '@/utils/tools'
import Link from 'next/link';





//  Reusable Status Badge Component
const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-small ${
      active
        ? 'bg-primary text-white'
        : 'bg-background text-text-disabled'
    }`}
  >
    {label}
  </span>
);

export default function MedicalRecordsTable({records}: {records:MedicalRecordWithPet[]}) {
  return (
    <div className="p-6 bg-background min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Table Container using your custom theme variables */}
        <div className="overflow-hidden bg-background-paper rounded-large shadow-sm border border-text-disabled/30">
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
                  <th scope="col" className="px-6 py-4 font-semibold rounded-tr-large">Checklist</th>
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
                    <td>
                      <Link href={`/records/${record.id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State / Footer (Optional) */}
          {records.length === 0 && (
            <div className="p-8 text-center text-text-secondary">
              No medical records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}