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
    <main className="min-h-screen flex bg-[var(--bg)]">
      {/* Decorative left panel */}
      <div className="flex-1 bg-gradient-to-br from-[var(--bg-elev)] to-[var(--bg)] border-r border-[var(--line)] relative hidden overflow-hidden lg:flex">
        {/* Giant decorative crescent */}
        <svg className="absolute top-[10%] -left-[15%] w-[120%] h-[120%] opacity-5 text-[var(--saffron)]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="giant-crescent">
              <rect width="100" height="100" fill="white" />
              <circle cx="60" cy="40" r="35" fill="black" />
            </mask>
          </defs>
          <circle cx="50" cy="50" r="45" fill="currentColor" mask="url(#giant-crescent)" />
        </svg>

        <div className="absolute top-12 left-12">
          <Brand size="lg" />
        </div>
        <div className="absolute bottom-16 left-12 max-w-[400px]">
          <h2 className="display text-[48px] leading-none m-0 text-[var(--ink)]">Command center.</h2>
          <p className="text-[15px] text-[var(--ink-2)] mt-4">Manage inventory, process orders, and track your store's performance from one beautiful interface.</p>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-8 right-8 mono text-xs text-[#8B949E]">
          {pathname}
        </div>

        <div className="w-full max-w-[380px] anim-fade-in">
          <div className="lg:hidden mb-12 text-center">
            <Brand size="lg" />
          </div>

          <div className="mb-10">
            <h1 className="display text-[36px] m-0 text-[var(--ink)]">Welcome back</h1>
            <p className="text-[14px] text-[var(--ink-3)] mt-[6px]">Enter your credentials to access the console.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              <div className="p-3 rounded-lg bg-[rgba(181,87,58,0.1)] text-[var(--terracotta)] text-[13px] border border-[var(--terracotta)]">
                {error}
              </div>
            )}

            <div className="mt-2">
              <Btn type="submit" disabled={isLoading} full size="lg">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Btn>
            </div>
          </form>

          <p className="text-center text-[13px] text-[var(--ink-4)] mt-8">
            Having trouble logging in? <a href="#" className="text-[var(--ink)] underline">Contact support</a>
          </p>
        </div>
      </div>
    </main>
  );
}
