# 🏠 MAISON — E-Commerce Store

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-3.12-00DC82?logo=nuxtdotjs&logoColor=white" alt="Nuxt 3" />
  <img src="https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Pinia-2.1-ffd859" alt="Pinia" />
  <img src="https://img.shields.io/badge/Architecture-FSD-blue" alt="FSD" />
</p>

A fully-featured e-commerce storefront built with **Nuxt 3**, **TypeScript**, **Pinia**, and **Feature-Sliced Design**. Includes product catalog, shopping cart, checkout flow, order tracking, and user profile.

## ✨ Features

- **Product Catalog** — 16 products, 5 categories, search, filtering, sorting
- **Product Detail** — full descriptions, stock info, quantity picker
- **Shopping Cart** — slide-out drawer, quantity controls, running total
- **Checkout Flow** — contact info, delivery address, payment method selection
- **Order Management** — order history with real-time status simulation
- **User Profile** — personal data editor, address book, order overview
- **Authentication** — login/register modals with auth guards
- **SSR / ISR** — server-side rendering with route-level cache rules
- **Server API** — Nitro API routes for products (ready for database swap)
- **Toast Notifications** — non-blocking feedback system
- **Responsive** — mobile-first layout, adaptive sidebar
- **Page Transitions** — smooth route animations

## 🏗 Architecture (Feature-Sliced Design)

```
src/
├── app/                    # Styles, plugins, middleware
├── layouts/                # Default layout (header + cart + auth + toasts)
├── middleware/              # Route guards (auth)
├── pages/                  # File-based routing
│   ├── index.vue           # Catalog
│   ├── products/[id].vue   # Product detail
│   ├── checkout.vue        # Checkout form
│   ├── orders.vue          # Order history
│   ├── profile.vue         # User profile
│   └── order-success.vue   # Post-checkout confirmation
├── widgets/                # Composite UI blocks
│   ├── app-header/         # Sticky nav with cart badge
│   └── cart-drawer/        # Slide-out cart panel
├── features/               # User interactions
│   ├── auth/               # Login/register modal + store
│   ├── manage-cart/        # Cart store (add, remove, qty)
│   ├── checkout/           # Checkout form logic
│   └── toast/              # Toast notification system
├── entities/               # Business objects
│   ├── product/            # Types, store, API, ProductCard
│   ├── order/              # Types, store, status config
│   └── user/               # User types
└── shared/                 # Helpers, composables, base UI
    └── lib/helpers/currency.ts

server/
├── api/products/           # GET /api/products, GET /api/products/:id
└── data/products.ts        # Product database (swap for Prisma/Drizzle)
```

## 🚀 Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Production build
pnpm preview      # Preview production
```

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Nuxt 3.12 (Vue 3.4) |
| **Language** | TypeScript 5.4 (strict) |
| **State** | Pinia 2.1 + persistence plugin |
| **Architecture** | Feature-Sliced Design v2 |
| **Styling** | SCSS + CSS Custom Properties |
| **Server** | Nitro API routes |
| **Images** | @nuxt/image |
| **Utilities** | VueUse 10, Zod 3 |

## 📄 License

MIT © 2025
