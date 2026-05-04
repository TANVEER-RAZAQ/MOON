'use client';

import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardStyle } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import type { CSSProperties } from 'react';

export default function PagesBlogPage() {
  const modules = [
    { icon: 'edit_note', label: 'Blog editor', desc: 'Rich-text editor for crafting blog posts and brand stories.' },
    { icon: 'web', label: 'Static pages', desc: 'Manage About Us, Contact, and custom landing pages.' },
    { icon: 'schedule_send', label: 'Publishing', desc: 'Schedule posts and manage draft/live status.' },
  ];

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="Storefront"
        title="Pages & Blog"
        subtitle="Create and manage content pages and blog posts for your storefront."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {modules.map((m) => (
          <Card key={m.label}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: 'var(--plum-soft)', color: 'var(--plum)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <Icon name={m.icon} size={22} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>{m.label}</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{m.desc}</p>
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
          <Icon name="article" size={26} />
        </div>
        <h3 className="display" style={{ margin: 0, fontSize: 22, fontWeight: 400 }}>Content management</h3>
        <p style={{ marginTop: 10, color: 'var(--ink-2)', fontSize: 14, maxWidth: 440, marginInline: 'auto' }}>
          A WYSIWYG editor for blog posts and static pages will be available in a future release. Your storefront content is currently managed directly in the codebase.
        </p>
        <div style={{ marginTop: 14 }}><Pill tone="saffron" size="md">Planned</Pill></div>
      </div>
    </div>
  );
}
