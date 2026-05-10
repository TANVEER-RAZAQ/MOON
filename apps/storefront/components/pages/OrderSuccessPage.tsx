'use client';

import Link from 'next/link';
import { useGetOrderQuery } from '@/lib/store/services/storefront-api';

interface OrderSuccessPageProps {
  orderId: string;
}

export default function OrderSuccessPage({ orderId }: OrderSuccessPageProps) {
  const { data: order, isLoading, isError } = useGetOrderQuery(orderId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF6EF] flex items-center justify-center">
        <p className="text-[#5f5447] text-lg">Loading your order...</p>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-[#5f5447] text-lg text-center">
          We could not load your order details. Your payment was still processed successfully.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#D2571B] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b84916] transition-colors"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

  const handleDownloadInvoice = () => {
    window.open(`${apiUrl}/orders/${orderId}/invoice`, '_blank');
  };

  const freeShipping = order.shipping_cost === 0;

  return (
    <main className="min-h-screen bg-[#FAF6EF] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#2c2417] mb-2" style={{ fontFamily: 'var(--font-fraunces, serif)' }}>
            Order Confirmed!
          </h1>
          <p className="text-[#5f5447] text-base">
            Thank you for your order. We will send a confirmation to{' '}
            <span className="font-semibold text-[#2c2417]">{order.customer_email}</span>.
          </p>
          <p className="text-[#D2571B] font-semibold text-lg mt-2">
            Order #{order.order_number}
          </p>
        </div>

        {/* Order card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ddd0] overflow-hidden mb-6">
          {/* Items */}
          <div className="p-6 border-b border-[#e8ddd0]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a7560] mb-4">
              Items Ordered
            </h2>
            <ul className="space-y-3">
              {order.items.map((item, index) => (
                <li key={index} className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#2c2417] font-medium truncate">{item.product_name}</p>
                    <p className="text-[#8a7560] text-sm">
                      {item.quantity} x ₹{item.unit_price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <p className="text-[#2c2417] font-semibold whitespace-nowrap">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals */}
          <div className="p-6 border-b border-[#e8ddd0] space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a7560] mb-4">
              Order Total
            </h2>
            <div className="flex justify-between text-[#5f5447]">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#5f5447]">
              <span>Shipping</span>
              <span>{freeShipping ? 'Free' : `₹${order.shipping_cost.toLocaleString('en-IN')}`}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-[#5f5447]">
                <span>Tax</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-[#2c2417] font-bold text-lg pt-2 border-t border-[#e8ddd0]">
              <span>Total</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a7560] mb-3">
              Shipping Address
            </h2>
            <address className="not-italic text-[#5f5447] leading-relaxed">
              <p className="font-semibold text-[#2c2417]">{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.line_1}</p>
              {order.shipping_address.line_2 && <p>{order.shipping_address.line_2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} &ndash;{' '}
                {order.shipping_address.postal_code}
              </p>
            </address>
          </div>
        </div>

        {/* Estimated delivery */}
        <p className="text-center text-[#8a7560] text-sm mb-8">
          Estimated delivery: <span className="font-semibold text-[#5f5447]">3–7 business days</span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="inline-flex items-center justify-center gap-2 border-2 border-[#D2571B] text-[#D2571B] px-7 py-3 rounded-full font-semibold hover:bg-[#D2571B] hover:text-white transition-colors"
          >
            Download Invoice
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#D2571B] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#b84916] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
