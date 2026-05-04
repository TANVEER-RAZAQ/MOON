# CLAUDE.md

This file documents the current project structure and working rules for this repository.

## Project Status

This repository is now **frontend-focused** and uses a single active implementation:

- `frontend/` (React + TypeScript + Vite)

Backend implementation is intentionally out of scope for this repository and should be handled in a separate workstream/repository.

The previous root-level static prototype (`index.html`, `css/`, `js/`) has been removed to avoid duplicate sources of truth.

## Source of Truth

All active product UI code lives inside:

- `frontend/src`

All active static assets for the UI live inside:

- `frontend/public`

Top-level expected structure:

- `CLAUDE.md`
- `MOON_eCommerce_PRD_v1.md`
- `MOON_Developer_Quick_Start.md`
- `MOON_Technical_Implementation_Guide.md`
- `frontend/`

## Run Commands

From repo root:

```bash
cd frontend
npm install
npm run dev
```

Build:

```bash
cd frontend
npm run build
```

## Environment Variables

Create `frontend/.env.local` from `frontend/.env.example`.

Current frontend-facing variables used by auth/config:

- `VITE_ADMIN_OWNER_EMAIL`
- `VITE_ADMIN_OWNER_PASSWORD`
- `VITE_ADMIN_OWNER_NAME`
- `VITE_API_URL` (optional, defaults in code)

## Frontend Architecture

### Main entry and shell

- `frontend/src/main.tsx` — React root and Redux provider
- `frontend/src/App.tsx` — routing, admin route guard integration, cart drawer behavior, app-level event wiring

### Core pages

- `frontend/src/pages/HomePage.tsx` — cinematic storefront landing
- `frontend/src/pages/CartPage.tsx` — full-page cart route
- `frontend/src/pages/CheckoutPage.tsx` — checkout flow
- `frontend/src/pages/admin/*` — owner dashboard layouts

### Shared components

- `frontend/src/components/Navbar.tsx`
- `frontend/src/components/Footer.tsx`
- `frontend/src/components/CartDrawer.tsx`

### Store and data

- `frontend/src/store/slices/cartSlice.ts` — cart state
- `frontend/src/store/services/api.ts` — RTK Query scaffold
- `frontend/src/data/products.ts` — product catalog, stories, shipping zones

### Visual and interaction hooks

- `frontend/src/hooks/useStorytellingCanvas.ts` — hero frame-sequence canvas logic
- `frontend/src/hooks/useRevealAnimation.ts` — intersection-based reveal utility

### Styling

- `frontend/src/styles/global.css` — imports project CSS + Tailwind layers
- `frontend/src/styles/style.css` — core custom styles used by route pages
- `frontend/src/styles/animations.css` — keyframes
- `frontend/tailwind.config.cjs` — cinematic design tokens and font mapping

## Asset Layout

These folders must remain available for hero/cinematic frame rendering:

- `frontend/public/moon333`
- `frontend/public/moon2222`
- `frontend/public/ezgif-2fae6b36993927b6-jpg`

Frame naming convention expected by code:

- `ezgif-frame-001.jpg` ... `ezgif-frame-192.jpg`

## Routes

- `/` — storefront
- `/cart` — cart page
- `/checkout` — checkout page
- `/admin/login` — owner login
- `/admin/dashboard-overview`
- `/admin/inventory`
- `/admin/analytics-focus`

## Cleanup Notes

This repo was cleaned to reduce confusion and maintenance overhead:

- Removed legacy root static site files and folders
- Removed unused legacy React section components
- Moved frame assets under `frontend/public` (no external symlinks)
- Removed generated config/build artifacts from source tree

## Working Rules

- Keep frontend work inside `frontend/` unless explicitly requested otherwise.
- Do not reintroduce a second UI implementation at repo root.
- Prefer updating this file when architecture, run commands, or folder ownership changes.
