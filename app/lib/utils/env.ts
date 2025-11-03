/**
 * Validação robusta de variáveis de ambiente do Supabase
 * Falha rápido com mensagens claras
 */

interface SupabaseEnvVars {
  url: string
  anonKey: string
}

/**
 * Valida e retorna variáveis de ambiente do Supabase
 * @throws Error se variáveis obrigatórias estiverem ausentes
 */
export function getSupabaseEnvVars(): SupabaseEnvVars {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is missing. Add it to your environment variables in Vercel or .env.local'
    )
  }

  if (!anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Add it to your environment variables in Vercel or .env.local'
    )
  }

  if (!url.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must start with https://')
  }

  return { url, anonKey }
}

/**
 * Versão segura que retorna null em vez de lançar erro
 * Útil para componentes opcionais
 */
export function getSupabaseEnvVarsSafe(): SupabaseEnvVars | null {
  try {
    return getSupabaseEnvVars()
  } catch {
    return null
  }
}