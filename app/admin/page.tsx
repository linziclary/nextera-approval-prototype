"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ALL_JOBS, PROJECTS, REVIEWERS } from "@/lib/data";
import type { JobStatus, Priority } from "@/lib/types";

const S  = { fontFamily: "'Arial Nova', Arial, sans-serif" } as const;
const SB = { fontFamily: "'Arial Nova', Arial, sans-serif", fontWeight: 700 } as const;

const today = new Date().toISOString().slice(0, 10);

const PRIORITY_ORDER: Record<Priority, number> = { Crisis: 0, Strategic: 1, "Quick Win": 2, Operational: 3 };

const PRIORITY_CHIP: Record<Priority, { bg: string; color: string }> = {
  Crisis:      { bg: "#ffebe4", color: "#d04100" },
  Strategic:   { bg: "#ffefce", color: "#503513" },
  Operational: { bg: "#e4fad9", color: "#48801c" },
  "Quick Win": { bg: "#e4fad9", color: "#48801c" },
};

function statusStyle(status: JobStatus): { label: string; bg: string; color: string } {
  if (status === "approved")  return { label: "Complete",    bg: "#e4fad9", color: "#48801c" };
  if (status === "returned")  return { label: "Blocked",     bg: "#ffebe4", color: "#d04100" };
  if (status === "cancelled") return { label: "Cancelled",   bg: "#e6e9eb", color: "#72797e" };
  return                              { label: "In Progress", bg: "#e1f5ff", color: "#0077ac" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function Chip({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: bg, color, fontSize: 11, lineHeight: "14px", ...S }}
    >
      {label}
    </span>
  );
}

function MetricCard({ value, label, sub }: { value: string | number; label: string; sub: string }) {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-1 flex-1">
      <span className="text-[#0c2737]" style={{ fontSize: 30, lineHeight: "32px", letterSpacing: "-0.225px", fontWeight: 700, ...S }}>
        {value}
      </span>
      <span className="text-[#0c2737]" style={{ fontSize: 18, lineHeight: "24px", ...S }}>{label}</span>
      <span className="text-[#72797e]" style={{ fontSize: 14, lineHeight: "18px", ...S }}>{sub}</span>
    </div>
  );
}

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex flex-col gap-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="flex-shrink-0 text-[#72797e] truncate" style={{ width: 130, fontSize: 12, lineHeight: "14px", ...S }}>
            {d.label}
          </span>
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 7, backgroundColor: "#e6e9eb" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }} />
          </div>
          <span className="flex-shrink-0 text-right text-[#0c2737]" style={{ width: 20, fontSize: 12, lineHeight: "14px", ...S, fontWeight: 400 }}>
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

