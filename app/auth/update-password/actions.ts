"use server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"


export const updatePassword=async(data:FormData)=>{
    const supabase = await createClient(await cookies());
    const password = data.get('password') as string
   const{data:user, error} =  await supabase.auth.updateUser({ password: password })
   console.log(user, error)
   if(error){
    return { error:error.message};
   }
    return {error:null}
}