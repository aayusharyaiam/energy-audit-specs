"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CloudUpload,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  History,
  Info,
  ListFilter,
  LockKeyhole,
  LogOut,
  Mail,
  MoreHorizontal,
  Plus,
  ReceiptIndianRupee,
  Save,
  Search,
  ShieldCheck,
  Upload,
  Zap,
} from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { BrandMark } from "@/components/brand-mark";
import { campusMonthlyData } from "@/lib/energy-data";
import { inrFormatter, integerFormatter } from "@/lib/format";

type WorkspaceTab = "daily" | "bills" | "history" | "import";

const tabs: Array<{
  id: WorkspaceTab;
  label: string;
  shortLabel: string;
  icon: ReactNode;
}> = [
  { id: "daily", label: "Daily readings", shortLabel: "Readings", icon: <Zap size={16} /> },
  { id: "bills", label: "Monthly bills", shortLabel: "Bills", icon: <ReceiptIndianRupee size={16} /> },
  { id: "history", label: "History", shortLabel: "History", icon: <History size={16} /> },
  { id: "import", label: "Import CSV", shortLabel: "Import", icon: <FileSpreadsheet size={16} /> },
];

const areaOptions = [
  ["campus_total", "Campus total"],
  ["pump_room", "Pump room"],
  ["faculty_quarters", "Faculty quarters"],
  ["hostels", "Hostels"],
  ["guest_house", "Guest house"],
  ["outdoor_lighting", "Street & court lighting"],
  ["campus_services", "Campus services"],
  ["academic_block", "Academic block"],
];

function AdminField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="admin-field">
      <span className="admin-label">
        {label}
        {required ? <span aria-hidden="true" className="ml-1 text-[#ad5f4c]">*</span> : null}
      </span>
      {children}
      {hint ? <span className="admin-hint">{hint}</span> : null}
    </label>
  );
}

function DemoNotice() {
  return (
    <div className="admin-demo-notice">
      <Info aria-hidden="true" className="mt-0.5 shrink-0" size={15} />
      <p>
        <strong>Interface preview.</strong> Data actions are intentionally local until Supabase authentication and
        row-level security are configured.
      </p>
    </div>
  );
}

