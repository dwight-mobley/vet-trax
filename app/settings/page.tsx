import React from 'react';
import Link from 'next/link';
import DeleteAccountButton from '@/components/ui/DeleteAccountButton';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header>
          <h1 className="text-3xl font-bold text-text-primary">
            Settings
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your account security and preferences.
          </p>
        </header>

        <div className="space-y-6">
          
          {/* Password & Security Section */}
          <section className="bg-background-paper rounded-large p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Password & Security</h2>
              <p className="text-sm text-text-secondary mt-1">
                Update your password to keep your account secure.
              </p>
            </div>
            
            <Link 
              href="/auth/update-password"
              className="bg-primary hover:bg-primary-dark text-primary-contrast font-medium px-6 py-2.5 rounded-medium transition-colors text-center shrink-0"
            >
              Update Password
            </Link>
          </section>

          {/* Danger Zone: Delete Account */}
          <section className="bg-background-paper rounded-large p-6 sm:p-8 shadow-sm border border-red-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-status-critical">Delete Account</h2>
              <p className="text-sm text-text-secondary mt-1">
                Permanently remove your personal account and all of its contents from our servers. This action is not reversible, so please continue with caution.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <p className="text-sm font-medium text-text-primary">
                Proceeding will delete all pets and reminders.
              </p>
             <DeleteAccountButton />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}