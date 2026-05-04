'use client';

import { useAppShell } from '@/components/AppContext';
import { HomePage } from '@/components/pages/HomePage';

export default function Page() {
  const {
    catalogItems,
    setActiveProduct,
    handleAddCurrentStory,
    handleAddCatalogItem,
    openShopSection,
    handleProductClick,
  } = useAppShell();

  // AppShell detects /products/:slug in pathname and auto-opens the ProductDetailModal.
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
