import "server-only";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { createServerClient } from "@/app/lib/supabase/server";
import { CheckoutMetadataSchema } from "@/app/lib/payments/schemas";
import type { CheckoutMetadata } from "@/app/lib/payments/types";

// Normaliza metadata do Mercado Pago para camelCase, aceitando snake_case
function normalizeCheckoutMetadata(metadata: unknown): Partial<CheckoutMetadata> {
  const m = (metadata ?? {}) as Record<string, unknown>;
  const testeId = (m.testeId as string) ?? (m.teste_id as string) ?? undefined;
  const name = (m.name as string) ?? (m.nome as string) ?? undefined;
  const phone = (m.phone as string) ?? (m.telefone as string) ?? undefined;
  const userEmail = (m.userEmail as string) ?? (m.user_email as string) ?? undefined;
  const version = (m.version as CheckoutMetadata["version"]) ?? undefined;
  return { testeId, name, phone, userEmail, version };
}

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  // Aceita snake_case vindo do MP e valida parcialmente (campos opcionais)
  const normalized = normalizeCheckoutMetadata(paymentData.metadata);
  const parsed = CheckoutMetadataSchema.partial().safeParse(normalized);
  const metadata: Partial<CheckoutMetadata> = parsed.success ? parsed.data : {};
  const userEmail: string | null = metadata.userEmail ?? paymentData.payer?.email ?? null;
  const fullName: string | null = metadata.name ?? null;
  const phone: string | null = metadata.phone ?? null;

  try {
    const supabase = await createServerClient();
    // Persistência idempotente por email: atualiza se existir, senão insere.
    if (userEmail) {
      const { data: existing, error: selectError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", userEmail)
        .limit(1);

      if (selectError) {
        console.warn("Supabase select profile by email error:", selectError);
      }

      if (existing && existing.length > 0) {
        await supabase
          .from("profiles")
          .update({ full_name: fullName, phone })
          .eq("email", userEmail);
      } else {
        await supabase.from("profiles").insert({
          full_name: fullName,
          email: userEmail,
          phone,
        });
      }
    } else {
      // Sem email confiável: mantém comportamento original (insere) para não perder dados.
      await supabase.from("profiles").insert({
        full_name: fullName,
        email: userEmail, // provavelmente null
        phone,
      });
    }
  } catch (error) {
    console.error("Supabase upsert/insert profile error:", error);
  }

  return;
}
