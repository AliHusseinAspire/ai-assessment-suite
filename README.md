# AI Assessment Suite

A monorepo containing two production-grade, AI-powered full-stack applications built **entirely using AI tools** (Claude Code, Cursor) as part of a company-mandated assessment. Evaluated on completeness, creativity, product quality, usability, and AI-driven implementation.

## Live Demos

| Application | URL |
|-------------|-----|
| **StockSmart** — Inventory Management | [ai-assessment-suite-inventory.vercel.app](https://ai-assessment-suite-inventory.vercel.app/) |
| **EventFlow** — Event Scheduler | [ai-assessment-suite-events.vercel.app](https://ai-assessment-suite-events.vercel.app/) |

## Applications

### StockSmart — Inventory Management System

Full CRUD inventory system with status tracking (in stock, low stock, ordered, discontinued), category management, role-based access control (Admin / Manager / Viewer), and a dashboard with KPI cards, stock charts, and activity feeds.

**AI Features:** Natural language search, smart categorization on item creation, AI-generated descriptions, predictive low-stock alerts.

> See [`apps/inventory/README.md`](apps/inventory/README.md) for full documentation.

### EventFlow — Event Scheduler Application

Event management platform with a monthly calendar view, RSVP system, invitation workflows, and role-based access (Owner / Member / Guest). Includes a dashboard with RSVP charts, upcoming events, and activity feeds.

**AI Features:** Natural language event creation, conflict detection with alternative suggestions, smart scheduling suggestions, AI-generated descriptions, natural language search.

> See [`apps/events/README.md`](apps/events/README.md) for full documentation.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | SSR, server actions, file-based routing |
| Language | TypeScript (strict) | Type safety across the full stack |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS with accessible components |
| Database | PostgreSQL (Supabase) | Managed Postgres with row-level security |
| ORM | Prisma | Type-safe queries, schema-as-code, migrations |
| Auth | Supabase Auth (@supabase/ssr) | Cookie-based sessions, SSR-compatible |
| AI | Groq (Llama 3.3 70B) | Fast inference for all AI features |
| Charts | Recharts | Dashboard data visualizations |
| Validation | Zod | Runtime schema validation at API boundaries |
| Monorepo | Turborepo + pnpm workspaces | Parallel builds, shared packages |
| Deployment | Vercel | Zero-config Next.js deploys, preview URLs |

## Project Structure

```
Assessment/
├── apps/
│   ├── inventory/             # StockSmart — Inventory Management
│   │   ├── app/               # Next.js App Router (pages, API routes)
│   │   ├── features/          # Domain logic (auth, inventory, dashboard)
│   │   ├── components/        # UI components (layout, forms, tables)
│   │   ├── lib/               # Utilities, AI client, auth, Supabase
│   │   └── prisma/            # Schema, migrations, seed
│   └── events/                # EventFlow — Event Scheduler
│       ├── app/               # Next.js App Router (pages, API routes)
│       ├── features/          # Domain logic (auth, events, invitations)
│       ├── components/        # UI components (layout, calendar, forms)
│       ├── lib/               # Utilities, AI client, auth, Supabase
│       └── prisma/            # Schema, migrations, seed
├── packages/
│   └── ui/                    # Shared UI library (components, hooks, utils)
├── turbo.json                 # Turborepo pipeline configuration
├── pnpm-workspace.yaml        # pnpm workspace definitions
└── package.json               # Root scripts and dependencies
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+
- A Supabase project (each app uses its own project)
- A Groq API key (free — AI features degrade gracefully without it)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd Assessment
pnpm install

# Set up an app (repeat for both apps/inventory and apps/events)
cd apps/inventory
cp .env.example .env          # Fill in your Supabase + Groq credentials
npx prisma generate           # Generate Prisma client
npx prisma db push            # Push schema to database
npx prisma db seed            # Seed sample data

# Run from monorepo root
cd ../..
pnpm dev                      # Starts both apps concurrently
```

StockSmart runs on [localhost:3000](http://localhost:3000), EventFlow on [localhost:3001](http://localhost:3001).

## Architecture Highlights

- **Server-first rendering** — React Server Components by default, `"use client"` only when needed
- **Server actions for mutations** — No REST API boilerplate; forms submit directly to server functions
- **Zod validation at every boundary** — Client-side form validation mirrors server-side schema checks
- **Server-enforced RBAC** — UI hides unauthorized actions, but the server independently rejects them
- **AI with graceful fallback** — Every AI feature wraps calls in `withAIFallback` so the app works without AI
- **Shared UI package** — Common components, hooks, and utilities shared across both apps via `@assessment/ui`

## AI Tools Used

| Tool | Role |
|------|------|
| **Claude Code** (Claude Opus) | Primary development — architecture, implementation, debugging, code review |
| **Cursor** | IDE-integrated AI assistance for rapid editing and iteration |

### AI-Driven Development Workflow

1. **Architecture & planning** — AI designed the monorepo structure, tech stack decisions, database schemas, and component hierarchy
2. **Feature implementation** — Full features generated through AI prompts: CRUD flows, auth, RBAC, dashboards, calendar views, invitation systems
3. **AI feature integration** — AI wrote the AI features themselves: prompt engineering, structured output parsing, fallback logic
4. **Iteration & polish** — UI refinements, dark mode, responsive design, and cross-app consistency all driven by AI pair programming
5. **Debugging & deployment** — Build errors, Prisma deployment issues, and Vercel configuration resolved through AI reasoning

## Deployment

Both apps are deployed independently on Vercel. Each has its own Supabase project for database and auth.

| App | Vercel Root Directory | Build Command |
|-----|----------------------|---------------|
| StockSmart | `apps/inventory` | `pnpm build` |
| EventFlow | `apps/events` | `pnpm build` |

See each app's README for detailed environment variable tables and deployment steps.

## License

Private — built for internal assessment purposes.
