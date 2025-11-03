import type { SupabaseClientOptions } from '@supabase/supabase-js'

// Opções compartilhadas para todos os clientes Supabase
export const supabaseClientOptions: SupabaseClientOptions<'public'> = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-application-name': 'next-mercado-pago',
    },
  },
  db: {
    schema: 'public',
  },
}

// Opções específicas para cliente browser
export const browserClientOptions: SupabaseClientOptions<'public'> = {
  ...supabaseClientOptions,
  auth: {
    ...supabaseClientOptions.auth,
    autoRefreshToken: false,
    persistSession: false,
  },
}

// Opções específicas para cliente servidor
export const serverClientOptions: SupabaseClientOptions<'public'> = {
  ...supabaseClientOptions,
  auth: {
    ...supabaseClientOptions.auth,
    persistSession: false,
  },
}