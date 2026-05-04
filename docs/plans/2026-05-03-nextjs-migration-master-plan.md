# MOON — Next.js 16 Migration & Admin Subdomain Master Plan

**Date:** 2026-05-03
**Branch base:** `frontend` (origin/frontend, fast-forwarded)
**Target:** Replace React + Vite + `frontend 2/` scaffold with **two production Next.js 16 apps** in a monorepo:
- `apps/storefront` → `moonnaturallyyours.com` (public, SEO-optimized, ISR)
- `apps/admin` → `admin.moonnaturallyyours.com` (internal, basic-auth + noindex)

Plus backend upgrades so non-developers can edit prices, upload images, and manage inventory **without touching code**.

---

## How to use this plan

Each phase is **self-contained for a new chat session**. Run them in order. Do not skip Phase 0 — it lists the verified APIs, paths, and anti-patterns the subagents discovered. Every other phase cites Phase 0.

When a phase says "copy from X", it means **literally copy the snippet** — these were verified against Next.js 16.2.4 + Vercel docs, not invented.

---

## Phase 0 — Documentation Discovery (consolidated)

### 0.1 Allowed APIs (verified — do NOT invent variants)

**Next.js 16 (v16.2.4) — App Router:**
| API | Import | Notes |
|---|---|---|
| `loading.tsx` file convention | (file in route folder) | Wraps sibling `page.tsx` in Suspense; ships in first chunk |
| `<Suspense>` | `react` | For granular streaming inside a `page.tsx` |
| `generateMetadata({params, searchParams}, parent)` | export from `page.tsx` / `layout.tsx` | **`params` & `searchParams` are `Promise` in v16 — must `await`** |
| `metadata.robots = {index, follow, googleBot:{...}}` | export from `layout.tsx` | `index: false, follow: false` for admin |
| `revalidatePath(path, type?)` | `next/cache` | Server Action / Route Handler only |
| `revalidateTag(tag, profile)` | `next/cache` | **v16: pass `'max'` as 2nd arg explicitly — single-arg form deprecated** |
| `fetch(url, { next: { revalidate, tags } })` | global | Tag fetches for fan-out invalidation |
| `<Image>` from `next/image` | `next/image` | `priority`, `fill`, `sizes`, `placeholder="blur"`, `blurDataURL` |
| `next/font/google` | `next/font/google` | Self-hosted at build, `display: 'swap'`, define at module scope |
| Route Handler `app/.../route.ts` | exports `GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS` | Cannot coexist with `page.tsx` in same folder |
| Server Action `'use server'` | top of file or function | POST under the hood |
| **`proxy.ts`** (NOT `middleware.ts`) | `apps/<app>/proxy.ts` | **Renamed in Next 16.** `export function proxy(request)`. Codemod: `npx @next/codemod@canary middleware-to-proxy .` |
| `app/robots.ts` | `MetadataRoute.Robots` from `next` | Returns `{ rules: { userAgent, disallow } }` |
| `next.config.ts` `images.remotePatterns` | `next` | Object form: `{ protocol, hostname, port, pathname, search }` |

**Vercel (verified):**
| Capability | Plan | Notes |
|---|---|---|
| Multiple Vercel Projects from one repo | All plans | One project per app; set "Root Directory" per project |
| Custom domain on production | All plans | Add per-project under Settings → Domains |
| Vercel Authentication (preview only on Hobby) | All plans | Doesn't protect production custom domain on Hobby |
| **Password Protection** for production | **Pro $150/mo add-on, or Enterprise** | 30-day minimum once enabled |
| Trusted IPs | Enterprise only | — |
| Skip unaffected projects | Auto with workspaces | Each app needs unique `name` in package.json |

### 0.2 Anti-patterns to AVOID

- ❌ `export function middleware(request)` in Next.js 16 → use `export function proxy(request)` in `proxy.ts`
- ❌ `revalidateTag('foo')` single arg in Next 16 → `revalidateTag('foo', 'max')`
- ❌ `params.id` directly in v16 → `const { id } = await params`
- ❌ `<script type="application/ld+json">{JSON.stringify(...)}</script>` without `.replace(/</g, '\\u003c')` — XSS hole
- ❌ `next/script` for JSON-LD — must be raw `<script>` in SSR HTML for crawlers
- ❌ `<Image fill>` without `sizes` — downloads largest variant on every viewport
- ❌ `defineFont(...)` inside a component — must be module-scope
- ❌ `Access-Control-Allow-Origin: *` with credentials — incompatible
- ❌ Mounting admin token in shared API client (current `frontend 2/lib/store/services/api.ts:133-142` injects admin Bearer token into ALL storefront requests)
- ❌ Hardcoded product catalog in `lib/data/products.ts` — blocks dynamic price/image editing
- ❌ Single `image_url` text column for products (current backend schema, `database/migrations/0002_core_schema.sql:53-68`) — must become `images jsonb[]`
- ❌ Body parser limit `100kb` (current `backend/src/app.js:54-55`) — blocks any image data even as base64

### 0.3 Current state snapshot (so the plan starts from reality)

