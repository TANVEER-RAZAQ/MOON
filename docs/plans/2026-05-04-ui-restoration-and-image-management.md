# MOON — UI Restoration & Image Management Plan
**Date:** 2026-05-04  
**Context:** Post Next.js migration audit. The migration is ~95% complete. All components, CSS tokens, animations and semantic classes are ported. Two real gaps remain plus one bug already fixed.

---

## Audit Summary (DO NOT RE-AUDIT — read this instead)

### What's confirmed PRESENT in Next.js
- All design tokens: paper/ink/saffron palette, spacing scale, type scale, motion presets (`--dur-*`, `--ease-*`)
- All semantic classes: `.moon-eyebrow`, `.moon-h2`, `.moon-lede`, `.moon-btn-primary`, `.moon-btn-saffron`, `.moon-btn-ghost`
- All components: Navbar, Hero, HeroProductMedia, HomepageClient, CartDrawer, ProductDetailModal, Footer
- All animations in `styles/animations.css`
- Video assets served from Vercel Blob (`https://kxxv61zbiojiooac.public.blob.vercel-storage.com`)
- Frame images in `apps/storefront/public/moon333/`, `moon2222/`, `ezgif-2fae6b36993927b6-jpg/`
- Multi-image upload UI in `apps/admin/app/(admin)/products/[id]/page.tsx` (drag-drop, reorder, alt text, primary indicator)
- Storefront multi-image gallery in `apps/storefront/app/products/[slug]/page.tsx`

### What was BROKEN (root causes)
1. **Admin 0 products** — `products.admin.routes.js:37` returned `{ products }` instead of `{ success, data }`. **FIXED** (2026-05-04).
2. **Storefront empty product grid** — `NEXT_PUBLIC_API_URL` env var not set in `apps/storefront/.env.local`. Backend defaults to `http://localhost:5000/api` but products only show if backend is running AND connected to Supabase.
3. **No products seeded in DB** — The 7 original products (Shilajit, Kashmiri Saffron, Kashmiri Honey, Irani Saffron, Kashmiri Almonds, Walnuts, Ghee) are missing from `public.products` table. Supabase only has schema, no seed data.
4. **Product images not in Supabase Storage** — `product-images` bucket needs images uploaded for each product.

---

## Phase 0 — Verified APIs (copy verbatim, do not invent)

### Backend public products endpoint
- `GET /api/products` — returns `{ success, data: Product[] }` (confirmed in `backend/src/modules/products/products.routes.js`)
- Response shape: `{ id, name, slug, description, price, discount_price, image_url, images: [{url, alt, order, blurDataUrl}], category, theme, is_active }`

### Backend admin endpoints (all require Bearer JWT with role=admin)
- `GET /api/admin/products` → `{ success: true, data: Product[] }` ✓ FIXED
- `POST /api/admin/products` → create, body: `{ name, price, category, theme, ... }`
- `PUT /api/admin/products/:id` → update, body: any subset of product fields
- `PUT /api/admin/products/:id/images` → replace images array `[{url, alt, order, blurDataUrl?}]`
- `POST /api/admin/products/:productId/upload` → multipart `images` field, returns `{ images: [...] }`

### Storefront page.tsx fetch pattern (verified)
```ts
const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/+$/, '');
const res = await fetch(`${apiBase}/products`, { next: { tags: ['products'] } });
const json = await res.json();
initialProducts = json.data ?? [];
```

### Admin RTK Query pattern (verified)
- Base URL: `process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'` (admin-api.ts:101)
- `unwrap` extracts `response.data` (admin-api.ts:103)
- Tag: `AdminProducts`

---

## Phase 1 — Env vars + backend connectivity (QUICK — 10 min)

**Goal:** Make `pnpm dev:storefront` show real products from the backend.

### 1.1 Create `apps/storefront/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
API_URL=http://localhost:5000/api
REVALIDATE_SECRET=dev-only-revalidate-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 1.2 Create `apps/admin/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
ADMIN_BASIC_AUTH_USER=admin
ADMIN_BASIC_AUTH_PASS=localonly
```

### 1.3 Create `backend/.env` (copy from .env.example, fill in real values)
```
NODE_ENV=development
PORT=5000
JWT_SECRET=<your-32-char-string>
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
FRONTEND_URL=http://localhost:3000,http://localhost:3001
STOREFRONT_URL=http://localhost:3000
REVALIDATE_SECRET=dev-only-revalidate-secret
```

### 1.4 Verification
- [ ] `cd backend && npm run dev` → no errors, listens on :5000
- [ ] `curl http://localhost:5000/api/products` → returns `{ success: true, data: [] }` (empty is OK)
- [ ] `pnpm dev:storefront` → homepage loads without network errors in console
- [ ] `pnpm dev:admin` → admin loads, products tab shows "0 products" (not an error)

