import { NextResponse } from 'next/server'
// The helper to create a Supabase client for Server-side logic
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 'next' is the path to redirect to after successful login (default: '/')
  const next = searchParams.get('next') ?? '/'
    console.log('Received auth callback with code:', code)
  if (code) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore)

    // Exchanging the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // Check for proxy/load balancers
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // Local: redirect to the origin (e.g., http://localhost:3000)
        console.log('Redirecting to local origin:', `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Production: use the forwarded host for the full URL
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Handle errors or missing code by redirecting to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}