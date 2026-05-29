'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { requireUser } from '@/utils/supabase/auth';
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/utils/supabase/admin';

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

    if (error) {
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

export const deleteAccount = async () => {
    //Get current user
    const user = await requireUser();
  
    const supabase = await createAdminClient(await cookies());
    const { error } = await supabase.auth.admin.deleteUser(user.id);
   
    if (error) {
        return error.message
    }        
    await supabase.auth.signOut();
    redirect('/auth/login')
}