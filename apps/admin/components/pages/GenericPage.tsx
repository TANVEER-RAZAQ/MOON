'use client';

import { Icon } from '@/components/ui/Icon';
import { Btn } from '@/components/ui/Btn';
import { PageHeader } from '@/components/ui/PageHeader';
import { cardClass } from '@/components/ui/Card';

interface GenericPageProps {
  title: string;
  eyebrow: string;
  icon: string;
}

export function GenericPage({ title, eyebrow, icon }: GenericPageProps) {
  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        subtitle="This section is part of your console. Live data and controls land here once the module ships."
        actions={[<Btn key="a" variant="primary" icon="add" size="sm">Create</Btn>]}
      />
      <div className={`${cardClass} p-[80px] text-center`}>
        <div className="w-[64px] h-[64px] rounded-[16px] bg-[var(--saffron-soft)] text-[var(--saffron-ink)] inline-flex items-center justify-center mb-[18px]">
          <Icon name={icon} size={30} />
        </div>
        <h3 className="display m-0 text-[26px] font-normal">Module placeholder</h3>
        <p className="mt-[10px] text-[var(--ink-2)] text-[14px] max-w-[420px] mx-auto">
          The visual system, table layout and side-panel patterns from Products and Inventory will carry over to this screen.
        </p>
      </div>
    </div>
  );
}
