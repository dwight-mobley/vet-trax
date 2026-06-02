"use client"
import { login, registerUser } from '@/actions/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


//Password Validation Icons
//Checkmark
const CheckMark = () => {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
};

const Dot = () => {
  return (
    <svg className="w-4 h-4 shrink-0 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="8" strokeWidth={2} />
    </svg>
  );
};

function LoginRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isSignUp = searchParams.get("register")?.toLowerCase() === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validPassword, setValidPassword] = useState({
    passwordsMatch: false,
    correctLength: false,
    specialChar: false,
    includesNumber: false,
  });

  const handleAuth = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        if(!Object.values(validPassword).every(value => value === true)){
          setError("Password Validation Error");
          return;
        }
        const registerError = await registerUser(new FormData(e.target), location.origin);
        if (registerError) {
          return setError(registerError);
        }
        //Redirect to success page
        router.push("/auth/register/success");
      } else {
        const loginError = await login(new FormData(e.target));
        if (loginError) return setError(loginError);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };


      useEffect(() => {
        setTimeout(() => {
            setValidPassword((s) => ({
                passwordsMatch: password === confirmPassword && s.correctLength,
                includesNumber: (/\d/).test(password),
                correctLength: password.length >= 8,
                specialChar: (/[^a-zA-Z0-9 ]/).test(password)
            }))

        }, 300)

    }, [password, confirmPassword])

  return (
    <div className="w-full flex justify-center">
      {/* Main Card */}
      <div className="w-full max-w-md bg-background-paper rounded-large shadow-xl border border-text-disabled/30 p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-text-primary">{isSignUp ? "Create an Account" : "Welcome Back"}</h1>
          <p className="text-text-secondary mt-2 text-sm">{isSignUp ? "Enter your details to register in the portal." : "Sign in to securely access your portal."}</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-medium bg-status-critical/10 border border-status-critical/20 flex items-start">
            <p className="text-status-critical text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@example.com"
              required
              className="w-full px-4 py-2.5 rounded-medium border border-text-disabled bg-background-paper text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-text-primary" htmlFor="password">
                Password
              </label>
              {!isSignUp && (
                <Link href="/auth/password-reset" type="button" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors">
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-medium border border-text-disabled bg-background-paper text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          {isSignUp && (
            <>
            <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-text-primary" htmlFor="password">
                Confirm Password
              </label>
            </div>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-medium border border-text-disabled bg-background-paper text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Password Requirements */}

            <div className="bg-background p-4 rounded-medium border border-text-disabled/50 mt-2">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">Password Requirements</h3>
              <ul className="text-sm space-y-1.5">
                <li className={`flex items-center gap-2 ${validPassword.passwordsMatch ? "text-status-healthy" : "text-text-secondary"}`}>
                  {validPassword.passwordsMatch ? <CheckMark /> : <Dot />}
                  Passwords Match
                </li>
                <li className={`flex items-center gap-2 ${validPassword.correctLength ? "text-status-healthy" : "text-text-secondary"}`}>
                  {validPassword.correctLength ? <CheckMark /> : <Dot />}
                  At least 8 characters
                </li>
                {/* Using text-secondary for "unmet" requirement examples */}
                <li className={`flex items-center gap-2 ${validPassword.includesNumber ? "text-status-healthy" : "text-text-secondary"}`}>
                  {validPassword.includesNumber ? <CheckMark /> : <Dot />}
                  Contains a number
                </li>
                <li className={`flex items-center gap-2 ${validPassword.specialChar ? "text-status-healthy" : "text-text-secondary"}`}>
                  {validPassword.specialChar ? <CheckMark /> : <Dot />}
                  Contains a special character
                </li>
              </ul>
            </div>
            </>

          )}

          <button type="submit" disabled={isLoading || (isSignUp && !Object.values(validPassword).every(value => value === true))} className="w-full mt-6 bg-primary hover:bg-primary-dark text-primary-contrast font-medium py-2.5 px-4 rounded-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
            {isLoading ? <span className="inline-block h-5 w-5 border-2 border-primary-contrast border-t-transparent rounded-full animate-spin"></span> : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 text-center text-sm text-text-secondary">
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
          <Link href={`/auth/login${!isSignUp ? "?register=true" : ""}`} className="font-medium text-primary hover:text-primary-dark transition-colors">
            {isSignUp ? "Sign in instead" : "Create one now"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterForm