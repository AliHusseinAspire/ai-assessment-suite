# StockSmart — Inventory Management System

AI-powered inventory management system built with Next.js 15, featuring smart categorization, predictive stock alerts, natural language search, and role-based access control. Built as part of a company assessment to demonstrate AI-driven full-stack development.

## Features

- **Full CRUD** — Create, read, update, and delete inventory items with rich forms
- **Status Tracking** — Automatic status management: In Stock, Low Stock, Ordered, Discontinued
- **Search & Filters** — Text search, category filters, status filters, and sort options via URL params
- **Category Management** — Color-coded categories with item counts
- **Role-Based Access Control** — Admin, Manager, and Viewer roles with server-enforced permissions
- **User Management** — Admin panel to manage users and assign roles
- **Dashboard** — KPI cards, stock status chart, category distribution pie chart, activity feed, low-stock alerts
- **Activity Logging** — Full audit trail of all inventory changes
- **Dark Mode** — System-aware theme toggle with full dark mode support
- **Responsive Design** — Mobile-first layout with collapsible sidebar and card-based mobile views
- **AI Features** — Natural language search, smart categorization, AI description generation, stock predictions

## Screenshots

> Screenshots will be added after deployment

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 (App Router) | Full-stack React framework |
| TypeScript (strict) | Type-safe development |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible component primitives |
| PostgreSQL (Supabase) | Managed database |
| Prisma | Type-safe ORM |
| Supabase Auth | Authentication & sessions |
| Groq (Llama 3.3 70B) | AI features (search, categorization, descriptions, predictions) |
| Recharts | Dashboard charts |
| Zod | Runtime validation |
| Turborepo | Monorepo build system |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database (Supabase recommended)
- Groq API key (for AI features — free, app works without it)
- Supabase: disable **"Enable email confirmations"** in Auth settings for testing

### Installation

```bash
# From the monorepo root
pnpm install

# Generate Prisma client
cd apps/inventory
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the dev server
pnpm dev
```

### Environment Variables

Create `apps/inventory/.env` based on `.env.example`:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) | Yes |
| `DIRECT_URL` | PostgreSQL direct connection string | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `GROQ_API_KEY` | Groq API key for AI features | No (graceful fallback) |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `apps/inventory`
4. Add environment variables
5. Deploy

The `next.config.ts` is pre-configured for monorepo transpilation.

## AI Features

### Natural Language Search
Type queries like "show me low stock electronics" or "cheapest items" and AI parses your intent into structured filters. Falls back to text search if AI is unavailable.

### Smart Categorization
When creating a new item, blur the name field and AI suggests the most appropriate category. Shown as a suggestion chip that auto-selects the category.

### AI Description Generation
Click "Generate with AI" next to the description field to auto-generate a professional product description based on the item name.

### Stock Predictions
The dashboard includes an AI predictions widget that analyzes inventory data and activity patterns to warn about items at risk of running out. Falls back to rule-based predictions (quantity below min threshold) when AI is unavailable.

## RBAC Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: CRUD items, manage categories, manage users, change roles, view all data |
| **Manager** | CRUD items, create/edit categories, view dashboard and activity. Cannot manage users. |
| **Viewer** | Read-only access: view items, categories, dashboard, and activity. Cannot create, edit, or delete. |

All permissions are enforced server-side. The UI hides unauthorized actions, but the server independently rejects unauthorized requests.