**Backend (`D:/MOON/MOON/backend/`):**
- Express + Supabase, JWT (15m access / 7d refresh), 2 roles (`customer`, `admin`)
- Admin endpoints exist for **analytics** + **inventory qty/sku/reserved** + **order status** + **notifications**
- **Missing**: product CRUD endpoints, price update endpoint, image upload, image management, revalidation webhook caller
- **No** `multer`/`busboy`/`sharp` deps, no Supabase Storage SDK wired
- Body parser cap: `100kb` (`src/app.js:54-55`)
- CORS: dev allows any localhost, prod allows only `env.app.frontendUrl` (`src/config/cors.js`)
- Razorpay configured (`src/integrations/payments/razorpay.client.js`)

**Frontend scaffold (`D:/MOON/MOON/frontend 2/`):**
- Next.js 16.2.4 + React 19.2.4 + TS, Tailwind v4 (no `tailwind.config.js`, uses `@theme` in `styles/global.css`)
- Has all 4 admin pages + storefront pages, Redux store, RTK Query
- `lib/data/products.ts` is **fully hardcoded** (7 products, 5 shipping zones, 22 states)
- Images are local `/public/moon333/...` files, no remote URLs
- **No `loading.tsx` files anywhere** → users see blank/JS-driven flash
- **No JSON-LD** → poor AI/SEO crawl signals
- **API client at `lib/store/services/api.ts:133-142` mixes admin token into all requests** → must split

**Repo state:**
- Working dir: `D:/MOON/MOON/` (git repo). Branch: `frontend` (just fast-forwarded 25 commits)
- Root has `frontend/` (old Vite, source removed, only `dist/` + `node_modules`) + `frontend 2/` (Next.js scaffold)
- No monorepo tool, no `pnpm-workspace.yaml`, no `apps/` directory yet

---

## Phase 1 — Repo restructure to monorepo

**Goal:** Turn the repo into a pnpm workspace with `apps/storefront`, `apps/admin`, `packages/shared`. Delete the old `frontend/` (Vite, dead). Move `frontend 2/` content into the new structure.

### 1.1 Tasks

1. **Create monorepo skeleton:**
   ```
   D:/MOON/MOON/
   ├── pnpm-workspace.yaml
   ├── package.json            # root: { "private": true, "name": "moon" }
   ├── apps/
   │   ├── storefront/         # Next.js 16 — public site
   │   └── admin/              # Next.js 16 — internal panel
   ├── packages/
   │   └── shared/             # @moon/shared — types, design tokens, fonts module
   └── backend/                # untouched (Express)
   ```

