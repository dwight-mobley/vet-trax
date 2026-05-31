"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";

import { deleteMedicalRecord } from "@/actions/medical-record";


function DeleteMedicalRecordButton({recordId}:{recordId:string}) {
    const router = useRouter()
    const { showError, showSuccess } = useModal()
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);
        const result = await deleteMedicalRecord(recordId);

        if (!result.success) {
            setLoading(false);
            showError('Failed to delete account!', result.message);
            return;
        }
        setLoading(false);
        showSuccess('Medical Record Deleted', 'Medical Record Successfully Deleted')
        router.push('/records')
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
                    <div className="bg-background-paper rounded-large shadow-lg p-6  max-w-md">
                        <h2 className="text-lg font-semibold text-text-primary mb-2">
                            Delete Medical Record?
                        </h2>

                        <p className="mb-6 text-status-critical">
                            This action cannot be undone.
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

export default DeleteMedicalRecordButton
