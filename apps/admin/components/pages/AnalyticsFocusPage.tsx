'use client';

import { useMemo } from 'react';
import {
  useGetAdminCustomerMetricsQuery,
  useGetAdminOrderMetricsQuery,
  useGetAdminProductMetricsQuery,
  useGetAdminRevenueMetricsQuery,
} from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card, cardStyle } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';
import { AreaChart } from '@/components/ui/AreaChart';
import { Placeholder } from '@/components/ui/Placeholder';
import type { CSSProperties } from 'react';

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

export function AnalyticsFocusPage() {
  const { data: revenue, isLoading: revenueLoading, isError: revenueError, refetch: refetchRevenue } = useGetAdminRevenueMetricsQuery(undefined);
  const { data: customers, refetch: refetchCustomers } = useGetAdminCustomerMetricsQuery(undefined);
  const { data: orders, refetch: refetchOrders } = useGetAdminOrderMetricsQuery(undefined);
  const { data: products, refetch: refetchProducts } = useGetAdminProductMetricsQuery({ limit: 8 });

  const totalOrderCount = orders?.total ?? 0;
  const conversionRate = totalOrderCount && (customers?.newCustomers ?? 0)
    ? (totalOrderCount / Math.max(customers?.newCustomers ?? 1, 1)) * 100
    : 0;

  // Synthetic chart series
  const chartSeries = useMemo(() => {
    const avg = (revenue?.totalRevenue ?? 0) / 14;
    return Array.from({ length: 14 }, () => Math.max(0, avg * (0.6 + Math.random() * 0.8)));
  }, [revenue?.totalRevenue]);

  const productRows = useMemo(
    () => {
      const total = (products ?? []).reduce((sum, p) => sum + p.unitsSold, 0);
      return (products ?? []).map((p) => ({
        ...p,
        split: total ? Math.round((p.unitsSold / total) * 100) : 0,
      }));
    },
    [products]
  );

  const statusRows = useMemo(
    () => Object.entries(orders?.byStatus ?? {}).sort((a, b) => b[1] - a[1]),
    [orders?.byStatus]
  );

  const pillTone = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'confirmed') return 'sage' as const;
    if (s === 'shipped' || s === 'packed' || s === 'fulfilled') return 'saffron' as const;
    if (s === 'cancelled' || s === 'refunded') return 'plum' as const;
    return 'gold' as const;
  };

  const onRefresh = () => { refetchRevenue(); refetchCustomers(); refetchOrders(); refetchProducts(); };

  const onExport = () => {
    const header = ['metric', 'value'];
    const rows = [
      ['Total Revenue', toCurrency(revenue?.totalRevenue ?? 0)],
      ['New Customers', String(customers?.newCustomers ?? 0)],
      ['Avg Order Value', toCurrency(revenue?.averageOrderValue ?? 0)],
      ['Conversion Rate', `${conversionRate.toFixed(2)}%`],
    ];
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'moon-analytics-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="Insights"
        title={<>Analytics <em style={{ fontStyle: 'italic', color: 'var(--saffron)' }}>focus</em>.</>}
        subtitle="One conversion funnel, one number to move this week. Distractions hidden by default."
        actions={[
          <Btn key="z" variant="ghost" icon="download" size="sm" onClick={onExport}>Export</Btn>,
          <Btn key="x" variant="primary" icon="refresh" size="sm" onClick={onRefresh}>Refresh</Btn>,
        ]}
      />

      {revenueError && (
        <div style={{
          ...(cardStyle as CSSProperties), padding: '14px 18px',
          borderColor: 'var(--terracotta)', fontSize: 13, color: 'var(--terracotta)',
        }}>
          Failed to load analytics from backend.
        </div>
      )}

      {/* Headline number */}
      <div style={{ ...(cardStyle as CSSProperties), padding: '48px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
            Total Revenue · All time
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span className="display" style={{ fontSize: 96, lineHeight: 0.9, color: 'var(--ink)', fontWeight: 400 }}>
              {revenueLoading ? '...' : toCurrency(revenue?.totalRevenue ?? 0)}
            </span>
          </div>
          <p style={{ marginTop: 18, fontSize: 14, color: 'var(--ink-2)', maxWidth: 460 }}>
            {revenue?.orderCount ? `From ${revenue.orderCount} confirmed orders.` : 'Revenue data will appear as orders come in.'}
            {' '}Average order value is <strong style={{ color: 'var(--sage)' }}>{toCurrency(revenue?.averageOrderValue ?? 0)}</strong>.
          </p>
        </div>
        <div style={{ flex: '0 0 320px' }}>
          <AreaChart data={chartSeries.length > 1 ? chartSeries : [0, 0]} height={140} accent="var(--sage)" subtle="var(--sage-soft)" />
        </div>
      </div>

      {/* Funnel / Status */}
      <Card title="Order status snapshot" subtitle={`${totalOrderCount} orders tracked`}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 1, height: 140, marginTop: 8 }}>
          {statusRows.length > 0 ? statusRows.map(([status, count], i) => {
            const pct = totalOrderCount ? (count / totalOrderCount) * 100 : 0;
            const toneColors = ['var(--saffron)', 'var(--terracotta)', 'var(--gold)', 'var(--sage)', 'var(--plum)'];
            return (
              <div key={status} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{
                  height: `${Math.max(pct, 5)}%`,
                  minHeight: 18,
                  background: toneColors[i % toneColors.length],
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.9,
                  transition: 'all .3s',
                }} />
                <div style={{ marginTop: 12, padding: '0 4px' }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{status}</div>
                  <div className="mono" style={{ fontSize: 16, color: 'var(--ink)', marginTop: 2 }}>{count}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{pct.toFixed(1)}%</div>
                </div>
              </div>
            );
          }) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
              No order data available yet.
            </div>
          )}
        </div>
      </Card>

      {/* Top products + traffic */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card title="Top sellers" subtitle="By revenue">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {productRows.length > 0 ? productRows.slice(0, 5).map((p, i) => (
              <div key={p.productId} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--line)',
              }}>
                <span className="display" style={{ fontSize: 22, color: 'var(--ink-3)', width: 28 }}>{String(i + 1).padStart(2, '0')}</span>
                <Placeholder label="" w={36} h={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.productName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.unitsSold} sold</div>
                </div>
                <span className="mono" style={{ fontSize: 13, color: 'var(--ink)' }}>{toCurrency(p.revenue)}</span>
              </div>
            )) : (
              <p style={{ padding: '16px 0', fontSize: 13, color: 'var(--ink-3)' }}>No product data yet.</p>
            )}
          </div>
        </Card>

        <Card title="Category split" subtitle="Share by units sold">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {productRows.slice(0, 5).map((c, i) => {
              const colors = ['var(--saffron)', 'var(--plum)', 'var(--sage)', 'var(--terracotta)', 'var(--gold)'];
              return (
                <div key={c.productId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: 'var(--ink)' }}>{c.productName}</span>
                    <span className="mono" style={{ color: 'var(--ink-3)' }}>{c.split}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-sunk)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(c.split * 2.5, 100)}%`, height: '100%', background: colors[i % colors.length], borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
            {!productRows.length && <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>No product data yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