---

## Phase 2 — Seed products into Supabase

**Goal:** Get the 7 MOON products into `public.products` so they appear in the store.

### 2.1 SQL seed — run in Supabase SQL Editor

```sql
INSERT INTO public.products (name, slug, description, price, discount_price, image_url, category, theme, meta_title, meta_description, is_active)
VALUES
  ('Himalayan Shilajit', 'shilajit', 'Purified Himalayan resin — gold grade, third-party tested. Harvested above 16,000 ft.', 1999, NULL, NULL, 'Himalayan Minerals', 'shilajit', 'Himalayan Shilajit — MOON Naturally Yours', 'Gold-grade Himalayan Shilajit resin, third-party tested for purity and potency.', true),
  ('Kashmiri Saffron', 'kashmiri-saffron', 'Mongra A++ threads from Pampore, hand-sorted at dawn. Unmatched aroma and color.', 850, NULL, NULL, 'Spices & Rituals', 'kashmiriSaffron', 'Kashmiri Saffron — MOON Naturally Yours', 'Hand-selected Mongra A++ saffron from Pampore, Kashmir. Purest threads.', true),
  ('Kashmiri Honey', 'kashmiri-honey', 'Wild mountain raw honey. Harvested from wildflower meadows above Pahalgam. Enzyme-alive, never heated.', 1150, NULL, NULL, 'Honey & Elixirs', 'kashmiriHoney', 'Kashmiri Honey — MOON Naturally Yours', 'Wild mountain raw honey from the meadows of Pahalgam. Unfiltered and enzyme-alive.', true),
  ('Irani Saffron', 'irani-saffron', 'Negin grade threads — the premium tier of Iranian saffron. Deep color, intoxicating aroma.', 1050, NULL, NULL, 'Spices & Rituals', 'iraniSaffron', 'Irani Saffron — MOON Naturally Yours', 'Negin grade Irani saffron threads. Premium color and aroma.', true),
  ('Kashmiri Almonds', 'kashmiri-almonds', 'Premium whole kernels from Kashmir valleys. Thin-skinned, naturally sweet.', 899, NULL, NULL, 'Dry Fruits & Nuts', 'kashmiriAlmonds', 'Kashmiri Almonds — MOON Naturally Yours', 'Premium Kashmiri almonds — thin-skinned, naturally sweet whole kernels.', true),
  ('Kashmiri Walnuts', 'walnuts', 'Light kernel, paper-thin shell — the hallmark of genuine Kashmiri walnuts.', 750, NULL, NULL, 'Dry Fruits & Nuts', 'walnuts', 'Kashmiri Walnuts — MOON Naturally Yours', 'Genuine Kashmiri walnuts with paper-thin shells and light, buttery kernels.', true),
  ('Kashmiri Ghee', 'kashmiri-ghee', 'Pure cultured butter ghee from Kashmiri cows. Clarified low-and-slow for maximum nutrition.', 1200, NULL, NULL, 'Ghee & Dairy', 'kashmiriGhee', 'Kashmiri Ghee — MOON Naturally Yours', 'Pure cultured butter ghee from pasture-raised Kashmiri cows.', true)
ON CONFLICT (slug) DO NOTHING;
```

### 2.2 Seed inventory for each product

```sql
INSERT INTO public.inventory (product_id, quantity, reserved, sku)
SELECT id, 100, 0, UPPER(REPLACE(slug, '-', '_')) || '_001'
FROM public.products
WHERE slug IN ('shilajit','kashmiri-saffron','kashmiri-honey','irani-saffron','kashmiri-almonds','walnuts','kashmiri-ghee')
ON CONFLICT (product_id) DO NOTHING;
```

### 2.3 Verification
- [ ] `SELECT COUNT(*) FROM public.products;` → 7
- [ ] `curl http://localhost:5000/api/products` → returns array of 7 products
- [ ] Storefront homepage shows 7 products in product grid
- [ ] Admin products tab shows 7 products

---

## Phase 3 — Upload product images via admin panel

**Goal:** Each product gets real images in Supabase Storage so storefront shows them.

### 3.1 Create Supabase Storage bucket (if not done)
1. Supabase dashboard → Storage → New bucket → name: `product-images` → Public: ON
2. Run RLS policy:
```sql
CREATE POLICY "Service role full access" ON storage.objects
  FOR ALL TO service_role USING (bucket_id = 'product-images');
```

