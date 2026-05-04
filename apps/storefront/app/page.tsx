import { HomepageClient } from '@/components/HomepageClient';
import type { BackendProduct } from '@/lib/store/services/storefront-api';

export const revalidate = 3600;

const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/+$/, '');

export default async function Page() {
  let initialProducts: BackendProduct[] = [];
  try {
    const res = await fetch(`${apiBase}/products`, {
      next: { tags: ['products'] },
    });
    if (res.ok) {
      const json = await res.json();
      initialProducts = json.data ?? [];
    }
  } catch {
    // Backend unavailable — AppShell falls back to static catalog
  }

  return <HomepageClient initialProducts={initialProducts} />;
}
