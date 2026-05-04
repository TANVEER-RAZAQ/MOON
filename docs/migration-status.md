# MOON Next.js 16 Migration Status

## Phase 1 — pnpm monorepo scaffold
**Status: DONE**

- `pnpm-workspace.yaml` — declares `apps/*` and `packages/*`
- `packages/shared` — `@moon/shared` with types + module-scope fonts
- `apps/storefront` — Next.js 16.2.4 storefront, port 3000
- `apps/admin` — Next.js 16.2.4 admin panel, port 3001
- Split API: `storefront-api.ts` (no auth) and `admin-api.ts` (Bearer token)
- All anti-patterns enforced: no `middleware.ts`, correct `revalidateTag('foo','max')`, `await params`, JSON-LD sanitised

---

## Phase 2 — Backend schema + product admin CRUD
**Status: DONE**

- Migration `0006_products_multi_image.sql` — `images jsonb`, `updated_by`, index
- `products.admin.routes.js` — GET/POST/PUT/DELETE + PUT `:id/images` behind `requireAuth+requireAdmin`
- Zod validation on all writes
- Fire-and-forget `revalidateStorefront()` after mutations
- `integrations/revalidate.js` + `env.js` updated with `storefrontUrl` + `revalidate.secret`

---

## Phase 3 — Backend image upload
**Status: DONE**

- `products.upload.routes.js` — `POST /api/admin/products/:productId/upload`
- multer memory storage, max 5 files × 5 MB
- sharp: 1400px webp (q85) + 10px blur placeholder (base64 data URL)
- Uploads to Supabase Storage bucket `product-images`
- Returns `[{url, alt, order, blurDataUrl}]`

---

## Phase 4 — Revalidation client
**Status: DONE** (delivered as part of Phase 2)

- `backend/src/integrations/revalidate.js`
- `STOREFRONT_URL` + `REVALIDATE_SECRET` env vars
- `storefront/app/api/revalidate/route.ts` correctly uses `revalidateTag(tag, 'max')`

---

## Phase 5 — Storefront SSR, ISR, JSON-LD, fonts
**Status: DONE**

- `products/[slug]/page.tsx` — Server Component, `revalidate=3600`, `await params`
- `generateStaticParams` fetches slugs from backend
- `generateMetadata` per product (title/desc/OG/Twitter/canonical)
- Product JSON-LD sanitised with `.replace(/</g, '\\u003c')`
- `<Image>` with `placeholder="blur"` + `blurDataURL`
- `app/loading.tsx` + `products/[slug]/loading.tsx` pulse skeletons

---

## Phase 6 — Kill hardcoded data + shipping migration
**Status: DONE**

- Migration `0007_products_story_shipping.sql` — `story jsonb`, `shipping_zones` table seeded
- `lib/data/products.ts` deleted → replaced by `lib/data/product-statics.ts` (editorial constants only)
- `app/page.tsx` converted to Server Component with `revalidate=3600`; fetches products server-side
- `components/HomepageClient.tsx` — client component with `initialProducts` prop

---

## Phase 7 — Admin app pages + proxy.ts gate
**Status: DONE**

- `proxy.ts` — `proxyGuard()` checks `__admin_gate` cookie; called from root layout
- `app/api/basic-auth/route.ts` — HTTP Basic Auth challenge / cookie issue
- `next.config.ts` — `X-Robots-Tag: noindex`, `X-Frame-Options: DENY` on all routes
- `products/page.tsx` — table with thumbnail, is_active toggle, edit link
- `products/[id]/page.tsx` — full editor: fields, SEO, drag-reorder image upload

---

## Phase 8 — Deployment config + docs
**Status: DONE**

- `backend/src/config/cors.js` — `FRONTEND_URL` comma-split for multi-origin
- `docs/deployment-checklist.md` — full production launch sequence
- `docs/migration-status.md` — this file

---

## Known limitations / future work

- `productStories` editorial content still lives in `lib/data/product-statics.ts` — should be migrated to the `story jsonb` column in Supabase via an admin editor (Phase 7+ scope)
- AppShell still uses `useGetProductsQuery()` as background refresh alongside server-provided `initialProducts` — could be removed to eliminate client-side product fetch entirely
- No automated E2E tests — add Playwright for cart flow and admin CRUD
- Razorpay webhook handler exists but payment flow is not tested end-to-end
