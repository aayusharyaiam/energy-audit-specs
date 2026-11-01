# BIT Patna Energy Audit Dashboard

A responsive, research-first dashboard for **Electrical Energy Auditing of BIT Mesra Off-Campus Patna**, based on Bhabya Bharti's 2026 B.Tech Electrical and Electronics Engineering thesis.

The website translates the source report into a clear public experience while keeping recorded bills, equipment snapshots, modeled estimates, disputed calculations, and future submitted readings visibly distinct.

> **Project status:** The public dashboard and admin interface are complete frontend implementations. The admin currently runs in an explicit no-write preview mode until Supabase authentication and Server Actions are connected.

## Features

### Public dashboard — `/`

- Interactive reporting-month selection.
- Monthly electricity-consumption and billed-cost metrics.
- Animated kWh/cost trend chart with an accessible table alternative.
- Source-aware analysis of all seven campus audit groups.
- Hostel load, appliance-demand, and seasonal research insights.
- Clearly labeled conservation projections and source warnings.
- Audit methodology and critical meter-reading semantics.
- Animated, accessible back-to-top control.
- Reduced-motion support, keyboard focus states, and touch-friendly controls.
- Responsive layouts with no page-level horizontal overflow.

### Admin workspace — `/admin`

- Email/password sign-in interface.
- Daily consumption and cumulative meter-reading forms.
- Monthly electricity-bill form.
- Historical record review and publication states.
- CSV selection, local validation, and row preview.
- Responsive card-based history tables on mobile and tablet.
- Explicit preview mode that cannot write, publish, or delete data.

### Data and backend foundation

- Reviewed 13-row campus bill baseline in `data/historical/campus-monthly-bills.csv`.
- Supabase browser and server client helpers.
- PostgreSQL schema, constraints, indexes, seeded areas, and RLS policies.
- Separate data semantics for cumulative readings, period consumption, and monthly bills.
- Duplicate-prevention indexes for meter/date and area/date records.

## Technology

- [Next.js](https://nextjs.org/) App Router
- TypeScript
- Tailwind CSS
- Motion
- Recharts
- Lucide icons
- Supabase Auth/Postgres/SSR
- Zod
- Playwright Core for responsive browser checks

## Getting started

### Requirements

- Node.js 20 or newer
- npm 10 or newer
- Microsoft Edge for the included responsive browser audit

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build and run TypeScript checks. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint across the project. |
| `npm run test:responsive` | Check both routes for viewport overflow at 320, 375, 768, 1024, and 1440px. |

The responsive test expects the application to already be running at `http://localhost:3000`. Set `BASE_URL` to test another deployment.

## Environment configuration

Copy the example file:

```bash
cp .env.example .env.local
```

On PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Configure:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The anon/publishable key is designed for browser use with RLS enabled. Never place a Supabase service-role key or another privileged secret in a `NEXT_PUBLIC_*` variable.

## Supabase setup

1. Create a Supabase project.
2. Apply `supabase/migrations/20261101000000_initial_schema.sql`.
3. Enable email/password authentication.
4. Create the approved administrator through Supabase Auth.
5. From a trusted SQL session, grant the role manually:

   ```sql
   insert into public.profiles (user_id, role)
   values ('AUTH-USER-UUID-HERE', 'admin');
   ```

6. Add the project values to `.env.local`.
7. Connect the prepared forms to authenticated Server Actions.
8. Query only published database rows from the public dashboard.

The migration prevents anonymous mutations, prevents users from assigning themselves an admin role, and keeps unpublished readings and bills out of public queries.

## Historical data import

`data/historical/campus-monthly-bills.csv` contains the 13 campus rows transcribed from PDF page 32. They are marked `needs_review` and should initially remain unpublished.

Do not import the same CSV as daily readings. Monthly bills are authoritative monthly totals and must be reconciled with—not added to—daily or meter-derived consumption.

## Source-integrity rules

- The thesis shows 13 monthly rows from January 2025 through January 2026, but its printed averages appear to use a 12-month denominator. Website aggregates are calculated from the imported rows.
- Solar street-lighting and water-heating figures are projections, not achieved savings.
- The solar water-heating capital-cost multiplier requires author verification.
- The court-light calculation contains conflicting results and remains flagged.
- Equipment calculations and load snapshots are not presented as measured time-series data.
- A cumulative meter's consumption is the difference from its previous valid reading for the same meter.
- Negative cumulative deltas require a documented reset or replacement.
- Missing data is displayed as unavailable rather than zero.

## Project structure

```text
app/
  admin/page.tsx               Admin route
  globals.css                  Design system and responsive styles
  layout.tsx                   Metadata and root layout
  page.tsx                     Public route
components/
  admin/admin-portal.tsx       Admin login, forms, history, and CSV preview
  area-analysis.tsx            Seven-group source coverage
  public-dashboard.tsx         Public-page composition and interactions
  scroll-to-top.tsx            Animated back-to-top control
  trend-chart.tsx              Responsive Recharts visualization
data/historical/
  campus-monthly-bills.csv     Reviewed thesis baseline
lib/
  energy-data.ts               Source rows and research facts
  format.ts                    INR, percentage, and energy formatting
  supabase/                    Browser/server client factories
scripts/
  responsive-check.mjs         Multi-viewport overflow audit
supabase/migrations/
  20261101000000_initial_schema.sql
design.md                      Visual direction and accessibility requirements
prd.md                         Product requirements
trd.md                         Technical requirements
energy audit final ver_removed.pdf
```

Generated directories such as `.next/` and `node_modules/` are intentionally excluded from Git.

## Responsive and accessibility standards

- Tested at 320, 375, 768, 1024, and 1440px.
- Mobile navigation and minimum 44px touch targets.
- No page-level horizontal scrolling.
- Accessible chart table alternative.
- Keyboard-operable controls and visible focus states.
- Semantic labels for forms, tabs, tables, and status information.
- `prefers-reduced-motion` support.
- Custom vertical scrollbar styling with horizontal scrollbar tracks suppressed.

## Deployment

The app can be deployed to Vercel using the standard Next.js workflow:

1. Push the repository to a Git provider.
2. Import it into Vercel.
3. Add the Supabase environment variables.
4. Deploy.
5. Add the production URL to the allowed Supabase authentication origins.

Before production launch, connect the admin Server Actions, verify RLS directly as anonymous and authenticated users, and have the thesis author review all flagged values.

## Research attribution

**Electrical Energy Auditing of BIT Mesra Off-Campus Patna**<br>
Bhabya Bharti · B.Tech EEE · 2026<br>
Birla Institute of Technology, Mesra Off-Campus Patna

This repository preserves the supplied thesis PDF and project specifications as source material. Confirm redistribution rights before exposing the PDF as a public download.
