'use client';

import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardClass } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

export default function PagesBlogPage() {
  const modules = [
    { icon: 'edit_note', label: 'Blog editor', desc: 'Rich-text editor for crafting blog posts and brand stories.' },
    { icon: 'web', label: 'Static pages', desc: 'Manage About Us, Contact, and custom landing pages.' },
    { icon: 'schedule_send', label: 'Publishing', desc: 'Schedule posts and manage draft/live status.' },
  ];

  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow="Storefront"
        title="Pages & Blog"
        subtitle="Create and manage content pages and blog posts for your storefront."
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[16px]">
        {modules.map((m) => (
          <Card key={m.label}>
            <div className="w-[44px] h-[44px] rounded-[11px] bg-[var(--plum-soft)] text-[var(--plum)] flex items-center justify-center mb-[14px]">
              <Icon name={m.icon} size={22} />
            </div>
            <div className="text-[14.5px] font-medium text-[var(--ink)] mb-[6px]">{m.label}</div>
            <p className="m-0 text-[13px] text-[var(--ink-2)] leading-[1.5]">{m.desc}</p>
          </Card>
        ))}
      </div>

      <div className={`${cardClass} p-[48px] text-center`}>
        <div className="w-[56px] h-[56px] rounded-[14px] bg-[var(--saffron-soft)] text-[var(--saffron-ink)] inline-flex items-center justify-center mb-[16px]">
          <Icon name="article" size={26} />
        </div>
        <h3 className="display m-0 text-[22px] font-normal">Content management</h3>
        <p className="mt-[10px] text-[var(--ink-2)] text-[14px] max-w-[440px] mx-auto">
          A WYSIWYG editor for blog posts and static pages will be available in a future release. Your storefront content is currently managed directly in the codebase.
        </p>
        <div className="mt-[14px]"><Pill tone="saffron" size="md">Planned</Pill></div>
      </div>
    </div>
  );
}