function LoginView({ onPreview }: { onPreview: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Authentication is not active yet. Configure Supabase, or use the interface preview below.");
  }

  return (
    <div className="admin-login-page">
      <header className="admin-login-header">
        <Link className="group flex items-center gap-3" href="/">
          <BrandMark className="h-9 w-9" />
          <span>
            <span className="block text-xs font-semibold text-ink">BIT Patna</span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
              Energy audit
            </span>
          </span>
        </Link>
        <Link className="admin-back-link" href="/">
          <ArrowLeft aria-hidden="true" size={14} /> Back to dashboard
        </Link>
      </header>

      <main className="admin-login-main">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="admin-login-frame"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="admin-login-story">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c4d8d1]">
                <ShieldCheck aria-hidden="true" size={13} /> Protected workspace
              </div>
              <h1 className="mt-7 max-w-md text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                Careful reporting starts here.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#b4c8c1]">
                Enter readings, review history and publish only data that has a clear unit, period and source.
              </p>
            </div>

            <div className="space-y-4">
              {[
                ["Separate reading types", "Cumulative meter readings never mix with measured daily kWh."],
                ["Review before publishing", "New and imported records remain private until explicitly published."],
                ["Keep an audit trail", "Corrections retain source notes and verification context."],
              ].map(([title, copy], index) => (
                <div className="flex gap-4 border-t border-white/10 pt-4" key={title}>
                  <span className="mt-0.5 text-[10px] font-semibold text-[#d8edb6]">0{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#9eb4ac]">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-login-form-wrap">
            <div className="mx-auto w-full max-w-[410px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Editor access</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-ink">Sign in to manage data</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Use the approved administrator account. Public visitors never need to sign in.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <AdminField label="Email address" required>
                  <div className="admin-input-icon-wrap">
                    <Mail aria-hidden="true" size={16} />
                    <input autoComplete="email" placeholder="admin@bitpatna.ac.in" required type="email" />
                  </div>
                </AdminField>
                <AdminField label="Password" required>
                  <div className="admin-input-icon-wrap">
                    <LockKeyhole aria-hidden="true" size={16} />
                    <input
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="admin-password-toggle"
                      onClick={() => setShowPassword((value) => !value)}
                      type="button"
                    >
                      {showPassword ? <EyeOff aria-hidden="true" size={16} /> : <Eye aria-hidden="true" size={16} />}
                    </button>
                  </div>
                </AdminField>

                {message ? (
                  <p aria-live="polite" className="rounded-xl border border-[#ead9b8] bg-[#fff9ed] p-3 text-xs leading-5 text-[#775d27]">
                    {message}
                  </p>
                ) : null}

                <button className="admin-primary-button w-full" type="submit">
                  Sign in securely <ArrowRight aria-hidden="true" size={15} />
                </button>
              </form>

              <div className="my-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aa19e]">
                <span className="h-px flex-1 bg-border" /> Frontend review <span className="h-px flex-1 bg-border" />
              </div>

              <button className="admin-preview-button group w-full" onClick={onPreview} type="button">
                Preview editor interface
                <ChevronRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" size={15} />
              </button>
              <p className="mt-3 text-center text-[11px] leading-5 text-muted">
                Preview mode cannot write, publish or delete records.
              </p>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}

function ReadingForm({ notify }: { notify: (message: string) => void }) {
  const [readingType, setReadingType] = useState("daily_consumption");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notify("Reading validated in preview mode. No data was written.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
      <form className="admin-panel" onSubmit={submit}>
        <div className="admin-panel-heading">
          <div>
            <p className="admin-panel-eyebrow">Manual entry</p>
            <h2>Record a daily reading</h2>
            <p>Add one measured period or cumulative meter value.</p>
          </div>
          <span className="admin-panel-icon"><Plus aria-hidden="true" size={18} /></span>
        </div>

        <div className="admin-form-grid mt-8">
          <AdminField label="Reading date" required>
            <input className="admin-input" required type="date" />
          </AdminField>
          <AdminField label="Campus area" required>
            <select className="admin-input" defaultValue="" required>
              <option disabled value="">Select an area</option>
              {areaOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </AdminField>
          <AdminField label="Reading type" required>
            <select
              className="admin-input"
              onChange={(event) => setReadingType(event.target.value)}
              value={readingType}
            >
              <option value="daily_consumption">Measured period consumption</option>
              <option value="cumulative">Cumulative meter reading</option>
            </select>
          </AdminField>
          <AdminField
            hint={readingType === "cumulative" ? "Required for cumulative readings" : "Optional for a direct area total"}
            label="Meter ID"
            required={readingType === "cumulative"}
          >
            <input
              className="admin-input"
              placeholder={readingType === "cumulative" ? "e.g. MAIN-INCOMER-01" : "Optional meter reference"}
              required={readingType === "cumulative"}
              type="text"
            />
          </AdminField>
          <AdminField label="Value (kWh)" required>
            <div className="admin-unit-input">
              <input min="0" placeholder="0.000" required step="0.001" type="number" />
              <span>kWh</span>
            </div>
          </AdminField>
          <AdminField label="Verification status" required>
            <select className="admin-input" defaultValue="needs_review">
              <option value="needs_review">Needs review</option>
              <option value="verified">Verified against source</option>
              <option value="disputed">Disputed / correction needed</option>
            </select>
          </AdminField>
          <div className="sm:col-span-2">
            <AdminField hint="Maximum 500 characters" label="Source notes">
              <textarea className="admin-input min-h-28 resize-y py-3" maxLength={500} placeholder="Meter photo reference, reset note, observation, or evidence…" />
            </AdminField>
          </div>
        </div>

        <div className="admin-form-footer">
          <label className="admin-checkbox">
            <input type="checkbox" />
            <span><Check aria-hidden="true" size={12} /></span>
            Publish immediately
          </label>
          <button className="admin-primary-button" type="submit">
            <Save aria-hidden="true" size={15} /> Validate reading
          </button>
        </div>
      </form>

      <aside className="space-y-5">
        <div className="admin-rule-card">
          <div className="flex items-center gap-3">
            <span className="admin-rule-icon"><ShieldCheck aria-hidden="true" size={17} /></span>
            <h3>Reading rules</h3>
          </div>
          <ul>
            <li><CheckCircle2 aria-hidden="true" size={14} /> Use the same meter ID across cumulative readings.</li>
            <li><CheckCircle2 aria-hidden="true" size={14} /> Never add a monthly bill to daily-derived totals.</li>
            <li><CheckCircle2 aria-hidden="true" size={14} /> Document meter resets before accepting a negative delta.</li>
          </ul>
        </div>
        <div className="admin-help-card">
          <CircleHelp aria-hidden="true" size={17} />
          <div>
            <p>Not sure which type?</p>
            <span>A meter face value that only rises is cumulative. A calculated day total is period consumption.</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function BillForm({ notify }: { notify: (message: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notify("Monthly bill validated in preview mode. No data was written.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
      <form className="admin-panel" onSubmit={submit}>
        <div className="admin-panel-heading">
          <div>
            <p className="admin-panel-eyebrow">Authoritative bill</p>
            <h2>Add a monthly bill</h2>
            <p>Record the campus total exactly as it appears on the billed source.</p>
          </div>
          <span className="admin-panel-icon admin-panel-icon-gold"><ReceiptIndianRupee aria-hidden="true" size={18} /></span>
        </div>

        <div className="admin-form-grid mt-8">
          <AdminField hint="Stored as the first calendar day" label="Billing month" required>
            <input className="admin-input" required type="month" />
          </AdminField>
          <AdminField label="Scope" required>
            <select className="admin-input" defaultValue="campus_total">
              <option value="campus_total">Campus total</option>
            </select>
          </AdminField>
          <AdminField label="Billed consumption" required>
            <div className="admin-unit-input">
              <input min="0" placeholder="0.000" required step="0.001" type="number" />
              <span>kWh</span>
            </div>
          </AdminField>
          <AdminField label="Bill amount" required>
            <div className="admin-unit-input admin-unit-prefix">
              <span>₹</span>
              <input min="0" placeholder="0.00" required step="0.01" type="number" />
            </div>
          </AdminField>
          <div className="sm:col-span-2">
            <AdminField hint="Include bill number or evidence reference when available" label="Source notes">
              <textarea className="admin-input min-h-28 resize-y py-3" maxLength={500} placeholder="Bill reference, correction note, or evidence location…" />
            </AdminField>
          </div>
        </div>

        <div className="admin-form-footer">
          <label className="admin-checkbox">
            <input type="checkbox" />
            <span><Check aria-hidden="true" size={12} /></span>
            Publish immediately
          </label>
          <button className="admin-primary-button" type="submit">
            <Save aria-hidden="true" size={15} /> Validate bill
          </button>
        </div>
      </form>

      <aside className="space-y-5">
        <div className="admin-rule-card">
          <div className="flex items-center gap-3">
            <span className="admin-rule-icon admin-rule-icon-gold"><ReceiptIndianRupee aria-hidden="true" size={17} /></span>
            <h3>Bill policy</h3>
          </div>
          <ul>
            <li><CheckCircle2 aria-hidden="true" size={14} /> The billed total is authoritative for the public monthly trend.</li>
            <li><CheckCircle2 aria-hidden="true" size={14} /> One campus-total record is allowed per billing month.</li>
            <li><CheckCircle2 aria-hidden="true" size={14} /> Daily-derived usage appears only as a reconciliation.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function HistoryPanel({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () =>
      [...campusMonthlyData]
        .reverse()
        .filter((row) => row.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <section className="admin-panel overflow-hidden p-0">
      <div className="admin-table-toolbar">
        <div>
          <p className="admin-panel-eyebrow">Historical baseline</p>
          <h2>Record history</h2>
          <p>Review imported source rows before publication.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <label className="admin-search">
            <Search aria-hidden="true" size={15} />
            <span className="sr-only">Search history</span>
            <input onChange={(event) => setQuery(event.target.value)} placeholder="Search month…" value={query} />
          </label>
          <button className="admin-icon-button" title="Filter records" type="button"><ListFilter aria-hidden="true" size={16} /></button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-history-table">
          <caption className="sr-only">Imported monthly bill history</caption>
          <thead>
            <tr>
              <th>Reporting period</th>
              <th>Type</th>
              <th>Consumption</th>
              <th>Amount</th>
              <th>Status</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month}>
                <td data-label="Reporting period">
                  <div className="admin-period-value">
                    <span className="admin-date-cell"><CalendarDays aria-hidden="true" size={15} /></span>
                    <div><strong>{row.label}</strong><span>PDF p. 32</span></div>
                  </div>
                </td>
                <td data-label="Type"><span className="admin-type-chip">Monthly bill</span></td>
                <td className="tabular-nums" data-label="Consumption">{integerFormatter.format(row.consumption)} kWh</td>
                <td className="tabular-nums" data-label="Amount">{inrFormatter.format(row.cost)}</td>
                <td data-label="Status"><span className="admin-review-chip"><span /> Needs review</span></td>
                <td data-label="Actions">
                  <button
                    aria-label={`Open actions for ${row.label}`}
                    className="admin-row-action"
                    onClick={() => notify(`Actions for ${row.label} are disabled in preview mode.`)}
                    type="button"
                  >
                    <MoreHorizontal aria-hidden="true" size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 ? (
        <div className="grid min-h-40 place-content-center text-center">
          <p className="text-sm font-semibold text-ink">No matching records</p>
          <p className="mt-1 text-xs text-muted">Try another month or clear the search.</p>
        </div>
      ) : null}
      <div className="admin-table-footer">
        <p>Showing {rows.length} of {campusMonthlyData.length} source rows</p>
        <p>All rows remain unpublished until verified</p>
      </div>
    </section>
  );
}

type CsvPreviewRow = {
  values: string[];
  valid: boolean;
  message: string;
};

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];
    if (character === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value.trim());
  return values;
}

function CsvImportPanel({ notify }: { notify: (message: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvPreviewRow[]>([]);
  const [fileError, setFileError] = useState("");

  const validCount = rows.filter((row) => row.valid).length;

  function readFile(file?: File) {
    if (!file) return;
    setFileError("");
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Choose a CSV file using the provided template columns.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError("The CSV exceeds the 2 MB import limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "").replace(/^\uFEFF/, "");
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        setFileError("The file needs a header and at least one data row.");
        return;
      }
      const parsedHeaders = parseCsvLine(lines[0]).map((value) => value.toLowerCase());
      const required = ["month", "consumption_kwh", "amount_inr"];
      const missing = required.filter((column) => !parsedHeaders.includes(column));
      if (missing.length > 0) {
        setFileError(`Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);
        return;
      }

      const monthIndex = parsedHeaders.indexOf("month");
      const consumptionIndex = parsedHeaders.indexOf("consumption_kwh");
      const amountIndex = parsedHeaders.indexOf("amount_inr");
      const parsedRows = lines.slice(1, 2001).map((line) => {
        const values = parseCsvLine(line);
        const errors: string[] = [];
        if (!/^\d{4}-\d{2}-\d{2}$/.test(values[monthIndex] ?? "")) errors.push("Invalid ISO date");
        if (!Number.isFinite(Number(values[consumptionIndex])) || Number(values[consumptionIndex]) < 0) errors.push("Invalid kWh");
        if (!Number.isFinite(Number(values[amountIndex])) || Number(values[amountIndex]) < 0) errors.push("Invalid INR");
        return { values, valid: errors.length === 0, message: errors.join(" · ") || "Ready" };
      });
      setFileName(file.name);
      setHeaders(parsedHeaders);
      setRows(parsedRows);
    };
    reader.readAsText(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    readFile(event.dataTransfer.files[0]);
  }

  function downloadTemplate() {
    const content = "month,consumption_kwh,amount_inr,notes\n2026-02-01,0,0,Replace with verified values\n";
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "monthly-bills-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-panel-eyebrow">Batch workflow</p>
            <h2>Import a CSV</h2>
            <p>Preview every row and resolve errors before an explicit commit.</p>
          </div>
          <button className="admin-template-button" onClick={downloadTemplate} type="button">
            <Download aria-hidden="true" size={14} /> Template
          </button>
        </div>

        <div
          className={`admin-drop-zone mt-8 ${dragging ? "admin-drop-zone-active" : ""}`}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(event: ChangeEvent<HTMLInputElement>) => readFile(event.target.files?.[0])}
            ref={inputRef}
            type="file"
          />
          <span className="admin-upload-icon"><CloudUpload aria-hidden="true" size={22} /></span>
          <h3>{fileName || "Drop your CSV here"}</h3>
          <p>{fileName ? `${rows.length} rows loaded for local validation` : "Maximum 2 MB · up to 2,000 rows"}</p>
          <button className="admin-preview-button mt-5" onClick={() => inputRef.current?.click()} type="button">
            <Upload aria-hidden="true" size={14} /> {fileName ? "Choose another file" : "Choose a file"}
          </button>
        </div>

        {fileError ? <p className="mt-4 rounded-xl border border-[#efd1c8] bg-[#fff5f2] p-3 text-xs text-[#8f4a3c]">{fileError}</p> : null}
      </section>

      {rows.length > 0 ? (
        <motion.section animate={{ opacity: 1, y: 0 }} className="admin-panel overflow-hidden p-0" initial={{ opacity: 0, y: 8 }}>
          <div className="admin-import-summary">
            <div>
              <p className="admin-panel-eyebrow">Validation preview</p>
              <h2>{fileName}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="admin-valid-chip"><CheckCircle2 aria-hidden="true" size={13} /> {validCount} valid</span>
              {rows.length - validCount > 0 ? <span className="admin-error-chip">{rows.length - validCount} errors</span> : null}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-history-table admin-import-table">
              <thead>
                <tr>
                  <th>Row</th>
                  {headers.slice(0, 5).map((header) => <th key={header}>{header.replaceAll("_", " ")}</th>)}
                  <th>Validation</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 6).map((row, rowIndex) => (
                  <tr key={`${rowIndex}-${row.values.join("-")}`}>
                    <td className="text-muted" data-label="Row">{rowIndex + 2}</td>
                    {headers.slice(0, 5).map((header, cellIndex) => (
                      <td data-label={header.replaceAll("_", " ")} key={cellIndex}>{row.values[cellIndex] || "—"}</td>
                    ))}
                    <td data-label="Validation">
                      <span className={row.valid ? "admin-valid-chip" : "admin-error-chip"}>
                        {row.valid ? <Check aria-hidden="true" size={12} /> : null}{row.message}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-form-footer">
            <p className="text-xs text-muted">Preview shows the first {Math.min(rows.length, 6)} rows.</p>
            <button
              className="admin-primary-button"
              disabled={validCount !== rows.length}
              onClick={() => notify("CSV passed local preview validation. Commit is disabled in preview mode.")}
              type="button"
            >
              <FileSpreadsheet aria-hidden="true" size={15} /> Validate batch
            </button>
          </div>
        </motion.section>
      ) : null}
    </div>
  );
}

function WorkspaceView({ onExit }: { onExit: () => void }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("daily");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const currentLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? "Workspace";

  return (
    <div className="admin-workspace-page">
      <header className="admin-workspace-header">
        <div className="admin-shell flex h-[70px] items-center justify-between gap-4">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            <BrandMark className="h-9 w-9 shrink-0" />
            <span className="hidden sm:block">
              <span className="block text-xs font-semibold text-ink">Energy Audit</span>
              <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.15em] text-muted">Editor workspace</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="admin-preview-status"><span /> Preview mode</span>
            <button className="admin-signout-button" onClick={onExit} type="button">
              <LogOut aria-hidden="true" size={15} /> <span className="hidden sm:inline">Exit preview</span>
            </button>
          </div>
        </div>
      </header>

      <main className="admin-shell py-8 sm:py-11">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="admin-panel-eyebrow">BIT Patna · Data management</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-4xl">Manage energy data</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              Create, review and publish readings without losing their measurement context.
            </p>
          </div>
          <DemoNotice />
        </div>

        <div className="admin-tabs-wrap mt-8" role="tablist" aria-label="Admin workspace sections">
          {tabs.map((tab) => (
            <button
              aria-controls={`panel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "admin-tab-active" : ""}
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        <div
          aria-labelledby={`tab-${activeTab}`}
          className="mt-5"
          id={`panel-${activeTab}`}
          role="tabpanel"
          tabIndex={0}
        >
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 7 }}
              key={activeTab}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "daily" ? <ReadingForm notify={setToast} /> : null}
              {activeTab === "bills" ? <BillForm notify={setToast} /> : null}
              {activeTab === "history" ? <HistoryPanel notify={setToast} /> : null}
              {activeTab === "import" ? <CsvImportPanel notify={setToast} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="admin-shell border-t border-border py-6 text-[11px] text-muted">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>{currentLabel} · interface preview</p>
          <p>No data leaves this browser session</p>
        </div>
      </footer>

      <AnimatePresence>
        {toast ? (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            aria-live="polite"
            className="admin-toast"
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <CheckCircle2 aria-hidden="true" size={17} />
            <span>{toast}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function AdminPortal() {
  const [preview, setPreview] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="workspace">
            <WorkspaceView onExit={() => setPreview(false)} />
          </motion.div>
        ) : (
          <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="login">
            <LoginView onPreview={() => setPreview(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
