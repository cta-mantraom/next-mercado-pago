import { z } from 'zod'

// Headers schema (optional – we mostly rely on verifyMercadoPagoSignature)
export const WebhookHeadersSchema = z.object({
  'x-signature': z.string().min(1),
  'x-request-id': z.string().min(1),
})

// Webhook body schema (normalized)
export const WebhookBodySchema = z.object({
  type: z.literal('payment'),
  data: z.object({ id: z.union([z.string(), z.number()]).transform(String) }),
})

// Client → backend payload for creating checkout (matches current form fields)
export const CreateCheckoutInputSchema = z.object({
  testeId: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  userEmail: z.string().email().optional(),
})

// Controlled metadata schema used on preference.body.metadata
export const CheckoutMetadataSchema = z.object({
  testeId: z.string(),
  name: z.string().optional(),
  phone: z.string().optional(),
  userEmail: z.string().email().optional(),
  version: z.literal('v1').optional(),
})

// Back URLs search params schema (used in pending route)
export const BackUrlParamsSchema = z.object({
  status: z.string().optional(),
  payment_id: z.union([z.string(), z.number()]).transform(String).optional(),
  external_reference: z.string().optional(),
  preference_id: z.string().optional(),
})