### 3.2 Upload images per product
1. Go to `http://localhost:3001` → Admin login → Products tab
2. Click each product → scroll to Images section
3. Drag and drop product images (the images from `apps/storefront/public/moon333/`, `moon2222/`, `ezgif-*/` can be used as starting images)
4. The upload endpoint (`POST /api/admin/products/:id/upload`) stores in Supabase and generates blur placeholders automatically

### 3.3 Verification
- [ ] Each product has at least 1 image in Supabase Storage
- [ ] `SELECT images FROM public.products WHERE slug = 'shilajit';` → non-empty jsonb array
- [ ] Storefront product cards show real product images
- [ ] Clicking a product shows the image gallery (`sortedImages.length > 1` shows grid)

---

## Phase 4 — Visual QA: confirm storefront matches React screenshots

**Goal:** Side-by-side verification that the Next.js storefront matches the 4 screenshots.

### 4.1 Checklist by screenshot

**Screenshot 1 (Hero — Kashmiri Honey, 03/03):**
- [ ] Counter shows `03 / 03 · HIMALAYAN ORIGIN` (check `SLIDE_CONFIG[2]`)
- [ ] Heading in Syncopate: `KASHMIRI HONEY`
- [ ] Italic subtitle in Fraunces: `Meadows of Pahalgam.`
- [ ] Feature tags visible (WILD ALPINE HARVESTED, UNFILTERED & RAW, ENZYME-RICH PURITY)
- [ ] Price `₹1,150` visible
- [ ] `SHOP NOW` (dark) + `EXPLORE` (ghost) buttons

**Screenshot 2 (Product grid):**
- [ ] 5-column grid on desktop
- [ ] Product cards show: category eyebrow, product image, name in serif, star rating, price, ADD TO CART button
- [ ] Card backgrounds use `CARD_THEMES` per product (dark gradients per product)
- [ ] Saffron card's ADD TO CART button is orange/saffron color

**Screenshot 3 (Archive section):**
- [ ] Split layout: product image left, text right
- [ ] `THE ARCHIVE` eyebrow
- [ ] Product name in serif, italic tagline in saffron/accent color
- [ ] Navigation dots (3 slides)

**Screenshot 4 (Newsletter + Footer):**
- [ ] `Letters, not marketing.` heading in serif
- [ ] Email input + SUBSCRIBE button (orange)
- [ ] Black footer with 4 columns: MOON logo, SHOP, COMPANY, FOLLOW US
- [ ] Social icons (Instagram, Facebook, YouTube, X)

### 4.2 Anti-pattern grep checks
```bash
# No middleware.ts
grep -r "export function middleware" apps/
# No hardcoded admin token in storefront
grep -r "getAdminToken" apps/storefront/
# No single-arg revalidateTag
grep -rE "revalidateTag\([^,]+\)$" apps/
```

---

## Phase 5 — Production prep

### 5.1 Vercel env vars (set in dashboard, NOT committed)

**moon-storefront project:**
```
NEXT_PUBLIC_API_URL = https://your-backend.onrender.com/api
API_URL = https://your-backend.onrender.com/api
REVALIDATE_SECRET = <same-as-backend>
NEXT_PUBLIC_SITE_URL = https://moonnaturallyyours.com
```

**moon-admin project:**
```
NEXT_PUBLIC_API_URL = https://your-backend.onrender.com/api
ADMIN_BASIC_AUTH_USER = admin
ADMIN_BASIC_AUTH_PASS = <32-char-random>
```

### 5.2 Render env vars (set in dashboard)
```
NODE_ENV = production
SUPABASE_URL = https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY = <key>
JWT_SECRET = <32-char-random>
FRONTEND_URL = https://moonnaturallyyours.com,https://admin.moonnaturallyyours.com
STOREFRONT_URL = https://moonnaturallyyours.com
REVALIDATE_SECRET = <same-as-storefront>
RAZORPAY_KEY = rzp_live_...
RAZORPAY_SECRET = ...
```

---

## Subagent Dispatch (for execution in new sessions)

| Phase | Subagent | Task |
|---|---|---|
| 1 | `coder` | Create `.env.local` files for storefront + admin |
| 2 | Manual | Run seed SQL in Supabase SQL Editor |
| 3 | Manual | Upload images via admin panel UI |
| 4 | `reviewer` | Visual QA against 4 screenshots, report gaps |
| 5 | `cicd-engineer` | Set Vercel + Render env vars |

---

## Already Fixed
- ✅ Admin 0 products: `products.admin.routes.js:37` — changed `{ products }` → `{ success: true, data: products }`
- ✅ `proxy.ts` — removed `proxyGuard` import from layout, stripped browser basic-auth prompt
- ✅ Admin login: bcrypt comparison flow confirmed correct; user needs to exist in `public.users` via `/api/auth/register`
