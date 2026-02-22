# EventFlow — Event Scheduler Application

A full-stack event scheduling platform built with Next.js 15, featuring AI-powered event creation, smart scheduling suggestions, conflict detection, and a monthly calendar view. Designed for teams to organize, manage, and RSVP to events with role-based access control.

## Features

- **Event Management** — Create, edit, cancel, and delete events with rich details (title, description, location, date/time, color coding, max attendees)
- **Monthly Calendar** — Interactive calendar grid with color-coded event dots, day popovers, and month navigation
- **RSVP System** — Attend, maybe, or decline events; real-time attendee counts and status tracking
- **Invitation System** — Send invitations to users by email with optional messages; accept/maybe/decline responses
- **Dashboard** — KPI cards (total events, upcoming, attending, pending invites), RSVP distribution chart, recent activity feed, upcoming events list
- **AI Quick Create** — Describe an event in natural language ("Team standup tomorrow at 9am in Room 101") and auto-fill the form
- **AI Scheduling Suggestions** — Analyzes your week and suggests optimal free time slots
- **AI Conflict Detection** — Warns about overlapping events when creating/editing and suggests alternatives
- **AI Event Descriptions** — Auto-generate professional descriptions from event title and location
- **AI Natural Language Search** — Search events with phrases like "meetings next week" or "cancelled events"
- **Role-Based Access Control** — OWNER, MEMBER, and GUEST roles with granular permissions
- **Dark Mode** — Full light/dark theme support with teal/emerald color palette
- **Responsive Design** — Mobile-first layout with collapsible sidebar

## Screenshots

> Screenshots to be added after deployment.

| View | Description |
|------|-------------|
| Dashboard | KPI cards, RSVP stacked bar chart, upcoming events, activity feed |
| Events List | Searchable table with status filters and AI search toggle |
| Event Detail | Full event info, RSVP buttons, attendee list, activity timeline |
| Create Event | Form with AI quick create, description generator, conflict detection |
| Calendar | Monthly grid with color-coded event dots and day popovers |
| Invitations | Pending and responded invitation cards with action buttons |

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | SSR, server actions, file-based routing |
| Language | TypeScript (strict) | Type safety across the full stack |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS with accessible components |
| Database | PostgreSQL (Supabase) | Managed Postgres with connection pooling |
| ORM | Prisma | Type-safe queries, schema-as-code |
| Auth | Supabase Auth (@supabase/ssr) | Cookie-based sessions, SSR-compatible |
| AI | Groq (llama-3.3-70b-versatile) | Fast inference for all AI features |
| Charts | Custom CSS + Recharts | RSVP stacked bar, data visualizations |
| Calendar | date-fns | Date math for calendar grid computation |
| Validation | Zod | Runtime schema validation at API boundaries |
| Notifications | Sonner | Toast notifications |
| Theming | next-themes | Light/dark mode toggle |
| Icons | Lucide React | Consistent icon set |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- A Supabase project (for auth and database)
- A Groq API key (for AI features)

### Installation

```bash
# From the monorepo root
pnpm install

# Generate Prisma client
cd apps/events
npx prisma generate
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

### Database Setup

The events app uses its own dedicated Supabase project (separate from inventory):

```bash
npx prisma db push
```

### Seed Data

Populate the database with sample data (3 users, 12 events, RSVPs, invitations, activities):

```bash
npx prisma db seed
```

### Run Development Server

```bash
# From monorepo root
pnpm dev --filter @assessment/events

# Or from apps/events
pnpm dev
```

The app runs on [http://localhost:3001](http://localhost:3001).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) | Yes |
| `DIRECT_URL` | Direct database URL (bypasses PgBouncer) | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `OPENAI_API_KEY` | Groq API key for AI features | Yes |
| `OPENAI_BASE_URL` | Groq API base URL (`https://api.groq.com/openai/v1`) | Yes |
| `OPENAI_MODEL` | AI model name (`llama-3.3-70b-versatile`) | Yes |

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set the root directory to `apps/events`
3. Configure environment variables in the Vercel dashboard
4. Set the build command to `pnpm build`
5. Set the install command to `pnpm install`
6. Deploy — Vercel auto-detects Next.js

