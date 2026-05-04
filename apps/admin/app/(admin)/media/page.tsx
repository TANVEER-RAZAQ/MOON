'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGetAdminProductsQuery } from '@/lib/store/services/admin-api';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardStyle } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Btn } from '@/components/ui/Btn';
import type { CSSProperties } from 'react';

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
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 4 }}>
            Total Images
          </div>
          <div className="display" style={{ fontSize: 32, fontWeight: 400, color: 'var(--ink)' }}>
            {isLoading ? '—' : mediaItems.length}
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 4 }}>
            Products with Images
          </div>
          <div className="display" style={{ fontSize: 32, fontWeight: 400, color: 'var(--ink)' }}>
            {isLoading ? '—' : `${productsWithImages}/${totalProducts}`}
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 4 }}>
            Missing Images
          </div>
          <div className="display" style={{ fontSize: 32, fontWeight: 400, color: totalProducts - productsWithImages > 0 ? 'var(--terracotta)' : 'var(--sage)' }}>
            {isLoading ? '—' : totalProducts - productsWithImages}
          </div>
        </Card>
      </div>

      {/* Image Grid */}
      {isLoading ? (
        <Card>
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>Loading media...</div>
        </Card>
      ) : mediaItems.length === 0 ? (
        <div style={{
          ...(cardStyle as CSSProperties),
          padding: 60,
          textAlign: 'center',
          border: '2px dashed var(--line)',
          background: 'var(--bg-sunk)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'var(--saffron-soft)', color: 'var(--saffron-ink)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18,
          }}>
            <Icon name="photo_library" size={30} />
          </div>
          <h3 className="display" style={{ margin: 0, fontSize: 22, fontWeight: 400, color: 'var(--ink)' }}>
            No images yet
          </h3>
          <p style={{ marginTop: 10, color: 'var(--ink-2)', fontSize: 14, maxWidth: 400, marginInline: 'auto' }}>
            Upload images by editing individual products. Go to Products → Edit → Media section.
          </p>
          <div style={{ marginTop: 16 }}>
            <Btn variant="primary" icon="add" onClick={() => router.push('/products')}>Go to Products</Btn>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {mediaItems.map((item, idx) => (
            <div
              key={`${item.productId}-${idx}`}
              onClick={() => router.push(`/products/${item.productId}`)}
              style={{
                position: 'relative', aspectRatio: '1',
                borderRadius: 12, overflow: 'hidden',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                transition: 'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Image src={item.url} alt={item.alt} fill style={{ objectFit: 'cover' }} />
              {/* Overlay on hover */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.6))',
                display: 'flex', alignItems: 'flex-end', padding: 10,
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', lineHeight: 1.3 }}>
                    {item.productName}
                  </div>
                  {item.isPrimary && (
                    <div style={{
                      display: 'inline-block', marginTop: 4,
                      fontSize: 9, padding: '1px 5px', borderRadius: 3,
                      background: 'var(--saffron)', color: '#fff', fontWeight: 500,
                    }}>PRIMARY</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', padding: '0 4px' }}>
        Images are uploaded via product editor. Click any image to navigate to its product.
      </div>
    </div>
  );
}