2. **Write `pnpm-workspace.yaml`** at repo root:
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```

3. **Write root `package.json`:**
   ```json
   {
     "name": "moon",
     "private": true,
     "scripts": {
       "dev:storefront": "pnpm --filter @moon/storefront dev",
       "dev:admin": "pnpm --filter @moon/admin dev",
       "build": "pnpm -r build"
     }
   }
   ```

4. **Move `frontend 2/` files into the two apps using the audit's classification:**

   **Into `apps/storefront/`:**
   - `app/page.tsx`, `app/products/[slug]/page.tsx`, `app/cart/page.tsx`, `app/checkout/page.tsx`
   - `app/layout.tsx` (storefront-flavored — keep storefront metadata)
   - `components/{Navbar,Footer,CartDrawer,ProductDetailModal,HeroProductMedia,AppShell,AppContext,Providers}.tsx`
   - `components/pages/{HomePage,CartPage,CheckoutPage}.tsx`
   - `hooks/{useStorytellingCanvas,useRevealAnimation}.ts`
   - `lib/store/index.ts` (storefront slices only)
   - `lib/store/slices/cartSlice.ts`
   - `lib/store/services/cartSession.ts`
   - **NEW** `lib/store/services/storefront-api.ts` (split from `api.ts` — endpoints lines 145–219, NO admin token injection)
   - `styles/*` (all of it; storefront uses the visual identity)
   - `public/*` (move all `/moon2222`, `/moon333`, `/ezgif-...` assets here as fallbacks until backend serves them)

   **Into `apps/admin/`:**
   - `app/admin/**` → flatten to `app/**` (admin app IS the admin — no `/admin` URL prefix needed)
     - `app/login/page.tsx`
     - `app/dashboard-overview/page.tsx`
     - `app/inventory/page.tsx`
     - `app/analytics-focus/page.tsx`
     - `app/products/page.tsx` (NEW — product editor list)
     - `app/products/[id]/page.tsx` (NEW — single product editor: price, name, images)
     - `app/layout.tsx` (admin-flavored — `metadata.robots = noindex`)
   - `components/pages/{AdminLoginPage,DashboardOverviewPage,InventoryPage,AnalyticsFocusPage}.tsx`
   - `lib/admin/{adminAuth,AdminContext,AdminLayout,RequireAdmin}.{ts,tsx}`
   - **NEW** `lib/store/services/admin-api.ts` (endpoints lines 221–311, with Bearer token injection)
   - `lib/store/index.ts` (admin slices only)
   - **NEW** `proxy.ts` (basic auth + noindex header — see Phase 8)
   - **NEW** `app/robots.ts` (disallow all)

   **Into `packages/shared/`:**
   - `lib/types/index.ts` → `packages/shared/src/types.ts`
   - `lib/store/hooks.ts` → `packages/shared/src/redux-hooks.ts` (typed `useAppDispatch`, `useAppSelector`)
   - **NEW** `packages/shared/src/fonts.ts` (export `Space_Grotesk`, `Manrope`, `Fraunces`, `Syncopate` instances per Phase 0)
   - **NEW** `packages/shared/src/design-tokens.css` (the `@theme {...}` block from `styles/global.css`)
   - `packages/shared/package.json`:
     ```json
     {
       "name": "@moon/shared",
       "version": "0.0.0",
       "private": true,
       "main": "./src/index.ts",
       "types": "./src/index.ts"
     }
     ```

5. **Each app's `package.json`** declares the workspace dep:
   ```json
   { "name": "@moon/storefront", "dependencies": { "@moon/shared": "workspace:*", "next": "16.2.4", ... } }
   ```

6. **Delete `frontend/` directory** (old Vite — source already gone, only stale `dist/` + `node_modules`).

7. **Delete `frontend 2/` directory** after the move is verified.

### 1.2 Verification checklist

- [ ] `pnpm install` from repo root succeeds with no peer-dep errors
- [ ] `pnpm dev:storefront` boots Next.js on `localhost:3000` (or chosen port)
- [ ] `pnpm dev:admin` boots Next.js on `localhost:3001`
- [ ] No file in `apps/storefront/` imports anything from `apps/admin/` (or vice versa)
- [ ] `git grep "from '@/lib/admin'"` inside `apps/storefront/` returns 0
- [ ] `git grep "getAdminToken"` inside `apps/storefront/` returns 0 (token leak test)

### 1.3 Anti-pattern guards

- Do NOT keep both `frontend/` and `apps/storefront/` — pick one (apps/storefront).
- Do NOT use `tailwind.config.js` in either app — Tailwind v4 uses `@theme` blocks in CSS.
- Do NOT define `next/font` instances inside `apps/storefront/app/layout.tsx` AND `apps/admin/app/layout.tsx` separately — define once in `@moon/shared/fonts` and import.

---

## Phase 2 — Backend: schema upgrade + product CRUD

**Goal:** Make products fully editable from admin. Replace single `image_url` with `images jsonb[]`. Add admin endpoints to update price, name, description, images.

### 2.1 Database migration

Create `D:/MOON/MOON/database/migrations/0003_products_multi_image.sql`:

```sql
-- Add images array (each entry: { url, alt, order, blurDataUrl })
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill from existing image_url
UPDATE public.products
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', image_url,
    'alt', name,
    'order', 0,
    'blurDataUrl', NULL
  )
)
WHERE jsonb_array_length(images) = 0 AND image_url IS NOT NULL;

-- Keep image_url as denormalized "primary image" for backward compat (drop later)
COMMENT ON COLUMN public.products.image_url IS
  'DEPRECATED: use images[0].url. Kept for backward compat until frontend cutover.';

-- Add audit columns
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES public.users(id);

CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = true;
```

### 2.2 New admin endpoints

In `D:/MOON/MOON/backend/src/modules/products/`:

| Method | Path | Auth | Body / Notes |
|---|---|---|---|
| `POST` | `/api/admin/products` | requireAuth + requireAdmin | Create product (name, slug, description, price, category, theme) |
| `PUT` | `/api/admin/products/:id` | requireAuth + requireAdmin | Update any field (price, discount_price, name, description, meta_title, meta_description, is_active) — **triggers revalidation webhook** |
| `DELETE` | `/api/admin/products/:id` | requireAuth + requireAdmin | Soft delete (set `is_active = false`) — **triggers revalidation** |
| `PUT` | `/api/admin/products/:id/images` | requireAuth + requireAdmin | Replace full images array `[{url, alt, order}]` — used after upload + reorder |

**Validator (Zod) for `PUT /api/admin/products/:id`:**
```js
const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
  discount_price: z.coerce.number().nonnegative().nullable().optional(),
  category: z.string().max(100).optional(),
  theme: z.string().max(50).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(255).optional(),
  is_active: z.boolean().optional(),
});
```

**After successful update, fire-and-forget revalidation:**
```js
// in products.controller.js after update
const { revalidateStorefront } = require('../../integrations/revalidate');
revalidateStorefront([`/products/${product.slug}`, '/']).catch(err =>
  req.log?.error({ err }, 'revalidation webhook failed')
);
```

### 2.3 Anti-pattern guards

- ❌ Do NOT expose `POST /api/admin/products` without admin auth — Zod validation alone is not auth.
- ❌ Do NOT allow updating `id`, `created_at`, `slug` (slug change breaks all bookmarked URLs and ISR cache keys).
- ❌ Do NOT hard-delete; soft-delete via `is_active = false` so order history references stay intact.

### 2.4 Verification checklist

- [ ] Migration runs cleanly: `psql ... -f 0003_products_multi_image.sql`
- [ ] `SELECT images FROM products LIMIT 1;` returns array, not null
- [ ] `curl -X PUT -H "Authorization: Bearer <admin-jwt>" -d '{"price": 1234}' /api/admin/products/<id>` returns 200 + updated row
- [ ] Same call without admin JWT returns 401/403
- [ ] After update, `GET /api/products` shows new price
- [ ] Backend log shows revalidation webhook attempt

---

## Phase 3 — Backend: image upload pipeline (Supabase Storage)

**Goal:** Admin can upload multiple images per product without touching code. Files land in Supabase Storage public bucket, URLs auto-attached to product.

### 3.1 Supabase Storage setup (one-time, via Supabase dashboard)

1. Create bucket `product-images` (public read).
2. Add RLS policy:
   ```sql
   CREATE POLICY "Service role full access" ON storage.objects
     FOR ALL TO service_role USING (bucket_id = 'product-images');
   ```
3. Public URL pattern: `https://<project-ref>.supabase.co/storage/v1/object/public/product-images/<path>`

### 3.2 Backend dependencies

Add to `backend/package.json`:
```bash
cd backend && npm install multer sharp
```
- `multer` — multipart parser (memory storage)
- `sharp` — generate `blurDataURL` (10×10 base64) per image at upload time

### 3.3 New endpoint: `POST /api/admin/products/:id/images/upload`

In `backend/src/modules/products/products.upload.routes.js`:

```js
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 }, // 5MB per file, 10 files max
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype);
    cb(ok ? null : new Error('Unsupported image type'), ok);
  },
});

router.post(
  '/admin/products/:id/images/upload',
  requireAuth,
  requireAdmin,
  upload.array('images', 10),
  productsController.uploadImages
);
```

**Controller logic:**
```js
const sharp = require('sharp');
const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');

async function uploadImages(req, res) {
  const supabase = getSupabaseAdminClient();
  const { id } = req.params;
  const files = req.files; // multer array

  const uploaded = [];
  for (const file of files) {
    // Generate blur placeholder
    const blur = await sharp(file.buffer).resize(10, 10).webp({ quality: 20 }).toBuffer();
    const blurDataUrl = `data:image/webp;base64,${blur.toString('base64')}`;

    // Upload to Supabase Storage
    const path = `${id}/${Date.now()}-${file.originalname}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '31536000', // 1 year — files are immutable (timestamp in path)
    });
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
    uploaded.push({ url: publicUrl, alt: file.originalname, blurDataUrl });
  }

  // Append to product.images
  const { data: product } = await supabase.from('products').select('images').eq('id', id).single();
  const newImages = [...(product?.images ?? []), ...uploaded.map((img, i) => ({ ...img, order: (product?.images?.length ?? 0) + i }))];
  await supabase.from('products').update({ images: newImages }).eq('id', id);

  // Revalidate storefront
  revalidateStorefront([`/products/${product.slug}`]).catch(() => {});

  res.json({ success: true, uploaded: newImages });
}
```

### 3.4 Body parser exception

In `backend/src/app.js`, **before** the `express.json({ limit: '100kb' })` line, mount upload routes:

```js
// Multer handles its own parsing — must be before express.json to avoid double-parse on multipart
app.use('/api', require('./modules/products/products.upload.routes'));
app.use(express.json({ limit: '100kb' }));
```

### 3.5 Anti-pattern guards

- ❌ Do NOT use `multer.diskStorage()` on Vercel/Render serverless — read-only FS. Use `memoryStorage()` and stream to Supabase.
- ❌ Do NOT bump `express.json({ limit })` to 50MB — opens DoS vector. Multer handles uploads with its own limit.
- ❌ Do NOT skip MIME-type filter — attackers upload `.exe` masquerading as `.jpg`.
- ❌ Do NOT re-encode images with `sharp` (e.g. force-convert to webp) — Next.js `<Image>` does that on demand. Only generate the tiny blur.
- ❌ Do NOT store the file buffer in DB — only the public URL.

### 3.6 Verification checklist

- [ ] `curl -F "images=@photo1.jpg" -F "images=@photo2.jpg" -H "Authorization: Bearer <admin>" .../api/admin/products/<id>/images/upload` returns array of public URLs
- [ ] Files visible in Supabase dashboard → Storage → product-images
- [ ] `GET /api/products` returns product with new images in array
- [ ] Each image has a `blurDataUrl` < 1KB
- [ ] Upload of 11th file in same call returns 400 (multer limit)
- [ ] Upload of 6MB file returns 413 (file size limit)

---

## Phase 4 — Backend: cross-app revalidation contract

**Goal:** When admin updates price/images, storefront pages refresh within seconds without rebuild.

### 4.1 Backend revalidation client

Create `backend/src/integrations/revalidate.js`:

```js
const env = require('../config/env');

async function revalidateStorefront(paths = []) {
  const url = `${env.app.storefrontUrl}/api/revalidate`;
  const secret = env.revalidate.secret;
  if (!url || !secret) return;

  await Promise.allSettled(
    paths.map(path =>
      fetch(`${url}?secret=${secret}&path=${encodeURIComponent(path)}`, {
        method: 'POST',
      })
    )
  );
}

module.exports = { revalidateStorefront };
```

Add to `backend/src/config/env.js`:
```js
app: {
  ...,
  storefrontUrl: process.env.STOREFRONT_URL || 'http://localhost:3000',
},
revalidate: {
  secret: process.env.REVALIDATE_SECRET || 'dev-only-revalidate-secret',
},
```

### 4.2 Storefront receiver

In Phase 5, the storefront will expose `apps/storefront/app/api/revalidate/route.ts` (verbatim from Next.js docs — see Phase 5.4).

### 4.3 Verification checklist

- [ ] `STOREFRONT_URL` and `REVALIDATE_SECRET` are env vars on backend (and Vercel project for storefront)
- [ ] Admin price update → backend logs "revalidation webhook 200"
- [ ] Hitting product page within 5s shows new price (no manual rebuild)

---

## Phase 5 — Storefront: skeleton, JSON-LD, ISR, fonts, images

**Goal:** Public site is SSR-streamed, SEO-rich, image-optimized, font-optimized. Users see skeleton on slow connections (never blank). AI crawlers get JSON-LD.

### 5.1 Per-route skeleton via `loading.tsx`

For every customer-facing route, add a `loading.tsx` sibling. **Copy this exact pattern** (from Phase 0):

```tsx
// apps/storefront/app/loading.tsx           (homepage skeleton)
// apps/storefront/app/products/[slug]/loading.tsx
// apps/storefront/app/cart/loading.tsx
// apps/storefront/app/checkout/loading.tsx

export default function Loading() {
  return (
    <div className="animate-pulse min-h-screen bg-paper-0">
      {/* hero skeleton */}
      <div className="h-[60vh] bg-paper-1" />
      {/* product grid skeleton */}
      <div className="container mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <div key={i}>
            <div className="aspect-square bg-paper-1 rounded-xl mb-4" />
            <div className="h-4 w-2/3 bg-paper-1 rounded mb-2" />
            <div className="h-4 w-1/3 bg-paper-1 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5.2 Convert pages to Server Components

