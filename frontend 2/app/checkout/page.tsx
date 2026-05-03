'use client';

import { useRouter } from 'next/navigation';
import { useAppShell } from '@/components/AppContext';
import { CheckoutPage } from '@/components/pages/CheckoutPage';
import { useAppDispatch } from '@/lib/store/hooks';
import { useClearCartMutation } from '@/lib/store/services/api';
import { getGuestCartSessionId } from '@/lib/store/services/cartSession';
import { clearCart } from '@/lib/store/slices/cartSlice';
import { useMemo } from 'react';

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartItems, cartSubtotal, cartCount, openShopSection } = useAppShell();
  const [clearCartMutation] = useClearCartMutation();
  const guestSessionId = useMemo(() => getGuestCartSessionId(), []);

  return (
    <CheckoutPage
      items={cartItems}
      subtotal={cartSubtotal}
      onBackToCart={() => {
        openShopSection();
      }}
      onOrderPlaced={async ({ paymentMethod, total, shippingZone, shippingCost, orderNumber }) => {
        try {
          await clearCartMutation({ sessionId: guestSessionId }).unwrap();
        } catch {
          // ignore backend failure
        }
        dispatch(clearCart());
        router.push('/');
      }}
    />
  );
}
