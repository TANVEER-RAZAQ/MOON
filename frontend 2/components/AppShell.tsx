'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { ProductDetailModal } from './ProductDetailModal';
import { AppContext } from './AppContext';
import { catalogItems as staticCatalogItems, productOrder, productStories } from '@/lib/data/products';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  useAddCartItemMutation,
  useClearCartMutation,
  useGetCartQuery,
  useGetProductsQuery,
  useRemoveCartItemMutation,
} from '@/lib/store/services/api';
import { getGuestCartSessionId } from '@/lib/store/services/cartSession';
import { addItem, clearCart, removeItem, setItems } from '@/lib/store/slices/cartSlice';
import type { BackendCartItem, BackendProduct } from '@/lib/store/services/api';
import type { CatalogItem, ProductKey } from '@/lib/types';
import type { ReactNode } from 'react';

const productKeyBySlug: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'kashmiri-saffron': 'kashmiriSaffron',
  'kashmiri-honey': 'kashmiriHoney',
  'irani-saffron': 'iraniSaffron',
  'kashmiri-almonds': 'kashmiriAlmonds',
  walnuts: 'walnuts',
  'kashmiri-walnuts': 'walnuts',
  'kashmiri-ghee': 'kashmiriGhee',
};

const slugByProductKey: Partial<Record<ProductKey, string>> = {
  shilajit: 'shilajit',
  kashmiriSaffron: 'kashmiri-saffron',
  kashmiriHoney: 'kashmiri-honey',
  iraniSaffron: 'irani-saffron',
  kashmiriAlmonds: 'kashmiri-almonds',
  walnuts: 'kashmiri-walnuts',
  kashmiriGhee: 'kashmiri-ghee',
};

const productKeyByName: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'kashmiri saffron': 'kashmiriSaffron',
  'irani saffron': 'iraniSaffron',
  'kashmiri almonds': 'kashmiriAlmonds',
  walnuts: 'walnuts',
  'kashmiri ghee': 'kashmiriGhee',
};

const fallbackCatalogByKey = staticCatalogItems.reduce((map, item) => {
  if (item.productKey) map[item.productKey] = item;
  return map;
}, {} as Record<ProductKey, CatalogItem>);

function trackEvent(eventName: string, payload: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof (window as typeof window & { gtag?: Function }).gtag === 'function') {
    (window as typeof window & { gtag: Function }).gtag('event', eventName, {
      event_category: 'ecommerce',
      ...payload,
    });
  }
}

function normalizeLegacyFramePath(imageUrl: string | null | undefined) {
  if (!imageUrl) return imageUrl ?? undefined;
  return imageUrl.replace(
    /(\/(?:moon2222|moon333|ezgif-2fae6b36993927b6-jpg)\/ezgif-frame-\d{3})\.jpg$/i,
    '$1.png'
  );
}

function inferProductKey(product: BackendProduct): ProductKey | null {
  if (product.slug && productKeyBySlug[product.slug]) return productKeyBySlug[product.slug];
  const normalizedName = product.name.trim().toLowerCase();
  if (productKeyByName[normalizedName]) return productKeyByName[normalizedName];
  return null;
}

