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
    return <div style={{ padding: 40, color: 'var(--terracotta)' }}>Failed to load orders.</div>;
  }

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 22px', borderBottom: '1px solid var(--line)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'capitalize',
                  padding: '5px 12px', borderRadius: 999,
                  border: '1px solid ' + (filter === f ? 'var(--ink)' : 'transparent'),
                  background: filter === f ? 'var(--ink)' : 'transparent',
                  color: filter === f ? 'var(--bg)' : 'var(--ink-2)',
                  cursor: 'pointer', transition: 'all .15s',
                }}
              >{f}</button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 240 }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: 8, fontSize: 16, color: 'var(--ink-3)' }}>search</span>
            <input
              type="text"
              placeholder="Search orders..."
              aria-label="Search orders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '6px 12px 6px 32px',
                background: 'var(--bg-sunk)', border: '1px solid var(--line)', borderRadius: 8,
                fontSize: 13, color: 'var(--ink)', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{
              fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--ink-3)', borderBottom: '1px solid var(--line)',
            }}>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Order</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Customer</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Payment</th>
              <th style={{ padding: '14px 22px', textAlign: 'right', fontWeight: 500 }}>Total</th>
              <th style={{ padding: '14px 22px', textAlign: 'center', fontWeight: 500, width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>Loading orders...</td></tr>
            ) : visibleOrders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>No orders found.</td></tr>
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
      <div style={{
        display: 'flex', gap: 24, fontSize: 12.5, color: 'var(--ink-3)',
        padding: '0 4px',
      }}>
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
        style={{
          borderBottom: isExpanded ? 'none' : '1px solid var(--line)',
          transition: 'background .15s', cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        onClick={onToggle}
      >
        <td style={{ padding: '14px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{order.order_number}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </div>
        </td>
        <td style={{ padding: '14px 22px' }}>
          <div style={{ fontSize: 13, color: 'var(--ink)' }}>{order.customer_email}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 1 }}>{order.customer_phone}</div>
        </td>
        <td style={{ padding: '14px 22px' }}>
          <div style={{ fontSize: 13, color: 'var(--ink)' }}>{formatDate(order.created_at)}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 1 }}>{formatTime(order.created_at)}</div>
        </td>
        <td style={{ padding: '14px 22px' }}>
          <Pill tone={STATUS_TONES[order.status] ?? 'neutral'}>{order.status}</Pill>
        </td>
        <td style={{ padding: '14px 22px' }}>
          <Pill tone={paymentStatus === 'captured' ? 'sage' : paymentStatus === 'failed' ? 'terracotta' : 'neutral'}>
            {paymentStatus}
          </Pill>
        </td>
        <td style={{ padding: '14px 22px', textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{currency(order.total)}</div>
        </td>
        <td style={{ padding: '14px 22px', textAlign: 'center' }}>
          <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={18} style={{ color: 'var(--ink-3)' }} />
        </td>
      </tr>

      {/* Expanded Detail */}
      {isExpanded && (
        <tr style={{ borderBottom: '1px solid var(--line)' }}>
          <td colSpan={7} style={{ padding: '0 22px 20px', background: 'var(--bg-sunk)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingTop: 16 }}>
              {/* Line Items */}
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 10 }}>
                  Line Items
                </div>
                {order.order_items.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--line)',
                    fontSize: 13,
                  }}>
                    <span style={{ color: 'var(--ink)' }}>{item.product_name} <span className="mono" style={{ color: 'var(--ink-3)' }}>×{item.quantity}</span></span>
                    <span className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{currency(item.subtotal)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-3)' }}>Subtotal</span>
                  <span className="mono" style={{ color: 'var(--ink)' }}>{currency(order.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-3)' }}>Shipping</span>
                  <span className="mono" style={{ color: 'var(--ink)' }}>{currency(order.shipping_cost)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', fontSize: 14, fontWeight: 500, borderTop: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--ink)' }}>Total</span>
                  <span className="mono" style={{ color: 'var(--ink)' }}>{currency(order.total)}</span>
                </div>
              </div>

              {/* Status Update + Notes */}
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 10 }}>
                  Update Status
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, s); }}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'capitalize',
                        padding: '5px 12px', borderRadius: 6,
                        border: '1px solid ' + (order.status === s ? 'var(--saffron)' : 'var(--line)'),
                        background: order.status === s ? 'var(--saffron-soft)' : 'var(--bg-elev)',
                        color: order.status === s ? 'var(--saffron-ink)' : 'var(--ink-2)',
                        cursor: order.status === s ? 'default' : 'pointer',
                        transition: 'all .15s',
                      }}
                    >{s}</button>
                  ))}
                </div>

                {order.tracking_number && (
                  <div style={{ marginTop: 16 }}>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 4 }}>
                      Tracking
                    </div>
                    <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink)' }}>{order.tracking_number}</div>
                  </div>
                )}

                {order.notes && (
                  <div style={{ marginTop: 16 }}>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 4 }}>
                      Notes
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{order.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
