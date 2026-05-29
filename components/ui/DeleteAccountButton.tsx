"use client";

import { deleteReminder, deleteReminderHistory } from "@/actions/reminder-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import { deleteAccount } from "@/actions/auth";


function DeleteAccountButton() {
    const router = useRouter()
    const { showError, showSuccess } = useModal()
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        console.log("Deleting Account")
        setLoading(true);
        
        const error = await deleteAccount();

        if (error) {
            setLoading(false);
            showError('Failed to delete account!', error);
            return;
        }
        setLoading(false);
        showSuccess('Account Deleted', 'Your account has been successfully deleted.')
        router.push('/auth/login')
    }

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-status-critical font-medium hover:underline"
            >
                Delete
            </button>

            {/* Modal Overlay */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    {/* Modal */}
                    <div className="bg-background-paper rounded-large shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold text-text-primary mb-2">
                            Delete Account?
                        </h2>

                        <p className="text-text-secondary mb-6">
                            This action cannot be undone. This will permanently remove all reminders, pets, and account information from our servers. Please proceed with caution.
                        </p>

                        <div className="flex justify-end gap-3">
                            {/* Cancel */}
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-medium border border-text-disabled text-text-primary hover:bg-background transition"
                            >
                                Cancel
                            </button>

                            {/* Confirm Delete */}
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 rounded-medium bg-status-critical text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteAccountButton
