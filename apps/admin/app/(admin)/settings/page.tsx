'use client';

import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardStyle } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import type { CSSProperties } from 'react';

export default function SettingsPage() {
  const sections = [
    { icon: 'store', label: 'Store details', desc: 'Business name, address, and contact information.', status: 'Planned' },
    { icon: 'local_shipping', label: 'Shipping zones', desc: 'Configure delivery regions, costs, and estimated delivery times.', status: 'Active' },
    { icon: 'account_balance', label: 'Taxes', desc: 'Set up GST rates and tax collection rules.', status: 'Planned' },
    { icon: 'credit_card', label: 'Payments', desc: 'Razorpay gateway configuration and test/live mode.', status: 'Active' },
    { icon: 'email', label: 'Notifications', desc: 'Order confirmation emails and SMS via Resend + Twilio.', status: 'Active' },
    { icon: 'palette', label: 'Appearance', desc: 'Storefront theme, colors, and brand assets.', status: 'Planned' },
  ];

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="System"
        title="Settings"
        subtitle="Configure your store, payments, shipping, and integrations."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {sections.map((s) => (
          <Card key={s.label} style={{ cursor: s.status === 'Active' ? 'pointer' : 'default', transition: 'transform .15s, box-shadow .15s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 11,
                background: s.status === 'Active' ? 'var(--sage-soft)' : 'var(--bg-sunk)',
                color: s.status === 'Active' ? 'var(--sage)' : 'var(--ink-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={s.icon} size={22} />
              </div>
              <Pill tone={s.status === 'Active' ? 'sage' : 'neutral'} size="sm">{s.status}</Pill>
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>{s.label}</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{s.desc}</p>
          </Card>
        ))}
      </div>

      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', padding: '0 4px' }}>
        Settings marked "Active" are configured via environment variables. A full settings UI is planned.
      </div>
    </div>
  );
}
