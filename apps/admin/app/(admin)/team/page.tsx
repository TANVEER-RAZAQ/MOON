'use client';

import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardClass } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

export default function TeamPage() {
  // Current admin (from context) — shown as the only team member
  const members = [
    { name: 'Owner', role: 'Admin', email: 'owner@moonnaturallyyours.com', status: 'Active' },
  ];

  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow="System"
        title="Team"
        subtitle="Manage team members and their permissions."
      />

      <Card padding={0}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)] border-b border-[var(--line)]">
              <th className="py-[14px] px-[22px] text-left font-medium">Member</th>
              <th className="py-[14px] px-[22px] text-left font-medium">Email</th>
              <th className="py-[14px] px-[22px] text-left font-medium">Role</th>
              <th className="py-[14px] px-[22px] text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email} className="border-b border-[var(--line)]">
                <td className="py-[14px] px-[22px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[34px] h-[34px] rounded-[8px] bg-gradient-to-br from-[var(--saffron)] to-[var(--terracotta)] text-[#FFF8EC] flex items-center justify-center font-display text-[14px]">
                      {m.name[0]}
                    </div>
                    <div className="text-[13.5px] font-medium text-[var(--ink)]">{m.name}</div>
                  </div>
                </td>
                <td className="py-[14px] px-[22px] text-[13px] text-[var(--ink)]">{m.email}</td>
                <td className="py-[14px] px-[22px]"><Pill tone="saffron">{m.role}</Pill></td>
                <td className="py-[14px] px-[22px]"><Pill tone="sage">{m.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className={`${cardClass} p-[48px] text-center`}>
        <div className="w-[56px] h-[56px] rounded-[14px] bg-[var(--saffron-soft)] text-[var(--saffron-ink)] inline-flex items-center justify-center mb-[16px]">
          <Icon name="person_add" size={26} />
        </div>
        <h3 className="display m-0 text-[22px] font-normal">Invite team members</h3>
        <p className="mt-[10px] text-[var(--ink-2)] text-[14px] max-w-[440px] mx-auto">
          Multi-user access with role-based permissions (Admin, Editor, Viewer) is planned for a future release.
        </p>
        <div className="mt-[14px]"><Pill tone="saffron" size="md">Planned</Pill></div>
      </div>
    </div>
  );
}
