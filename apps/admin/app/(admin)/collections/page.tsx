'use client';

import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, cardClass } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

export default function CollectionsPage() {
  const plannedFeatures = [
    { icon: 'auto_awesome', label: 'Smart collections', desc: 'Automatically group products by rules (price, category, tags).' },
    { icon: 'library_add', label: 'Manual collections', desc: 'Hand-pick products into curated sets for campaigns or pages.' },
    { icon: 'storefront', label: 'Featured slots', desc: 'Pin collections to your storefront homepage sections.' },
  ];

  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow="Catalog"
        title="Collections"
        subtitle="Group products into curated collections for your storefront."
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[16px]">
        {plannedFeatures.map((f) => (
          <Card key={f.label}>
            <div className="w-[44px] h-[44px] rounded-[11px] bg-[var(--plum-soft)] text-[var(--plum)] flex items-center justify-center mb-[14px]">
              <Icon name={f.icon} size={22} />
            </div>
            <div className="text-[14.5px] font-medium text-[var(--ink)] mb-[6px]">{f.label}</div>
            <p className="m-0 text-[13px] text-[var(--ink-2)] leading-snug">{f.desc}</p>
          </Card>
        ))}
      </div>

      <div className={`${cardClass} p-[48px] text-center`}>
        <div className="w-[56px] h-[56px] rounded-[14px] bg-[var(--saffron-soft)] text-[var(--saffron-ink)] inline-flex items-center justify-center mb-[16px]">
          <Icon name="collections_bookmark" size={26} />
        </div>
        <h3 className="display m-0 text-[22px] font-normal">Collections module</h3>
        <p className="mt-[10px] text-[var(--ink-2)] text-[14px] max-w-[440px] mx-auto">
          The collections engine is planned for a future release. It will bring smart and manual grouping capabilities to your catalog.
        </p>
        <div className="mt-[14px]"><Pill tone="saffron" size="md">Planned</Pill></div>
      </div>
    </div>
  );
}
