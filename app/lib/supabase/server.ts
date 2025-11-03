import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseEnvVars } from '@/app/lib/utils/env'
import { serverClientOptions } from './config'

export async function createServerClient(): Promise<SupabaseClient> {
  const { url, anonKey } = getSupabaseEnvVars()
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