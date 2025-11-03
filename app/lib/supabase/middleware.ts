import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseEnvVarsSafe } from '@/app/lib/utils/env'

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request })

  const envVars = getSupabaseEnvVarsSafe()
  if (!envVars) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase env vars not found in middleware')
    }
    return response
  }

  const { url, anonKey } = envVars

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    await supabase.auth.getUser()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware error:', error)
    }
  }

  return response
}