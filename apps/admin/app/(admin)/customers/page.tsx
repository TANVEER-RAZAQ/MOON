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
    return <div className="p-[40px] text-[var(--terracotta)]">Failed to load customers.</div>;
  }

  return (
    <div className="anim-fade-in flex flex-col gap-6">
      <PageHeader
        eyebrow="Commerce"
        title="Customers"
        actions={[
          <Btn key="export" variant="secondary" icon="download" size="sm">Export</Btn>,
        ]}
      />

      <Card padding={0}>
        {/* Toolbar */}
        <div className="flex items-center justify-between py-4 px-5 border-b border-[var(--line)] flex-wrap gap-3">
          <div className="flex gap-1.5">
            {(['recent', 'spent', 'orders'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`mono text-[11px] py-1.5 px-3 rounded-full border transition-all duration-150 capitalize ${
                  sortBy === s 
                    ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' 
                    : 'border-transparent bg-transparent text-[var(--ink-2)]'
                }`}
              >{s === 'spent' ? 'Top spenders' : s === 'orders' ? 'Most orders' : 'Recent'}</button>
            ))}
          </div>
          <div className="relative w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-base text-[var(--ink-3)]">search</span>
            <input
              type="text"
              placeholder="Search customers..."
              aria-label="Search customers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-1.5 pr-3 pl-8 bg-[var(--bg-sunk)] border border-[var(--line)] rounded-lg text-[13px] text-[var(--ink)] outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)] border-b border-[var(--line)]">
              <th className="py-3.5 px-5 text-left font-medium">Customer</th>
              <th className="py-3.5 px-5 text-left font-medium">Email</th>
              <th className="py-3.5 px-5 text-left font-medium">Phone</th>
              <th className="py-3.5 px-5 text-right font-medium">Orders</th>
              <th className="py-3.5 px-5 text-right font-medium">Total Spent</th>
              <th className="py-3.5 px-5 text-left font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="p-10 text-center text-[var(--ink-3)]">Loading customers...</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-[var(--ink-3)]">No customers found.</td></tr>
            ) : visible.map((c) => {
              const name = getDisplayName(c.first_name, c.last_name);
              const initials = getInitials(c.first_name, c.last_name, c.email);

              return (
                <tr
                  key={c.id}
                  className="border-b border-[var(--line)] transition-colors duration-150 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-[var(--saffron)] to-[var(--terracotta)] text-[#FFF8EC] flex items-center justify-center font-display text-[13px] font-medium shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="text-[13.5px] font-medium text-[var(--ink)]">{name ?? 'Unnamed'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="text-[13px] text-[var(--ink)]">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className={`mono text-[12.5px] ${c.phone ? 'text-[var(--ink)]' : 'text-[var(--ink-4)]'}`}>
                      {c.phone ?? '—'}
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {c.orderCount > 0 ? (
                      <Pill tone="saffron">{c.orderCount}</Pill>
                    ) : (
                      <span className="text-[12.5px] text-[var(--ink-4)]">0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="mono text-[13px] font-medium text-[var(--ink)]">
                      {c.totalSpent > 0 ? currency(c.totalSpent) : '—'}
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="text-[12.5px] text-[var(--ink-2)]">{formatDate(c.created_at)}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Summary */}
      <div className="flex gap-6 text-[12.5px] text-[var(--ink-3)] px-1">
        <span>{customers?.length ?? 0} customers</span>
        <span>·</span>
        <span>
          {currency((customers || []).reduce((sum, c) => sum + c.totalSpent, 0))} lifetime revenue
        </span>
      </div>
    </div>
  );
}
