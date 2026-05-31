import { requireUser } from '@/utils/supabase/auth'
import Link from 'next/link'
import React from 'react'

async function Footer() {
  const user = await requireUser();
  if(user?.id){
    return null;
  }
  return (
      <footer className="w-full bg-primary-dark p-3 text-center">
        <h2 className="text-2xl font-bold text-primary-contrast mb-3">Ready to streamline your pet care?</h2>
        <Link href="/auth/login?register=true" className="inline-block bg-background-paper text-primary-dark px-8 py-3 rounded-medium font-bold hover:bg-background transition-colors">
          Start using VetTrax today
        </Link>
        <p className="mt-12 text-primary-light/60 text-sm">&copy; {new Date().getFullYear()} VetTrax. All rights reserved.</p>
      </footer>
  )
}

export default Footer
