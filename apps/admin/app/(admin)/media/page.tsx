'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGetAdminProductsQuery } from '@/lib/store/services/admin-api';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardClass } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Btn } from '@/components/ui/Btn';

interface MediaItem {
  url: string;
  alt: string;
  productId: string;
  productName: string;
  isPrimary: boolean;
}

export default function MediaPage() {
  const router = useRouter();
  const { data: products, isLoading } = useGetAdminProductsQuery();

  // Collect all images from all products
  const mediaItems = useMemo<MediaItem[]>(() => {
    if (!products) return [];
    const items: MediaItem[] = [];
    for (const p of products) {
      if (p.images && p.images.length > 0) {
        for (let i = 0; i < p.images.length; i++) {
          const img = p.images[i];
          // Validate URL
          try { new URL(img.url); } catch { continue; }
          items.push({
            url: img.url,
            alt: img.alt || p.name,
            productId: p.id,
            productName: p.name,
            isPrimary: i === 0,
          });
        }
      } else if (p.image_url) {
        try { new URL(p.image_url); } catch { return items; }
        items.push({
          url: p.image_url,
          alt: p.name,
          productId: p.id,
          productName: p.name,
          isPrimary: true,
        });
      }
    }
    return items;
  }, [products]);

  const totalProducts = products?.length ?? 0;
  const productsWithImages = useMemo(() => {
    if (!products) return 0;
    return products.filter(p => (p.images && p.images.length > 0) || p.image_url).length;
  }, [products]);

  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow="Storefront"
        title="Media library"
        subtitle="All product images across your catalog. Click any image to edit that product."
        actions={[
          <Btn key="upload" variant="primary" icon="add_photo_alternate" size="sm" onClick={() => router.push('/products')}>
            Upload via Products
          </Btn>,
        ]}
      />

      {/* Stats */}
      <div className="flex gap-[16px]">
        <Card className="flex-1">
          <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] mb-[4px]">
            Total Images
          </div>
          <div className="display text-[32px] font-normal text-[var(--ink)]">
            {isLoading ? '—' : mediaItems.length}
          </div>
        </Card>
        <Card className="flex-1">
          <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] mb-[4px]">
            Products with Images
          </div>
          <div className="display text-[32px] font-normal text-[var(--ink)]">
            {isLoading ? '—' : `${productsWithImages}/${totalProducts}`}
          </div>
        </Card>
        <Card className="flex-1">
          <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] mb-[4px]">
            Missing Images
          </div>
          <div className={`display text-[32px] font-normal ${totalProducts - productsWithImages > 0 ? 'text-[var(--terracotta)]' : 'text-[var(--sage)]'}`}>
            {isLoading ? '—' : totalProducts - productsWithImages}
          </div>
        </Card>
      </div>

      {/* Image Grid */}
      {isLoading ? (
        <Card>
          <div className="p-[40px] text-center text-[var(--ink-3)]">Loading media...</div>
        </Card>
      ) : mediaItems.length === 0 ? (
        <div className={`${cardClass} p-[60px] text-center border-2 border-dashed border-[var(--line)] bg-[var(--bg-sunk)] rounded-[var(--radius-lg)]`}>
          <div className="w-[64px] h-[64px] rounded-[16px] bg-[var(--saffron-soft)] text-[var(--saffron-ink)] inline-flex items-center justify-center mb-[18px]">
            <Icon name="photo_library" size={30} />
          </div>
          <h3 className="display m-0 text-[22px] font-normal text-[var(--ink)]">
            No images yet
          </h3>
          <p className="mt-[10px] text-[var(--ink-2)] text-[14px] max-w-[400px] mx-auto">
            Upload images by editing individual products. Go to Products → Edit → Media section.
          </p>
          <div className="mt-[16px]">
            <Btn variant="primary" icon="add" onClick={() => router.push('/products')}>Go to Products</Btn>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-[14px]">
          {mediaItems.map((item, idx) => (
            <div
              key={`${item.productId}-${idx}`}
              onClick={() => router.push(`/products/${item.productId}`)}
              className="relative aspect-square rounded-[12px] overflow-hidden border border-[var(--line)] cursor-pointer transition-all duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] group"
            >
              <Image src={item.url} alt={item.alt} fill className="object-cover" />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.6)] flex items-end p-[10px]">
                <div>
                  <div className="text-[12px] font-medium text-white leading-[1.3]">
                    {item.productName}
                  </div>
                  {item.isPrimary && (
                    <div className="inline-block mt-[4px] text-[9px] py-[1px] px-[5px] rounded-[3px] bg-[var(--saffron)] text-white font-medium">PRIMARY</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="mono text-[11px] text-[var(--ink-4)] px-[4px]">
        Images are uploaded via product editor. Click any image to navigate to its product.
      </div>
    </div>
  );
}
