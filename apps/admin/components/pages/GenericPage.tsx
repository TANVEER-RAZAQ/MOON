'use client';

import { Icon } from '@/components/ui/Icon';
import { Btn } from '@/components/ui/Btn';
import { PageHeader } from '@/components/ui/PageHeader';
import { cardStyle } from '@/components/ui/Card';
import type { CSSProperties } from 'react';

interface GenericPageProps {
  title: string;
  eyebrow: string;
  icon: string;
}

export function GenericPage({ title, eyebrow, icon }: GenericPageProps) {
  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        subtitle="This section is part of your console. Live data and controls land here once the module ships."
        actions={[<Btn key="a" variant="primary" icon="add" size="sm">Create</Btn>]}
      />
      <div style={{
        ...(cardStyle as CSSProperties),
        padding: 80, textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'var(--saffron-soft)',
          color: 'var(--saffron-ink)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}>
          <Icon name={icon} size={30} />
        </div>
        <h3 className="display" style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>Module placeholder</h3>
        <p style={{ marginTop: 10, color: 'var(--ink-2)', fontSize: 14, maxWidth: 420, marginInline: 'auto' }}>
          The visual system, table layout and side-panel patterns from Products and Inventory will carry over to this screen.
        </p>
      </div>
    </div>
  );
}
