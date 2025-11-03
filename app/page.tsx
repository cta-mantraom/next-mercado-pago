import PaymentStatusDisplay from './components/PaymentStatusDisplay'
import CheckoutForm from './components/CheckoutForm'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>
}) {
  const params = await searchParams
  const rawStatus = params?.status
  const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus

  return (
    <main className="flex flex-col justify-center items-center h-screen gap-6 p-4">
      <PaymentStatusDisplay status={status} />
      <CheckoutForm />
    </main>
  )
}