function mapBackendCartItems(items: BackendCartItem[], catalog: CatalogItem[] = []) {
  const catalogById = catalog.reduce((map, ci) => { map[ci.id] = ci; return map; }, {} as Record<string, CatalogItem>);
  return items.map((item) => ({
    id: item.productId,
    itemId: item.itemId,
    title: item.productName,
    price: Number(item.price),
    quantity: item.quantity,
    image: catalogById[item.productId]?.image,
  }));
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const guestSessionId = useMemo(() => getGuestCartSessionId(), []);

  const [activeProduct, setActiveProduct] = useState<ProductKey>('shilajit');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);

  const { data: backendProducts } = useGetProductsQuery();
  const { data: backendCartItems, isSuccess: isCartLoaded } = useGetCartQuery({ sessionId: guestSessionId });
  const [addCartItemMutation] = useAddCartItemMutation();
  const [removeCartItemMutation] = useRemoveCartItemMutation();
  const [clearCartMutation] = useClearCartMutation();

  const catalogItems = useMemo(() => {
    if (!backendProducts || backendProducts.length === 0) return staticCatalogItems;
    const fromBackend: Partial<Record<ProductKey, CatalogItem>> = {};
    backendProducts.forEach((product) => {
      const key = inferProductKey(product);
      if (!key) return;
      const fallback = fallbackCatalogByKey[key];
      fromBackend[key] = {
        id: product.id,
        title: product.name,
        subtitle: product.description || fallback.subtitle,
        price: Number(product.discount_price ?? product.price),
        image: normalizeLegacyFramePath(product.image_url) || fallback.image,
        alt: fallback.alt,
        featured: fallback.featured,
        productKey: key,
      };
    });
    return productOrder.map((key) => fromBackend[key] ?? fallbackCatalogByKey[key]).filter(Boolean);
  }, [backendProducts]);

  const catalogByProductKey = useMemo(
    () =>
      catalogItems.reduce((map, item) => {
        if (item.productKey) map[item.productKey] = { id: item.id, title: item.title, price: item.price };
        return map;
      }, {} as Partial<Record<ProductKey, { id: string; title: string; price: number }>>),
    [catalogItems]
  );

  const resolvedProductKey: ProductKey = useMemo(() => {
    const current = String(activeProduct);
    return (productOrder as string[]).includes(current) ? activeProduct : 'shilajit';
  }, [activeProduct]);

  const activeStory = productStories[resolvedProductKey] ?? productStories.shilajit;
  const isAdminRoute = pathname.startsWith('/admin');

  useRevealAnimation();

  useEffect(() => {
    if (isCartLoaded && backendCartItems) {
      dispatch(setItems(mapBackendCartItems(backendCartItems, catalogItems)));
    }
  }, [backendCartItems, catalogItems, dispatch, isCartLoaded]);

  useEffect(() => {
    if (activeStory?.theme) {
      document.body.dataset.theme = activeStory.theme;
    }
  }, [activeStory]);

  useEffect(() => {
    const updateNavbarOnScroll = () => {
      const navbar = document.getElementById('navbar');
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    };
    updateNavbarOnScroll();
    window.addEventListener('scroll', updateNavbarOnScroll);
    return () => window.removeEventListener('scroll', updateNavbarOnScroll);
  }, []);

  // Handle hash-based scroll on route change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else if (pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname]);

  useEffect(() => {
    if (isAdminRoute && isCartDrawerOpen) setIsCartDrawerOpen(false);
  }, [isAdminRoute, isCartDrawerOpen]);

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isCartDrawerOpen]);

  // Auto-open product modal when navigating directly to /products/:slug
  useEffect(() => {
    const match = pathname.match(/^\/products\/(.+)$/);
    if (!match) return;
    const slug = match[1];
    const productKey = productKeyBySlug[slug];
    if (!productKey) return;
    const item = catalogItems.find((ci) => ci.productKey === productKey);
    if (item && (!selectedProduct || selectedProduct.productKey !== productKey)) {
      setSelectedProduct(item);
      setIsCartDrawerOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, catalogItems]);

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const openCartDrawer = () => {
    trackEvent('view_cart', { items: cartCount, value: cartSubtotal });
    setIsCartDrawerOpen(true);
  };

  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const openShopSection = () => {
    closeCartDrawer();
    router.push('/#shop');
  };

  const handleAddCatalogItem = async (item: { id: string; title: string; price: number }) => {
    const image = catalogItems.find((ci) => ci.id === item.id)?.image;
    let syncedWithServer = false;
    try {
      const updatedCart = await addCartItemMutation({
        sessionId: guestSessionId,
        productId: item.id,
        quantity: 1,
      }).unwrap();
      dispatch(setItems(mapBackendCartItems(updatedCart, catalogItems)));
      syncedWithServer = true;
    } catch {
      dispatch(addItem({ ...item, image }));
    }
    trackEvent('add_to_cart', {
      product_name: item.title,
      value: item.price,
      source: syncedWithServer ? 'backend' : 'local-fallback',
    });
    setIsCartDrawerOpen(true);
  };

  const handleProductClick = (item: CatalogItem) => {
    setSelectedProduct(item);
    setIsCartDrawerOpen(false);
    if (item.productKey) {
      const slug = slugByProductKey[item.productKey];
      if (slug && pathname !== `/products/${slug}`) {
        router.push(`/products/${slug}`);
      }
    }
  };

  const handleAddCurrentStory = async () => {
    const storyItem = catalogByProductKey[resolvedProductKey];
    if (!storyItem) return;
    await handleAddCatalogItem(storyItem);
  };

  const handleRemoveItem = async (id: string) => {
    const removed = cartItems.find((item) => item.id === id);
    if (!removed) return;
    if (removed.itemId) {
      try {
        const updated = await removeCartItemMutation({
          sessionId: guestSessionId,
          itemId: removed.itemId,
        }).unwrap();
        dispatch(setItems(mapBackendCartItems(updated, catalogItems)));
      } catch {
        dispatch(removeItem(id));
      }
    } else {
      dispatch(removeItem(id));
    }
    trackEvent('remove_from_cart', { product_name: removed.title, value: removed.price });
  };

  const contextValue = {
    catalogItems,
    cartItems,
    cartSubtotal,
    cartCount,
    isCartDrawerOpen,
    resolvedProductKey,
    openCartDrawer,
    closeCartDrawer,
    openShopSection,
    handleAddCatalogItem,
    handleRemoveItem,
    handleProductClick,
    handleAddCurrentStory,
    setActiveProduct,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <a className="skip-link" href="#main-content">Skip to content</a>

      {!isAdminRoute ? (
        <Navbar
          cartCount={cartCount}
          onCartClick={openCartDrawer}
          onSearchClick={openShopSection}
          onAccountClick={() => {}}
          heroTheme="light"
        />
      ) : null}

      {children}

      {!isAdminRoute ? (
        <CartDrawer
          isOpen={isCartDrawerOpen}
          items={cartItems}
          subtotal={cartSubtotal}
          onClose={closeCartDrawer}
          onRemoveItem={handleRemoveItem}
          onContinueShopping={openShopSection}
          onCheckout={() => {
            if (!cartItems.length) {
              window.alert('Your cart is empty.');
              return;
            }
            trackEvent('begin_checkout', { items: cartCount, value: cartSubtotal });
            closeCartDrawer();
            router.push('/checkout');
          }}
        />
      ) : null}

      {!isAdminRoute && selectedProduct && (
        <ProductDetailModal
          item={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            if (pathname.startsWith('/products/')) {
              router.replace('/#shop');
            }
          }}
          onAddToCart={async (item) => {
            setSelectedProduct(null);
            if (pathname.startsWith('/products/')) {
              router.replace('/#shop');
            }
            await handleAddCatalogItem(item);
          }}
        />
      )}

      {!isAdminRoute ? <Footer /> : null}
    </AppContext.Provider>
  );
}
