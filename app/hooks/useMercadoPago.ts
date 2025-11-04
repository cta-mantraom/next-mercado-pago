import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";
import type { CheckoutFormData } from "@/app/lib/payments/types";
import { getPublicEnvSafe } from "@/app/lib/config/env";

const useMercadoPago = () => {
  const router = useRouter();

  useEffect(() => {
    const env = getPublicEnvSafe();
    const publicKey = env?.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
    if (!publicKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Mercado Pago public key missing. Set NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY in your environment.');
      }
      return;
    }
    initMercadoPago(publicKey);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: CheckoutFormData) {
    try {
      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      router.push(data.initPoint);
    } catch (error) {
      console.log(error);
    }
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;
