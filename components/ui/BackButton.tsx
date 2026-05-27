import Link from "next/link";
import React from "react";

interface BackButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  pageTitle: string;
}

function BackButton({ className, href, pageTitle }: BackButtonProps) {
  const internalStyles = "text-primary hover:text-primary-dark hover:underline text-sm font-medium transition-colors";
  return (
    <div className={className}>
      <Link href={href} className={`${internalStyles}`}>
        &larr; Back to {pageTitle}
      </Link>
    </div>
  );
}

export default BackButton;
