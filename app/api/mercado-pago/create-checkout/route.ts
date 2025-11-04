export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";
import { CreateCheckoutInputSchema, CheckoutMetadataSchema } from "@/app/lib/payments/schemas";
import { getPublicEnvSafe } from "@/app/lib/config/env";

export async function POST(req: NextRequest) {
  const raw = await req.json();
  const parsed = CreateCheckoutInputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }
  const { testeId, userEmail, name, phone, email } = parsed.data;

  try {
    const preference = new Preference(mpClient);

    const publicEnv = getPublicEnvSafe();
    const origin = req.nextUrl.origin || publicEnv?.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "";

    const createdPreference = await preference.create({
      body: {
        external_reference: testeId, // IMPORTANTE: id da compra no nosso sistema
        metadata: CheckoutMetadataSchema.parse({
          testeId, // Mercado Pago converte para snake_case (teste_id)
          name,
          phone,
          userEmail: userEmail || email,
          version: 'v1',
        }),
        ...((userEmail || email) && {
          payer: {
            email: userEmail || email,
          },
        }),

        items: [
          {
            id: "id-do-seu-produto",
            description: "Descrição do produto",
            title: "Nome do produto",
            quantity: 1,
            unit_price: 5.00,
            currency_id: "BRL",
            category_id: "category", // Recomendado inserir, mesmo que não tenha categoria - Aumenta a pontuação da sua integração com o Mercado Pago
          },
        ],
        payment_methods: {
          // Descomente para desativar métodos de pagamento
             excluded_payment_methods: [
               {
                 id: "bolbradesco",
               },
               {
                 id: "pec",
               },
             ],
             excluded_payment_types: [
               {
                 id: "debit_card",
               },
               {
                 id: "credit_card",
               },
             ],
          installments: 12, // Número máximo de parcelas permitidas - calculo feito automaticamente
        },
        auto_return: "approved",
        back_urls: {
          success: `${origin}/?status=sucesso`,
          failure: `${origin}/?status=falha`,
          pending: `${origin}/api/mercado-pago/pending`, // Criamos uma rota para lidar com pagamentos pendentes
        },
      },
    });

    if (!createdPreference.id) {
      throw new Error("No preferenceID");
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
