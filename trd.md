# TRD — Energy Audit Dashboard

## 1. Architecture
**Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + Recharts + Supabase (Postgres/Auth) + Vercel.** No standalone Express server. Next.js Server Components render public data, and Next.js Server Actions handle authorized mutations. Supabase is a managed backend service; this is **serverless**, not a browser-only application.

```
Visitor -> Next.js public Server Component -> Supabase Postgres (published records)
Admin -> Supabase Auth -> /admin -> Next.js Server Actions -> RLS-protected Postgres
CSV -> browser preview/validation -> authorized Server Action -> transactional import
```

## 2. Repository layout
```
app/
  page.tsx                 # public page
  admin/page.tsx           # login or authenticated admin UI
  actions/readings.ts      # server actions: create/update/delete/publish
  actions/import.ts        # server-side validated CSV import
  layout.tsx
components/
  dashboard/{metric-card,trend-chart,area-breakdown,recommendations}.tsx
  admin/{login-form,reading-form,bill-form,csv-import,history-table}.tsx
lib/
  supabase/{server,client}.ts
  validation.ts            # zod schemas
  energy.ts                # derived metrics and coverage logic
  constants.ts             # thesis metadata, groups
supabase/migrations/
data/historical/            # reviewed seed CSV, not runtime source
```

## 3. Data model
Use UUID primary keys, timestamptz UTC timestamps, date-only reporting dates, numeric decimal for kWh and INR.

- `profiles`: `user_id uuid PK references auth.users`, `role text CHECK role IN ('admin')` (grant role manually in Supabase dashboard; do not permit self-assignment).
- `areas`: `id uuid PK`, `code text UNIQUE`, `name text`, `sort_order int`; seed `pump_room`, `faculty_quarters`, `hostels`, `guest_house`, `outdoor_lighting`, `campus_services`, `academic_block` and optionally `campus_total` as a distinct aggregate scope.
- `meters`: `id uuid PK`, `area_id FK`, `label text`, `unit text DEFAULT 'kWh'`, `active boolean`; optional for direct daily totals, required for cumulative readings.
- `daily_readings`: `id uuid PK`, `reading_date date`, `area_id FK`, `meter_id FK nullable`, `reading_type text CHECK IN ('cumulative','daily_consumption')`, `value_kwh numeric(14,3) CHECK >=0`, `source text CHECK IN ('manual','historical_import')`, `notes text`, `published boolean DEFAULT false`, `created_by uuid`, `created_at`, `updated_at`; unique `(meter_id, reading_date, reading_type)` for non-null meters; enforce uniqueness of unmetered `(area_id, reading_date, reading_type)` via partial unique index.
- `monthly_bills`: `id uuid PK`, `month date` (first day of month), `area_id FK`, `consumption_kwh numeric(14,3)`, `amount_inr numeric(14,2)`, `source text`, `published boolean`, `notes`, `created_by`, timestamps; unique `(area_id, month)`.
- `audit_events`: `id uuid PK`, `actor_id`, `table_name`, `row_id`, `action`, `changed_at`, `before_json jsonb`, `after_json jsonb` (optional but useful for corrections).

For historical group-specific figures that are **estimates or equipment calculations**, use separate static research content or a `research_facts` table with `method`, `period`, `citation`, `verified` fields. Never mix modeled equipment usage into measured meter readings.

## 4. RLS and authentication
Enable RLS on all public tables. Anonymous/public `SELECT` only where `published=true` for readings/bills; areas and active meters may be readable. Admin `SELECT/INSERT/UPDATE/DELETE` only if `auth.uid()` is present in `profiles` with `role='admin'`. The profiles table must not allow users to insert or elevate their own roles. All mutations require server-side session verification **and** database RLS; never rely on hidden admin controls. Use `@supabase/ssr` with cookie-based sessions; keep service-role credentials entirely server-side and avoid them for ordinary CRUD. Secure CSV imports with the same authorization, validation, and transaction boundaries.

## 5. Input validation
Zod on server and client: valid ISO date, nonnegative finite decimal kWh, INR >=0, known area/meter, reasonable upper limits configurable by admin, notes length <=500. Normalize month to first calendar day. CSV maximum size 2 MB and 2,000 rows in MVP; reject unsupported columns; preview error messages. Use an RPC/Postgres function for atomic batch upserts when needed, with admin role check inside the database function; avoid partially applied imports.

## 6. Calculation rules
- Meter delta: `reading(today) - reading(previous observed date)`; show period coverage, do **not** label multi-day delta as a single-day value.
- Direct daily consumption: sum only validated, nonoverlapping daily entries; do not combine with derived meter deltas for same scope/time.
- Monthly consumption: prefer billed campus total for official monthly trend; optionally show daily-derived estimate as separate series if coverage complete.
- MoM change: `(current - previous) / previous * 100`, only if both periods are valid and previous > 0.
- Costs: display actual bill amount; never multiply kWh by an assumed tariff and label as billed cost.
- Never sum campus total together with its constituent areas.
- Source baseline and later records should be visually distinguished.
- `last updated` is latest publication/update time, not current time.

## 7. Data migration
Transcribe and verify the 13 monthly campus bill rows from PDF p. 32 into a CSV. Import with `source='historical_import'`, record page reference in notes, and initially set `published=false` until checked. Do the same for faculty quarters and academic block only after verifying data consistency. Keep January 2026 appliance breakdown and proposed solar savings as research facts, not ongoing measurements. Never automatically invent daily readings from monthly totals.

## 8. Deployment
Create Supabase project, run SQL migrations, enable email/password auth, create one admin user, manually grant `admin` profile role, configure RLS. Deploy Next.js on Vercel; set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or publishable key), and server-only secrets if truly needed. Add allowed auth redirect origins, verify cookies and session expiry, and test RLS directly as anonymous/authenticated. Use dynamic rendering or `revalidateTag`/`revalidatePath('/')` after successful mutations; ensure public queries cannot remain stale indefinitely. Set timezone for reporting explicitly to `Asia/Kolkata` while storing timestamps UTC.

## 9. Reliability and operations
Supabase free tier and Vercel free tier may have changing limits, sleeping/paused projects, and usage restrictions; verify current plan eligibility before production. Avoid excessive polling; use refresh-on-navigation or 60-second revalidation. Use pagination for history, server-side rate limits for import/actions, error logging, and periodic DB exports/backups. Public charts should fail gracefully if Supabase is temporarily unavailable.

## 10. Security and QA checklist
- RLS denies anonymous inserts, updates and deletes.
- RLS denies signed-in non-admin writes.
- Admin role cannot be self-granted.
- Unpublished rows never appear on public page or public aggregate queries.
- Server actions validate every field; CSV content cannot inject SQL/HTML.
- Duplicate meter/day and month/area entries are handled deterministically.
- No privileged key is exposed in client bundle.
- Test loading/empty states, accessibility, mobile viewport, and data revalidation.
