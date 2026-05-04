'use client';

import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardStyle } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import type { CSSProperties } from 'react';

export default function DiscountsPage() {
  const plannedTypes = [
    { icon: 'percent', label: 'Percentage off', desc: '10%, 20%, 50% off entire order or specific products.' },
    { icon: 'payments', label: 'Fixed amount', desc: '₹100, ₹500 flat discounts with minimum order thresholds.' },
    { icon: 'local_shipping', label: 'Free shipping', desc: 'Remove shipping fees for qualifying orders.' },
    { icon: 'schedule', label: 'Time-limited', desc: 'Flash sales with automatic start/end dates.' },
  ];

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="Commerce"
        title="Discounts"
        subtitle="Create promo codes and automatic discounts to drive sales."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {plannedTypes.map((t) => (
          <Card key={t.label}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: 'var(--sage-soft)', color: 'var(--sage)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <Icon name={t.icon} size={22} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>{t.label}</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{t.desc}</p>
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
          <Icon name="sell" size={26} />
        </div>
        <h3 className="display" style={{ margin: 0, fontSize: 22, fontWeight: 400 }}>Discounts engine</h3>
        <p style={{ marginTop: 10, color: 'var(--ink-2)', fontSize: 14, maxWidth: 440, marginInline: 'auto' }}>
          Promo codes, automatic discounts, and BOGO deals are planned for a future release. This module will integrate with your checkout flow.
        </p>
        <div style={{ marginTop: 14 }}><Pill tone="saffron" size="md">Planned</Pill></div>
      </div>
    </div>
  );
}
