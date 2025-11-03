import { NextResponse, type NextRequest } from 'next/server'

// Middleware mínimo compatível com Edge Runtime.
// Removemos qualquer import de Supabase para evitar warnings e manter performance.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}