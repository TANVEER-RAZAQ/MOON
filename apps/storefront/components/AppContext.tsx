'use client';

import { createContext, useContext } from 'react';
import type { CatalogItem, CartItem, ProductKey } from '@/lib/types';

export interface AppShellContext {
  catalogItems: CatalogItem[];
  cartItems: CartItem[];
  cartSubtotal: number;
  cartCount: number;
  isCartDrawerOpen: boolean;
  resolvedProductKey: ProductKey;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  openShopSection: () => void;
  handleAddCatalogItem: (item: { id: string; title: string; price: number }) => Promise<void>;
  handleRemoveItem: (id: string) => Promise<void>;
  handleProductClick: (item: CatalogItem) => void;
  handleAddCurrentStory: () => Promise<void>;
  setActiveProduct: (key: ProductKey) => void;
}

export const AppContext = createContext<AppShellContext | null>(null);

export function useAppShell(): AppShellContext {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppShell must be used inside AppShell');
  return ctx;
}
