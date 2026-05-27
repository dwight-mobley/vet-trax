"use client";
import { MedicalRecordCreateForm, MedicalRecordCreateFormSchema, MedicalRecordUpdateForm, MedicalRecordUpdateFormSchema } from "@/schemas/medical-records";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMedicalRecord } from "@/actions/medical-record";

export default function MedicalRecordForm({ initialData, pets }: { initialData?: Partial<MedicalRecordUpdateForm>; pets: Array<{ id: string; name: string }> }) {
  console.log(initialData)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MedicalRecordCreateForm>({
    resolver: zodResolver(MedicalRecordCreateFormSchema || MedicalRecordUpdateFormSchema),
    defaultValues: {
      pet_id: initialData?.pet_id || "",
      date: initialData?.date || "",
      description: initialData?.description || "",
      vet: initialData?.vet || "",
      notes: initialData?.notes || "",
      weight: initialData?.weight || null,
      height: initialData?.height || null,
      coggins: initialData?.coggins || false,
      trimmed: initialData?.trimmed || false,
      wormed: initialData?.wormed || false,
      yearly_vaccines: initialData?.yearly_vaccines || false,
    },
  });

  const onSubmit = async (data: MedicalRecordCreateForm) => {
    const validated = MedicalRecordCreateFormSchema.safeParse(data);
    console.log(validated);
    console.log(data);
    const { success, message } = await addMedicalRecord(data);
    if (!success) {
      console.log(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))} className="space-y-8 bg-background-paper p-6 rounded-large shadow">

      {/* Section: Basic Information */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PET */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Pet</label>
            <select {...register("pet_id")} className="w-full border border-text-disabled rounded-medium px-3 py-2 bg-white">
              <option value="">Select a pet</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.pet_id && <p className="text-status-critical text-sm mt-1">{errors.pet_id.message}</p>}
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Date</label>
            <input type="date" {...register("date")} className="w-full border border-text-disabled rounded-medium px-3 py-2" />
            {errors.date && <p className="text-status-critical text-sm mt-1">{errors.date.message}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
            <input type="text" {...register("description")} className="w-full border border-text-disabled rounded-medium px-3 py-2" />
            {errors.description && <p className="text-status-critical text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* VET */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Vet (optional)</label>
            <input type="text" {...register("vet")} className="w-full border border-text-disabled rounded-medium px-3 py-2" />
            {errors.vet && <p className="text-status-critical text-sm mt-1">{errors.vet.message}</p>}
          </div>
        </div>
      </div>

      {/* Section: Vitals & Procedures */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Vitals & Procedures</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WEIGHT */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Weight (lbs, optional)</label>
            <input
              type="number"
              step="0.1"
              {...register("weight", { valueAsNumber: true })}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.weight && <p className="text-status-critical text-sm mt-1">{errors.weight.message}</p>}
          </div>

          {/* HEIGHT */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Height (hands, optional)</label>
            <input
              type="number"
              step="0.1"
              {...register("height", { valueAsNumber: true })}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.height && <p className="text-status-critical text-sm mt-1">{errors.height.message}</p>}
          </div>

          {/* BOOLEAN TOGGLES */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">Check all that apply</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["coggins", "Coggins"],
                ["trimmed", "Trimmed"],
                ["wormed", "Wormed"],
                ["yearly_vaccines", "Yearly Vaccines"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(key as "coggins" | "trimmed" | "wormed" | "yearly_vaccines")}
                    className="w-4 h-4 text-primary border-text-disabled rounded focus:ring-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Additional Details */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Additional Details</h2>

        {/* NOTES */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Notes (optional)</label>
          <textarea {...register("notes")} className="w-full border border-text-disabled rounded-medium px-3 py-2 h-24" />
          {errors.notes && <p className="text-status-critical text-sm mt-1">{errors.notes.message}</p>}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-contrast font-medium py-2.5 rounded-medium hover:bg-primary-dark transition disabled:bg-primary-light disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : "Save Record"}
      </button>
    </form>
  );
}