"use client"

import { useState } from "react";
import { resetPassword } from "@/actions/auth";

import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const {showSuccess, showError} = useModal()
    const router = useRouter()

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            const result = await resetPassword(new FormData(e.target), location.origin)
            if(result?.error){
                showError('Error Resetting Password', result.error.message)
                return;
            }
            showSuccess('Reset Link Sent', 'If the email is registered a password reset link will be sent. Please check your email and spam folder.')
            router.push('/auth/login')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
            <div className="w-full max-w-md bg-background-paper rounded-large shadow-lg p-8">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                        {/* Optional Icon (e.g., Lucide React key icon) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Reset your password
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            className="w-full px-4 py-2 bg-background border border-text-disabled rounded-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-colors"
                            placeholder="patient@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-primary-contrast font-medium py-2.5 px-4 rounded-medium transition-colors shadow-sm"
                    >
                        Send Reset Link
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <a
                        href="/login"
                        className="text-sm font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </a>
                </div>

            </div>
        </div>
    );
}