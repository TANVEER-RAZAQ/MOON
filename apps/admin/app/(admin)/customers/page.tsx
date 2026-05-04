'use client';

import { useState } from 'react';
import { useGetAdminCustomersQuery } from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';

function currency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(first?: string | null, last?: string | null, email?: string) {
  if (first) return (first[0] + (last?.[0] ?? '')).toUpperCase();
  return (email ?? '?')[0].toUpperCase();
}

function getDisplayName(first?: string | null, last?: string | null) {
  const full = [first?.trim(), last?.trim()].filter(Boolean).join(' ');
  return full || null;
}

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'spent' | 'orders'>('recent');

  const { data: customers, isLoading, isError } = useGetAdminCustomersQuery();

  let visible = (customers || []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.email.toLowerCase().includes(q) ||
      (c.first_name ?? '').toLowerCase().includes(q) ||
      (c.last_name ?? '').toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
    );
  });

  // Sort
  if (sortBy === 'spent') {
    visible = [...visible].sort((a, b) => b.totalSpent - a.totalSpent);
  } else if (sortBy === 'orders') {
    visible = [...visible].sort((a, b) => b.orderCount - a.orderCount);
  }
  // 'recent' is default from backend

  if (isError) {
    return <div style={{ padding: 40, color: 'var(--terracotta)' }}>Failed to load customers.</div>;
  }

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="Commerce"
        title="Customers"
        actions={[
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
          <div style={{ display: 'flex', gap: 6 }}>
            {(['recent', 'spent', 'orders'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  padding: '5px 12px', borderRadius: 999,
                  border: '1px solid ' + (sortBy === s ? 'var(--ink)' : 'transparent'),
                  background: sortBy === s ? 'var(--ink)' : 'transparent',
                  color: sortBy === s ? 'var(--bg)' : 'var(--ink-2)',
                  cursor: 'pointer', transition: 'all .15s',
                  textTransform: 'capitalize',
                }}
              >{s === 'spent' ? 'Top spenders' : s === 'orders' ? 'Most orders' : 'Recent'}</button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 240 }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: 8, fontSize: 16, color: 'var(--ink-3)' }}>search</span>
            <input
              type="text"
              placeholder="Search customers..."
              aria-label="Search customers"
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
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Customer</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Phone</th>
              <th style={{ padding: '14px 22px', textAlign: 'right', fontWeight: 500 }}>Orders</th>
              <th style={{ padding: '14px 22px', textAlign: 'right', fontWeight: 500 }}>Total Spent</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>Loading customers...</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>No customers found.</td></tr>
            ) : visible.map((c) => {
              const name = getDisplayName(c.first_name, c.last_name);
              const initials = getInitials(c.first_name, c.last_name, c.email);

              return (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid var(--line)', transition: 'background .15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: 'linear-gradient(135deg, var(--saffron), var(--terracotta))',
                        color: '#FFF8EC',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 500,
                        flexShrink: 0,
                      }}>{initials}</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{name ?? 'Unnamed'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ fontSize: 13, color: 'var(--ink)' }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    <div className="mono" style={{ fontSize: 12.5, color: c.phone ? 'var(--ink)' : 'var(--ink-4)' }}>
                      {c.phone ?? '—'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px', textAlign: 'right' }}>
                    {c.orderCount > 0 ? (
                      <Pill tone="saffron">{c.orderCount}</Pill>
                    ) : (
                      <span style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>0</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 22px', textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                      {c.totalSpent > 0 ? currency(c.totalSpent) : '—'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{formatDate(c.created_at)}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 24, fontSize: 12.5, color: 'var(--ink-3)', padding: '0 4px' }}>
        <span>{customers?.length ?? 0} customers</span>
        <span>·</span>
        <span>
          {currency((customers || []).reduce((sum, c) => sum + c.totalSpent, 0))} lifetime revenue
        </span>
      </div>
    </div>
  );
}
