"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { campusMonthlyData, type CampusMonth } from "@/lib/energy-data";
import { compactFormatter, inrFormatter, integerFormatter } from "@/lib/format";

type Mode = "consumption" | "cost";

type ChartTooltipProps = {
  active?: boolean;
  mode: Mode;
  payload?: ReadonlyArray<{
    payload?: CampusMonth;
    value?: number | string;
  }>;
};

function ChartTooltip({ active, mode, payload }: ChartTooltipProps) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;

  return (
    <div className="chart-tooltip">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {item.label}
      </p>
      <p className="mt-1.5 text-base font-semibold tabular-nums text-ink">
        {mode === "consumption"
          ? `${integerFormatter.format(item.consumption)} kWh`
          : inrFormatter.format(item.cost)}
      </p>
      <p className="mt-1 text-[11px] text-muted">Historical research baseline</p>
    </div>
  );
}

type TrendChartProps = {
  selectedIndex: number;
};

export function TrendChart({ selectedIndex }: TrendChartProps) {
  const [mode, setMode] = useState<Mode>("consumption");
  const selected = campusMonthlyData[selectedIndex];

  return (
    <div className="data-panel overflow-hidden">
      <div className="flex flex-col gap-5 border-b border-border px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7 sm:py-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="status-dot" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-muted">
              Historical monthly series
            </p>
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink sm:text-2xl">
            Energy over time
          </h3>
          <p className="mt-1.5 text-sm text-muted">
            13 source rows · January 2025 to January 2026
          </p>
        </div>

        <div aria-label="Chart measure" className="segmented-control" role="group">
          <button
            aria-pressed={mode === "consumption"}
            className={mode === "consumption" ? "segment-active" : ""}
            onClick={() => setMode("consumption")}
            type="button"
          >
            kWh
          </button>
          <button
            aria-pressed={mode === "cost"}
            className={mode === "cost" ? "segment-active" : ""}
            onClick={() => setMode("cost")}
            type="button"
          >
            Cost
          </button>
        </div>
      </div>

      <div
        aria-label={`${mode === "consumption" ? "Electricity consumption" : "Electricity cost"} chart from January 2025 to January 2026`}
        className="h-[320px] w-full px-1 pb-1 pt-6 sm:h-[390px] sm:px-5 sm:pt-8"
        role="img"
      >
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={campusMonthlyData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="energyFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#327B6A" stopOpacity={0.2} />
                <stop offset="92%" stopColor="#327B6A" stopOpacity={0.015} />
              </linearGradient>
              <linearGradient id="costFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#B88728" stopOpacity={0.18} />
                <stop offset="92%" stopColor="#B88728" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5E8E3" strokeDasharray="3 5" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="shortLabel"
              dy={9}
              interval="preserveStartEnd"
              minTickGap={24}
              tick={{ fill: "#77807c", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, "auto"]}
              tick={{ fill: "#8a918e", fontSize: 10 }}
              tickFormatter={(value: number) => compactFormatter.format(value)}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={<ChartTooltip mode={mode} />}
              cursor={{ stroke: "#9da8a2", strokeDasharray: "3 4", strokeWidth: 1 }}
            />
            <ReferenceLine
              stroke="#A7B2AC"
              strokeDasharray="2 5"
              x={selected.shortLabel}
            />
            <Area
              activeDot={{ fill: "#FFFFFF", r: 5, stroke: mode === "consumption" ? "#327B6A" : "#A86F17", strokeWidth: 3 }}
              animationDuration={650}
              dataKey={mode}
              dot={false}
              fill={mode === "consumption" ? "url(#energyFill)" : "url(#costFill)"}
              isAnimationActive
              stroke={mode === "consumption" ? "#327B6A" : "#A86F17"}
              strokeLinecap="round"
              strokeWidth={2.5}
              type="monotoneX"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-[#fbfcfa] px-5 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p>
          Selected: <strong className="font-semibold text-ink">{selected.label}</strong>
        </p>
        <p>Source: Thesis table · PDF p. 32</p>
      </div>

      <details className="accessible-data border-t border-border">
        <summary>View chart as a data table</summary>
        <div className="overflow-x-auto px-5 pb-5 sm:px-7">
          <table>
            <caption className="sr-only">Monthly campus electricity consumption and billed cost</caption>
            <thead>
              <tr>
                <th>Month</th>
                <th>Consumption</th>
                <th>Bill</th>
              </tr>
            </thead>
            <tbody>
              {campusMonthlyData.map((row) => (
                <tr key={row.month}>
                  <td data-label="Month">{row.label}</td>
                  <td data-label="Consumption">{integerFormatter.format(row.consumption)} kWh</td>
                  <td data-label="Bill">{inrFormatter.format(row.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
