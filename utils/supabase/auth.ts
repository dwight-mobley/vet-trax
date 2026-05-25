
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";


/**
 * Fetches the current user or redirects to login if unauthenticated.
 * Use this in Server Components and Server Actions.
 */
export const requireUser = async () => {
    const cookieStore = await cookies();

    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    //Middleware handles redirection
    return user!;
};