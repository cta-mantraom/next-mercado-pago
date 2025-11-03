import "server-only";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { createServerClient } from "@/app/lib/supabase/server";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  const metadata: any = paymentData.metadata || {};
  const userEmail: string | null = metadata.user_email ?? paymentData.payer?.email ?? null;
  const fullName: string | null = metadata.name ?? null;
  const phone: string | null = metadata.phone ?? null;

  try {
    const supabase = await createServerClient();
    // Salva/atualiza perfil básico do comprador
    await supabase.from("profiles").insert({
      full_name: fullName,
      email: userEmail,
      phone,
    });
  } catch (error) {
    console.error("Supabase insert profile error:", error);
  }

  return;
}
