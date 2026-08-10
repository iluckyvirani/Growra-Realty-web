# Growra Realty

Premium luxury real estate platform frontend — Next.js 15, TypeScript, Tailwind CSS, shadcn/ui.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui + Radix primitives
- **Icons:** Lucide React
- **Motion:** Framer Motion
- **Carousel:** Embla
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Charts:** Recharts
- **Maps:** Leaflet placeholder
- **Theme:** Light / Dark (next-themes)
- **Package manager:** pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # production build
pnpm start   # serve production build
pnpm lint    # ESLint
pnpm format  # Prettier
```

## Project structure

```
src/
├── app/              # App Router pages & API
├── components/       # UI, layout, home, property, search, dashboard…
├── constants/        # Brand, nav, budgets
├── data/             # Static JSON-style datasets
├── hooks/
├── lib/              # Utilities (cn, formatPrice, EMI…)
├── services/         # Data access / search
├── store/            # Zustand (wishlist, compare, auth, search)
└── types/            # Shared TypeScript types
```

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/buy` `/rent` `/commercial` `/luxury` `/projects` `/plots` `/pg` | Listings |
| `/property/[slug]` | Property details |
| `/builders/[slug]` | Builder profile |
| `/city/[slug]` | City listings |
| `/wishlist` `/compare` | Shortlist & compare |
| `/auth/*` | Login, signup, OTP, forgot password |
| `/dashboard` `/profile` | User areas |
| `/blog` `/about` `/contact` | Content & company |

## Brand

- Primary gold `#C89B3C`
- Cream background `#FAF8F3`
- Charcoal `#1B1B1B`

Data is static (no backend). Auth is mocked via Zustand persistence.
