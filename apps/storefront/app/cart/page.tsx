'use client';

import { useRouter } from 'next/navigation';
import { useAppShell } from '@/components/AppContext';
import { CartPage } from '@/components/pages/CartPage';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useClearCartMutation } from '@/lib/store/services/storefront-api';
import { getGuestCartSessionId } from '@/lib/store/services/cartSession';
import { clearCart } from '@/lib/store/slices/cartSlice';
import { useMemo } from 'react';

export default function Page() {
  const router = useRouter();
  const { handleRemoveItem, cartItems, cartSubtotal, cartCount, openShopSection } = useAppShell();

  return (
    <CartPage
      items={cartItems}
      subtotal={cartSubtotal}
      onRemoveItem={handleRemoveItem}
      onContinueShopping={openShopSection}
      onCheckout={() => {
        if (!cartItems.length) {
          window.alert('Your cart is empty.');
          return;
        }
        router.push('/checkout');
      }}
    />
  );
}
