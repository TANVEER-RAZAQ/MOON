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
    return <div style={{ padding: 40, color: 'var(--terracotta)' }}>Failed to load categories.</div>;
  }

  const totalProducts = (categories || []).reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        subtitle="Product categories are derived from your catalog. Manage them by editing individual products."
        actions={[
          <Btn key="refresh" variant="secondary" icon="refresh" size="sm">Refresh</Btn>,
        ]}
      />

      {/* Stats Strip */}
      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 4 }}>
            Categories
          </div>
          <div className="display" style={{ fontSize: 32, fontWeight: 400, color: 'var(--ink)' }}>
            {isLoading ? '—' : categories?.length ?? 0}
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 4 }}>
            Total Products
          </div>
          <div className="display" style={{ fontSize: 32, fontWeight: 400, color: 'var(--ink)' }}>
            {isLoading ? '—' : totalProducts}
          </div>
        </Card>
      </div>

      {/* Category Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {isLoading ? (
          <Card>
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--ink-3)' }}>Loading categories...</div>
          </Card>
        ) : (categories || []).length === 0 ? (
          <Card>
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--ink-3)' }}>No categories found. Add products with category fields.</div>
          </Card>
        ) : (categories || []).map((cat) => (
          <Card key={cat.name}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--saffron-soft)', color: 'var(--saffron-ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="category" size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>{cat.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                    {cat.productCount} product{cat.productCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <Pill tone={cat.activeCount === cat.productCount ? 'sage' : 'saffron'}>
                {cat.activeCount}/{cat.productCount} active
              </Pill>
            </div>

            {cat.themes.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {cat.themes.map((theme) => (
                  <Pill key={theme} tone="plum" size="sm">{theme}</Pill>
                ))}
              </div>
            )}

            {/* Usage bar */}
            <div style={{ marginTop: 14 }}>
              <div style={{
                height: 4, borderRadius: 2, background: 'var(--bg-sunk)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${totalProducts > 0 ? (cat.productCount / totalProducts * 100) : 0}%`,
                  background: 'linear-gradient(90deg, var(--saffron), var(--terracotta))',
                  transition: 'width .3s ease',
                }} />
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 4 }}>
                {totalProducts > 0 ? Math.round(cat.productCount / totalProducts * 100) : 0}% of catalog
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
