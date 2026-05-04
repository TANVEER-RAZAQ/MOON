'use client';

import { FormEvent, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Brand } from '@/components/ui/Brand';
import { Btn } from '@/components/ui/Btn';
import { Field } from '@/components/ui/Field';
import { MoonInput } from '@/components/ui/Input';
import type { AdminSession } from '@/lib/admin/adminAuth';
import { getOwnerDefaults } from '@/lib/admin/adminAuth';

interface AdminLoginPageProps {
  session: AdminSession | null;
  onLogin: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  isLoading: boolean;
}

export function AdminLoginPage({ session, onLogin, isLoading }: AdminLoginPageProps) {
  const pathname = usePathname();
  const defaults = getOwnerDefaults();
  const [email, setEmail] = useState(defaults.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const result = await onLogin(email, password);
    if (!result.ok) {
      setError(result.message ?? 'Invalid owner credentials.');
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Decorative left panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, var(--bg-elev) 0%, var(--bg) 100%)',
        borderRight: '1px solid var(--line)',
        position: 'relative',
        display: 'none',
        overflow: 'hidden',
      }} className="lg-flex">
        {/* Giant decorative crescent */}
        <svg style={{ position: 'absolute', top: '10%', left: '-15%', width: '120%', height: '120%', opacity: 0.05, color: 'var(--saffron)' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="giant-crescent">
              <rect width="100" height="100" fill="white" />
              <circle cx="60" cy="40" r="35" fill="black" />
            </mask>
          </defs>
          <circle cx="50" cy="50" r="45" fill="currentColor" mask="url(#giant-crescent)" />
        </svg>

        <div style={{ position: 'absolute', top: 48, left: 48 }}>
          <Brand size="lg" />
        </div>
        <div style={{ position: 'absolute', bottom: 64, left: 48, maxWidth: 400 }}>
          <h2 className="display" style={{ fontSize: 48, lineHeight: 1, margin: 0, color: 'var(--ink)' }}>Command center.</h2>
          <p style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 16 }}>Manage inventory, process orders, and track your store's performance from one beautiful interface.</p>
        </div>
      </div>

      {/* Login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 32, right: 32 }} className="mono text-xs text-[#8B949E]">
          {pathname}
        </div>

        <div style={{ width: '100%', maxWidth: 380 }} className="anim-fade-in">
          <div className="lg-hidden" style={{ marginBottom: 48, textAlign: 'center' }}>
            <Brand size="lg" />
          </div>

          <div style={{ marginBottom: 40 }}>
            <h1 className="display" style={{ fontSize: 36, margin: 0, color: 'var(--ink)' }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>Enter your credentials to access the console.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Email Address">
              <MoonInput
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@moon.com"
              />
            </Field>

            <Field label="Password">
              <MoonInput
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>

            {error && (
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(181,87,58,0.1)', color: 'var(--terracotta)', fontSize: 13, border: '1px solid var(--terracotta)' }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: 8 }}>
              <Btn type="submit" disabled={isLoading} full size="lg">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Btn>
            </div>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-4)', marginTop: 32 }}>
            Having trouble logging in? <a href="#" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Contact support</a>
          </p>
        </div>
      </div>
      
      {/* Hide graphic on small screens */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) { .lg-flex { display: flex !important; } .lg-hidden { display: none !important; } }
      `}} />
    </main>
  );
}
