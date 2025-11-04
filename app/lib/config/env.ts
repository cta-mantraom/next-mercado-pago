import { z } from 'zod'

// Server-only (private) environment variables
const ServerEnvSchema = z.object({
  MERCADO_PAGO_ACCESS_TOKEN: z
    .string()
    .min(1, 'MERCADO_PAGO_ACCESS_TOKEN is required'),
  MERCADO_PAGO_WEBHOOK_SECRET: z
    .string()
    .min(1, 'MERCADO_PAGO_WEBHOOK_SECRET is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
})

export type ServerEnv = z.infer<typeof ServerEnvSchema>

// Public (client-exposed) environment variables
const PublicEnvSchema = z.object({
  NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY is required'),
  // Optional public values used for building URLs or clients
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
})

export type PublicEnv = z.infer<typeof PublicEnvSchema>

let cachedServerEnv: ServerEnv | null = null
let cachedPublicEnv: PublicEnv | null = null

/**
 * Strict server env getter – throws on invalid/missing values.
 * Use only in server-side code (API routes, server utils).
 */
export function getServerEnvStrict(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv
  const parsed = ServerEnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ')
    throw new Error(`[Env] Missing/invalid server env: ${issues}`)
  }
  cachedServerEnv = {
    MERCADO_PAGO_ACCESS_TOKEN: parsed.data.MERCADO_PAGO_ACCESS_TOKEN,
    MERCADO_PAGO_WEBHOOK_SECRET: parsed.data.MERCADO_PAGO_WEBHOOK_SECRET,
    NODE_ENV: parsed.data.NODE_ENV,
  }
  return cachedServerEnv
}

/**
 * Safe public env getter – returns null if required public keys are missing.
 * Prefer using this in client-side code to avoid hard crashes.
 */
export function getPublicEnvSafe(): PublicEnv | null {
  if (cachedPublicEnv) return cachedPublicEnv
  const parsed = PublicEnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const missing = parsed.error.issues.map((e) => e.path.join('.')).join(', ')
    // Log a lightweight warning; do not crash the UI.
    if (typeof window !== 'undefined') {
      console.warn('[Env] Public env not fully configured:', missing)
    } else {
      console.warn('[Env] Public env not fully configured:', missing)
    }
    return null
  }
  cachedPublicEnv = parsed.data
  return cachedPublicEnv
}