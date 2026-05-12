'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Field } from '@/components/ui/Field';
import { MoonInput } from '@/components/ui/Input';
import { MoonTextarea } from '@/components/ui/Textarea';
import { Toggle } from '@/components/ui/Toggle';
import { Btn } from '@/components/ui/Btn';
import {
  DEFAULT_ADMIN_SETTINGS,
  readAdminSettings,
  saveAdminSettings,
  type AdminSettings,
} from '@/lib/admin/adminSettings';
import {
  useGetShippingZonesQuery,
  useUpdateShippingZoneMutation,
  type ShippingZone,
} from '@/lib/store/services/admin-api';

type SectionId = 'store' | 'shipping' | 'taxes' | 'payments' | 'notifications' | 'appearance';

const sections: Array<{ id: SectionId; icon: string; label: string; desc: string; status: 'Configurable' | 'Local' }> = [
  { id: 'store', icon: 'store', label: 'Store details', desc: 'Business name, address, and customer contact information.', status: 'Local' },
  { id: 'shipping', icon: 'local_shipping', label: 'Shipping zones', desc: 'Default checkout shipping controls for local testing.', status: 'Local' },
  { id: 'taxes', icon: 'account_balance', label: 'Taxes', desc: 'GST collection settings for checkout planning.', status: 'Local' },
  { id: 'payments', icon: 'credit_card', label: 'Payments', desc: 'Razorpay mode notes and test amount helper.', status: 'Local' },
  { id: 'notifications', icon: 'email', label: 'Notifications', desc: 'Order and stock notification preferences.', status: 'Local' },
  { id: 'appearance', icon: 'palette', label: 'Appearance', desc: 'Admin-visible brand settings and announcement text.', status: 'Local' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('store');
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [saved, setSaved] = useState(false);

  const { data: shippingZones = [] } = useGetShippingZonesQuery();
  const [updateShippingZone] = useUpdateShippingZoneMutation();
  const [zoneEdits, setZoneEdits] = useState<Record<string, { cost: string; estimatedDays: string }>>({});

  const getZoneEdit = (zone: ShippingZone) => {
    return zoneEdits[zone.id] ?? { cost: String(zone.cost), estimatedDays: String(zone.estimated_days) };
  };

  useEffect(() => {
    setSettings(readAdminSettings());
  }, []);

  const activeMeta = useMemo(
    () => sections.find((section) => section.id === activeSection) ?? sections[0],
    [activeSection]
  );

  const setValue = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    saveAdminSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="anim-fade-in flex flex-col gap-[24px] max-w-[1120px]">
      <PageHeader
        eyebrow="System"
        title="Settings"
        subtitle="Click a settings card to configure that part of the admin console."
        actions={[
          <Btn key="save" variant="primary" icon="save" onClick={save}>Save settings</Btn>,
        ]}
      />

      {saved ? (
        <div className="p-[12px] rounded-[10px] border border-[var(--sage)] text-[var(--sage)]">
          Settings saved locally and applied to this admin browser.
        </div>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[16px]">
        {sections.map((section) => {
          const selected = section.id === activeSection;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`text-left rounded-[16px] p-0 bg-transparent cursor-pointer transition-shadow ${
                selected ? 'border border-[var(--saffron)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--saffron)_18%,transparent)]' : 'border border-[var(--line)]'
              }`}
            >
              <div className="h-full border-none p-[20px] rounded-[16px] bg-[var(--bg-elev)]">
                <div className="flex items-start justify-between mb-[14px]">
                  <div className={`w-[44px] h-[44px] rounded-[11px] flex items-center justify-center ${
                    selected ? 'bg-[var(--saffron-soft)] text-[var(--saffron-ink)]' : 'bg-[var(--sage-soft)] text-[var(--sage)]'
                  }`}>
                    <Icon name={section.icon} size={22} />
                  </div>
                  <Pill tone={section.status === 'Configurable' ? 'sage' : 'neutral'} size="sm">{section.status}</Pill>
                </div>
                <div className="text-[14.5px] font-medium text-[var(--ink)] mb-[6px]">{section.label}</div>
                <p className="m-0 text-[13px] text-[var(--ink-2)] leading-relaxed">{section.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Card title={activeMeta.label} subtitle={activeMeta.desc}>
        <div className="mt-[18px] grid gap-[18px] max-w-[720px]">
          {activeSection === 'store' ? (
            <>
              <Field label="Store name"><MoonInput value={settings.storeName} onChange={(event) => setValue('storeName', event.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-[14px]">
                <Field label="Support email"><MoonInput type="email" value={settings.supportEmail} onChange={(event) => setValue('supportEmail', event.target.value)} /></Field>
                <Field label="Support phone"><MoonInput value={settings.supportPhone} onChange={(event) => setValue('supportPhone', event.target.value)} /></Field>
              </div>
              <Field label="Business address"><MoonTextarea rows={3} value={settings.businessAddress} onChange={(event) => setValue('businessAddress', event.target.value)} /></Field>
            </>
          ) : null}

          {activeSection === 'shipping' ? (
            <div className="flex flex-col gap-[20px]">
              <div className="text-[var(--ink-2)] text-[13px] leading-relaxed">
                These are your live shipping zones. Changes are saved directly to the database.
              </div>
              {shippingZones.length === 0 ? (
                <p className="text-[var(--ink-2)] text-[13px]">No shipping zones found.</p>
              ) : (
                shippingZones.map((zone) => {
                  const edit = getZoneEdit(zone);
                  return (
                    <div key={zone.id} className="border border-[var(--line)] rounded-[10px] p-[16px] flex flex-col gap-[12px]">
                      <div className="font-semibold text-[14px] text-[var(--ink)]">{zone.zone_name}</div>
                      <div className="text-[12px] text-[var(--ink-2)]">{zone.states.join(', ')}</div>
                      <div className="grid grid-cols-[1fr_1fr_auto] gap-[10px] items-end">
                        <Field label="Cost (₹)">
                          <MoonInput
                            type="number"
                            min={0}
                            value={edit.cost}
                            onChange={(e) => setZoneEdits((prev) => ({ ...prev, [zone.id]: { ...getZoneEdit(zone), cost: e.target.value } }))}
                          />
                        </Field>
                        <Field label="Estimated days">
                          <MoonInput
                            type="number"
                            min={1}
                            value={edit.estimatedDays}
                            onChange={(e) => setZoneEdits((prev) => ({ ...prev, [zone.id]: { ...getZoneEdit(zone), estimatedDays: e.target.value } }))}
                          />
                        </Field>
                        <Btn
                          variant="primary"
                          onClick={async () => {
                            await updateShippingZone({ id: zone.id, patch: { cost: Number(edit.cost), estimatedDays: Number(edit.estimatedDays) } });
                            setZoneEdits((prev) => { const next = { ...prev }; delete next[zone.id]; return next; });
                          }}
                        >
                          Save
                        </Btn>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : null}

          {activeSection === 'taxes' ? (
            <>
              <div className="flex items-center gap-[12px]">
                <Toggle checked={settings.gstEnabled} onChange={(value) => setValue('gstEnabled', value)} />
                <span className="text-[13px] text-[var(--ink)]">Collect GST in checkout calculations</span>
              </div>
              <Field label="GST rate"><MoonInput type="number" min={0} max={100} value={settings.gstRate} onChange={(event) => setValue('gstRate', Number(event.target.value))} /></Field>
            </>
          ) : null}

          {activeSection === 'payments' ? (
            <>
              <Field label="Razorpay mode">
                <select
                  value={settings.razorpayMode}
                  onChange={(event) => setValue('razorpayMode', event.target.value as AdminSettings['razorpayMode'])}
                  className="w-full py-[10px] px-[12px] rounded-[10px] border border-[var(--line)] bg-[var(--bg-sunk)] text-[var(--ink)]"
                >
                  <option value="live">Live</option>
                  <option value="test">Test</option>
                </select>
              </Field>
              <Field label="Payment test amount"><MoonInput type="number" min={1} value={settings.paymentTestAmount} onChange={(event) => setValue('paymentTestAmount', Number(event.target.value))} /></Field>
              <div className="text-[var(--ink-2)] text-[13px] leading-relaxed">
                Razorpay keys still come from backend environment variables. These local settings do not switch the backend gateway mode.
              </div>
            </>
          ) : null}

          {activeSection === 'notifications' ? (
            <>
              <div className="flex items-center gap-[12px]">
                <Toggle checked={settings.orderEmails} onChange={(value) => setValue('orderEmails', value)} />
                <span className="text-[13px] text-[var(--ink)]">Send order confirmation emails</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <Toggle checked={settings.lowStockAlerts} onChange={(value) => setValue('lowStockAlerts', value)} />
                <span className="text-[13px] text-[var(--ink)]">Show low stock alerts</span>
              </div>
            </>
          ) : null}

          {activeSection === 'appearance' ? (
            <>
              <Field label="Accent color"><MoonInput type="color" value={settings.accentColor} onChange={(event) => setValue('accentColor', event.target.value)} className="h-[44px] p-[6px]" /></Field>
              <Field label="Announcement text"><MoonInput value={settings.announcementText} onChange={(event) => setValue('announcementText', event.target.value)} placeholder="Optional storefront announcement" /></Field>
              <div className="text-[var(--ink-2)] text-[13px] leading-relaxed">
                Accent color is applied to the admin console after saving. Storefront announcement text is stored locally until backend settings are added.
              </div>
            </>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
