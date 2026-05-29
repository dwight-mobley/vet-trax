"use server"

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const resetPassword = async (data:FormData, url:string) => {  
    const email = data.get('email'); 
    if(!email) return {error: {message: 'Email is required'}};
    const supabase = await createClient(await cookies());
    const {error} = await supabase.auth.resetPasswordForEmail(email as string, {
        redirectTo: `${url}/auth/update-password`,
    })
    if (error){
        return {error:error};
    }
    return null;
}