"use client"
import { useRouter } from "next/navigation";
import React from "react";

interface BackButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {

}

function BackButton({ className }: BackButtonProps) {
  const internalStyles = "text-primary hover:text-primary-dark hover:underline text-sm font-medium transition-colors";
  const router = useRouter()
  return (
    <div className={className}>
      <button onClick={router.back} className={`${internalStyles}`}>
        &larr; Back
      </button>
    </div>
  );
}

export default BackButton;
