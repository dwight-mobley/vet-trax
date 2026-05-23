import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-background-paper rounded-large shadow-xl border border-text-disabled/30 p-8 text-center">

        {/* Mail Icon */}
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Check your email
        </h1>

        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          We&apos;ve sent a secure verification link to your inbox. Please click the link to verify your account and complete your registration.
        </p>

        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            Didn&apos;t receive an email? Check your spam folder or contact support.
          </p>


        </div>
      </div>
    </div>
  );
}