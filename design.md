# Design Specification — Quiet Energy

## 1. Direction
**Apple-inspired restraint, not a clone.** Editorial typography, spacious layout, precise data visualization, subtle borders, and calm surfaces. The public site should read like a research exhibit, not a crowded SaaS analytics console. The admin page uses the same design language with more utilitarian forms.

## 2. References (public/free inspiration)
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/ — hierarchy, clarity, accessibility (reference principles; don't copy proprietary assets).
- shadcn/ui: https://github.com/shadcn-ui/ui — accessible, composable component patterns.
- Tailwind CSS: https://github.com/tailwindlabs/tailwindcss — styling system.
- Lucide: https://github.com/lucide-icons/lucide — light, consistent icons.
- Recharts: https://github.com/recharts/recharts — clean, responsive charts.
- Geist font: https://github.com/vercel/geist-font — freely available font; review license.
- Next.js examples: https://github.com/vercel/next.js/tree/canary/examples — architecture inspiration, not visual template.

## 3. Design tokens
```
Background: #F8F9FA
Surface:    #FFFFFF
Text:       #17191C
Secondary:  #6B7280
Border:     #E6E8EB
Accent:     #327B6A (muted green, use sparingly)
Warning:    #B7791F
Radius:     16px cards, 12px inputs, 999px pills
Max width:  1120px
Spacing:    8px base; sections 72–112px desktop, 48–64px mobile
Typography: Geist or system -apple-system/BlinkMacSystemFont/Inter fallback
```
Prefer a white/off-white default, no gradient-heavy backgrounds, no glassmorphism, no animated counters, no 3D decoration. Contrast must meet WCAG AA for normal text.

## 4. Public-page wireframe
```
[BIT PATNA / ENERGY AUDIT]                  Overview  Findings  Method  Admin

ELECTRICAL ENERGY AUDIT · RESEARCH DASHBOARD
Understanding how our campus uses energy.
A measured look at consumption, costs, and opportunities for efficiency.
[Reporting period] [Updated on ...]

[Latest reading] [Selected month] [Monthly bill] [Change vs previous]

Energy over time                             [kWh | Cost] [Period]
+--------------------------------------------------------------+
|                        calm line chart                       |
+--------------------------------------------------------------+

Where energy is used
[seven compact rows / horizontal bars with valid data only]

What the research found
[Hostel loads] [Seasonal demand] [Heating systems]

Opportunities to save
[LED retrofits] [Solar street lights] [Solar water heating]

Methodology / Source / Research credit / Data freshness
```

## 5. Admin-page wireframe
```
[Energy Audit]                                    [Signed in] [Sign out]
Manage data
[Daily readings] [Monthly bills] [History] [Import CSV]

Date           Area                Reading type
[2026-..]      [Select]            [Daily / Cumulative]
Meter          Value (kWh)         Notes
[Select]       [Number]            [Optional]
[ ] Publish immediately
[Save reading]

[Recent updates with edit / publish / delete]
```
Login replaces the admin workspace when signed out; no third page necessary.

## 6. Components and behavior
- Header: thin bottom border; responsive condensed menu; no sticky full-height navigation.
- Hero: desktop 56–72px heading, mobile 36–44px; max text width 720px.
- Metric cards: large tabular numbers; unit and reporting period visible; no misleading zero for missing data.
- Trend chart: muted gridlines, clear tooltips, visible x-axis period labels; no 3D pie charts.
- Area breakdown: ranked horizontal bars only when data is comparable; otherwise a factual list of audited areas.
- Insight blocks: source-linked labels such as “Thesis finding · 2026,” distinct from “Latest reported reading.”
- Savings cards: projected payback/savings explicitly labeled **estimates**, not achieved results.
- Admin: native-feeling inputs, visible required labels, inline errors, pending/success states, confirm destructive changes.
- CSV: drag/drop optional; always offer accessible file picker and preview before commit.

## 7. Responsive and accessibility
Desktop 12-column grid; tablet 6; mobile single column. Charts must provide accessible data table alternative. Keyboard-operable tabs and controls, visible focus ring, form labels, reduced-motion support, touch targets >=44px, proper color contrast. Keep transitions 120–200ms and honor `prefers-reduced-motion`.

## 8. Content tone
Precise, quiet, scientific. Use “Recorded electricity consumption” instead of “Real-time power usage”; “Projected savings” instead of “Money saved”; “No reading available” instead of 0. Always display kWh vs kW accurately and distinguish source-era baseline from current submitted data.

## 9. Optional polish, only after MVP
Light/dark mode toggle, PDF source download if redistribution is authorized, small campus outline image with appropriate rights, and downloadable filtered CSV. Avoid features that add backend complexity.
