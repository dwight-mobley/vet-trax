"use client";

import { markReminderComplete } from "@/actions/reminder-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";


function MarkReminderCompleteButton ({ reminderId }: { reminderId: string }) {
  const router = useRouter()
  const {showError, showSuccess} = useModal()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const {success, message} = await markReminderComplete(reminderId);
    if(!success){
      setLoading(false);
      showError('Failed to mark reminder as complete!', message);
    }
    setLoading(false);
    showSuccess('Reminder Completed', message)
    setOpen(false);
    router.refresh()
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-white font-medium hover:underline bg-status-healthy rounded p-2"
      >
        Complete
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* Modal */}
          <div className="bg-background-paper rounded-large shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Mark Reminder as Complete?
            </h2>

            <p className="text-text-secondary mb-6">
              This action cannot be undone. This will reset this reminder
              and place a log in your reminder history.
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
                className="px-4 py-2 rounded-medium bg-status-healthy text-white hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Working..." : "Mark Complete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkReminderCompleteButton
