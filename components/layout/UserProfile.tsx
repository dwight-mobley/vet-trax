"use client";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client"; // or your local supabase browser client file
import { LogOut, User as UserIcon, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();

  // Initialize Supabase browser client for handling client-side sign out
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Refreshes the server components/layout to update the auth state
  };

  // Safe fallback if user has no display name set in metadata
  const userEmail = user.email || "User";
  const userInitials = userEmail.substring(0, 2).toUpperCase();

  return (
    <div className="relative group p-4 border-t border-text-disabled/20 bg-background-paper">

      {/*
        ========================================
        HOVER MENU (POPS UP ABOVE)
        ========================================
      */}
      <div className="absolute bottom-full left-4 right-4  bg-background border border-text-disabled/30 rounded-md shadow-lg p-1 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-400 ease-out-400 z-30">

        {/* Profile Link */}
        <button
          onClick={() => router.push("/settings/profile")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-text-disabled/10 rounded-sm transition-colors text-left"
        >
          <UserIcon className="w-4 h-4 text-text-secondary" />
          <span>View Profile</span>
        </button>

        {/* Divider */}
        <div className="h-px bg-text-disabled/20 my-1" />

        {/* Sign Out Link */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-sm transition-colors text-left font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/*
        ========================================
        TRIGGER BUTTON (THE MAIN PROFILE ROW)
        ========================================
      */}
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-text-disabled/10 transition-colors cursor-pointer">
        <div className="flex items-center min-w-0">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-contrast font-semibold text-sm shrink-0">
            {userInitials}
          </div>

          {/* Info */}
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {user.user_metadata?.full_name || "Pet Owner"}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {userEmail}
            </p>
          </div>
        </div>

        {/* Indicator Arrow */}
        <ChevronUp className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors shrink-0 ml-2" />
      </div>

    </div>
  );
}
