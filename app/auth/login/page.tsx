"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { login, registerUser } from "@/actions/auth";



export default  function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const registerError = await registerUser(new FormData(e.target), location.origin)
        if (registerError) {
         return setError(registerError)
        }
       //Redirect to success page
        router.push('/auth/register/success')
      } else {
        const loginError = await login(new FormData(e.target))
        if (loginError) return setError(loginError);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
        if(err instanceof Error){
               setError(err.message);
        }else{
            setError("An unexpected error occurred")
        }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Main Card */}
      <div className="w-full max-w-md bg-background-paper rounded-large shadow-xl border border-text-disabled/30 p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-text-secondary mt-2 text-sm">
            {isSignUp
              ? "Enter your details to register in the portal."
              : "Sign in to securely access your portal."}
          </p>
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
                <Link href="/auth/password-reset"
                  type="button"
                  className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors"
                >
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-primary hover:bg-primary-dark text-primary-contrast font-medium py-2.5 px-4 rounded-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 border-2 border-primary-contrast border-t-transparent rounded-full animate-spin"></span>
            ) : (
              isSignUp ? "Sign Up" : "Sign In"
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 text-center text-sm text-text-secondary">
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {isSignUp ? "Sign in instead" : "Create one now"}
          </button>
        </div>

      </div>
    </div>
  );
}