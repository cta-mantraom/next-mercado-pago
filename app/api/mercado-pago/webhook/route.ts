export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// app/api/mercadopago-webhook/route.js

import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient, { verifyMercadoPagoSignature } from "@/app/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";
import { createServerClient } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const signatureResponse: any = verifyMercadoPagoSignature(request);
    if (signatureResponse instanceof NextResponse) {
      return signatureResponse;
    }

    const body = await request.json();

    const { type, data } = body;

    switch (type) {
      case "payment":
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({ id: data.id });
        // Registra evento do webhook no Supabase
        try {
          const supabase = await createServerClient();
          await supabase.from("payments").upsert({
            id: String(paymentData.id),
            external_reference: paymentData.external_reference ?? null,
            status: paymentData.status,
            date_approved: paymentData.date_approved,
            payer_email: paymentData.payer?.email ?? null,
            raw: paymentData,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        } catch (err) {
          console.error("Supabase insert payment error:", err);
        }
        if (
          paymentData.status === "approved" || // Pagamento por cartão OU
          paymentData.date_approved !== null // Pagamento por Pix
        ) {
          await handleMercadoPagoPayment(paymentData);
        }
        break;
      // case "subscription_preapproval": Eventos de assinatura
      //   console.log("Subscription preapproval event");
      //   console.log(data);
      //   break;
      default:
        console.log("Unhandled event type:", type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
