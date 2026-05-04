# MOON Deployment Checklist

## Backend (`/backend`)

### Required env vars
| Variable | Notes |
|---|---|
| `JWT_SECRET` | Min 32 chars, random string |
| `SUPABASE_URL` | Project URL from Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret) |
| `FRONTEND_URL` | Comma-separated allowed CORS origins, e.g. `https://www.moonnaturallyyours.com,https://admin.moonnaturallyyours.com` |
| `STOREFRONT_URL` | Storefront base URL for on-demand ISR, e.g. `https://www.moonnaturallyyours.com` |
| `REVALIDATE_SECRET` | Random string — must match `REVALIDATE_SECRET` in storefront |
| `RAZORPAY_KEY` | Razorpay live key |
| `RAZORPAY_SECRET` | Razorpay live secret |
| `RAZORPAY_WEBHOOK_SECRET` | Set in Razorpay dashboard |
| `RESEND_API_KEY` | Transactional email |

### Database migrations to run (in order)
```
0001_extensions.sql
0002_core_schema.sql
0003_updated_at_triggers.sql
0004_carts.sql
0005_inventory_rpc.sql
0006_products_multi_image.sql   ← Phase 2: images jsonb, updated_by
0007_products_story_shipping.sql ← Phase 6: story jsonb, shipping_zones seed
```

### Supabase Storage
- Create bucket `product-images` (public read access)
- Set CORS policy to allow your backend domain

---

## Storefront (`/apps/storefront`)

### Required env vars
| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base, e.g. `https://api.moonnaturallyyours.com/api` |
| `REVALIDATE_SECRET` | Must match backend `REVALIDATE_SECRET` |

### Build & deploy
```bash
pnpm --filter @moon/storefront build
```
- Deploys to Vercel / any Node.js host
- On-demand ISR via `POST /api/revalidate?secret=<REVALIDATE_SECRET>&tag=products`

---

## Admin Panel (`/apps/admin`)

### Required env vars
| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base |
| `ADMIN_BASIC_AUTH_USER` | HTTP Basic Auth username |
| `ADMIN_BASIC_AUTH_PASS` | HTTP Basic Auth password (not `change-me-in-production`) |
| `NEXT_PUBLIC_ADMIN_OWNER_EMAIL` | Pre-fills the login email field |

### Build & deploy
```bash
pnpm --filter @moon/admin build
```
- Should be deployed behind HTTPS — the basic auth cookie is `Secure` in production
- The `X-Robots-Tag: noindex, nofollow` header is set on all routes

---

## Monorepo root

```bash
# Install all workspace deps
pnpm install

# Build everything
pnpm build

# Run storefront dev (port 3000)
pnpm dev:storefront

# Run admin dev (port 3001)
pnpm dev:admin
```

---

## Production launch sequence

1. Run all DB migrations against production Supabase
2. Create `product-images` storage bucket
3. Deploy backend (set all env vars)
4. Deploy storefront (set `NEXT_PUBLIC_API_URL`, `REVALIDATE_SECRET`)
5. Deploy admin (set `NEXT_PUBLIC_API_URL`, `ADMIN_BASIC_AUTH_*`)
6. Set `FRONTEND_URL` in backend to comma-separated list of both app domains
7. Verify `POST /api/revalidate?secret=…&tag=products` returns `{"revalidated":true}`
8. Log into admin panel, confirm products load
9. Upload product images via the product editor
10. Confirm storefront shows live product data with images
