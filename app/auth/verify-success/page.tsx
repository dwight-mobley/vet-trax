import Link from "next/link";

export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-background-paper rounded-large shadow-xl border border-text-disabled/30 p-8 text-center">

        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-status-healthy/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-status-healthy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Email Verified!
        </h1>

        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          Your email address has been successfully verified. Your account is now active and secure.
        </p>

        <Link
          href="/"
          className="block w-full bg-primary hover:bg-primary-dark text-primary-contrast font-medium py-2.5 px-4 rounded-medium transition-all duration-200"
        >
          Continue to Dashboard
        </Link>
      </div>
    </div>
  );
}