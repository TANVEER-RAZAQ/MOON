'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetAdminProductsQuery, useUpdateAdminProductMutation } from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Toggle } from '@/components/ui/Toggle';
import { Placeholder } from '@/components/ui/Placeholder';

type FilterType = 'all' | 'active' | 'archived';

function currency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

export default function ProductsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const { data: products, isLoading, isError } = useGetAdminProductsQuery();
  const [updateProduct] = useUpdateAdminProductMutation();

  const toggleActive = (id: string, current: boolean) => {
    updateProduct({ id, patch: { is_active: !current } });
  };

  const visibleProducts = (products || []).filter((p) => {
    if (filter === 'active' && !p.is_active) return false;
    if (filter === 'archived' && p.is_active) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  if (isError) {
    return <div className="p-[40px] text-[var(--terracotta)]">Failed to load products.</div>;
  }

  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        actions={[
          <Btn key="1" variant="secondary" icon="download" size="sm" onClick={() => {
            const headers = ['name','slug','category','price','discount_price','is_active'];
            const rows = visibleProducts.map(p => [p.name, p.slug, p.category ?? '', String(p.price), String(p.discount_price ?? ''), String(!!p.is_active)].join(','));
            const csv = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = 'moon-products.csv'; link.click();
            URL.revokeObjectURL(url);
          }}>Export</Btn>,
          <Btn key="2" variant="primary" icon="add" size="sm" onClick={() => router.push('/products/new')}>New product</Btn>,
        ]}
      />

      <Card padding={0}>
        {/* Toolbar */}
        <div className="flex items-center justify-between py-[16px] px-[22px] border-b border-[var(--line)]">
          <div className="flex gap-[6px]">
            {(['all', 'active', 'archived'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`font-mono text-[11px] capitalize py-[6px] px-[14px] rounded-full border transition-colors ${filter === f ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-transparent bg-transparent text-[var(--ink-2)]'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-[240px]">
            <span className="material-symbols-outlined absolute left-[10px] top-[8px] text-[16px] text-[var(--ink-3)]">search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-[6px] pr-[12px] pl-[32px] bg-[var(--bg-sunk)] border border-[var(--line)] rounded-[8px] text-[13px] text-[var(--ink)] outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)] border-b border-[var(--line)]">
              <th className="py-[16px] px-[22px] text-left font-medium w-[40px]" />
              <th className="py-[16px] px-[22px] text-left font-medium">Product</th>
              <th className="py-[16px] px-[22px] text-left font-medium">Status</th>
              <th className="py-[16px] px-[22px] text-left font-medium">Category</th>
              <th className="py-[16px] px-[22px] text-right font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-[40px] text-center text-[var(--ink-3)]">Loading products...</td></tr>
            ) : visibleProducts.length === 0 ? (
              <tr><td colSpan={5} className="p-[40px] text-center text-[var(--ink-3)]">No products found.</td></tr>
            ) : visibleProducts.map((p) => {
              const rawThumb = p.images?.[0]?.url || p.image_url;
              const isFallback = p.images?.[0]?.isFallback === true;
              const thumb = (() => { try { new URL(rawThumb!); return rawThumb; } catch { return null; } })();
              
              return (
                <tr
                  key={p.id}
                  className="border-b border-[var(--line)] transition-colors duration-150 cursor-pointer hover:bg-[var(--bg-hover)]"
                  onClick={(e) => {
                    // Don't navigate if clicking the toggle
                    if ((e.target as HTMLElement).closest('button[role="switch"]')) return;
                    router.push(`/products/${p.id}`);
                  }}
                >
                  <td className="py-[14px] px-[22px]">
                    {thumb ? (
                      <div className="relative w-[44px] h-[44px] rounded-[8px] overflow-hidden border border-[var(--line)]">
                        <Image src={thumb} alt={p.name} width={44} height={44} className="w-full h-full object-cover" />
                        {isFallback && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/55 text-white text-[7px] text-center py-[1px] tracking-[0.05em] font-semibold">STOCK</div>
                        )}
                      </div>
                    ) : (
                      <Placeholder label="IMG" w={44} h={44} />
                    )}
                  </td>
                  <td className="py-[14px] px-[22px]">
                    <div className="text-[14px] font-medium text-[var(--ink)]">{p.name}</div>
                    <div className="mono text-[11.5px] text-[var(--ink-3)] mt-[2px]">{p.slug}</div>
                  </td>
                  <td className="py-[14px] px-[22px]">
                    <div className="flex items-center gap-[8px]">
                      <Toggle checked={!!p.is_active} onChange={() => toggleActive(p.id, !!p.is_active)} />
                      <span className={`text-[13px] ${p.is_active ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]'}`}>
                        {p.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </td>
                  <td className="py-[14px] px-[22px]">
                    {p.category ? <Pill tone="neutral">{p.category}</Pill> : <span className="text-[var(--ink-4)]">—</span>}
                  </td>
                  <td className="py-[14px] px-[22px] text-right">
                    <div className="mono text-[13px] text-[var(--ink)]">{currency(p.discount_price ?? p.price)}</div>
                    {p.discount_price && <div className="mono text-[11px] text-[var(--ink-4)] line-through">{currency(p.price)}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
