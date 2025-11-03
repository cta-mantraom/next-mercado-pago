import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseEnvVars } from '@/app/lib/utils/env'
import { browserClientOptions } from './config'

let clientInstance: SupabaseClient | null = null

export function createBrowserClient(): SupabaseClient {
  if (clientInstance) return clientInstance

  const { url, anonKey } = getSupabaseEnvVars()

  clientInstance = createSupabaseBrowserClient(url, anonKey, browserClientOptions)

  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase browser client initialized')
  }

  return clientInstance
}

export function resetBrowserClient(): void {
  clientInstance = null
}