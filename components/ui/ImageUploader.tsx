"use client";

import { PetCreateForm, PetUpdateForm } from "@/schemas/pet";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { UseFormSetValue } from "react-hook-form";

interface ImageUploaderProps {
url?: string;
preset?: string;
previousImage?:string;
setValue: UseFormSetValue<PetCreateForm> | UseFormSetValue<PetUpdateForm>
}

export const ImageUploader = ({ url, preset = "vet_trax", previousImage, setValue }: ImageUploaderProps) => {
  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <CldUploadButton
        uploadPreset={preset}
        onSuccess={(result) => {
          if (previousImage) {
            fetch("/api/cloudinary/destroy", {
              method: "POST",
              body: JSON.stringify({ url:previousImage }),
            });
          }
          if (typeof result.info !== "string" && result.info?.secure_url) {
            setValue("image", result.info.secure_url);
          }
        }}
        className="
          bg-primary
          text-primary-contrast
          font-medium
          px-4
          py-2.5
          rounded-medium
          hover:bg-primary-dark
          transition
          cursor-pointer
          inline-block
        ">
        Upload Image
      </CldUploadButton>

      {/* Preview */}
      {url && (
        <div className="flex items-center gap-3 bg-background-paper p-3 rounded-medium border border-text-disabled shadow-sm">
          <Image src={url} alt="pet" width={60} height={60} className="rounded-medium object-cover" />
          <p className="text-text-secondary text-sm truncate">{url}</p>
        </div>
      )}
    </div>
  );
};
