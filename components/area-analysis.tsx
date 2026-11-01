"use client";

import { motion } from "motion/react";
import { Check, CircleDashed, FileChartColumn } from "lucide-react";
import { auditAreas, campusMonthlyData } from "@/lib/energy-data";
import { decimalFormatter } from "@/lib/format";

type AreaAnalysisProps = {
  selectedIndex: number;
};

const kindLabels = {
  monthly_series: "Monthly series",
  equipment_snapshot: "Equipment snapshot",
  modeled_estimate: "Modeled estimate",
};

export function AreaAnalysis({ selectedIndex }: AreaAnalysisProps) {
  const comparable = auditAreas.filter((area) => area.values);
  const max = Math.max(...comparable.map((area) => area.values?.[selectedIndex] ?? 0));
  const period = campusMonthlyData[selectedIndex];

  return (
    <div className="mt-8 overflow-hidden rounded-[24px] border border-border bg-white">
      <div className="flex flex-col gap-5 border-b border-border px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:py-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Seven audited groups
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">
            Source-aware area coverage
          </h3>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-soft px-3 py-2 text-xs font-medium text-[#496159]">
          <FileChartColumn aria-hidden="true" size={14} />
          {period.label}
        </div>
      </div>

      <div className="divide-y divide-border">
        {auditAreas.map((area, index) => {
          const value = area.values?.[selectedIndex];
          const hasSeries = typeof value === "number";
          const width = hasSeries && max > 0 ? Math.max(5, (value / max) * 100) : 0;

          return (
            <div
              className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(150px,0.8fr)_minmax(280px,1.6fr)] sm:items-center sm:px-7"
              key={area.code}
            >
              <div className="flex items-start gap-3">
                <span className={`area-index ${hasSeries ? "area-index-active" : ""}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{area.name}</p>
                  <p className="mt-1.5 text-[11px] font-medium text-muted">
                    {kindLabels[area.kind]} · p. {area.page}
                  </p>
                </div>
              </div>

              {hasSeries ? (
                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#477064]">
                      <Check aria-hidden="true" size={13} /> Comparable row available
                    </span>
                    <strong className="text-sm font-semibold tabular-nums text-ink">
                      {decimalFormatter.format(value)} <span className="text-xs font-medium text-muted">kWh</span>
                    </strong>
                  </div>
                  <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-[#eef1ed]">
                    <motion.div
                      animate={{ width: `${width}%` }}
                      className="h-full rounded-full bg-[#4b8b79]"
                      initial={false}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted">{area.detail}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#d7dcd6] bg-[#fafbf9] px-4 py-3">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#666e6a]">
                    <CircleDashed aria-hidden="true" size={14} /> No valid monthly time series
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{area.detail}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-border bg-[#fafbf9] px-5 py-4 text-xs leading-relaxed text-muted sm:px-7">
        Bar lengths compare only the four thesis tables with matching monthly coverage. They are not
        presented as shares of the campus total because methods and scopes may differ.
      </div>
    </div>
  );
}
