// utils/supabase/auth.ts
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Fetches the current user or redirects to login if unauthenticated.
 * Use this in Server Components and Server Actions.
 */
export const requireUser = async () => {
    const cookieStore = await cookies();
   
    const supabase = await createClient(cookieStore);

    const { data: { user }, error } = await supabase.auth.getUser();

    // If there is no user, instantly kick them to the login page
    if (error || !user) {
        redirect("/login");
    }

    return user;
};