The current `frontend 2/` pages mostly delegate to client components (`AppShell`, `HomePage` are `'use client'`). Refactor:

- **Server Component (data fetch + JSON-LD):** `app/page.tsx`, `app/products/[slug]/page.tsx`
- **Client Component (interactivity):** `HomePageInteractive.tsx`, `ProductDetailInteractive.tsx`, `CartDrawer`, `Navbar` (cart count)

**Example — `app/products/[slug]/page.tsx`:**
```tsx
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProductDetailInteractive } from '@/components/ProductDetailInteractive';
import { ProductDetailSkeleton } from '@/components/ProductDetailSkeleton';

export const revalidate = 3600; // ISR — refresh every hour by default

type Props = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  const res = await fetch(`${process.env.API_URL}/products/${slug}`, {
    next: { revalidate: 3600, tags: [`product:${slug}`, 'products'] },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — MOON Naturally Yours`,
    description: product.meta_description || product.description,
    openGraph: {
      title: product.name,
      description: product.meta_description,
      images: product.images?.map((img: any) => ({ url: img.url })),
    },
  };
}

export async function generateStaticParams() {
  const res = await fetch(`${process.env.API_URL}/products`);
  const products = await res.json();
  return products.map((p: any) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map((i: any) => i.url) ?? [],
    sku: product.id,
    brand: { '@type': 'Brand', name: 'MOON Naturally Yours' },
    offers: {
      '@type': 'Offer',
      url: `https://moonnaturallyyours.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.discount_price ?? product.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailInteractive product={product} />
      </Suspense>
    </>
  );
}
```

### 5.3 Sitewide JSON-LD in root layout

`apps/storefront/app/layout.tsx`:
```tsx
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MOON Naturally Yours',
  url: 'https://moonnaturallyyours.com',
  logo: 'https://moonnaturallyyours.com/logo.png',
  sameAs: ['https://instagram.com/moon...', /* etc */],
};
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MOON Naturally Yours',
  url: 'https://moonnaturallyyours.com',
};

// In <body>:
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, '\\u003c') }} />
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd).replace(/</g, '\\u003c') }} />
```

### 5.4 Revalidation receiver

`apps/storefront/app/api/revalidate/route.ts` — **verbatim from Next.js docs**:

```ts
import { revalidatePath, revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
  }
  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');
  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, path });
  }
  if (tag) {
    revalidateTag(tag, 'max');
    return Response.json({ revalidated: true, tag });
  }
  return Response.json({ revalidated: false, message: 'Missing path or tag' }, { status: 400 });
}
```

### 5.5 next/font (shared)

`packages/shared/src/fonts.ts`:
```ts
import { Space_Grotesk, Manrope, Fraunces, Syncopate } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-space-grotesk' });
export const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
export const fraunces = Fraunces({ subsets: ['latin'], display: 'swap', variable: '--font-fraunces' });
export const syncopate = Syncopate({ subsets: ['latin'], display: 'swap', weight: ['400', '700'], variable: '--font-syncopate' });

export const allFontVars = `${spaceGrotesk.variable} ${manrope.variable} ${fraunces.variable} ${syncopate.variable}`;
```

In each app's `layout.tsx`:
```tsx
import { allFontVars } from '@moon/shared/fonts';
<html lang="en" className={`${allFontVars} antialiased`}>...</html>
```

### 5.6 next/image config

`apps/storefront/next.config.ts`:
```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '<your-supabase-ref>.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
      {
        protocol: 'https',
        hostname: '<your-supabase-ref>.supabase.co',
        pathname: '/storage/v1/render/image/public/product-images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: { serverActions: { allowedOrigins: ['admin.moonnaturallyyours.com', 'moonnaturallyyours.com'] } },
};

export default config;
```

Use in components:
```tsx
<Image
  src={product.images[0].url}
  alt={product.images[0].alt}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={product.images[0].blurDataUrl}
  priority={isHero}
/>
```

### 5.7 Verification checklist

- [ ] `view-source:https://moonnaturallyyours.com/products/saffron` shows `<script type="application/ld+json">` with full Product schema
- [ ] Lighthouse SEO score ≥ 95
- [ ] Throttle network to "Slow 3G" — skeleton appears within 200ms
- [ ] `curl -X POST 'https://moonnaturallyyours.com/api/revalidate?secret=X&path=/products/saffron'` returns 200
- [ ] After admin price edit, refreshing product page within 10s shows new price
- [ ] Network tab shows AVIF/WebP images served from `_next/image` (not raw Supabase URL)
- [ ] No font CSS request to `fonts.googleapis.com` at runtime (next/font self-hosts)
- [ ] No FOUT — text renders with correct font on first paint

### 5.8 Anti-pattern guards

- ❌ Do NOT make pages `'use client'` at the top level — kills streaming SSR + JSON-LD.
- ❌ Do NOT use React Helmet anywhere — it's a React SPA pattern, breaks Next.js metadata.
- ❌ Do NOT pass `params.slug` directly in v16 — `await params` first.
- ❌ Do NOT call `revalidateTag('foo')` without 2nd arg in v16 — pass `'max'`.

---

## Phase 6 — Storefront: kill hardcoded data

**Goal:** Remove `lib/data/products.ts` from storefront. All product/shipping data flows from backend.

### 6.1 Tasks

1. **Delete `apps/storefront/lib/data/products.ts`** (the 224-line hardcoded catalog).
2. **Move `productStories` narrative metadata to backend.** Add columns to `products` table:
   ```sql
   ALTER TABLE public.products ADD COLUMN IF NOT EXISTS story jsonb;
   -- story = { subtitle, location, narrative, color, details: [...], featureName, featureDesc }
   ```
3. **Seed migration** to populate `story` for the existing 7 products from the current hardcoded data.
4. **Move `shippingZones` to backend.** New table:
   ```sql
   CREATE TABLE public.shipping_zones (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     states text[] NOT NULL,
     cost numeric(10,2) NOT NULL,
     eta_min_days int NOT NULL,
     eta_max_days int NOT NULL,
     is_active boolean DEFAULT true
   );
   ```
   Backend exposes `GET /api/shipping/zones` (public, ISR).
5. **Replace `useGetProductsQuery()` calls in client components** with props passed down from Server Component pages (so data is in SSR HTML, not hydration).

### 6.2 Anti-pattern guards

- ❌ Do NOT keep the hardcoded `catalogItems` "as fallback" — it will rot. If backend is down, show error UI instead.
- ❌ Do NOT fetch products inside `AppShell` (client) anymore — fetch in Server Component pages.

### 6.3 Verification checklist

- [ ] `git grep "catalogItems\|productStories\|shippingZones" apps/storefront/` returns 0
- [ ] Disabling JS in browser still shows full product page (SSR HTML test)
- [ ] Changing a product's `story.narrative` in DB → admin → reflects on storefront within 10s

---

## Phase 7 — Admin app: standalone with auth gate, product editor, image manager

**Goal:** Admin app is a fully independent Next.js app. Has its own `proxy.ts` basic-auth gate. Product editor lets non-developers update prices and upload images.

### 7.1 Admin layout (noindex everywhere)

`apps/admin/app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { allFontVars } from '@moon/shared/fonts';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'MOON Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${allFontVars} antialiased`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
```

`apps/admin/app/robots.ts`:
```ts
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
```

### 7.2 Product editor page

`apps/admin/app/products/page.tsx` (list, client component using RTK Query):
- Table of all products with: image thumbnail, name, slug, price, is_active toggle
- Click row → `/products/[id]`
- "New Product" button → `/products/new`

`apps/admin/app/products/[id]/page.tsx` (single product editor):
- **Price field** — number input, on save calls `PUT /api/admin/products/:id` with `{price}`
- **Discount price field** — number input or null
- **Name, description, meta_title, meta_description, theme** — text inputs
- **Images section:**
  - Drag-and-drop multi-file upload → `POST /api/admin/products/:id/images/upload`
  - Existing images grid with reorder (drag), delete, set-as-primary
  - Save reorder/delete → `PUT /api/admin/products/:id/images` with new array
- **Live preview iframe** of `https://moonnaturallyyours.com/products/<slug>?_preview=true` (optional)
- After every save, RTK Query invalidates `['Products']` tag so the list refreshes; backend triggers storefront revalidation.

### 7.3 Admin RTK Query endpoints (additions)

In `apps/admin/lib/store/services/admin-api.ts`, add to existing list:

```ts
getAdminProducts: builder.query<Product[], void>({
  query: () => '/products',
  providesTags: ['Products'],
}),
updateAdminProduct: builder.mutation<Product, { id: string; patch: Partial<Product> }>({
  query: ({ id, patch }) => ({
    url: `/admin/products/${id}`,
    method: 'PUT',
    body: patch,
  }),
  invalidatesTags: ['Products'],
}),
uploadProductImages: builder.mutation<{ uploaded: ImageMeta[] }, { id: string; files: File[] }>({
  query: ({ id, files }) => {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    return { url: `/admin/products/${id}/images/upload`, method: 'POST', body: formData };
  },
  invalidatesTags: ['Products'],
}),
updateProductImagesArray: builder.mutation<Product, { id: string; images: ImageMeta[] }>({
  query: ({ id, images }) => ({
    url: `/admin/products/${id}/images`,
    method: 'PUT',
    body: { images },
  }),
  invalidatesTags: ['Products'],
}),
```

### 7.4 Verification checklist

- [ ] `view-source:https://admin.moonnaturallyyours.com/` shows `<meta name="robots" content="noindex, nofollow, ...">`
- [ ] `https://admin.moonnaturallyyours.com/robots.txt` returns `User-agent: *\nDisallow: /`
- [ ] Login → product editor → change price → click save → toast "Saved" → open storefront → new price within 10s
- [ ] Drag 3 photos onto product editor → upload → 3 thumbnails appear → public storefront shows all 3
- [ ] Reorder images → save → storefront primary image changes
- [ ] Click "Deactivate" → storefront stops listing the product

### 7.5 Anti-pattern guards

- ❌ Do NOT put admin pages back under `/admin/*` URL prefix — admin app IS the admin, root paths only.
- ❌ Do NOT share the API client between apps — admin's client has the Bearer-token interceptor, storefront's must not.
- ❌ Do NOT cache admin API responses with ISR — must always be live (`cache: 'no-store'` or RTK Query default).

---

## Phase 8 — Deployment: two Vercel projects, DNS, env vars, auth gate

**Goal:** `moonnaturallyyours.com` and `admin.moonnaturallyyours.com` deployed independently from one repo. Admin gated. Env vars scoped per project.

### 8.1 Vercel project setup

1. **Create Vercel Project A** "moon-storefront":
   - Connect GitHub repo
   - Settings → Build & Deployment → **Root Directory: `apps/storefront`**
   - Framework Preset: Next.js (auto-detected)
   - Settings → Domains → Add `moonnaturallyyours.com` and `www.moonnaturallyyours.com` (with redirect)

2. **Create Vercel Project B** "moon-admin":
   - Same repo
   - Settings → Build & Deployment → **Root Directory: `apps/admin`**
   - Settings → Domains → Add `admin.moonnaturallyyours.com`

3. **DNS at registrar** (per Vercel dashboard prompts):
   | Host | Type | Value |
   |---|---|---|
   | `@` | A | (IP shown by Vercel for storefront project) |
   | `www` | CNAME | (CNAME shown by Vercel for storefront project) |
   | `admin` | CNAME | (CNAME shown by Vercel for admin project — DIFFERENT from storefront's) |

### 8.2 Env vars per project

**moon-storefront (Production):**
- `API_URL` = `https://api.moonnaturallyyours.com` (or wherever Express is hosted — Render/Railway)
- `NEXT_PUBLIC_API_URL` = same (for client-side cart calls)
- `REVALIDATE_SECRET` = (generate strong random)
- `NEXT_PUBLIC_SITE_URL` = `https://moonnaturallyyours.com`

**moon-admin (Production):**
- `NEXT_PUBLIC_API_URL` = `https://api.moonnaturallyyours.com`
- `ADMIN_BASIC_AUTH_USER` = (chosen username)
- `ADMIN_BASIC_AUTH_PASS` = (strong random — 32+ chars)
- `ADMIN_IP_ALLOWLIST` = (optional, e.g. `203.0.113.10,198.51.100.0/24`)

**backend (Render/Railway):**
- `STOREFRONT_URL` = `https://moonnaturallyyours.com`
- `REVALIDATE_SECRET` = (SAME value as storefront)
- `FRONTEND_URL` = `https://admin.moonnaturallyyours.com,https://moonnaturallyyours.com` (comma-split in cors.js)

### 8.3 Admin auth gate via `proxy.ts`

`apps/admin/proxy.ts` (Next 16 — file is `proxy.ts`, function is `proxy`):

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER = process.env.ADMIN_BASIC_AUTH_USER!;
const PASS = process.env.ADMIN_BASIC_AUTH_PASS!;
const ALLOWED_IPS = (process.env.ADMIN_IP_ALLOWLIST ?? '')
  .split(',').map(s => s.trim()).filter(Boolean);

export function proxy(request: NextRequest) {
  if (ALLOWED_IPS.length > 0) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '';
    if (!ALLOWED_IPS.includes(ip)) {
      return new Response('Forbidden', { status: 403 });
    }
  }
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    const [u, p] = atob(auth.slice(6)).split(':');
    if (u === USER && p === PASS) {
      const res = NextResponse.next();
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }
  }
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Moon Admin", charset="UTF-8"',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
```

Note: this is **two-factor**: basic auth (browser prompt) + JWT-based admin login (the existing flow inside the app). Basic auth keeps the entire app invisible; admin login is the in-app authorization.

### 8.4 CORS update

In `backend/src/config/cors.js`, allow both subdomains:
```js
const allowedOrigins = new Set(
  (env.app.frontendUrl ?? '').split(',').map(s => s.trim()).filter(Boolean)
);
```
Set `FRONTEND_URL=https://admin.moonnaturallyyours.com,https://moonnaturallyyours.com` in backend env.

### 8.5 Verification checklist

- [ ] Visiting `https://moonnaturallyyours.com` → public storefront, no auth
- [ ] Visiting `https://admin.moonnaturallyyours.com` → browser shows basic auth prompt
- [ ] Wrong password → 401, no app HTML leaks
- [ ] Correct password → admin login screen → enter admin email/password → dashboard loads
- [ ] `https://admin.moonnaturallyyours.com/robots.txt` returns disallow-all
- [ ] Google "site:admin.moonnaturallyyours.com" search → no results (after a few weeks)
- [ ] Update product price in admin → public site updates within 10s

### 8.6 Anti-pattern guards

- ❌ Do NOT enable Vercel Password Protection AND `proxy.ts` basic auth — pick one (proxy is free; Vercel is $150/mo Pro add-on).
- ❌ Do NOT exclude `/api/*` from the proxy matcher — admin's API routes need protection too.
- ❌ Do NOT commit env values to git — use Vercel dashboard.
- ❌ Do NOT use `Access-Control-Allow-Origin: *` if backend uses cookies — must echo specific origin.

---

## Phase 9 — Final verification

### 9.1 End-to-end smoke test

1. Open incognito → `https://moonnaturallyyours.com`
2. Watch DevTools → Network: HTML arrives with full content + JSON-LD in source
3. Throttle to "Slow 3G" → reload → skeleton appears in <500ms
4. Lighthouse → all 4 scores ≥ 95
5. View source → `<script type="application/ld+json">` present with Product schema
6. Open `https://admin.moonnaturallyyours.com` → basic auth → admin login → product editor
7. Change saffron price from ₹1250 → ₹1299 → save
8. Open new incognito → `https://moonnaturallyyours.com/products/saffron` → price shows ₹1299 within 10s
9. Upload 2 new photos → save → public site shows new gallery
10. Toggle "is_active = false" → public listing page no longer shows that product

### 9.2 Anti-pattern grep checks

```bash
# No middleware.ts (Next 16 uses proxy.ts)
git grep -l "export function middleware" apps/

# No deprecated single-arg revalidateTag
git grep -E "revalidateTag\([^,]+\)$" apps/

# No React Helmet anywhere
git grep "react-helmet" apps/ packages/

# No hardcoded products in storefront
git grep -E "catalogItems\s*=|productStories\s*=" apps/storefront/

# No admin token leaking into storefront
git grep "getAdminToken" apps/storefront/

# All `<script type="application/ld+json">` use the XSS-safe escape
git grep -A2 'application/ld\+json' apps/ | grep -v "\\\\u003c" | grep -v "^--$"
# (manual review: every match should be followed by .replace(/</g, '\\u003c'))
```

### 9.3 Subagent re-deployment for execution

When ready to **execute** this plan in the next session, dispatch:

| Phase | Subagent type | Prompt summary |
|---|---|---|
| 1 | `coder` | Restructure repo to monorepo per Phase 1 spec; verify `pnpm install` + boots |
| 2-4 | `backend-dev` | Apply DB migration, build admin product CRUD + image upload + revalidation client per Phase 2-4 |
| 5-6 | `coder` (frontend) | Build storefront Server Components, JSON-LD, ISR, skeleton, kill hardcoded data per Phase 5-6 |
| 7 | `coder` (frontend) | Build admin app with product editor, image manager, noindex per Phase 7 |
| 8 | `cicd-engineer` | Wire Vercel projects, DNS, env vars, basic-auth proxy per Phase 8 |
| 9 | `tester` + `reviewer` | Run all verification checklists, anti-pattern grep, Lighthouse |

Each subagent gets the relevant phase as its full prompt (self-contained per make-plan rules). Memory entries (see `MEMORY.md`) preserve cross-session context.

---

## Appendix A — File paths cheat sheet

| Concern | Path |
|---|---|
| Skeleton (homepage) | `apps/storefront/app/loading.tsx` |
| Skeleton (product) | `apps/storefront/app/products/[slug]/loading.tsx` |
| Product Server Component | `apps/storefront/app/products/[slug]/page.tsx` |
| JSON-LD Organization | `apps/storefront/app/layout.tsx` |
| Revalidation receiver | `apps/storefront/app/api/revalidate/route.ts` |
| next.config images | `apps/storefront/next.config.ts` |
| Shared fonts | `packages/shared/src/fonts.ts` |
| Admin layout (noindex) | `apps/admin/app/layout.tsx` |
| Admin robots | `apps/admin/app/robots.ts` |
| Admin auth gate | `apps/admin/proxy.ts` |
| Admin product editor | `apps/admin/app/products/[id]/page.tsx` |
| Backend migration | `backend/database/migrations/0003_products_multi_image.sql` |
| Backend revalidate client | `backend/src/integrations/revalidate.js` |
| Backend image upload | `backend/src/modules/products/products.upload.routes.js` |

## Appendix B — Open gaps (for follow-up)

- Generating `blurDataURL` for images uploaded BEFORE Phase 3 (need a one-time backfill script using `sharp`).
- Cross-subdomain auth cookies if you ever want SSO between admin and storefront — currently not needed (basic auth on admin, no auth on storefront).
- Image transformations via Supabase render endpoint vs Vercel `<Image>` — currently Vercel handles it; if image bandwidth becomes expensive on Vercel, swap to Supabase loader.
- Backup/restore strategy for `product-images` bucket.
- Razorpay webhook signature verification (move from current location to `apps/storefront/app/api/webhooks/razorpay/route.ts`).

---

**End of plan.** Total phases: 9. Estimated execution time with parallel subagents: 2-3 working days.
