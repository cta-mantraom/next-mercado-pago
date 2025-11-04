import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabasePublicEnvStrict } from '@/app/lib/config/env'
import { browserClientOptions } from './config'

let clientInstance: SupabaseClient | null = null

export function createBrowserClient(): SupabaseClient {
  if (clientInstance) return clientInstance

  const env = getSupabasePublicEnvStrict()
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  clientInstance = createSupabaseBrowserClient(url, anonKey, browserClientOptions)

  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase browser client initialized')
  }

  return clientInstance
}

export function resetBrowserClient(): void {
  clientInstance = null
}