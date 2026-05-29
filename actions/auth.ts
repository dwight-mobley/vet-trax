'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function registerUser(formData: FormData, url: string) {
    const supabase = await createClient(await cookies());
    const { data, error } = await supabase.auth.signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {            
            emailRedirectTo: `${url}/auth/verify-success`,
        },
    })
   
    if (error) {
        return error.message
    }
    return null
}

export async function login(formData: FormData) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if(error){
        return error.message;
    }
    return null
}

export const resetPassword = async (data: FormData, url: string) => {
    const email = data.get('email');
    if (!email) return { error: { message: 'Email is required' } };
    const supabase = await createClient(await cookies());
    const { error } = await supabase.auth.resetPasswordForEmail(email as string, {
        redirectTo: `${url}/auth/update-password`,
    })
    if (error) {
        return { error: error };
    }
    return null;
}

export const updatePassword = async (data: FormData) => {
    const supabase = await createClient(await cookies());
    const password = data.get('password') as string
    const { data: user, error } = await supabase.auth.updateUser({ password: password })
    console.log(user, error)
    if (error) {
        return { error: error.message };
    }
    return { error: null }
}