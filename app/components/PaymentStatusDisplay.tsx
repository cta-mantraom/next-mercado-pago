'use client'

interface Props {
  status?: string
}

function SuccessMessage() {
  return (
    <div className="px-4 py-2 rounded-md bg-green-50 text-green-700 border border-green-200">
      Pagamento aprovado.
    </div>
  )
}

function PendingMessage() {
  return (
    <div className="px-4 py-2 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-200">
      Pagamento pendente. Aguarde a confirmação.
    </div>
  )
}

function RejectedMessage() {
  return (
    <div className="px-4 py-2 rounded-md bg-red-50 text-red-700 border border-red-200">
      Pagamento não aprovado. Tente novamente.
    </div>
  )
}

export function PaymentStatusDisplay({ status }: Props) {
  if (!status) return null

  const normalized = status.toLowerCase()
  const isApproved = normalized === 'sucesso' || normalized === 'approved'
  const isPending = normalized === 'pending'
  const isRejected = normalized === 'falha' || normalized === 'rejected'

  return (
    <div>
      {isApproved && <SuccessMessage />}
      {isPending && <PendingMessage />}
      {isRejected && <RejectedMessage />}
    </div>
  )
}

export default PaymentStatusDisplay