### Post-Deployment

- Run `npx prisma db push` against your production database to create tables
- Optionally run `npx prisma db seed` to populate sample data

## AI Features

### 1. Natural Language Event Creation (`/api/ai/parse-event`)
Type a description like "Team standup every weekday at 9am in Room 101" into the AI Quick Create widget on the event form. The AI parses it into structured fields (title, description, location, start/end dates, all-day flag) and auto-fills the form.

### 2. Conflict Detection (`/api/ai/conflicts`)
When creating or editing an event, the system checks for time overlaps with existing events. Uses a hybrid approach: code-level date overlap detection for accuracy, plus AI-powered suggestions for resolving conflicts (e.g., alternative time slots).

### 3. Smart Scheduling Suggestions (`/api/ai/suggest-times`)
Available on the dashboard. Analyzes your week's schedule and suggests 3-5 optimal free time slots for new events, with reasons for each suggestion (e.g., "Morning slot before your afternoon meetings").

### 4. AI Event Descriptions (`/api/ai/describe`)
Click "Generate with AI" on the event form to auto-generate a professional event description based on the title and location. Useful for quickly creating well-written event listings.

### 5. Natural Language Search (`/api/ai/search`)
Toggle the AI search mode (Sparkles icon) on the events list page. Type queries like "meetings next week", "cancelled events", or "events in the auditorium" — the AI translates them into structured filters applied to the event list.

All AI features use the `withAIFallback` wrapper for graceful degradation — if the AI service is unavailable, the app continues to function with manual input.

## RBAC Roles

| Permission | OWNER | MEMBER | GUEST |
|---|---|---|---|
| View dashboard | Yes | Yes | Yes |
| View events | Yes | Yes | Yes |
| View calendar | Yes | Yes | Yes |
| Create events | Yes | Yes | No |
| Edit own events | Yes | Yes | No |
| Edit any event | Yes | No | No |
| Delete events | Yes | No | No |
| Cancel events | Yes | Yes (own) | No |
| Send invitations | Yes | Yes | No |
| Respond to invitations | Yes | Yes | Yes |
| Manage users/roles | Yes | No | No |
| Update profile | Yes | Yes | Yes |

### Role Descriptions

- **OWNER** — Full administrative access. Can manage all events, users, and roles. Default role for the first user or promoted users.
- **MEMBER** — Can create and manage their own events, send invitations, and RSVP. Cannot manage other users or delete events they don't own.
- **GUEST** — Read-only access to events, calendar, and dashboard. Can respond to invitations and RSVP to events. Cannot create events or send invitations.

## Project Structure

```
apps/events/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authenticated routes
│   │   ├── dashboard/      # KPIs, charts, activity feed
│   │   ├── events/         # CRUD, detail, form, AI widgets
│   │   ├── calendar/       # Monthly calendar grid
│   │   ├── invitations/    # Invitation cards + responses
│   │   ├── users/          # User management (OWNER only)
│   │   └── settings/       # Profile settings
│   ├── (public)/           # Login, register
│   └── api/                # API routes (AI + calendar)
├── components/             # Presentational components
│   ├── layout/             # Sidebar, header, nav, breadcrumbs
│   └── ui/                 # Confirm dialog, password input
├── features/               # Domain logic by feature
│   ├── auth/               # Auth actions, schemas, types
│   ├── dashboard/          # Dashboard queries
│   ├── events/             # Event actions, queries, schemas
│   ├── invitations/        # Invitation actions, queries
│   └── users/              # User actions, queries
├── lib/                    # Shared utilities
│   ├── ai/                 # Groq client + withAIFallback
│   ├── auth/               # Auth provider, permissions
│   └── supabase/           # Supabase client/server/middleware
└── prisma/                 # Schema, migrations, seed
```
