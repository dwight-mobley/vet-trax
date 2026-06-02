import Link from "next/link";
import { PawPrint, FileText, Bell, ChevronRight } from "lucide-react";
import Image from "next/image";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Hero Section */}
      <main className="w-full min-h-[550px] flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 bg-hero bg-cover  bg-center">
       
        
      </main>

      {/* Features Section */}
      <section className="bg-background-paper py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Everything you need in one place</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">VetTrax simplifies pet management with intuitive tools designed for comprehensive care.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-large bg-background border border-text-disabled/30 hover:border-primary-light transition-colors">
              <div className="w-14 h-14 rounded-medium bg-primary-light/20 flex items-center justify-center text-primary mb-6">
                <PawPrint className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Detailed Pet Profiles</h3>
              <p className="text-text-secondary">Store essential details including name, weight, height, breed, color, and upload a profile picture so every pet&apos;s identity is front and center.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-large bg-background border border-text-disabled/30 hover:border-primary-light transition-colors">
              <div className="w-14 h-14 rounded-medium bg-status-info/10 flex items-center justify-center text-status-info mb-6">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Clinical Vet Records</h3>
              <p className="text-text-secondary">Log and organize medical history, vaccinations, and visit summaries securely so you always have access to critical health data.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-large bg-background border border-text-disabled/30 hover:border-secondary-light transition-colors">
              <div className="w-14 h-14 rounded-medium bg-secondary-light/20 flex items-center justify-center text-secondary mb-6">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Automated Reminders</h3>
              <p className="text-text-secondary">Set custom alerts for upcoming appointments, medication schedules, and routine checkups to keep health on track.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer/>

    </div>
  );
}
