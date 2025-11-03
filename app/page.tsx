import PaymentStatusDisplay from './components/PaymentStatusDisplay'
import CheckoutForm from './components/CheckoutForm'

export default function Page({
  searchParams,
}: {
  searchParams?: { status?: string | string[] }
}) {
  const rawStatus = searchParams?.status
  const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus

  return (
    <main className="flex flex-col justify-center items-center h-screen gap-6 p-4">
      <PaymentStatusDisplay status={status} />
      <CheckoutForm />
    </main>
  )
}
