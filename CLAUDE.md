# Assessment Project — CLAUDE.md

## Context

Company-mandated AI assessment: build 2 out of 5 full-stack apps **purely using AI tools** (Claude, Cursor). Evaluated on completeness, creativity, product quality, usability, and AI-driven implementation.

## Chosen Scenarios

### Version 4 — Inventory Management System (Primary, build first)
- CRUD for inventory items (name, quantity, category, metadata)
- Status tracking: `in stock`, `low stock`, `ordered`, `discontinued`
- Search by name, category, stock status, attributes
- Role-based access control (RBAC)
- AI features: smart categorization, low-stock predictions, natural language search
- Deployed live with working auth

### Version 5 — Event Scheduler Application (Secondary)
- CRUD for events (title, date/time, location, description)
- Status tracking: `upcoming`, `attending`, `maybe`, `declined`
- Search by title, date range, location
- User accounts with invitation system
- AI features: smart scheduling, NL event creation, conflict detection
- Deployed live with working auth

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG, API routes, file-based routing, easy deployment on Vercel |
| Language | **TypeScript (strict)** | Type safety, better DX, catch bugs at compile time |
| Styling | **Tailwind CSS + shadcn/ui** | Utility-first, consistent design system, accessible components out of the box |
| Database | **PostgreSQL via Supabase** | Managed Postgres, built-in auth, row-level security, real-time subscriptions |
| ORM | **Prisma** | Type-safe queries, migrations, schema-as-code |
| Auth | **Supabase Auth (or NextAuth.js)** | SSO-ready, role management, session handling |
| AI | **OpenAI API / Anthropic API** | For AI features (search, categorization, NL input) |
| Deployment | **Vercel** | Zero-config Next.js deploys, preview URLs, edge functions |
| State Mgmt | **React Server Components + minimal client state** | Leverage RSC where possible, zustand/context only when needed |

---

## Project Structure (Monorepo — both apps share core)

```
Assessment/
├── CLAUDE.md                  # This file
├── apps/
│   ├── inventory/             # V4 — Inventory Management
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── (auth)/        # Auth-gated route group
│   │   │   ├── (public)/      # Public routes (login, register)
│   │   │   ├── api/           # API route handlers
│   │   │   └── layout.tsx     # Root layout
│   │   ├── prisma/            # Prisma schema + migrations
│   │   └── next.config.ts
│   └── events/                # V5 — Event Scheduler
│       ├── app/
│       ├── prisma/
│       └── next.config.ts
├── packages/
│   └── ui/                    # Shared UI components (both apps reuse)
│       ├── components/
│       │   ├── data-table/    # Generic sortable/filterable table
│       │   ├── forms/         # Form primitives (input, select, etc.)
│       │   ├── layout/        # Shell, sidebar, header, footer
│       │   ├── feedback/      # Toast, alert, modal, confirm dialog
│       │   └── search/        # Search bar, filters, AI search
│       ├── hooks/             # Shared React hooks
│       ├── lib/               # Shared utilities
│       └── index.ts           # Barrel export
└── package.json               # Workspace root (pnpm/turborepo)
```

---

## Architecture Principles

