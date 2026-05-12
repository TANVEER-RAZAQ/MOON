'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Btn } from '@/components/ui/Btn';
import { Brand } from '@/components/ui/Brand';
import type { AdminSession } from './adminAuth';
import { ADMIN_SETTINGS_STORAGE_KEY, ADMIN_SETTINGS_UPDATED_EVENT, applyAdminAppearanceSettings } from './adminSettings';
import type { ReactNode } from 'react';

/* ─── NAV CONFIG ──────────────────────────────────────────────────── */
interface NavItem {
  id: string;
  to: string;
  label: string;
  icon: string;
  badge?: string | null;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', to: '/dashboard-overview', label: 'Dashboard', icon: 'dashboard', badge: null },
      { id: 'analytics', to: '/analytics-focus', label: 'Analytics', icon: 'monitoring', badge: 'Live' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { id: 'products', to: '/products', label: 'Products', icon: 'inventory_2', badge: null },
      { id: 'inventory', to: '/inventory', label: 'Inventory', icon: 'shelves', badge: null },
      { id: 'collections', to: '/collections', label: 'Collections', icon: 'collections_bookmark', badge: null },
      { id: 'categories', to: '/categories', label: 'Categories', icon: 'category', badge: null },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { id: 'orders', to: '/orders', label: 'Orders', icon: 'receipt_long', badge: null },
      { id: 'customers', to: '/customers', label: 'Customers', icon: 'group', badge: null },
      { id: 'discounts', to: '/discounts', label: 'Discounts', icon: 'sell', badge: null },
    ],
  },
  {
    label: 'Storefront',
    items: [
      { id: 'pages', to: '/pages-blog', label: 'Pages & Blog', icon: 'article', badge: null },
      { id: 'media', to: '/media', label: 'Media library', icon: 'photo_library', badge: null },
      { id: 'seo', to: '/seo', label: 'SEO', icon: 'travel_explore', badge: null },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'team', to: '/team', label: 'Team', icon: 'badge', badge: null },
      { id: 'settings', to: '/settings', label: 'Settings', icon: 'tune', badge: null },
    ],
  },
];

const NAV_LABEL_TO_PAGE: Record<string, { eyebrow: string; title: string }> = {
  '/dashboard-overview': { eyebrow: 'Overview', title: 'Dashboard' },
  '/analytics-focus': { eyebrow: 'Insights', title: 'Analytics' },
  '/products': { eyebrow: 'Catalog', title: 'Products' },
  '/inventory': { eyebrow: 'Catalog', title: 'Inventory' },
  '/collections': { eyebrow: 'Catalog', title: 'Collections' },
  '/categories': { eyebrow: 'Catalog', title: 'Categories' },
  '/orders': { eyebrow: 'Commerce', title: 'Orders' },
  '/customers': { eyebrow: 'Commerce', title: 'Customers' },
  '/discounts': { eyebrow: 'Commerce', title: 'Discounts' },
  '/pages-blog': { eyebrow: 'Storefront', title: 'Pages & Blog' },
  '/media': { eyebrow: 'Storefront', title: 'Media library' },
  '/seo': { eyebrow: 'Storefront', title: 'SEO' },
  '/team': { eyebrow: 'System', title: 'Team' },
  '/settings': { eyebrow: 'System', title: 'Settings' },
};



