'use client';

import { useMemo, useState } from 'react';
import {
  useGetAdminCustomerMetricsQuery,
  useGetAdminOrderMetricsQuery,
  useGetAdminProductMetricsQuery,
  useGetAdminRevenueMetricsQuery,
  useGetAnalyticsTimelineQuery,
  useGetBuyersSummaryQuery,
  useGetGeoBreakdownQuery,
} from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card, cardClass } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';
import { AreaChart } from '@/components/ui/AreaChart';
import { Placeholder } from '@/components/ui/Placeholder';

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

export function AnalyticsFocusPage() {
  const [granularity, setGranularity] = useState<'day'|'week'|'month'>('day');

  const { data: revenue, isLoading: revenueLoading, isError: revenueError, refetch: refetchRevenue } = useGetAdminRevenueMetricsQuery(undefined);
  const { data: customers, refetch: refetchCustomers } = useGetAdminCustomerMetricsQuery(undefined);
  const { data: orders, refetch: refetchOrders } = useGetAdminOrderMetricsQuery(undefined);
  const { data: products, refetch: refetchProducts } = useGetAdminProductMetricsQuery({ limit: 8 });
  const { data: timelineData, refetch: refetchTimeline } = useGetAnalyticsTimelineQuery({ granularity });
  const { data: buyersData, refetch: refetchBuyers } = useGetBuyersSummaryQuery({ limit: 10 });
  const { data: geoData, refetch: refetchGeo } = useGetGeoBreakdownQuery(undefined);

  const totalOrderCount = orders?.total ?? 0;
  const conversionRate = totalOrderCount && (customers?.newCustomers ?? 0)
    ? (totalOrderCount / Math.max(customers?.newCustomers ?? 1, 1)) * 100
    : 0;

  const chartSeries = useMemo(() => {
    if (!timelineData?.timeline?.length) return [0, 0];
    return timelineData.timeline.map(t => t.revenue);
  }, [timelineData]);

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

  const onRefresh = () => { 
    refetchRevenue(); refetchCustomers(); refetchOrders(); refetchProducts(); 
    refetchTimeline(); refetchBuyers(); refetchGeo();
  };

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
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow="Insights"
        title={<>Analytics <em className="italic text-[var(--saffron)]">focus</em>.</>}
        subtitle="One conversion funnel, one number to move this week. Distractions hidden by default."
        actions={[
          <Btn key="z" variant="ghost" icon="download" size="sm" onClick={onExport}>Export</Btn>,
          <Btn key="x" variant="primary" icon="refresh" size="sm" onClick={onRefresh}>Refresh</Btn>,
        ]}
      />

      {revenueError && (
        <div className={`${cardClass} py-[14px] px-[18px] border-[var(--terracotta)] text-[13px] text-[var(--terracotta)]`}>
          Failed to load analytics from backend.
        </div>
      )}

      {/* Headline number */}
      <div className={`${cardClass} py-[48px] px-[36px] flex justify-between items-end gap-[32px]`}>
        <div>
          <div className="mono text-[11px] tracking-[0.08em] uppercase text-[var(--ink-3)] mb-[12px]">
            Total Revenue · All time
          </div>
          <div className="flex items-baseline gap-[14px]">
            <span className="display text-[96px] leading-[0.9] text-[var(--ink)] font-normal">
              {revenueLoading ? '...' : toCurrency(revenue?.totalRevenue ?? 0)}
            </span>
          </div>
          <p className="mt-[18px] text-[14px] text-[var(--ink-2)] max-w-[460px]">
            {revenue?.orderCount ? `From ${revenue.orderCount} confirmed orders.` : 'Revenue data will appear as orders come in.'}
            {' '}Average order value is <strong className="text-[var(--sage)]">{toCurrency(revenue?.averageOrderValue ?? 0)}</strong>.
          </p>
        </div>
        <div className="flex-[0_0_320px]">
          <div className="flex gap-[8px] mb-[12px] justify-end">
            <Btn size="sm" variant={granularity === 'day' ? 'primary' : 'ghost'} onClick={() => setGranularity('day')}>D</Btn>
            <Btn size="sm" variant={granularity === 'week' ? 'primary' : 'ghost'} onClick={() => setGranularity('week')}>W</Btn>
            <Btn size="sm" variant={granularity === 'month' ? 'primary' : 'ghost'} onClick={() => setGranularity('month')}>M</Btn>
          </div>
          <AreaChart data={chartSeries} height={140} accent="var(--sage)" subtle="var(--sage-soft)" />
        </div>
      </div>

      {/* Funnel / Status */}
      <Card title="Order status snapshot" subtitle={`${totalOrderCount} orders tracked`}>
        <div className="flex items-stretch gap-[1px] h-[140px] mt-[8px]">
          {statusRows.length > 0 ? statusRows.map(([status, count], i) => {
            const pct = totalOrderCount ? (count / totalOrderCount) * 100 : 0;
            const toneColors = ['var(--saffron)', 'var(--terracotta)', 'var(--gold)', 'var(--sage)', 'var(--plum)'];
            return (
              <div key={status} className="flex-1 flex flex-col justify-end">
                <div
                  className="min-h-[18px] rounded-t-[4px] opacity-90 transition-all duration-300"
                  style={{
                    height: `${Math.max(pct, 5)}%`,
                    backgroundColor: toneColors[i % toneColors.length],
                  }}
                />
                <div className="mt-[12px] px-[4px]">
                  <div className="text-[12px] text-[var(--ink-3)]">{status}</div>
                  <div className="mono text-[16px] text-[var(--ink)] mt-[2px]">{count}</div>
                  <div className="mono text-[11px] text-[var(--ink-4)]">{pct.toFixed(1)}%</div>
                </div>
              </div>
            );
          }) : (
            <div className="flex-1 flex items-center justify-center text-[var(--ink-3)] text-[13px]">
              No order data available yet.
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-[14px]">
        <Card title="Top sellers" subtitle="By revenue">
          <div className="flex flex-col">
            {productRows.length > 0 ? productRows.slice(0, 5).map((p, i) => (
              <div key={p.productId} className={`flex items-center gap-[12px] py-[11px] ${i === 0 ? '' : 'border-t border-[var(--line)]'}`}>
                <span className="display text-[22px] text-[var(--ink-3)] w-[28px]">{String(i + 1).padStart(2, '0')}</span>
                <Placeholder label="" w={36} h={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium text-[var(--ink)] whitespace-nowrap overflow-hidden text-ellipsis">{p.productName}</div>
                  <div className="text-[11.5px] text-[var(--ink-3)]">{p.unitsSold} sold</div>
                </div>
                <span className="mono text-[13px] text-[var(--ink)]">{toCurrency(p.revenue)}</span>
              </div>
            )) : (
              <p className="py-[16px] text-[13px] text-[var(--ink-3)]">No product data yet.</p>
            )}
          </div>
        </Card>

        <Card title="Category split" subtitle="Share by units sold">
          <div className="flex flex-col gap-[14px]">
            {productRows.slice(0, 5).map((c, i) => {
              const colors = ['var(--saffron)', 'var(--plum)', 'var(--sage)', 'var(--terracotta)', 'var(--gold)'];
              return (
                <div key={c.productId}>
                  <div className="flex justify-between text-[13px] mb-[6px]">
                    <span className="text-[var(--ink)]">{c.productName}</span>
                    <span className="mono text-[var(--ink-3)]">{c.split}%</span>
                  </div>
                  <div className="h-[8px] bg-[var(--bg-sunk)] rounded-[4px] overflow-hidden">
                    <div className="h-full rounded-[4px]" style={{ width: `${Math.min(c.split * 2.5, 100)}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              );
            })}
            {!productRows.length && <p className="text-[13px] text-[var(--ink-3)]">No product data yet.</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-[14px]">
        <Card title="Recent Buyers" subtitle="High-value customers">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse mt-[12px]">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--ink-3)] text-[12px]">
                  <th className="py-[8px] px-[4px] font-medium">Customer</th>
                  <th className="py-[8px] px-[4px] font-medium">Location</th>
                  <th className="py-[8px] px-[4px] font-medium">Orders</th>
                  <th className="py-[8px] px-[4px] font-medium text-right">LTV</th>
                </tr>
              </thead>
              <tbody>
                {buyersData?.buyers?.map(b => (
                  <tr key={b.email} className="border-b border-[var(--line)]">
                    <td className="py-[12px] px-[4px]">
                      <div className="text-[13px] text-[var(--ink)] font-medium">{b.name}</div>
                      <div className="text-[11px] text-[var(--ink-3)]">{b.email}</div>
                    </td>
                    <td className="py-[12px] px-[4px] text-[12px] text-[var(--ink-2)]">
                      {b.city ? `${b.city}, ${b.state}` : '—'}
                    </td>
                    <td className="py-[12px] px-[4px] text-[13px] text-[var(--ink-2)]">{b.totalOrders}</td>
                    <td className="py-[12px] px-[4px] text-[13px] text-[var(--ink)] text-right">
                      {toCurrency(b.totalSpent)}
                    </td>
                  </tr>
                ))}
                {!buyersData?.buyers?.length && (
                  <tr>
                    <td colSpan={4} className="py-[16px] px-[4px] text-[13px] text-[var(--ink-3)] text-center">No buyer data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Top Regions" subtitle="Revenue by state">
          <div className="flex flex-col gap-[12px] mt-[12px]">
            {geoData?.byState?.slice(0, 8).map((s, i) => (
              <div key={s.state} className="flex justify-between items-center">
                <div className="flex items-center gap-[8px]">
                  <span className="mono text-[var(--ink-3)] text-[11px]">{i+1}.</span>
                  <span className="text-[13px] text-[var(--ink)]">{s.state}</span>
                </div>
                <div className="text-right">
                  <div className="text-[13px] text-[var(--ink)]">{toCurrency(s.revenue)}</div>
                  <div className="text-[11px] text-[var(--ink-3)]">{s.orders} orders</div>
                </div>
              </div>
            ))}
            {!geoData?.byState?.length && (
              <p className="text-[13px] text-[var(--ink-3)]">No geo data found.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