### 1. Clean Architecture — Separation of Concerns
- **app/** — routing, layouts, page-level data fetching only
- **features/** — domain-specific logic grouped by feature (e.g., `features/inventory/`, `features/events/`)
- **components/** — purely presentational, no business logic
- **lib/** — utilities, API clients, constants
- **server/** — server actions, database queries, validation

### 2. Component Design
- **Atomic design mindset**: build small, compose up. Buttons → FormFields → Forms → Pages
- **Every component must be reusable or justify why it's not**
- Props over internal state. Lift state only when needed
- Use **composition** (`children`, render props) over prop drilling
- Colocate component + styles + types + tests in the same directory

### 3. Naming Conventions
| Item | Convention | Example |
|------|-----------|---------|
| Files/folders | `kebab-case` | `data-table.tsx`, `use-debounce.ts` |
| Components | `PascalCase` | `DataTable`, `SearchBar` |
| Functions/hooks | `camelCase` | `useDebounce`, `formatCurrency` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_PAGE_SIZE`, `DEFAULT_ROLE` |
| Types/interfaces | `PascalCase` | `InventoryItem`, `UserRole` |
| Database tables | `snake_case` | `inventory_items`, `user_roles` |
| API routes | `kebab-case` | `/api/inventory-items` |
| Env variables | `UPPER_SNAKE_CASE` prefixed | `NEXT_PUBLIC_API_URL`, `DATABASE_URL` |

### 4. TypeScript Rules
- `strict: true` — no exceptions
- No `any`. Use `unknown` + type guards when the type is truly unknown
- Define explicit return types on exported functions
- Use discriminated unions for status fields (not raw strings)
- Prefer `interface` for object shapes, `type` for unions/intersections
- Zod schemas for runtime validation at API boundaries

### 5. API & Data Layer
- Server Actions for mutations (forms, create/update/delete)
- Route Handlers (`app/api/`) only for external integrations or webhooks
- Validate **all** inputs with Zod at the boundary — never trust the client
- Use Prisma transactions for multi-step mutations
- Pagination: cursor-based for lists, offset for admin tables
- Error responses follow a consistent shape: `{ error: string, code: string }`

### 6. Error Handling
- Never swallow errors silently
- Use error boundaries (`error.tsx`) at route segment level
- Server actions return `{ success: true, data } | { success: false, error }` — no throwing across the network
- Log server errors with context (user, action, input)
- User-facing error messages must be helpful, never expose internals

### 7. Auth & RBAC Pattern
- Middleware-level auth check for protected routes
- Role enum: `ADMIN`, `MANAGER`, `VIEWER` (V4) / `OWNER`, `MEMBER`, `GUEST` (V5)
- Permission checks happen at the **server action / API layer**, not just UI
- UI hides unauthorized actions but the server **enforces** them independently

### 8. Styling Rules
- Tailwind utility classes only — no custom CSS unless absolutely necessary
- Use `cn()` helper (clsx + tailwind-merge) for conditional classes
- Design tokens via Tailwind config (colors, spacing, fonts) — no magic numbers
- Dark mode support from day one (`dark:` variants)
- Mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)

### 9. Performance
- Use React Server Components by default; add `"use client"` only when needed
- Lazy load heavy components (`next/dynamic`)
- Optimize images with `next/image`
- Debounce search inputs (300ms)
- Use `loading.tsx` skeletons for route-level loading states

### 10. Git Workflow
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- One logical change per commit
- Branch naming: `feature/v4-inventory-crud`, `fix/v4-search-filter`
- No committing `.env`, secrets, or `node_modules`

---

## AI Features Strategy

Both apps must include meaningful AI features. Prioritize these:

| Feature | Implementation | Applies To |
|---------|---------------|------------|
| Natural language search | User types "show me items running low" → AI parses intent → structured query | V4, V5 |
| Smart categorization | AI suggests category/tags on item creation based on name/description | V4 |
| Predictive alerts | AI analyzes usage patterns → warns about low stock before it happens | V4 |
| NL event creation | "Team standup every weekday at 9am" → auto-fills event form | V5 |
| Conflict detection | AI checks for scheduling overlaps and suggests alternatives | V5 |
| Smart descriptions | AI generates/improves item or event descriptions | V4, V5 |

---

## Definition of Done (per feature)

- [ ] Core functionality works end-to-end
- [ ] Input validation on client AND server
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading and error states handled
- [ ] Accessible (keyboard nav, screen reader labels, ARIA)
- [ ] No TypeScript errors, no lint warnings
- [ ] Deployed and verified on live URL

---

## README Standards

Each app (`apps/inventory/`, `apps/events/`) **must** include a `README.md` with:

1. **Project overview** — what the app does, one-paragraph description
2. **Feature list** — bullet points of all implemented features
3. **Screenshots** — at least 3 (dashboard, list view, detail/form view); placeholders acceptable initially
4. **Tech stack** — table of technologies used
5. **Getting started** — prerequisites, install steps, env setup, DB migration, seed, run dev server
6. **Environment variables** — table with variable name, description, required/optional
7. **Deployment instructions** — Vercel deployment steps
8. **AI features** — explanation of each AI feature and how it works
9. **RBAC roles** — table describing each role and its permissions
