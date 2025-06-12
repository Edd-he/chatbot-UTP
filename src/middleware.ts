export { default } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v7 as uuidv7 } from 'uuid'

export const config = {
  matcher: ['/'],
}

export function middleware(req: NextRequest) {
  const uuid = uuidv7()

  return NextResponse.redirect(new URL(`/${uuid}`, req.url))
}
