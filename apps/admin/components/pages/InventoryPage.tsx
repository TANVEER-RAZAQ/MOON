'use client';

import { useMemo, useState } from 'react';
import { useGetInventoryQuery, useUpdateInventoryMutation } from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card, cardClass } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';
import { StatCard } from '@/components/ui/StatCard';
import { Bars } from '@/components/ui/Bars';
import { Placeholder } from '@/components/ui/Placeholder';

type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface InventoryRow {
  id: string;
  name: string;
  subtitle: string;
  sku: string;
  slug: string;
  stock: number;
  reserved: number;
  available: number;
  status: InventoryStatus;
}

function inferStatus(quantity: number): InventoryStatus {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity < 10) return 'Low Stock';
  return 'In Stock';
}

function exportInventoryCsv(rows: InventoryRow[]) {
  const headers = ['product_name', 'sku', 'quantity', 'reserved', 'available', 'status'];
  const csvRows = rows.map((row) => [row.name, row.sku, String(row.stock), String(row.reserved), String(row.available), row.status].join(','));
  const csv = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'moon-inventory-report.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function InventoryPage() {
  const [filter, setFilter] = useState<'all' | 'critical'>('all');
  const [rowError, setRowError] = useState('');
  const [pendingQty, setPendingQty] = useState<Map<string, number>>(new Map());

  const getPending = (id: string, stock: number) =>
    pendingQty.has(id) ? pendingQty.get(id)! : stock;

  const { data: inventory, isLoading, isError, refetch } = useGetInventoryQuery();
  const [updateInventory, { isLoading: isUpdating }] = useUpdateInventoryMutation();

  const rows = useMemo<InventoryRow[]>(() => {
    return (inventory ?? []).map((item) => {
      const quantity = Number(item.quantity ?? 0);
      const reserved = Number(item.reserved ?? 0);
      return {
        id: item.id,
        name: item.products?.name ?? 'Unknown Product',
        subtitle: item.products?.category ?? 'No category',
        sku: item.sku,
        slug: item.products?.slug ?? '',
        stock: quantity,
        reserved,
        available: Math.max(quantity - reserved, 0),
        status: inferStatus(quantity),
      };
    });
  }, [inventory]);

  const visibleRows = useMemo(() => {
    if (filter === 'all') return rows;
    return rows.filter((row) => row.status !== 'In Stock');
  }, [rows, filter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const lowOrOut = rows.filter((row) => row.status !== 'In Stock').length;
    const totalQty = rows.reduce((sum, row) => sum + row.stock, 0);
    const outOfStock = rows.filter((row) => row.stock === 0).length;
    return { total, lowOrOut, totalQty, outOfStock };
  }, [rows]);

  const velocitySeries = useMemo(() => {
    return rows.map((r) => r.stock).slice(0, 30);
  }, [rows]);

  const updateStock = async (row: InventoryRow, nextQty: number) => {
    setRowError('');
    try {
      await updateInventory({ id: row.id, quantity: Math.max(nextQty, 0) }).unwrap();
      await refetch();
    } catch {
      setRowError(`Could not update inventory for ${row.name}.`);
    }
  };

  const lowStockRows = rows.filter((r) => r.stock <= 10 && r.stock >= 0);

  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow="Catalog"
        title="Inventory"
        subtitle="Stock levels across the catalog. We will alert you when items dip below their reorder threshold."
        actions={[
          <Btn key="a" variant="secondary" icon="download" size="sm" onClick={() => exportInventoryCsv(visibleRows)}>Export</Btn>,
          <Btn key="b" variant="primary" icon="add_box" size="sm" onClick={() => refetch()}>Refresh</Btn>,
        ]}
      />

      {isError && (
        <div className={`${cardClass} py-[14px] px-[18px] !border-[var(--terracotta)] text-[13px] text-[var(--terracotta)]`}>
          Unable to load inventory from backend.
        </div>
      )}

      {rowError && (
        <div className={`${cardClass} py-[14px] px-[18px] !border-[var(--gold)] text-[13px] text-[var(--gold)]`}>
          {rowError}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-[14px]">
        <StatCard label="Total units" value={isLoading ? '...' : stats.totalQty.toLocaleString()} sub={`across ${stats.total} SKUs`} tone="ink" />
        <StatCard label="Low stock" value={isLoading ? '...' : String(stats.lowOrOut)} sub="≤ 10 units left" tone="gold" />
        <StatCard label="Out of stock" value={isLoading ? '...' : String(stats.outOfStock)} sub="reorder needed" tone="terracotta" />
      </div>

      {/* Stock alerts */}
      <Card title="Stock alerts" subtitle="Items at or below their reorder threshold" action={
        <div className="flex gap-[6px]">
          <button 
            onClick={() => setFilter('all')} 
            className={`font-mono text-[11px] py-[4px] px-[10px] rounded-full border cursor-pointer ${filter === 'all' ? 'border-[var(--saffron)] bg-[var(--saffron-soft)] text-[var(--saffron-ink)]' : 'border-[var(--line)] bg-transparent text-[var(--ink-3)]'}`}
          >All</button>
          <button 
            onClick={() => setFilter('critical')} 
            className={`font-mono text-[11px] py-[4px] px-[10px] rounded-full border cursor-pointer ${filter === 'critical' ? 'border-[var(--terracotta)] bg-[rgba(181,87,58,0.1)] text-[var(--terracotta)]' : 'border-[var(--line)] bg-transparent text-[var(--ink-3)]'}`}
          >Low/Out</button>
        </div>
      }>
        <div className="flex flex-col">
          {visibleRows.map((row, i) => (
            <div key={row.id} className={`grid grid-cols-[50px_1fr_100px_140px_120px] items-center gap-[16px] py-[12px] ${i === 0 ? 'border-none' : 'border-t border-[var(--line)]'}`}>
              <Placeholder label="" w={42} h={42} />
              <div>
                <div className="text-[14px] font-medium">{row.name}</div>
                <div className="mono text-[11.5px] text-[var(--ink-3)]">{row.sku}</div>
              </div>
              <Pill tone="neutral">{row.subtitle}</Pill>
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => setPendingQty(m => { const n = new Map(m); n.set(row.id, Math.max(0, getPending(row.id, row.stock) - 1)); return n; })}
                  disabled={isUpdating}
                  className="w-[26px] h-[26px] rounded-[6px] border border-[var(--line-strong)] bg-[var(--bg-elev)] text-[var(--ink-2)] cursor-pointer flex items-center justify-center text-[14px] font-medium"
                >−</button>
                <input
                  type="number"
                  min="0"
                  value={getPending(row.id, row.stock)}
                  onChange={e => setPendingQty(m => { const n = new Map(m); n.set(row.id, Math.max(0, Number(e.target.value))); return n; })}
                  className="w-[52px] text-center border border-[var(--line)] rounded-[6px] bg-[var(--bg-elev)] py-[2px] px-[4px] text-[13px] font-mono"
                  style={{ color: row.stock === 0 ? 'var(--terracotta)' : row.stock <= 10 ? 'var(--gold)' : 'var(--ink)' }}
                />
                <button
                  onClick={() => setPendingQty(m => { const n = new Map(m); n.set(row.id, getPending(row.id, row.stock) + 1); return n; })}
                  disabled={isUpdating}
                  className="w-[26px] h-[26px] rounded-[6px] border border-[var(--line-strong)] bg-[var(--bg-elev)] text-[var(--ink-2)] cursor-pointer flex items-center justify-center text-[14px] font-medium"
                >+</button>
                {pendingQty.has(row.id) && (
                  <button
                    onClick={() => {
                      updateStock(row, pendingQty.get(row.id)!);
                      setPendingQty(m => { const n = new Map(m); n.delete(row.id); return n; });
                    }}
                    disabled={isUpdating}
                    className="ml-[6px] py-[3px] px-[10px] text-[12px] rounded-[6px] border border-[var(--sage)] bg-[var(--sage-soft)] text-[var(--sage)] cursor-pointer font-medium"
                  >Save</button>
                )}
              </div>
              <Pill tone={row.status === 'In Stock' ? 'sage' : row.status === 'Low Stock' ? 'gold' : 'terracotta'}>
                {row.status}
              </Pill>
            </div>
          ))}
          {!isLoading && visibleRows.length === 0 && (
            <div className="py-[32px] text-center text-[var(--ink-3)] text-[13px]">
              No inventory items match this filter.
            </div>
          )}
          {isLoading && (
            <div className="py-[32px] text-center text-[var(--ink-3)] text-[13px]">
              Loading inventory…
            </div>
          )}
        </div>
      </Card>

      {/* Velocity */}
      {velocitySeries.length > 1 && (
        <Card title="Stock distribution" subtitle="Current stock levels across products">
          <Bars data={velocitySeries} height={140} />
        </Card>
      )}
    </div>
  );
}
