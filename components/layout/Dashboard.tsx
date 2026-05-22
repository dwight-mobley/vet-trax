"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  Activity,
  Settings,
  Menu,
  X
} from "lucide-react";
import { NavLinks } from "./NavLinks";
import { UserProfile } from "./UserProfile";


const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pets", href: "/pets", icon: PawPrint },
  { name: "Reminders", href: "/reminders", icon: Calendar },
  { name: "Medical Records", href: "/records", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/*
        ========================================
        DESKTOP SIDEBAR
        ========================================
      */}
      <aside className="hidden md:flex flex-col w-64 bg-background-paper border-r border-text-disabled/30 fixed inset-y-0 z-10">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-text-disabled/20">
          <div className="w-8 h-8 rounded-small bg-primary flex items-center justify-center mr-3">
            <Activity className="w-5 h-5 text-primary-contrast" />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">VetTrax</span>
        </div>

        {/* Links Area */}
        <div className="flex-1 overflow-y-auto py-4">
          <NavLinks pathname={pathname} navItems={NAV_ITEMS} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>

        {/* User Profile Area (Bottom) */}
       <UserProfile/>
      </aside>

      {/*
        ========================================
        MOBILE TOP BAR & FLYOUT MENU
        ========================================
      */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background-paper border-b border-text-disabled/30 flex items-center justify-between px-4 z-20">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-small bg-primary flex items-center justify-center mr-3">
            <Activity className="w-5 h-5 text-primary-contrast" />
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight">VetTrax</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-text-secondary hover:text-text-primary"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-text-primary/50 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <div className={`
        md:hidden fixed inset-y-0 left-0 w-64 bg-background-paper border-r border-text-disabled/30 z-20 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-text-disabled/20">
          <span className="text-xl font-bold text-text-primary">Menu</span>
        </div>
        <div className="py-4">
          <NavLinks pathname={pathname} navItems={NAV_ITEMS} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        </div>
      </div>

      {/*
        ========================================
        MAIN CONTENT AREA
        ========================================
      */}
      <main className="flex-1 flex flex-col md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}