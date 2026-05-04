'use client';

import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardStyle } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import type { CSSProperties } from 'react';

export default function CollectionsPage() {
  const plannedFeatures = [
    { icon: 'auto_awesome', label: 'Smart collections', desc: 'Automatically group products by rules (price, category, tags).' },
    { icon: 'library_add', label: 'Manual collections', desc: 'Hand-pick products into curated sets for campaigns or pages.' },
    { icon: 'storefront', label: 'Featured slots', desc: 'Pin collections to your storefront homepage sections.' },
  ];

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="Catalog"
        title="Collections"
        subtitle="Group products into curated collections for your storefront."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {plannedFeatures.map((f) => (
          <Card key={f.label}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: 'var(--plum-soft)', color: 'var(--plum)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <Icon name={f.icon} size={22} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>{f.label}</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{f.desc}</p>
          </Card>
        ))}
      </div>

      <div style={{
        ...(cardStyle as CSSProperties),
        padding: 48, textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'var(--saffron-soft)', color: 'var(--saffron-ink)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <Icon name="collections_bookmark" size={26} />
        </div>
        <h3 className="display" style={{ margin: 0, fontSize: 22, fontWeight: 400 }}>Collections module</h3>
        <p style={{ marginTop: 10, color: 'var(--ink-2)', fontSize: 14, maxWidth: 440, marginInline: 'auto' }}>
          The collections engine is planned for a future release. It will bring smart and manual grouping capabilities to your catalog.
        </p>
        <div style={{ marginTop: 14 }}><Pill tone="saffron" size="md">Planned</Pill></div>
      </div>
    </div>
  );
}
