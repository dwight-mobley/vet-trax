import { MedicalRecordWithPet } from "@/schemas/medical-records";
import { dateFormatter } from "@/utils/tools";

const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
    <span
        className={`inline-flex items-center rounded-small px-2 py-0.5 text-xs font-medium ${active ? "bg-primary text-white" : "bg-background text-text-disabled"
            }`}
    >
        {label}
    </span>
);

export default function PetMedicalRecordHistoryTable({
    records,
}: {
    records: MedicalRecordWithPet[];
}) {
    if (records.length === 0) {
        return (
            <div className="rounded-large border border-text-disabled/30 bg-background-paper p-6 text-sm text-text-secondary">
                No medical record history for this pet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-large border border-text-disabled/30 bg-background-paper shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-primary text-primary-contrast">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Description</th>
                        <th className="px-6 py-4 font-semibold">Vet</th>
                        <th className="px-6 py-4 font-semibold">Weight</th>
                        <th className="px-6 py-4 font-semibold">Checklist</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-text-disabled/30">
                    {records.map((record) => (
                        <tr key={record.id} className="hover:bg-background transition-colors duration-150">
                            <td className="px-6 py-4 text-text-secondary">{dateFormatter(record.date)}</td>
                            <td className="px-6 py-4 text-text-primary">{record.description || "-"}</td>
                            <td className="px-6 py-4 text-text-secondary">{record.vet || "-"}</td>
                            <td className="px-6 py-4 text-text-secondary">
                                {record.weight ? `${record.weight} lbs` : "--"}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <StatusBadge active={!!record.coggins} label="Coggins" />
                                    <StatusBadge active={!!record.trimmed} label="Trimmed" />
                                    <StatusBadge active={!!record.wormed} label="Wormed" />
                                    <StatusBadge active={!!record.yearly_vaccines} label="Vaccines" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