/* ─── SIDEBAR ─────────────────────────────────────────────────────── */
function Sidebar({ session, onLogout }: { session: AdminSession; onLogout: () => void }) {
  const pathname = usePathname();
  const displayName = session.name || session.email;
  const avatarLetter = displayName.slice(0, 1).toUpperCase();

  return (
    <aside className="w-[248px] shrink-0 bg-[var(--bg-elev)] border-r border-[var(--line)] flex flex-col h-screen sticky top-0">
      {/* Workspace switcher */}
      <div className="pt-[18px] px-[16px] pb-[12px] border-b border-[var(--line)]">
        <div className="w-full flex items-center gap-[10px] py-[8px] px-[10px] bg-[var(--bg-sunk)] border border-[var(--line)] rounded-[9px] text-[var(--ink)] text-left">
          <div className="w-[26px] h-[26px] rounded-[6px] bg-gradient-to-br from-[var(--saffron)] to-[var(--terracotta)] text-[#FFF8EC] flex items-center justify-center font-display text-[14px] shrink-0">M</div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-medium">Moon Studio</div>
            <div className="mono text-[10px] text-[var(--ink-3)] tracking-[0.06em]">ADMIN CONSOLE</div>
          </div>
          <Icon name="unfold_more" size={14} className="text-[var(--ink-3)]" />
        </div>
      </div>

      {/* Search */}
      <div className="pt-[14px] px-[16px] pb-[6px]">
        <div className="flex items-center gap-[8px] py-[7px] px-[10px] bg-[var(--bg-sunk)] border border-[var(--line)] rounded-[9px] text-[12.5px] text-[var(--ink-3)] cursor-text">
          <Icon name="search" size={15} />
          <span className="flex-1">Quick jump</span>
          <span className="mono text-[10px] py-[1px] px-[6px] bg-[var(--bg-elev)] border border-[var(--line)] rounded-[4px]">⌘ K</span>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-[12px] pt-[8px] pb-[16px]">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mt-[14px]">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-[var(--ink-4)] px-[10px] pb-[8px]">
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.to || pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.id}
                  href={item.to}
                  className={`w-full flex items-center gap-[11px] py-[7px] px-[10px] rounded-[8px] border-none font-sans text-[13px] cursor-pointer text-left mb-[1px] no-underline transition-colors duration-120 ${isActive ? 'bg-[var(--saffron-soft)] text-[var(--saffron-ink)] font-medium' : 'bg-transparent text-[var(--ink-2)] font-normal hover:bg-[var(--bg-hover)]'}`}
                >
                  <Icon name={item.icon} size={17} fill={isActive ? 1 : 0} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`mono text-[10px] py-[1px] px-[7px] rounded-full font-medium ${isActive ? 'bg-[var(--saffron)] text-[#FFF8EC] border-none' : 'bg-[var(--bg-sunk)] text-[var(--ink-3)] border border-[var(--line)]'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User pill */}
      <div className="py-[12px] px-[14px] border-t border-[var(--line)] flex items-center gap-[10px]">
        <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-[var(--saffron)] to-[var(--terracotta)] text-[#FFF8EC] flex items-center justify-center font-display text-[16px]">
          {avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-medium text-[var(--ink)]">{displayName}</div>
          <div className="text-[11px] text-[var(--ink-3)]">Owner</div>
        </div>
        <button
          title="Log out"
          aria-label="Log out"
          onClick={onLogout}
          className="w-[26px] h-[26px] rounded-[6px] border border-[var(--line)] bg-transparent text-[var(--ink-3)] flex items-center justify-center cursor-pointer"
        >
          <Icon name="logout" size={14} />
        </button>
      </div>
    </aside>
  );
}

/* ─── TOP BAR ─────────────────────────────────────────────────────── */
function TopBar({ theme, onThemeToggle }: { theme: string; onThemeToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = '/' + pathname.split('/').filter(Boolean)[0];
  const meta = NAV_LABEL_TO_PAGE[basePath] || { eyebrow: 'Admin', title: 'Console' };

  const [openPopover, setOpenPopover] = useState<'command' | 'notifications' | 'help' | null>(null);

  const togglePopover = (name: 'command' | 'notifications' | 'help') => {
    setOpenPopover((prev) => (prev === name ? null : name));
  };

  // Close popover on outside click
  useEffect(() => {
    if (!openPopover) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-topbar-popover]')) {
        setOpenPopover(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openPopover]);

  const iconBtnClass = "relative w-[34px] h-[34px] rounded-[9px] border border-[var(--line)] bg-[var(--bg-elev)] text-[var(--ink-2)] flex items-center justify-center cursor-pointer";
  const popoverClass = "absolute top-[100%] right-0 mt-[8px] bg-[var(--bg-elev)] border border-[var(--line)] rounded-[12px] shadow-[var(--shadow-lg,0_8px_24px_rgba(0,0,0,0.12))] min-w-[260px] p-0 z-[100] overflow-hidden";
  const popoverItemClass = "flex items-center gap-[10px] py-[10px] px-[16px] text-[13px] text-[var(--ink)] cursor-pointer transition-colors duration-100 border-none bg-transparent w-full text-left font-sans hover:bg-[var(--bg-hover)]";

  return (
    <header className="flex items-center justify-between py-[14px] px-[32px] bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)] border-b border-[var(--line)] sticky top-0 z-[10]">
      <div className="flex items-center gap-[16px]">
        <Brand />
        <span className="w-[1px] h-[22px] bg-[var(--line)]" />
        <div className="flex items-center gap-[8px]">
          <span className="mono text-[11px] text-[var(--ink-3)] tracking-[0.06em] uppercase">
            {meta.eyebrow}
          </span>
          <Icon name="chevron_right" size={14} className="text-[var(--ink-4)]" />
          <span className="text-[13px] text-[var(--ink)] font-medium">{meta.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-[8px]">
        {/* Quick Create (Bolt) */}
        <div className="relative" data-topbar-popover>
          <button title="Quick actions" aria-label="Quick actions" onClick={() => togglePopover('command')} className={iconBtnClass}>
            <Icon name="bolt" size={16} />
          </button>
          {openPopover === 'command' && (
            <div className={popoverClass}>
              <div className="pt-[10px] px-[16px] pb-[6px] border-b border-[var(--line)]">
                <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)]">Quick Create</div>
              </div>
              <button className={popoverItemClass} onClick={() => { setOpenPopover(null); router.push('/products/new'); }}>
                <Icon name="inventory_2" size={16} className="text-[var(--saffron)]" />
                <span>New Product</span>
              </button>
              <button className={popoverItemClass} onClick={() => { setOpenPopover(null); router.push('/orders'); }}>
                <Icon name="receipt_long" size={16} className="text-[var(--saffron)]" />
                <span>View Orders</span>
              </button>
              <button className={popoverItemClass} onClick={() => { setOpenPopover(null); router.push('/inventory'); }}>
                <Icon name="shelves" size={16} className="text-[var(--saffron)]" />
                <span>Manage Inventory</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" data-topbar-popover>
          <button title="Notifications" aria-label="Notifications" onClick={() => togglePopover('notifications')} className={iconBtnClass}>
            <Icon name="notifications" size={16} />
            <span className="absolute top-[6px] right-[6px] w-[6px] h-[6px] rounded-full bg-[var(--terracotta)] border-[1.5px] border-[var(--bg)]" />
          </button>
          {openPopover === 'notifications' && (
            <div className={popoverClass}>
              <div className="pt-[10px] px-[16px] pb-[6px] border-b border-[var(--line)]">
                <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)]">Notifications</div>
              </div>
              <div className="py-[24px] px-[16px] text-center">
                <Icon name="notifications_none" size={28} className="text-[var(--ink-4)] mb-[8px]" />
                <div className="text-[13px] text-[var(--ink-3)]">No new notifications</div>
                <div className="text-[11.5px] text-[var(--ink-4)] mt-[4px]">
                  You&apos;ll see order alerts and low stock warnings here.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div className="relative" data-topbar-popover>
          <button title="Help" aria-label="Help" onClick={() => togglePopover('help')} className={iconBtnClass}>
            <Icon name="help" size={16} />
          </button>
          {openPopover === 'help' && (
            <div className={popoverClass}>
              <div className="pt-[10px] px-[16px] pb-[6px] border-b border-[var(--line)]">
                <div className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)]">Help & Support</div>
              </div>
              <a href="mailto:support@moonnaturallyyours.com" className={`${popoverItemClass} no-underline`} >
                <Icon name="mail" size={16} className="text-[var(--saffron)]" />
                <span>Email Support</span>
              </a>
              <button className={popoverItemClass} onClick={() => { setOpenPopover(null); router.push('/settings'); }}>
                <Icon name="tune" size={16} className="text-[var(--saffron)]" />
                <span>Settings</span>
              </button>
              <div className="pt-[8px] px-[16px] pb-[10px] border-t border-[var(--line)]">
                <div className="mono text-[10px] text-[var(--ink-4)]">Moon Admin Console v0.1</div>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          title="Toggle theme"
          aria-label="Toggle theme"
          onClick={onThemeToggle}
          className={iconBtnClass}
        ><Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} size={16} /></button>
        <span className="w-[1px] h-[22px] bg-[var(--line)] mx-[4px]" />
        <Btn variant="primary" icon="add" size="sm" onClick={() => router.push('/products/new')}>Create</Btn>
      </div>
    </header>
  );
}

/* ─── ADMIN LAYOUT ────────────────────────────────────────────────── */
interface AdminLayoutProps {
  session: AdminSession;
  onLogout: () => void;
  children: ReactNode;
}

export function AdminLayout({ session, onLogout, children }: AdminLayoutProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('moon-theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('moon-theme', theme);
    applyAdminAppearanceSettings();
  }, [theme]);

  useEffect(() => {
    applyAdminAppearanceSettings();

    const handleSettingsUpdate = () => applyAdminAppearanceSettings();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_SETTINGS_STORAGE_KEY) {
        applyAdminAppearanceSettings();
      }
    };

    window.addEventListener(ADMIN_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(ADMIN_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar session={session} onLogout={onLogout} />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar theme={theme} onThemeToggle={toggleTheme} />
        <div className="py-[32px] px-[36px] pb-[60px] max-w-[1320px] w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
