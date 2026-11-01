"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleGauge,
  Clock3,
  Database,
  Droplets,
  FileCheck2,
  Flame,
  IndianRupee,
  Leaf,
  LineChart,
  ShieldCheck,
  SunMedium,
  TimerReset,
  Wrench,
  Zap,
} from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { AreaAnalysis } from "@/components/area-analysis";
import { HeroSchematic } from "@/components/hero-schematic";
import { Reveal } from "@/components/reveal";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { TrendChart } from "@/components/trend-chart";
import {
  auditStages,
  campusMonthlyData,
  computedBaseline,
  januaryApplianceData,
  summary,
} from "@/lib/energy-data";
import {
  compactFormatter,
  decimalFormatter,
  formatPercent,
  inrFormatter,
  integerFormatter,
} from "@/lib/format";

type MetricCardProps = {
  eyebrow: string;
  value: string;
  unit?: string;
  detail: string;
  icon: ReactNode;
  accent?: "default" | "positive" | "warning";
};

function MetricCard({
  eyebrow,
  value,
  unit,
  detail,
  icon,
  accent = "default",
}: MetricCardProps) {
  return (
    <div className={`metric-card metric-${accent}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="metric-eyebrow">{eyebrow}</p>
        <span className="metric-icon">{icon}</span>
      </div>
      <p className="mt-9 flex flex-wrap items-baseline gap-x-2 tabular-nums">
        <strong className="text-[clamp(1.65rem,3vw,2.15rem)] font-semibold tracking-[-0.045em] text-ink">
          {value}
        </strong>
        {unit ? <span className="text-sm font-medium text-muted">{unit}</span> : null}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{detail}</p>
    </div>
  );
}

function HostelLoadVisual() {
  const rate = (summary.hostelInUseWatts / summary.hostelConnectedWatts) * 100;
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="mt-8 grid items-center gap-7 sm:grid-cols-[150px_1fr]">
      <div className="relative mx-auto h-[145px] w-[145px]">
        <svg aria-hidden="true" className="h-full w-full -rotate-90" viewBox="0 0 110 110">
          <circle cx="55" cy="55" fill="none" r="42" stroke="#e7ebe5" strokeWidth="9" />
          <motion.circle
            cx="55"
            cy="55"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            r="42"
            stroke="#327B6A"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - rate / 100)}
            strokeLinecap="round"
            strokeWidth="9"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ strokeDashoffset: circumference * (1 - rate / 100) }}
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <strong className="text-2xl font-semibold tracking-[-0.04em] text-ink">{rate.toFixed(1)}%</strong>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">in use</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted">Connected equipment load</p>
          <p className="mt-1 text-xl font-semibold tabular-nums tracking-[-0.03em] text-ink">
            {decimalFormatter.format(summary.hostelConnectedWatts / 1000)} kW
          </p>
        </div>
        <div className="h-px bg-border" />
        <div>
          <p className="text-xs font-medium text-muted">Load reported in use</p>
          <p className="mt-1 text-xl font-semibold tabular-nums tracking-[-0.03em] text-ink">
            {decimalFormatter.format(summary.hostelInUseWatts / 1000)} kW
          </p>
        </div>
      </div>
    </div>
  );
}

function ApplianceBars() {
  const visible = januaryApplianceData.slice(0, 5);
  const total = campusMonthlyData.at(-1)?.consumption ?? 1;

  return (
    <div className="mt-8 space-y-4">
      {visible.map((item, index) => {
        const percent = (item.value / total) * 100;
        return (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-[#525c58]">{item.name}</span>
              <span className="tabular-nums text-muted">{percent.toFixed(1)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#edf0ec]">
              <motion.div
                className={`h-full rounded-full ${index === 0 ? "bg-[#b97835]" : "bg-[#6e9b8f]"}`}
                initial={{ width: 0 }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                whileInView={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-[11px] leading-relaxed text-muted">
        Percent of the January 2026 appliance table total. Zero-use rows are omitted here.
      </p>
    </div>
  );
}

function SeasonalityVisual() {
  const values = campusMonthlyData.map((item) => item.consumption);
  const max = Math.max(...values);
  const peakIndex = values.indexOf(max);
  const min = Math.min(...values);
  const lowIndex = values.indexOf(min);

  return (
    <div className="mt-8">
      <div aria-label="Thirteen monthly consumption bars" className="flex h-28 items-end gap-1.5" role="img">
        {values.map((value, index) => (
          <motion.div
            className={`min-w-0 flex-1 rounded-t-[4px] ${index === peakIndex ? "bg-[#327B6A]" : index === lowIndex ? "bg-[#d3b56f]" : "bg-[#cfd9d3]"}`}
            initial={{ height: 0 }}
            key={campusMonthlyData[index].month}
            title={`${campusMonthlyData[index].label}: ${integerFormatter.format(value)} kWh`}
            transition={{ duration: 0.45, delay: index * 0.025, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ height: `${Math.max(12, (value / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Lowest row</p>
          <p className="mt-1.5 text-sm font-semibold text-ink">{campusMonthlyData[lowIndex].shortLabel}</p>
          <p className="mt-0.5 text-xs tabular-nums text-muted">{compactFormatter.format(min)} kWh</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Peak row</p>
          <p className="mt-1.5 text-sm font-semibold text-ink">{campusMonthlyData[peakIndex].shortLabel}</p>
          <p className="mt-0.5 text-xs tabular-nums text-muted">{compactFormatter.format(max)} kWh</p>
        </div>
      </div>
    </div>
  );
}

export function PublicDashboard() {
  const [selectedIndex, setSelectedIndex] = useState(campusMonthlyData.length - 1);
  const selected = campusMonthlyData[selectedIndex];
  const latest = campusMonthlyData.at(-1) ?? selected;

  const comparison = useMemo(() => {
    if (selectedIndex === 0) return null;
    const previous = campusMonthlyData[selectedIndex - 1];
    if (!previous || previous.consumption <= 0) return null;
    return ((selected.consumption - previous.consumption) / previous.consumption) * 100;
  }, [selected, selectedIndex]);

  return (
    <MotionConfig reducedMotion="user">
      <SiteHeader />
      <main id="main-content">
        <section className="hero-section" id="overview">
          <div className="site-shell pb-10 pt-12 sm:pb-14 sm:pt-16 lg:pb-18 lg:pt-20">
            <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.74fr)] lg:gap-12">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-[#dbe2da] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#52675f] shadow-[0_1px_0_rgba(23,25,28,0.03)]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6b9c8e] opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#327B6A]" />
                    </span>
                    Electrical energy audit · Research dashboard
                  </div>
                </Reveal>

                <Reveal delay={0.06}>
                  <h1 className="hero-title mt-5 text-balance">
                    Understanding how our campus <span>uses energy.</span>
                  </h1>
                </Reveal>

                <Reveal delay={0.12}>
                  <p className="mt-5 max-w-2xl text-balance text-[17px] leading-8 text-[#5f6965] sm:text-lg">
                    A measured look at electricity consumption, billed cost and practical opportunities
                    for efficiency at BIT Mesra Off-Campus Patna.
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                    <a className="primary-button group" href="#findings">
                      Explore the findings
                      <ArrowDown
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-y-0.5"
                        size={16}
                      />
                    </a>
                    <a className="text-button group" href="#methodology">
                      How the audit works
                      <ArrowDownRight
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                        size={15}
                      />
                    </a>
                  </div>
                </Reveal>

                <Reveal delay={0.24}>
                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-border pt-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays aria-hidden="true" size={14} /> Jan 2025–Jan 2026
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Database aria-hidden="true" size={14} /> 13 historical bill rows
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 aria-hidden="true" size={14} /> Manual reporting, not live telemetry
                    </span>
                  </div>
                </Reveal>
              </div>

              <Reveal className="lg:pb-1" delay={0.16} y={12}>
                <HeroSchematic />
              </Reveal>
            </div>
          </div>
        </section>

        <section aria-labelledby="snapshot-heading" className="border-y border-border bg-white">
          <div className="site-shell py-10 sm:py-12">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-eyebrow">Recorded baseline</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink" id="snapshot-heading">
                  A month-by-month view
                </h2>
              </div>
              <label className="relative block w-full sm:w-[220px]">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                  Reporting month
                </span>
                <select
                  className="month-select"
                  onChange={(event) => setSelectedIndex(Number(event.target.value))}
                  value={selectedIndex}
                >
                  {campusMonthlyData.map((item, index) => (
                    <option key={item.month} value={index}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-[15px] right-4 text-muted" size={15} />
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Reveal>
                <MetricCard
                  detail={`${latest.label} · latest source period`}
                  eyebrow="Latest monthly total"
                  icon={<Zap aria-hidden="true" size={16} />}
                  unit="kWh"
                  value={integerFormatter.format(latest.consumption)}
                />
              </Reveal>
              <Reveal delay={0.04}>
                <MetricCard
                  detail={`${selected.label} · thesis table p. 32`}
                  eyebrow="Selected consumption"
                  icon={<LineChart aria-hidden="true" size={16} />}
                  unit="kWh"
                  value={integerFormatter.format(selected.consumption)}
                />
              </Reveal>
              <Reveal delay={0.08}>
                <MetricCard
                  detail={`${selected.label} · recorded bill amount`}
                  eyebrow="Electricity cost"
                  icon={<IndianRupee aria-hidden="true" size={16} />}
                  value={inrFormatter.format(selected.cost)}
                />
              </Reveal>
              <Reveal delay={0.12}>
                <MetricCard
                  accent={comparison === null ? "warning" : comparison <= 0 ? "positive" : "warning"}
                  detail={
                    comparison === null
                      ? "No comparable earlier source row"
                      : `Compared with ${campusMonthlyData[selectedIndex - 1].label}`
                  }
                  eyebrow="Change vs previous"
                  icon={
                    comparison === null ? (
                      <TimerReset aria-hidden="true" size={16} />
                    ) : comparison > 0 ? (
                      <ArrowUp aria-hidden="true" size={16} />
                    ) : (
                      <ArrowDown aria-hidden="true" size={16} />
                    )
                  }
                  value={comparison === null ? "Not available" : formatPercent(comparison)}
                />
              </Reveal>
            </div>

            <Reveal delay={0.08}>
              <div className="verification-note mt-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff4dc] text-[#8c651a]">
                  <AlertTriangle aria-hidden="true" size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#473d29]">Aggregate checked from source rows</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#74684e]">
                    The 13 imported rows total {integerFormatter.format(computedBaseline.totalConsumption)} kWh.
                    Their calculated mean is {integerFormatter.format(computedBaseline.averageConsumption)} kWh—not
                    the 12-month average printed in the thesis. Individual source rows are preserved.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-space" id="findings">
          <div className="site-shell">
            <Reveal>
              <SectionHeading
                copy="Read the historical pattern without treating a research baseline as a live meter feed. Switch between consumption and billed cost, then inspect coverage by audit group."
                eyebrow="01 · Consumption"
                title="The campus load changes meaningfully through the year."
              />
            </Reveal>

            <Reveal className="mt-8 sm:mt-10" delay={0.08}>
              <TrendChart selectedIndex={selectedIndex} />
            </Reveal>

            <Reveal className="mt-16 sm:mt-22">
              <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                <SectionHeading
                  copy="The thesis examines seven campus load groups, but not every group has a comparable monthly series. The dashboard says so rather than inventing an allocation."
                  eyebrow="02 · Audit coverage"
                  title="What can—and cannot—be compared."
                />
                <div className="rounded-2xl border border-border bg-[#f0f3ef] p-5 text-sm leading-relaxed text-[#56615c] lg:justify-self-end lg:max-w-md">
                  <strong className="font-semibold text-ink">Reading the bars:</strong> only source tables with the
                  same 13-month coverage are scaled together. Equipment calculations and snapshots stay visibly
                  separate.
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <AreaAnalysis selectedIndex={selectedIndex} />
            </Reveal>
          </div>
        </section>

        <section className="section-space border-y border-border bg-white">
          <div className="site-shell">
            <Reveal>
              <SectionHeading
                copy="These observations are fixed thesis findings. They provide context for future reported readings but are not live measurements."
                eyebrow="03 · Research findings"
                title="Three patterns deserve attention."
              />
            </Reveal>

            <div className="mt-8 grid gap-4 lg:grid-cols-3 sm:mt-10">
              <Reveal className="insight-card" delay={0.02}>
                <div className="flex items-start justify-between gap-4">
                  <span className="insight-icon"><Building2 aria-hidden="true" size={18} /></span>
                  <span className="source-chip">Thesis finding · p. 30</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-ink">Hostel load snapshot</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  The connected equipment inventory is roughly twice the load reported in use.
                </p>
                <HostelLoadVisual />
              </Reveal>

              <Reveal className="insight-card" delay={0.07}>
                <div className="flex items-start justify-between gap-4">
                  <span className="insight-icon insight-icon-warm"><Flame aria-hidden="true" size={18} /></span>
                  <span className="source-chip">January 2026 · p. 33</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-ink">Heating leads the mix</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Geysers form the largest appliance line in the January breakdown, followed by water coolers.
                </p>
                <ApplianceBars />
              </Reveal>

              <Reveal className="insight-card" delay={0.12}>
                <div className="flex items-start justify-between gap-4">
                  <span className="insight-icon insight-icon-gold"><SunMedium aria-hidden="true" size={18} /></span>
                  <span className="source-chip">Campus bills · p. 32</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-ink">Demand is seasonal</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  The highest source row is 3.5× the lowest, pointing to different cooling and heating pressures.
                </p>
                <SeasonalityVisual />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section-space" id="recommendations">
          <div className="site-shell">
            <Reveal>
              <div className="recommendation-intro">
                <div className="relative z-10 max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6d7ca]">
                    04 · Conservation opportunities
                  </p>
                  <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                    Practical changes, clearly labeled as projections.
                  </h2>
                  <p className="mt-5 max-w-xl text-balance text-sm leading-7 text-[#c6d8d2] sm:text-base">
                    The thesis models several efficiency measures. None should be presented as achieved savings until
                    installation and post-audit measurement confirm the result.
                  </p>
                </div>
                <div aria-hidden="true" className="recommendation-orbit">
                  <Leaf size={36} />
                </div>
              </div>
            </Reveal>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <Reveal className="opportunity-card" delay={0.02}>
                <div className="flex items-center justify-between gap-4">
                  <span className="opportunity-number">01</span>
                  <span className="estimate-chip">Modeled estimate</span>
                </div>
                <div className="opportunity-icon mt-10"><SunMedium aria-hidden="true" size={22} /></div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink">Solar street lighting</h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Replace 96 grid-powered street lights with integrated solar units to reduce outdoor-lighting demand.
                </p>
                <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-5">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">Capital</dt>
                    <dd className="mt-1.5 text-lg font-semibold tabular-nums text-ink">₹8.64 lakh</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">Payback</dt>
                    <dd className="mt-1.5 text-lg font-semibold tabular-nums text-ink">~58 months</dd>
                  </div>
                </dl>
                <p className="mt-5 text-[11px] text-muted">Source calculation · PDF pp. 39–40</p>
              </Reveal>

              <Reveal className="opportunity-card" delay={0.07}>
                <div className="flex items-center justify-between gap-4">
                  <span className="opportunity-number">02</span>
                  <span className="estimate-chip">Modeled estimate</span>
                </div>
                <div className="opportunity-icon opportunity-icon-warm mt-10"><Droplets aria-hidden="true" size={22} /></div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink">Solar water heating</h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Shift hostel water heating away from resistance geysers, the largest line in the winter appliance mix.
                </p>
                <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-5">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">Projected / year</dt>
                    <dd className="mt-1.5 text-lg font-semibold tabular-nums text-ink">₹4.64 lakh</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">Payback</dt>
                    <dd className="mt-1.5 text-lg font-semibold tabular-nums text-ink">~4 years</dd>
                  </div>
                </dl>
                <p className="mt-5 text-[11px] leading-relaxed text-[#926f2f]">
                  Source capital-cost multiplier is inconsistent and requires verification · pp. 41–42
                </p>
              </Reveal>

              <Reveal className="opportunity-card" delay={0.12}>
                <div className="flex items-center justify-between gap-4">
                  <span className="opportunity-number">03</span>
                  <span className="estimate-chip estimate-chip-neutral">Operational</span>
                </div>
                <div className="opportunity-icon opportunity-icon-blue mt-10"><Wrench aria-hidden="true" size={22} /></div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink">Efficiency first</h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Begin with lower-cost actions before capital projects: LEDs, controls, preventive maintenance and
                  user awareness.
                </p>
                <ul className="mt-7 space-y-3 border-t border-border pt-5 text-sm text-[#4e5b56]">
                  {["Timer-controlled geysers", "Lighting and occupancy controls", "Wiring and equipment maintenance"].map((item) => (
                    <li className="flex items-center gap-2.5" key={item}>
                      <Check aria-hidden="true" className="text-accent" size={15} /> {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[11px] text-muted">General recommendations · PDF pp. 42–44</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section-space border-t border-border bg-white" id="methodology">
          <div className="site-shell">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
                <SectionHeading
                  copy="The source combines bill review, field observations, equipment inventories and operating-hour calculations. Future updates must preserve the distinction between readings and models."
                  eyebrow="05 · Methodology"
                  title="From observation to accountable reporting."
                />
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-soft p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-accent shadow-sm"><BookOpen aria-hidden="true" size={18} /></span>
                  <p className="text-xs leading-relaxed text-muted">
                    Based on Bhabya Bharti’s 2026 B.Tech EEE thesis, supervised by Dr. Kumar Nikhil and Dr. Mayank Kumar.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-9 grid gap-px overflow-hidden rounded-[24px] border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
              {auditStages.map((stage, index) => (
                <Reveal className="h-full bg-[#fbfcfa] p-6 sm:p-7" delay={index * 0.05} key={stage.number}>
                  <span className="text-xs font-semibold tabular-nums text-accent">{stage.number}</span>
                  <h3 className="mt-10 text-lg font-semibold tracking-[-0.025em] text-ink">{stage.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{stage.copy}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <Reveal className="method-card method-card-dark">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[#d9efc2]"><CircleGauge aria-hidden="true" size={18} /></span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#b9cec7]">Critical reading semantics</p>
                </div>
                <h3 className="mt-8 max-w-xl text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                  Cumulative meter values and period consumption must never be mixed.
                </h3>
                <div className="mt-9 grid gap-5 sm:grid-cols-2">
                  <div className="border-t border-white/15 pt-4">
                    <p className="text-sm font-semibold text-white">Cumulative reading</p>
                    <p className="mt-2 text-xs leading-6 text-[#b9cbc5]">
                      Consumption is the difference from the previous valid reading for the same meter. Negative deltas require a documented reset.
                    </p>
                  </div>
                  <div className="border-t border-white/15 pt-4">
                    <p className="text-sm font-semibold text-white">Period consumption</p>
                    <p className="mt-2 text-xs leading-6 text-[#b9cbc5]">
                      The entered kWh already represents the period. Monthly bills remain authoritative and are reconciled—not added—to daily totals.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal className="method-card" delay={0.06}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf1ed] text-accent"><ShieldCheck aria-hidden="true" size={18} /></span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-muted">Evidence standard</p>
                </div>
                <ul className="mt-8 space-y-5">
                  {[
                    ["Units stay explicit", "kWh for energy, kW for load, INR for billed cost."],
                    ["Coverage stays visible", "Every number carries a period, method and source class."],
                    ["Uncertainty stays visible", "Disputed source calculations are flagged, not normalized."],
                  ].map(([title, copy]) => (
                    <li className="flex gap-3" key={title}>
                      <FileCheck2 aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={16} />
                      <div>
                        <p className="text-sm font-semibold text-ink">{title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted">{copy}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-[#eef1ec] py-14 sm:py-18">
          <div className="site-shell flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Data stewardship</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-3xl">
                New readings belong in a protected editor workspace.
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                The admin interface is prepared for daily readings, monthly bills, publication controls and validated CSV imports.
              </p>
            </div>
            <Link className="secondary-button group shrink-0" href="/admin">
              Open admin workspace
              <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" size={16} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#142e27] text-white">
        <div className="site-shell py-10 sm:py-12">
          <div className="grid gap-9 border-b border-white/10 pb-8 lg:grid-cols-[0.8fr_0.42fr_1.15fr]">
            <div className="max-w-md">
              <p className="text-sm font-semibold">BIT Patna Energy Audit</p>
              <p className="mt-3 text-sm leading-7 text-[#aebfba]">
                Electrical Energy Auditing of BIT Mesra Off-Campus Patna · a public research dashboard based on the 2026 thesis baseline.
              </p>
            </div>
            <div>
              <p className="footer-heading">Navigate</p>
              <div className="mt-4 grid gap-3 text-sm text-[#b8c7c2]">
                <a className="footer-link" href="#findings">Findings</a>
                <a className="footer-link" href="#recommendations">Recommendations</a>
                <a className="footer-link" href="#methodology">Methodology</a>
              </div>
            </div>
            <div>
              <p className="footer-heading">Research attribution</p>
              <p className="mt-4 text-sm font-semibold leading-6 text-white">
                Electrical Energy Auditing of BIT Mesra Off-Campus Patna
              </p>
              <p className="mt-2 text-sm leading-6 text-[#b8c7c2]">
                Bhabya Bharti · B.Tech EEE · 2026
                <br />
                Birla Institute of Technology, Mesra Off-Campus Patna
              </p>
            </div>
          </div>
          <div className="flex gap-3 border-b border-white/10 py-5 text-[11px] leading-5 text-[#9fb1ab]">
            <BookOpen aria-hidden="true" className="mt-0.5 shrink-0 text-[#d8edb6]" size={15} />
            <p>
              This repository preserves the supplied thesis PDF and project specifications as source material.
              Confirm redistribution rights before exposing the PDF as a public download.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-[11px] text-[#91a49e] sm:flex-row sm:items-center sm:justify-between">
            <p>Historical baseline · last source period January 2026</p>
            <p>Manual reporting · Asia/Kolkata · Values subject to source verification</p>
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </MotionConfig>
  );
}
