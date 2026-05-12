'use client';

import { useState } from 'react';
import { useGetAdminOrdersQuery, useUpdateAdminOrderStatusMutation } from '@/lib/store/services/admin-api';
import type { AdminOrder } from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_TONES: Record<string, 'saffron' | 'sage' | 'plum' | 'terracotta' | 'gold' | 'neutral'> = {
  pending: 'saffron',
  confirmed: 'gold',
  packed: 'plum',
  shipped: 'sage',
  delivered: 'sage',
  cancelled: 'terracotta',
};

const STATUS_OPTIONS: StatusFilter[] = ['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

function currency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: orders, isLoading, isError } = useGetAdminOrdersQuery();
  const [updateStatus] = useUpdateAdminOrderStatusMutation();

  const visibleOrders = (orders || []).filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus({ id: orderId, status: newStatus });
  };

  if (isError) {
    return <div className="p-[40px] text-[var(--terracotta)]">Failed to load orders.</div>;
  }

  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow="Commerce"
        title="Orders"
        actions={[
          <Btn key="refresh" variant="secondary" icon="refresh" size="sm">Refresh</Btn>,
          <Btn key="export" variant="secondary" icon="download" size="sm">Export</Btn>,
        ]}
      />

      <Card padding={0}>
        {/* Toolbar */}
        <div className="flex items-center justify-between py-[16px] px-[22px] border-b border-[var(--line)] flex-wrap gap-[12px]">
          <div className="flex gap-[4px] flex-wrap">
            {STATUS_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-[11px] capitalize py-[5px] px-[12px] rounded-full border transition-all duration-150 cursor-pointer ${filter === f ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-transparent bg-transparent text-[var(--ink-2)]'}`}
              >{f}</button>
            ))}
          </div>
          <div className="relative w-[240px]">
            <span className="material-symbols-outlined absolute left-[10px] top-[8px] text-[16px] text-[var(--ink-3)]">search</span>
            <input
              type="text"
              placeholder="Search orders..."
              aria-label="Search orders"
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
              <th className="py-[14px] px-[22px] text-left font-medium">Order</th>
              <th className="py-[14px] px-[22px] text-left font-medium">Customer</th>
              <th className="py-[14px] px-[22px] text-left font-medium">Date</th>
              <th className="py-[14px] px-[22px] text-left font-medium">Status</th>
              <th className="py-[14px] px-[22px] text-left font-medium">Payment</th>
              <th className="py-[14px] px-[22px] text-right font-medium">Total</th>
              <th className="py-[14px] px-[22px] text-center font-medium w-[40px]" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="p-[40px] text-center text-[var(--ink-3)]">Loading orders...</td></tr>
            ) : visibleOrders.length === 0 ? (
              <tr><td colSpan={7} className="p-[40px] text-center text-[var(--ink-3)]">No orders found.</td></tr>
            ) : visibleOrders.map((order) => {
              const isExpanded = expandedId === order.id;
              const paymentStatus = order.payments?.[0]?.status ?? 'pending';
              const itemCount = order.order_items?.length ?? 0;

              return (
                <OrderRow
                  key={order.id}
                  order={order}
                  isExpanded={isExpanded}
                  paymentStatus={paymentStatus}
                  itemCount={itemCount}
                  onToggle={() => setExpandedId(isExpanded ? null : order.id)}
                  onStatusChange={handleStatusChange}
                />
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Summary bar */}
      <div className="flex gap-[24px] text-[12.5px] text-[var(--ink-3)] px-[4px]">
        <span>{orders?.length ?? 0} total orders</span>
        <span>·</span>
        <span>
          {currency((orders || []).reduce((sum, o) => sum + Number(o.total || 0), 0))} gross revenue
        </span>
      </div>
    </div>
  );
}

/* ─── Order Row (with inline expansion) ───────────────────────────── */
interface OrderRowProps {
  order: AdminOrder;
  isExpanded: boolean;
  paymentStatus: string;
  itemCount: number;
  onToggle: () => void;
  onStatusChange: (id: string, status: string) => void;
}

