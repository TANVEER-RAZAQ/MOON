'use client';

import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardStyle } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import type { CSSProperties } from 'react';

export default function TeamPage() {
  // Current admin (from context) — shown as the only team member
  const members = [
    { name: 'Owner', role: 'Admin', email: 'owner@moonnaturallyyours.com', status: 'Active' },
  ];

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="System"
        title="Team"
        subtitle="Manage team members and their permissions."
      />

      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{
              fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--ink-3)', borderBottom: '1px solid var(--line)',
            }}>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Member</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Role</th>
              <th style={{ padding: '14px 22px', textAlign: 'left', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '14px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: 'linear-gradient(135deg, var(--saffron), var(--terracotta))',
                      color: '#FFF8EC',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: 14,
                    }}>{m.name[0]}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{m.name}</div>
                  </div>
                </td>
                <td style={{ padding: '14px 22px', fontSize: 13, color: 'var(--ink)' }}>{m.email}</td>
                <td style={{ padding: '14px 22px' }}><Pill tone="saffron">{m.role}</Pill></td>
                <td style={{ padding: '14px 22px' }}><Pill tone="sage">{m.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

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
          <Icon name="person_add" size={26} />
        </div>
        <h3 className="display" style={{ margin: 0, fontSize: 22, fontWeight: 400 }}>Invite team members</h3>
        <p style={{ marginTop: 10, color: 'var(--ink-2)', fontSize: 14, maxWidth: 440, marginInline: 'auto' }}>
          Multi-user access with role-based permissions (Admin, Editor, Viewer) is planned for a future release.
        </p>
        <div style={{ marginTop: 14 }}><Pill tone="saffron" size="md">Planned</Pill></div>
      </div>
    </div>
  );
}
