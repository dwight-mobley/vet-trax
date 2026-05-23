"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicAnimals } from "@/schemas/database";
import { addPet } from "@/actions/pet-actions";
import { z } from "zod";
import { PetCreateForm, PetCreateFormSchema } from "@/schemas/pet";


const animalOptions: PublicAnimals[] = [
  "cat",
  "cow",
  "dog",
  "rabbit",
  "hamster",
  "horse",
  "other",
  "lizard",
];

export default function AddPetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetCreateForm>({
    resolver: zodResolver(PetCreateFormSchema),
    defaultValues: {
      name: "",
      type: "dog",
      breed: "",
      color: "",
      birth_date: "",
      weight: undefined,
      height: undefined,
      notes: "",
      image: "",
    },
  });

  async function onSubmit(data: PetCreateForm) {
   const {success, message} = await addPet(data);
   if(!success){
    alert(message)
   }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-background-paper p-6 rounded-large shadow"
    >
      {/* Section: Basic Info */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Name
            </label>
            <input
              {...register("name")}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.name && (
              <p className="text-status-critical text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            >
              {animalOptions.map((a) => (
                <option key={a} value={a}>
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-status-critical text-sm mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Breed */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Breed (optional)
            </label>
            <input
              {...register("breed")}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.breed && (
              <p className="text-status-critical text-sm mt-1">
                {errors.breed.message}
              </p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Color (optional)
            </label>
            <input
              {...register("color")}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.color && (
              <p className="text-status-critical text-sm mt-1">
                {errors.color.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section: Physical Stats */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Physical Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Birth Date (optional)
            </label>
            <input
              type="date"
              {...register("birth_date")}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.birth_date && (
              <p className="text-status-critical text-sm mt-1">
                {errors.birth_date.message}
              </p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Weight (lbs, optional)
            </label>
            <input
              type="number"
              step="0.1"
              {...register("weight", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.weight && (
              <p className="text-status-critical text-sm mt-1">
                {errors.weight.message}
              </p>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Height (inches, optional)
            </label>
            <input
              type="number"
              step="0.1"
              {...register("height", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.height && (
              <p className="text-status-critical text-sm mt-1">
                {errors.height.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section: Additional Info */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Additional Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">
              Notes (optional)
            </label>
            <textarea
              {...register("notes")}
              className="w-full border border-text-disabled rounded-medium px-3 py-2 h-24"
            />
            {errors.notes && (
              <p className="text-status-critical text-sm mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">
              Image URL (optional)
            </label>
            <input
              {...register("image")}
              className="w-full border border-text-disabled rounded-medium px-3 py-2"
            />
            {errors.image && (
              <p className="text-status-critical text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-contrast font-medium py-2.5 rounded-medium hover:bg-primary-dark transition disabled:bg-primary-light disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}
