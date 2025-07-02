export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v7 as uuidv7 } from 'uuid'

export const config = {
  matcher: ['/', '/admin/:path*'],
}

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl
  const uuid = uuidv7()

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    const role = token.user?.role
    const modules: string[] = token.user?.modules || []

    if (pathname.startsWith('/admin/users') && role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/not-found', req.url))
    }

    if (role === 'SUPER_ADMIN') {
      return NextResponse.next()
    }

    const modulePath = pathname.split('/')[2]

    if (!modules.includes(modulePath)) {
      return NextResponse.redirect(new URL('/admin/not-found', req.url))
    }

    return NextResponse.next()
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${uuid}`, req.url))
  }

  return NextResponse.next()
}
