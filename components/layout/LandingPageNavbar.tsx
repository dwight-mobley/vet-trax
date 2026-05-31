
import {  PawPrintIcon } from 'lucide-react'
import Link from 'next/link'


export default function LandingPageNavbar() {
  return (
     <header className="w-full px-6 py-4 flex items-center justify-between bg-background-paper shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <PawPrintIcon className="w-8 h-8" />
          <span className="text-2xl font-bold tracking-tight text-text-primary">VetTrax</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/auth/login" className="text-text-secondary hover:text-primary transition-colors font-medium">
            Log In
          </Link>
          <Link href="/auth/login?register=true" className="bg-primary text-primary-contrast px-5 py-2 rounded-medium font-medium hover:bg-primary-dark transition-colors">
            Get Started
          </Link>
        </nav>
      </header>
  )
}
