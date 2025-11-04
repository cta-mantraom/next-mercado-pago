export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";
import { BackUrlParamsSchema } from "@/app/lib/payments/schemas";

export async function GET(request: Request) {
  // Rota para lidar com pagamentos pendentes do Mercado Pago (i.e Pix)
  // Quando o cliente clica no botão 'Voltar para o site' no Checkout depois de pagar (ou não) o Pix
  const { searchParams } = new URL(request.url);
  const parsed = BackUrlParamsSchema.safeParse({
    payment_id: searchParams.get("payment_id"),
    external_reference: searchParams.get("external_reference"),
    status: searchParams.get("status"),
    preference_id: searchParams.get("preference_id"),
  });
  if (!parsed.success || !parsed.data.payment_id || !parsed.data.external_reference) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const paymentId = parsed.data.payment_id;
  const testeId = parsed.data.external_reference;

  const payment = new Payment(mpClient);
  const paymentData = await payment.get({ id: paymentId });

  if (paymentData.status === "approved" || paymentData.date_approved !== null) {
    // Pagamentos já foi realizado. redirecionamos para a página de sucesso
    return NextResponse.redirect(new URL(`/?status=sucesso`, request.url));
  }

  // Pagamentos pendentes. redirecionamos para a página inicial
  return NextResponse.redirect(new URL("/", request.url));
}
