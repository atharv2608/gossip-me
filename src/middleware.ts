import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Check the current path
  const { pathname } = req.nextUrl

  // Redirect to /dashboard if user is authenticated and trying to access /sign-in
  if (token &&( pathname === '/sign-in' || pathname === "/sign-up" || pathname === "/")) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect to /sign-in if not authenticated and trying to access /dashboard
  if (!token && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // Allow access to other routes
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/sign-in', '/sign-up', '/'],
}
