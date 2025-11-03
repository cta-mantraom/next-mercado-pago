"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import useMercadoPago from "./hooks/useMercadoPago";

export default function Home() {
  const { createMercadoPagoCheckout } = useMercadoPago();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const statusMessage = useMemo(() => {
    const status = searchParams.get("status");
    if (status === "sucesso") return "Pagamento aprovado";
    if (status === "falha") return "Pendente";
    return null;
  }, [searchParams]);

  async function handleBuy() {
    if (!name || !phone || !email) {
      alert("Preencha nome, telefone e email.");
      return;
    }
    setLoading(true);
    try {
      // Gera um ID simples para external_reference
      const testeId = `order_${Date.now()}`;
      await createMercadoPagoCheckout({ testeId, name, phone, email, userEmail: email });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6 p-4">
      {statusMessage && (
        <div className="px-4 py-2 rounded-md bg-gray-100 text-gray-800">
          {statusMessage}
        </div>
      )}
      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
          />
        </div>
        <button
          onClick={handleBuy}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md w-full"
        >
          {loading ? "Carregando..." : "Comprar"}
        </button>
      </div>
    </div>
  );
}
