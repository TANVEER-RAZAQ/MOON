'use client';

import { useGetAdminCategoriesQuery } from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useGetAdminCategoriesQuery();

  if (isError) {
    return <div className="p-[40px] text-[var(--terracotta)]">Failed to load categories.</div>;
  }

  const totalProducts = (categories || []).reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="anim-fade-in flex flex-col gap-6">
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        subtitle="Product categories are derived from your catalog. Manage them by editing individual products."
        actions={[
          <Btn key="refresh" variant="secondary" icon="refresh" size="sm">Refresh</Btn>,
        ]}
      />

      {/* Stats Strip */}
      <div className="flex gap-4">
        <Card className="flex-1">
          <div className="mono text-[10px] tracking-widest uppercase text-[var(--ink-4)] mb-1">
            Categories
          </div>
          <div className="display text-3xl font-normal text-[var(--ink)]">
            {isLoading ? '—' : categories?.length ?? 0}
          </div>
        </Card>
        <Card className="flex-1">
          <div className="mono text-[10px] tracking-widest uppercase text-[var(--ink-4)] mb-1">
            Total Products
          </div>
          <div className="display text-3xl font-normal text-[var(--ink)]">
            {isLoading ? '—' : totalProducts}
          </div>
        </Card>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {isLoading ? (
          <Card>
            <div className="p-5 text-center text-[var(--ink-3)]">Loading categories...</div>
          </Card>
        ) : (categories || []).length === 0 ? (
          <Card>
            <div className="p-5 text-center text-[var(--ink-3)]">No categories found. Add products with category fields.</div>
          </Card>
        ) : (categories || []).map((cat) => (
          <Card key={cat.name}>
            <div className="flex items-start justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[10px] bg-[var(--saffron-soft)] text-[var(--saffron-ink)] flex items-center justify-center">
                  <Icon name="category" size={20} />
                </div>
                <div>
                  <div className="text-[15px] font-medium text-[var(--ink)]">{cat.name}</div>
                  <div className="mono text-[11px] text-[var(--ink-3)] mt-0.5">
                    {cat.productCount} product{cat.productCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <Pill tone={cat.activeCount === cat.productCount ? 'sage' : 'saffron'}>
                {cat.activeCount}/{cat.productCount} active
              </Pill>
            </div>

            {cat.themes.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {cat.themes.map((theme) => (
                  <Pill key={theme} tone="plum" size="sm">{theme}</Pill>
                ))}
              </div>
            )}

            {/* Usage bar */}
            <div className="mt-3.5">
              <div className="h-1 rounded-sm bg-[var(--bg-sunk)] overflow-hidden">
                <div className="h-full rounded-sm transition-all duration-300 ease-in-out bg-gradient-to-r from-[var(--saffron)] to-[var(--terracotta)]" style={{
                  width: `${totalProducts > 0 ? (cat.productCount / totalProducts * 100) : 0}%`,
                }} />
              </div>
              <div className="mono text-[10px] text-[var(--ink-4)] mt-1">
                {totalProducts > 0 ? Math.round(cat.productCount / totalProducts * 100) : 0}% of catalog
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