type SortDir = "asc" | "desc";
type SortCol = "project" | "title" | "brand" | "channel" | "priority" | "stage" | "reviewer" | "dueDate" | "status";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span style={{ marginLeft: 3, opacity: active ? 1 : 0.25, fontSize: 10, color: "#72797e" }}>
      {active && dir === "desc" ? "↓" : "↑"}
    </span>
  );
}

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: 12, lineHeight: "14px", color: "#72797e", ...S }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: 12, lineHeight: "14px", color: "#0c2737", border: "1px solid #b5bdc3",
          borderRadius: 6, padding: "4px 8px", backgroundColor: "white", cursor: "pointer",
          outline: "none", ...S,
        }}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function PipelinePage() {
  const activeJobs   = ALL_JOBS.filter((j) => j.status === "active");
  const overdueJobs  = ALL_JOBS.filter((j) => j.status !== "approved" && j.status !== "cancelled" && j.dueDate < today);
  const approvedJobs = ALL_JOBS.filter((j) => j.status === "approved");

  const avgDays = approvedJobs.length > 0
    ? (approvedJobs.reduce((sum, j) => sum + j.daysPending, 0) / approvedJobs.length).toFixed(1)
    : "—";

  const byBrand: Record<string, number> = {};
  for (const j of activeJobs) byBrand[j.brand] = (byBrand[j.brand] ?? 0) + 1;
  const brandData = Object.entries(byBrand).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));

  const cancellationData = [
    { label: "Budget reprioritised", value: 3 },
    { label: "Scope changed",        value: 2 },
    { label: "Duplicate request",    value: 2 },
    { label: "Stakeholder withdrawn", value: 1 },
  ];

  // ── Table state ────────────────────────────────────────────────────────────
  const [sortCol, setSortCol]               = useState<SortCol>("dueDate");
  const [sortDir, setSortDir]               = useState<SortDir>("asc");
  const [filterBrand, setFilterBrand]       = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus]     = useState("All");
  const [reassignMap, setReassignMap]       = useState<Record<string, string>>({});

  const projectMap = useMemo(
    () => Object.fromEntries(PROJECTS.map((p) => [p.id, p.name])),
    []
  );

  const brandOptions    = useMemo(() => ["All", ...Array.from(new Set(ALL_JOBS.map((j) => j.brand)))], []);
  const priorityOptions = ["All", "Crisis", "Strategic", "Quick Win", "Operational"];
  const statusOptions   = ["All", "active", "approved", "returned", "cancelled"];

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  }

  const rows = useMemo(() => {
    const list = ALL_JOBS
      .filter((j) => filterBrand    === "All" || j.brand    === filterBrand)
      .filter((j) => filterPriority === "All" || j.priority === filterPriority)
      .filter((j) => filterStatus   === "All" || j.status   === filterStatus);

    return [...list].sort((a, b) => {
      const stageA = a.stages.find((s) => s.status === "active");
      const stageB = b.stages.find((s) => s.status === "active");
      const ridA = reassignMap[a.id] ?? stageA?.assignedTo?.id ?? "";
      const ridB = reassignMap[b.id] ?? stageB?.assignedTo?.id ?? "";

      let va: string | number = "";
      let vb: string | number = "";

      switch (sortCol) {
        case "project":  va = projectMap[a.projectId] ?? ""; vb = projectMap[b.projectId] ?? ""; break;
        case "title":    va = a.title;    vb = b.title;    break;
        case "brand":    va = a.brand;    vb = b.brand;    break;
        case "channel":  va = a.channels[0] ?? ""; vb = b.channels[0] ?? ""; break;
        case "priority": va = PRIORITY_ORDER[a.priority]; vb = PRIORITY_ORDER[b.priority]; break;
        case "stage":    va = stageA?.name ?? ""; vb = stageB?.name ?? ""; break;
        case "reviewer": va = REVIEWERS[ridA]?.name ?? ""; vb = REVIEWERS[ridB]?.name ?? ""; break;
        case "dueDate":  va = a.dueDate;  vb = b.dueDate;  break;
        case "status":   va = a.status;   vb = b.status;   break;
      }

      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filterBrand, filterPriority, filterStatus, sortCol, sortDir, reassignMap, projectMap]);

  const cellHead: React.CSSProperties = {
    padding: "8px 10px", fontSize: 12, lineHeight: "14px", color: "#72797e",
    backgroundColor: "#f8f9fb", borderBottom: "1px solid #b5bdc3",
    textAlign: "left", whiteSpace: "nowrap", cursor: "pointer",
    userSelect: "none", fontWeight: 400, ...S,
  };

  const cellBody: React.CSSProperties = {
    padding: "10px", fontSize: 12, lineHeight: "14px",
    color: "#0c2737", borderBottom: "1px solid #e6e9eb", verticalAlign: "middle", ...S,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col gap-1" style={{ marginBottom: 16 }}>
        <h1 className="text-[#0c2737]" style={{ fontSize: 24, lineHeight: "28px", letterSpacing: "-0.144px", fontWeight: 700, ...S }}>
          Pipeline View
        </h1>
        <p className="text-[#72797e]" style={{ fontSize: 14, lineHeight: "18px", ...S }}>
          Approval pipeline data across your projects and jobs
        </p>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {/* KPI row 1 */}
        <div className="flex gap-4">
          <MetricCard value={activeJobs.length} label="Active Jobs" sub="Jobs that are started and not yet completed" />
          <MetricCard value={overdueJobs.length} label="Jobs Overdue" sub={overdueJobs.length === 0 ? "Currently all are within due date" : "Past due date"} />
        </div>

        {/* KPI row 2 */}
        <div className="flex gap-4">
          <MetricCard value={ALL_JOBS.length} label="Total Jobs" sub="Across all projects and brands" />
          <MetricCard value={avgDays} label="Days to Approval" sub="Average across approved jobs" />
        </div>

        {/* Charts */}
        <div className="flex gap-4">
          <div className="bg-white rounded-lg p-4 flex-1">
            <h3 className="text-[#0c2737] mb-4" style={{ fontSize: 16, lineHeight: "20px", ...SB }}>Active Jobs by Brand</h3>
            <BarChart data={brandData.length > 0 ? brandData : [{ label: "No data", value: 0 }]} color="#ca8eef" />
          </div>
          <div className="bg-white rounded-lg p-4 flex-1">
            <h3 className="text-[#0c2737] mb-4" style={{ fontSize: 16, lineHeight: "20px", ...SB }}>Cancellation Reasons</h3>
            <BarChart data={cancellationData} color="#f39900" />
          </div>
        </div>

        {/* Jobs table */}
        <div className="bg-white rounded-lg" style={{ border: "1px solid #e6e9eb" }}>
          {/* Toolbar */}
          <div className="flex items-center gap-4 flex-wrap p-4" style={{ borderBottom: "1px solid #b5bdc3" }}>
            <span style={{ fontSize: 16, lineHeight: "20px", color: "#0c2737", ...SB }}>All Jobs</span>
            <span style={{ fontSize: 12, color: "#72797e", ...S }}>
              {rows.length}{rows.length !== ALL_JOBS.length ? ` of ${ALL_JOBS.length}` : ""} jobs
            </span>
            <div className="flex items-center gap-4 ml-auto flex-wrap">
              <FilterSelect label="Brand"    value={filterBrand}    options={brandOptions}    onChange={setFilterBrand} />
              <FilterSelect label="Priority" value={filterPriority} options={priorityOptions} onChange={setFilterPriority} />
              <FilterSelect label="Status"   value={filterStatus}   options={statusOptions}   onChange={setFilterStatus} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 960 }}>
              <thead>
                <tr>
                  {(
                    [
                      ["project",  "Project"],
                      ["title",    "Job Title"],
                      ["brand",    "Brand"],
                      ["channel",  "Channel"],
                      ["priority", "Priority"],
                      ["stage",    "Current Stage"],
                      ["reviewer", "Assigned Reviewer"],
                      ["dueDate",  "Due Date"],
                      ["status",   "Status"],
                    ] as [SortCol, string][]
                  ).map(([col, label]) => (
                    <th key={col} style={cellHead} onClick={() => handleSort(col)}>
                      {label}
                      <SortIcon active={sortCol === col} dir={sortDir} />
                    </th>
                  ))}
                  <th style={{ ...cellHead, cursor: "default" }}>Reassign</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((job) => {
                  const activeStage = job.stages.find((s) => s.status === "active");
                  const isOverdue = job.status !== "approved" && job.status !== "cancelled" && job.dueDate < today;
                  const priChip = PRIORITY_CHIP[job.priority];
                  const sChip = statusStyle(job.status);
                  const reassignedId = reassignMap[job.id];
                  const reviewer = reassignedId ? REVIEWERS[reassignedId] : activeStage?.assignedTo;

                  return (
                    <tr key={job.id} className="hover:bg-[#f8f9fb] transition-colors">
                      {/* Project */}
                      <td style={{ ...cellBody, color: "#72797e", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {projectMap[job.projectId]}
                      </td>

                      {/* Job Title */}
                      <td style={{ ...cellBody, maxWidth: 200 }}>
                        <Link
                          href={`/job/${job.id}`}
                          style={{ color: "#0077ac", textDecoration: "none", ...SB, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {job.title}
                        </Link>
                      </td>

                      {/* Brand */}
                      <td style={cellBody}>{job.brand}</td>

                      {/* Channel */}
                      <td style={{ ...cellBody, color: "#72797e", whiteSpace: "nowrap" }}>
                        {job.channels.slice(0, 2).join(", ")}
                      </td>

                      {/* Priority */}
                      <td style={cellBody}>
                        <Chip label={job.priority} bg={priChip.bg} color={priChip.color} />
                      </td>

                      {/* Current Stage */}
                      <td style={{ ...cellBody, color: "#72797e", whiteSpace: "nowrap" }}>
                        {activeStage?.name ?? (job.status === "approved" ? "Complete" : "—")}
                      </td>

                      {/* Assigned Reviewer */}
                      <td style={cellBody}>
                        {reviewer ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-flex items-center justify-center rounded-full flex-shrink-0"
                              style={{ width: 20, height: 20, backgroundColor: reviewer.avatarColor, color: "white", fontSize: 10, ...S }}
                            >
                              {reviewer.initials}
                            </span>
                            <span style={{ whiteSpace: "nowrap", color: reassignedId ? "#0077ac" : "#0c2737" }}>
                              {reviewer.name}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: "#b5bdc3" }}>—</span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td style={{ ...cellBody, whiteSpace: "nowrap", color: isOverdue ? "#d04100" : "#0c2737" }}>
                        {formatDate(job.dueDate)}
                        {isOverdue && <span style={{ marginLeft: 4, fontSize: 10 }}>⚠</span>}
                      </td>

                      {/* Status */}
                      <td style={cellBody}>
                        <Chip label={sChip.label} bg={sChip.bg} color={sChip.color} />
                      </td>

                      {/* Reassign */}
                      <td style={cellBody}>
                        <select
                          value={reassignedId ?? activeStage?.assignedTo?.id ?? ""}
                          onChange={(e) =>
                            setReassignMap((prev) => ({ ...prev, [job.id]: e.target.value }))
                          }
                          disabled={!activeStage}
                          style={{
                            fontSize: 11, color: "#0077ac", border: "1px solid #b5bdc3",
                            borderRadius: 6, padding: "3px 6px", backgroundColor: "white",
                            cursor: activeStage ? "pointer" : "default",
                            opacity: activeStage ? 1 : 0.4, maxWidth: 140, outline: "none", ...S,
                          }}
                        >
                          {!activeStage && <option value="">—</option>}
                          {Object.values(REVIEWERS).map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={10} style={{ ...cellBody, textAlign: "center", color: "#72797e", padding: "40px 16px" }}>
                      No jobs match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
