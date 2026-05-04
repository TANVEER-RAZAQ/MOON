'use client';

import { useMemo } from 'react';
import { useAppShell } from '@/components/AppContext';
import { HomePage } from '@/components/pages/HomePage';
import { catalogItems as staticCatalogItems, productOrder } from '@/lib/data/product-statics';
import type { BackendProduct } from '@/lib/store/services/storefront-api';
import type { CatalogItem, ProductKey } from '@/lib/types';

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

const productKeyByName: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'kashmiri saffron': 'kashmiriSaffron',
  'irani saffron': 'iraniSaffron',
  'kashmiri almonds': 'kashmiriAlmonds',
  walnuts: 'walnuts',
  'kashmiri ghee': 'kashmiriGhee',
};

const fallbackByKey = staticCatalogItems.reduce<Partial<Record<ProductKey, CatalogItem>>>(
  (map, item) => { if (item.productKey) map[item.productKey] = item; return map; },
  {}
);

function normalizeLegacyPath(url: string | null | undefined) {
  if (!url) return url ?? undefined;
  return url.replace(/(\/(?:moon2222|moon333|ezgif-2fae6b36993927b6-jpg)\/ezgif-frame-\d{3})\.jpg$/i, '$1.png');
}

interface Props {
  initialProducts: BackendProduct[];
}

export function HomepageClient({ initialProducts }: Props) {
  const { setActiveProduct, handleAddCurrentStory, handleAddCatalogItem, openShopSection, handleProductClick } =
    useAppShell();

  const catalogItems = useMemo<CatalogItem[]>(() => {
    if (!initialProducts.length) return staticCatalogItems;
    const fromBackend: Partial<Record<ProductKey, CatalogItem>> = {};
    for (const product of initialProducts) {
      const key =
        (product.slug && productKeyBySlug[product.slug]) ||
        productKeyByName[product.name.trim().toLowerCase()] ||
        null;
      if (!key) continue;
      const fallback = fallbackByKey[key];
      fromBackend[key] = {
        id: product.id,
        title: product.name,
        subtitle: product.description || fallback?.subtitle || '',
        price: Number(product.discount_price ?? product.price),
        image: (normalizeLegacyPath(product.image_url) ?? fallback?.image) || '',
        alt: fallback?.alt ?? product.name,
        featured: fallback?.featured,
        productKey: key,
      };
    }
    return productOrder
      .map((key) => fromBackend[key] ?? fallbackByKey[key])
      .filter((item): item is CatalogItem => item != null);
  }, [initialProducts]);

  return (
    <HomePage
      catalogItems={catalogItems}
      onSelectProduct={setActiveProduct}
      onAddDetailToCart={handleAddCurrentStory}
      onAddCatalogToCart={handleAddCatalogItem}
      onBrowseCollection={openShopSection}
      onProductClick={handleProductClick}
    />
  );
}
