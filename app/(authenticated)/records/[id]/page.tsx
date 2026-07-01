import BackButton from '@/components/ui/BackButton';
import { getMedicalRecordById } from '@/data-access/medical-records';
import { dateFormatter } from '@/utils/tools';
import Link from 'next/link';
import React from 'react';




const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
  <div className={`flex items-center justify-between p-3 border rounded-medium ${
    active
      ? 'border-primary bg-primary-light/10'
      : 'border-text-disabled/30 bg-background'
  }`}>
    <span className={active ? 'text-primary-dark font-medium' : 'text-text-secondary'}>
      {label}
    </span>
    {active ? (
      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      null
    )}
  </div>
);

const DetailItem = ({ label, value }: { label: string; value: string | number | null }) => (
  <div>
    <dt className="text-sm font-medium text-text-secondary">{label}</dt>
    <dd className="mt-1 text-base text-text-primary">{value || '--'}</dd>
  </div>
);

export default async function MedicalRecordDetailsPage({params}:{params:Promise<{ id: string }>}) {
    const searchParams = await params;

    const record = await getMedicalRecordById(searchParams.id);
    if(!record){
        return (
            <div>Record Not Found</div>
        )
    }
  return (
    <div className="p-6 bg-background min-h-screen font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
             <BackButton />
            <div className="flex items-center gap-3 mb-2">

              <h1 className="text-3xl font-bold text-text-primary">
                {record.description}
              </h1>
              <span className="px-3 py-1 bg-secondary-light/20 text-secondary-dark text-xl font-medium rounded-large">
                {record.pet.name}
              </span>
            </div>
            <p className="text-text-secondary">
              Recorded on {new Date(record.createdAt as string).toDateString()}
            </p>
          </div>

          <Link href={`/records/${record.id}/edit`} className="px-4 py-2 bg-primary text-primary-contrast rounded-medium font-medium hover:bg-primary-dark transition-colors shadow-sm">
            Edit Record
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Column: Details & Notes (Spans 2 columns on desktop) */}
          <div className="md:col-span-2 space-y-6">

            {/* Details Card */}
            <div className="bg-background-paper p-6 rounded-large shadow-sm border border-text-disabled/30">
              <h2 className="text-lg font-semibold text-text-primary mb-4 pb-2 border-b border-text-disabled/30">
               Details
              </h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                <DetailItem label="Date of Visit" value={dateFormatter(record.date)} />
                <DetailItem label="Veterinarian" value={record.vet as string} />
                <DetailItem label="Weight" value={record.weight ? `${record.weight} lbs` : null} />
                <DetailItem label="Height" value={record.height ? `${record.height} hands` : null} />
              </dl>
            </div>

            {/* Notes Card */}
            <div className="bg-background-paper p-6 rounded-large shadow-sm border border-text-disabled/30">
              <h2 className="text-lg font-semibold text-text-primary mb-4 pb-2 border-b border-text-disabled/30">
                Notes
              </h2>
              {record.notes ? (
                <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                  {record.notes}
                </p>
              ) : (
                <p className="text-text-secondary italic">No notes provided for this visit.</p>
              )}
            </div>

          </div>

          {/* Right Column: Checklist */}
          <div className="md:col-span-1">
            <div className="bg-background-paper p-6 rounded-large shadow-sm border border-text-disabled/30 h-full">
              <h2 className="text-lg font-semibold text-text-primary mb-4 pb-2 border-b border-text-disabled/30">
                Vaccination/Treatment
              </h2>
              <div className="space-y-3">
                <StatusBadge active={record.coggins} label="Coggins Test" />
                <StatusBadge active={record.trimmed} label="Hooves Trimmed" />
                <StatusBadge active={record.wormed} label="Wormed" />
                <StatusBadge active={record.yearly_vaccines} label="Yearly Vaccines" />
              </div>
            </div>
          </div>

        </div>

        {/* Meta Footer */}
        <div className="text-sm text-text-secondary text-right">
          Record ID: <span className="font-mono">{record.id}</span>
        </div>

      </div>
    </div>
  );
}