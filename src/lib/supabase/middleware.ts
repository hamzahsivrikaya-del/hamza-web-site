import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public rotalar - auth gerektirmez
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/araclar') ||
    pathname.startsWith('/antrenmanlar') ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/cron') ||
    pathname.startsWith('/api/push') ||
    pathname.startsWith('/api/share') ||
    pathname.includes('.')
  ) {
    // Giriş yapmış kullanıcıyı login veya landing page'den yönlendir
    if ((pathname === '/login' || pathname === '/') && user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      const redirectUrl = profile?.role === 'admin' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return supabaseResponse
  }

  // Auth gerektiren rotalar
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Rol kontrolü
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // Admin rotaları
  if (pathname.startsWith('/admin') && profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Üye rotaları
  if (pathname.startsWith('/dashboard') && profile?.role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}
