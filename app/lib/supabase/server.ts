import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabasePublicEnvStrict } from '@/app/lib/config/env'
import { serverClientOptions } from './config'

export async function createServerClient(): Promise<SupabaseClient> {
  const env = getSupabasePublicEnvStrict()
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const cookieStore = await cookies()

  const supabase = createSupabaseServerClient(url, anonKey, {
    ...serverClientOptions,
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Could not set cookies:', error)
          }
        }
      },
    },
  })

  return supabase
}