function OrderRow({ order, isExpanded, paymentStatus, itemCount, onToggle, onStatusChange }: OrderRowProps) {
  return (
    <>
      <tr
        className={`transition-colors duration-150 cursor-pointer hover:bg-[var(--bg-hover)] ${isExpanded ? 'border-none' : 'border-b border-[var(--line)]'}`}
        onClick={onToggle}
      >
        <td className="py-[14px] px-[22px]">
          <div className="text-[13px] font-medium text-[var(--ink)]">{order.order_number}</div>
          <div className="mono text-[11px] text-[var(--ink-4)] mt-[2px]">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </div>
        </td>
        <td className="py-[14px] px-[22px]">
          <div className="text-[13px] text-[var(--ink)]">{order.customer_email}</div>
          <div className="mono text-[11px] text-[var(--ink-4)] mt-[1px]">{order.customer_phone}</div>
        </td>
        <td className="py-[14px] px-[22px]">
          <div className="text-[13px] text-[var(--ink)]">{formatDate(order.created_at)}</div>
          <div className="mono text-[11px] text-[var(--ink-4)] mt-[1px]">{formatTime(order.created_at)}</div>
        </td>
        <td className="py-[14px] px-[22px]">
          <Pill tone={STATUS_TONES[order.status] ?? 'neutral'}>{order.status}</Pill>
        </td>
        <td className="py-[14px] px-[22px]">
          <Pill tone={paymentStatus === 'captured' ? 'sage' : paymentStatus === 'failed' ? 'terracotta' : 'neutral'}>
            {paymentStatus}
          </Pill>
        </td>
        <td className="py-[14px] px-[22px] text-right">
          <div className="mono text-[13px] font-medium text-[var(--ink)]">{currency(order.total)}</div>
        </td>
        <td className="py-[14px] px-[22px] text-center">
          <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={18} className="text-[var(--ink-3)]" />
        </td>
      </tr>

      {/* Expanded Detail */}
      {isExpanded && (
        <tr className="border-b border-[var(--line)]">
          <td colSpan={7} className="px-[22px] pb-[20px] bg-[var(--bg-sunk)]">
            <div className="grid grid-cols-3 gap-[24px] pt-[16px]">
              {/* Line Items */}
              <div>
                <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] mb-[10px]">
                  Line Items
                </div>
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-[8px] border-b border-[var(--line)] text-[13px]">
                    <span className="text-[var(--ink)]">{item.product_name} <span className="mono text-[var(--ink-3)]">×{item.quantity}</span></span>
                    <span className="mono text-[var(--ink)] font-medium">{currency(item.subtotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-[10px] text-[13px]">
                  <span className="text-[var(--ink-3)]">Subtotal</span>
                  <span className="mono text-[var(--ink)]">{currency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between py-[4px] text-[13px]">
                  <span className="text-[var(--ink-3)]">Shipping</span>
                  <span className="mono text-[var(--ink)]">{currency(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between pt-[8px] text-[14px] font-medium border-t border-[var(--line)]">
                  <span className="text-[var(--ink)]">Total</span>
                  <span className="mono text-[var(--ink)]">{currency(order.total)}</span>
                </div>
              </div>

              {/* Status Update + Notes */}
              <div>
                <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] mb-[10px]">
                  Update Status
                </div>
                <div className="flex gap-[6px] flex-wrap">
                  {(['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, s); }}
                      className={`font-mono text-[11px] capitalize py-[5px] px-[12px] rounded-[6px] border transition-all duration-150 ${order.status === s ? 'border-[var(--saffron)] bg-[var(--saffron-soft)] text-[var(--saffron-ink)] cursor-default' : 'border-[var(--line)] bg-[var(--bg-elev)] text-[var(--ink-2)] cursor-pointer'}`}
                    >{s}</button>
                  ))}
                </div>

                {order.tracking_number && (
                  <div className="mt-[16px]">
                    <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] mb-[4px]">
                      Tracking
                    </div>
                    <div className="mono text-[12.5px] text-[var(--ink)]">{order.tracking_number}</div>
                  </div>
                )}

                {order.notes && (
                  <div className="mt-[16px]">
                    <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] mb-[4px]">
                      Notes
                    </div>
                    <div className="text-[13px] text-[var(--ink-2)] leading-[1.5]">{order.notes}</div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div>
                <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] mb-[10px]">
                  Ship To
                </div>
                {order.shipping_address ? (
                  <address className="not-italic text-[13px] text-[var(--ink-2)] leading-[1.7]">
                    <div className="font-semibold text-[var(--ink)]">{order.shipping_address.full_name}</div>
                    <div>{order.shipping_address.phone}</div>
                    <div>{order.shipping_address.line_1}</div>
                    {order.shipping_address.line_2 && <div>{order.shipping_address.line_2}</div>}
                    <div>{order.shipping_address.city}, {order.shipping_address.state}</div>
                    <div>{order.shipping_address.postal_code}</div>
                  </address>
                ) : (
                  <div className="text-[12px] text-[var(--ink-4)]">No address on file</div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
