# PRD — BIT Patna Energy Audit Dashboard

## 1. Product overview
A lightweight, public-facing website for **Electrical Energy Auditing of BIT Mesra Off-Campus Patna**, based on Bhabya Bharti's 2026 B.Tech EEE thesis. Transform a static energy-audit report into a readable, continuously updated dashboard. An authorized editor enters readings; visitors see published data. This is **manual reporting, not live sensor telemetry**.

## 2. Source and evidence
Primary source: `energy audit final ver_removed.pdf` (48 PDF pages). Thesis author: Bhabya Bharti. Thesis goals: document energy use, locate inefficient loads, evaluate renewable solutions, recommend savings (PDF pp. 6, 15). Campus electricity is supplied through two transformers rated 200 kVA and 450 kVA (p. 22). The report describes seven load groups (p. 23): pump room; faculty quarters; hostels; guest house; street/court lighting; guard/security/shops/canteen/ATM and other services; academic block.

Historical campus monthly electricity consumption and bill values appear on p. 32, covering **Jan 2025–Jan 2026 (13 rows)**. Thesis reports total 1,317,070 kWh and ₹11,122,884 and monthly average 109,755.83 kWh / ₹926,907. These aggregate labels require verification before display: 13 rows are shown, while the reported averages appear based on 12 months. Preserve individual source rows and clearly label their coverage; calculate website aggregates from imported rows rather than copying the report totals without review.

The hostel equipment table reports 332,346 W connected and 165,034 W in use (p. 30). January 2026 appliance consumption breakdown appears on p. 33. Faculty quarter monthly breakdown appears on p. 27; academic-block monthly consumption appears on p. 39 (PDF page position may vary with printed pagination). Solar street lighting proposal: 96 units, ₹864,000 projected capital cost, ~58-month payback (pp. 40–41). Solar water heating: ~₹463,740 annual projected electricity savings and ~4-year payback (pp. 41–42). **These are estimates, not realized savings.**

## 3. Audiences
- Public visitors: students, faculty, project evaluators, campus management.
- Admin/editor: senior/project owner who publishes and corrects readings.

## 4. Scope and navigation (maximum two pages)
### `/` — public dashboard
Single scrolling page, with anchored sections:
1. Header: project title, campus identifier, `Methodology`, `Findings`, `Recommendations` anchor links, subtle Admin link.
2. Hero: “Understanding how our campus uses energy.” Short research summary; reporting period and **last updated** timestamp.
3. Metric strip: latest recorded consumption (kWh), consumption for selected month (kWh), recorded electricity cost (₹), change versus comparable previous period (only if available).
4. Trend: monthly campus kWh chart with selectable period; optional cost overlay/toggle.
5. Area analysis: seven audit groups, compact breakdown/table. Show **no data** when a group has no valid time-series; do not invent allocation from campus totals.
6. Research insights: historic hostel load, appliance consumption, seasonality; distinguish static thesis findings from dynamic observations.
7. Conservation opportunities: LEDs, solar street lighting, solar water heating, maintenance/timers. Label modeled projections explicitly.
8. Methodology and footer: manual updates, source attribution, units, assumptions, data freshness, research credits.

### `/admin` — protected editor workspace
Unauthenticated: centered email/password sign-in. Authenticated: compact tabbed UI (not separate page routes):
- **Daily reading:** date, campus/area, reading type (`meter_cumulative_kwh` or `period_consumption_kwh`), value, optional meter ID, notes, source/verification status.
- **Monthly bill:** billing month, campus total kWh, amount in INR, optional notes and evidence attachment (optional later).
- **History:** filter, edit, delete with confirmation, publish/unpublish.
- **CSV import:** preview, validate, error report, explicit commit; provide template download.
- **Sign out.**

## 5. Critical daily-update semantics
Daily updates can be **cumulative meter readings** or **measured daily kWh**. They must never be mixed. A cumulative meter's daily consumption is the difference from the prior reading **for the same meter**; reject negative differences as errors unless a documented meter reset/replacement is recorded. A daily kWh entry is already a period consumption. Do not sum both sources for the same meter/day. Monthly bills are authoritative billed totals; do not add them to summed daily values. Show comparison/reconciliation separately.

## 6. MVP requirements
- Public read-only access; one approved admin account (additional editors optional later).
- Login/logout with Supabase Auth; authenticated updates protected by row-level security.
- CRUD and publication status for daily readings and monthly bills.
- CSV upload with preview, per-row validation, duplicate detection, and rollback-safe batch commit.
- Charts update on refresh after publication; optional automatic refresh/revalidation within ~60 seconds.
- Responsive layout, keyboard accessibility, clear loading/empty/error states.
- Source-tagged historical import (research baseline) separated from newly entered measurements.
- Date-aware aggregates; display explicit measurement coverage and timestamps.

## 7. Out of scope
Hardware integration, real-time IoT monitoring, predictive AI, tariff forecasting, carbon accounting without validated emission factors, public user accounts, multi-campus administration, complex CMS, and automated scheduled ingestion.

## 8. Success criteria
- Admin can log in and publish a valid daily reading in under one minute.
- Public page reflects newly published data without deployment.
- Anonymous users cannot mutate data or see unpublished records.
- A historical CSV can be imported without duplicates and with visible row-level errors.
- All published numbers have an explicit unit, period, and source classification.

## 9. Content validation before launch
The thesis contains inconsistencies and probable transcription/calculation mistakes: 13 monthly rows vs. 12-month averages; a solar-water-heating capital-cost line with mismatched multiplier; court-light calculation text alternates between 1,454.7 and 1,488 kWh; older figure captions mention February 2023 despite January 2026 tables. Do not silently normalize them. Confirm the intended values with the author, mark disputed values as unverified, and avoid using disputed aggregates as headline KPIs.

## 10. Acceptance tests
- Signed-out visitor can view published records only.
- Admin edits a daily reading; chart/metric changes after save and refresh.
- A second submission with same meter/date is rejected or explicitly updates existing row.
- Importing the same CSV twice cannot double-count values.
- Missing previous cumulative reading displays “insufficient data,” not 0.
- Mobile layout works at 375px; charts and tables remain usable.
