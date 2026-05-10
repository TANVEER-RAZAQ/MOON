import { Suspense } from 'react'
import OrderSuccessPage from '@/components/pages/OrderSuccessPage'

export default function OrderSuccessRoute({ params }: { params: { orderId: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessPage orderId={params.orderId} />
    </Suspense>
  )
}
