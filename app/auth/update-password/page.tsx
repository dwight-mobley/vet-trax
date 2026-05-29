"use client"
import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import { AuthError } from "@supabase/supabase-js";
import { updatePassword } from "@/actions/auth";


//Checkmark
const CheckMark = () => {
    return (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}

const Dot = () => {
    return (
        <svg className="w-4 h-4 shrink-0 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="8" strokeWidth={2} />
        </svg>
    );
}

export default function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [validPassword, setValidPassword] = useState({
        passwordsMatch: false,
        correctLength: false,
        specialChar: false,
        includesNumber: false
    })
    const router = useRouter()
    const { showSuccess, showError } = useModal()

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

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        try {
            if (!Object.values(validPassword).every(value => value === true)) {
                showError('Passwords Error', "Make sure your passwords meets validation requirements.")
                return;
            }
           
            const result = await updatePassword(new FormData(e.target))
           
            if(result?.error){
                showError('Password Update Failed', result.error);
                return;
            }
            showSuccess('Password Changed', 'Your password was successfully changed.')
            router.push('/');
        } catch (err) {
            showError('Error Resetting Password', 'Please try again.')
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
            <div className="w-full max-w-md bg-background-paper rounded-large shadow-lg p-8">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary mb-4">
                        {/* Lock Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2zm.99-9.167a5.002 5.002 0 0110.02 0" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Create new password
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Your new password must be different from previous used passwords.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={onSubmit} className="space-y-5">
                    {/* New Password Input */}
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-text-primary mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-text-disabled rounded-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-text-disabled rounded-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-background p-4 rounded-medium border border-text-disabled/50 mt-2">
                        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">
                            Password Requirements
                        </h3>
                        <ul className="text-sm space-y-1.5">
                            <li className={`flex items-center gap-2 ${validPassword.passwordsMatch ? 'text-status-healthy' : 'text-text-secondary'}`}>
                                {validPassword.passwordsMatch ? <CheckMark /> : <Dot />}
                                Passwords Match
                            </li>
                            <li className={`flex items-center gap-2 ${validPassword.correctLength ? 'text-status-healthy' : 'text-text-secondary'}`}>
                                {validPassword.correctLength ? <CheckMark /> : <Dot />}
                                At least 8 characters
                            </li>
                            {/* Using text-secondary for "unmet" requirement examples */}
                            <li className={`flex items-center gap-2 ${validPassword.includesNumber ? 'text-status-healthy' : 'text-text-secondary'}`}>
                                {validPassword.includesNumber ? <CheckMark /> : <Dot />}
                                Contains a number
                            </li>
                            <li className={`flex items-center gap-2 ${validPassword.specialChar ? 'text-status-healthy' : 'text-text-secondary'}`}>
                                {validPassword.specialChar ? <CheckMark /> : <Dot />}
                                Contains a special character
                            </li>
                        </ul>
                    </div>

                    {/* Submit Action */}
                    {Object.values(validPassword).every(value => value === true) &&
                        <button
                            type="submit"
                            disabled={!Object.values(validPassword).every(value => value === true)}
                            className="w-full bg-primary hover:bg-primary-dark text-primary-contrast font-medium py-2.5 px-4 rounded-medium transition-colors shadow-sm mt-6"
                        >
                            Update Password
                        </button>
                    }
                </form>

            </div>
        </div>
    );
}