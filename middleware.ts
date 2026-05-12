import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

function withSessionCookies(
  redirectResponse: NextResponse,
  supabaseResponse: NextResponse
): NextResponse {
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
  })
  return redirectResponse
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  // Protect /admin routes except /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    if (!user) {
      const redirectUrl = new URL('/admin/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return withSessionCookies(NextResponse.redirect(redirectUrl), supabaseResponse)
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/admin/login' && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/admin'
    return withSessionCookies(
      NextResponse.redirect(new URL(redirectTo, request.url)),
      supabaseResponse
    )
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
