"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import type { Job, Priority } from "@/lib/types";

const S  = { fontFamily: "'Arial Nova', Arial, sans-serif" } as const;
const SB = { fontFamily: "'Arial', Arial, sans-serif", fontWeight: 700 } as const;

const PRIORITY_CHIP: Record<Priority, { bg: string; color: string }> = {
  Crisis:      { bg: "#ffebe4", color: "#d04100" },
  Strategic:   { bg: "#ffefce", color: "#503513" },
  Operational: { bg: "#e4fad9", color: "#48801c" },
  "Quick Win": { bg: "#ffefce", color: "#503513" },
};

function topPriority(jobs: Job[]): Priority {
  const order: Priority[] = ["Crisis", "Strategic", "Quick Win", "Operational"];
  for (const p of order) {
    if (jobs.some((j) => j.priority === p)) return p;
  }
  return "Operational";
}

function jobStatusText(job: Job): { label: string; color: string } {
  if (job.status === "approved")   return { label: "Approved",      color: "#48801c" };
  if (job.status === "returned")   return { label: "Returned",      color: "#503513" };
  if (job.status === "cancelled")  return { label: "Cancelled",     color: "#72797e" };
  const active = job.stages.find((s) => s.status === "active");
  if (active?.assignedTo?.id === "jmiles") return { label: "Needs Approval", color: "#0077ac" };
  return { label: "In Progress", color: "#0c2737" };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
}

function ChevronRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5.5 3.5L9.5 7.5L5.5 11.5" stroke="#72797e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#72797e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PriorityChip({ priority }: { priority: Priority }) {
  const { bg, color } = PRIORITY_CHIP[priority];
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: bg, color, fontSize: 12, lineHeight: "14px", ...S }}
    >
      {priority}
    </span>
  );
}

export default function ProjectsPage() {
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(PROJECTS.map((p) => [p.id, true]))
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return PROJECTS;
    const q = search.toLowerCase();
    return PROJECTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.jobs.some((j) => j.title.toLowerCase().includes(q))
    );
  }, [search]);

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const cellBase: React.CSSProperties = {
    padding: "8px",
    fontSize: 12,
    lineHeight: "14px",
    borderBottom: "1px solid #b5bdc3",
    ...S,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Breadcrumb header */}
      <div className="flex-shrink-0 flex items-center" style={{ height: 32, marginBottom: 16 }}>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2" style={{ fontSize: 14, lineHeight: "18px", color: "#72797e", ...S }}>
            <Link href="/" style={{ color: "#72797e", textDecoration: "none" }}>My Approvals</Link>
            <span>/</span>
            <span style={{ color: "#0c2737", ...SB }}>My Projects &amp; Jobs</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white rounded-lg">
          {/* Search + count row */}
          <div className="flex items-center gap-4 p-4" style={{ borderBottom: "1px solid #b5bdc3" }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
              style={{ border: "1px solid #b5bdc3", maxWidth: 320 }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="4" stroke="#72797e" strokeWidth="1.2" />
                <path d="M11 11L9.5 9.5" stroke="#72797e" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#0c2737]"
                style={{ fontSize: 14, lineHeight: "18px", ...S }}
              />
            </div>
            <span className="ml-auto text-[#0c2737] whitespace-nowrap" style={{ fontSize: 12, lineHeight: "14px", ...S }}>
              Showing {filtered.length} Project{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table */}
          <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 16 }} />
              <col style={{ width: 220 }} />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...cellBase, backgroundColor: "#f8f9fb", fontWeight: 400, color: "#0c2737", width: 16 }} />
                <th style={{ ...cellBase, backgroundColor: "#f8f9fb", fontWeight: 400, color: "#0c2737", textAlign: "left" }}>
                  Project / Jobs
                </th>
                <th style={{ ...cellBase, backgroundColor: "#f8f9fb", fontWeight: 400, color: "#0c2737", textAlign: "left" }}>
                  Brand
                </th>
                <th style={{ ...cellBase, backgroundColor: "#f8f9fb", fontWeight: 400, color: "#0c2737", textAlign: "left" }}>
                  Channels
                </th>
                <th style={{ ...cellBase, backgroundColor: "#f8f9fb", fontWeight: 400, color: "#0c2737", textAlign: "left" }}>
                  Due Date
                </th>
                <th style={{ ...cellBase, backgroundColor: "#f8f9fb", fontWeight: 400, color: "#0c2737", textAlign: "left" }}>
                  Priority / Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const isExpanded = !!expanded[project.id];
                const pri = topPriority(project.jobs);
                const latestDue = project.jobs
                  .map((j) => j.dueDate)
                  .sort()
                  .at(-1) ?? "";

                return (
                  <>
                    {/* Project row */}
                    <tr key={project.id} style={{ cursor: "pointer" }} onClick={() => toggle(project.id)}>
                      <td style={{ ...cellBase, color: "#72797e", verticalAlign: "middle", padding: "8px 4px" }}>
                        {isExpanded ? <ChevronDown /> : <ChevronRight />}
                      </td>
                      <td style={{ ...cellBase, verticalAlign: "middle" }}>
                        <div style={{ ...SB, color: "#0c2737", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {project.name}
                        </div>
                        <div style={{ ...S, color: "#72797e", marginTop: 2 }}>
                          {project.jobs.length} Jobs
                        </div>
                      </td>
                      <td style={{ ...cellBase, color: "#72797e", verticalAlign: "middle" }}>{project.brand}</td>
                      <td style={{ ...cellBase, color: "#72797e", verticalAlign: "middle", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {Array.from(new Set(project.jobs.flatMap((j) => j.channels))).slice(0, 3).join(", ")}
                      </td>
                      <td style={{ ...cellBase, color: "#72797e", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        {latestDue ? formatDate(latestDue) : "—"}
                      </td>
                      <td style={{ ...cellBase, verticalAlign: "middle" }}>
                        <PriorityChip priority={pri} />
                      </td>
                    </tr>

                    {/* Job rows (expanded) */}
                    {isExpanded &&
                      project.jobs.map((job) => {
                        const { label, color } = jobStatusText(job);
                        return (
                          <tr key={job.id} style={{ borderBottom: "1px solid #e6e9eb" }}>
                            <td style={{ padding: "16px 4px", borderBottom: "1px solid #e6e9eb" }} />
                            <td style={{ padding: "16px 8px 16px 24px", borderBottom: "1px solid #e6e9eb", verticalAlign: "middle" }}>
                              <Link
                                href={`/job/${job.id}`}
                                style={{ ...SB, color: "#0077ac", fontSize: 12, lineHeight: "14px", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                              >
                                {job.title}
                              </Link>
                            </td>
                            <td style={{ padding: "16px 8px", color: "#72797e", fontSize: 12, lineHeight: "14px", ...S, borderBottom: "1px solid #e6e9eb", verticalAlign: "middle" }}>
                              {job.brand}
                            </td>
                            <td style={{ padding: "16px 8px", color: "#72797e", fontSize: 12, lineHeight: "14px", ...S, borderBottom: "1px solid #e6e9eb", verticalAlign: "middle", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {job.channels.slice(0, 2).join(", ")}
                            </td>
                            <td style={{ padding: "16px 8px", color: "#72797e", fontSize: 12, lineHeight: "14px", ...S, borderBottom: "1px solid #e6e9eb", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                              {formatDate(job.dueDate)}
                            </td>
                            <td style={{ padding: "16px 8px", fontSize: 12, lineHeight: "14px", ...S, borderBottom: "1px solid #e6e9eb", verticalAlign: "middle", color }}>
                              {label}
                            </td>
                          </tr>
                        );
                      })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
