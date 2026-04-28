"use client";
import { useState } from "react";
import Link from "next/link";
import { ALL_JOBS } from "@/lib/data";
import type { Job, Priority } from "@/lib/types";

const S  = { fontFamily: "'Arial Nova', Arial, sans-serif" } as const;
const SB = { fontFamily: "'Arial', Arial, sans-serif", fontWeight: 700 } as const;

function formatDue(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

const PRIORITY_ORDER: Record<Priority, number> = { Crisis: 0, Strategic: 1, "Quick Win": 2, Operational: 3 };
const AWAITING   = ALL_JOBS
  .filter((j) => j.status === "active" && j.stages.some((s) => s.status === "active" && s.assignedTo?.id === "jmiles"))
  .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
const ALL_ACTIVE  = ALL_JOBS.filter((j) => j.status === "active");
const COMPLETED   = ALL_JOBS.filter((j) => j.status === "approved");
const RETURNED    = ALL_JOBS.filter((j) => j.status === "returned");

type Tab = "awaiting" | "active" | "completed" | "returned";

const PRIORITY_CHIP: Record<Priority, { bg: string; color: string }> = {
  Crisis:      { bg: "#ffebe4", color: "#d04100" },
  Strategic:   { bg: "#ffefce", color: "#503513" },
  Operational: { bg: "#e4fad9", color: "#48801c" },
  "Quick Win": { bg: "#e4fad9", color: "#48801c" },
};

function Chip({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: bg, color, fontSize: 12, lineHeight: "14px", ...S }}
    >
      {label}
    </span>
  );
}

function Avatar({ initials, bg = "#48801c" }: { initials: string; bg?: string }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full flex-shrink-0 text-white"
      style={{ width: 24, height: 24, backgroundColor: bg, fontSize: 12, lineHeight: "14px", ...S }}
    >
      {initials}
    </span>
  );
}

function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function statusChip(job: Job): { label: string; bg: string; color: string } {
  if (job.status === "approved")  return { label: "Complete",            bg: "#e4fad9", color: "#48801c" };
  if (job.status === "returned")  return { label: "Blocked",             bg: "#ffebe4", color: "#d04100" };
  if (job.status === "cancelled") return { label: "Complete",            bg: "#e6e9eb", color: "#72797e" };
  const active = job.stages.find((s) => s.status === "active");
  if (active?.assignedTo?.id === "jmiles") return { label: "Needs Your Approval", bg: "#008ac0", color: "#ffffff" };
  if (active?.assignedTo)                  return { label: "In Review",            bg: "#e1f5ff", color: "#0077ac" };
  return { label: "In Progress", bg: "#e1f5ff", color: "#0077ac" };
}

function JobCard({ job }: { job: Job }) {
  const activeStage = job.stages.find((s) => s.status === "active");
  const isCrisis = job.priority === "Crisis";
  const priChip = PRIORITY_CHIP[job.priority];
  const needsReview = activeStage?.assignedTo?.id === "jmiles";
  const chip = statusChip(job);

  return (
    <div
      className="bg-white rounded-lg p-4 flex flex-col gap-2"
      style={{ border: `1px solid ${isCrisis ? "#d04100" : "transparent"}` }}
    >
      {/* Row 1: title · due date · status chip */}
      <div className="flex items-center gap-2">
        <span className="flex-1 min-w-0" style={{ fontSize: 16, lineHeight: "20px", fontWeight: 700, color: "#0077ac", fontFamily: "'Arial Nova', Arial, sans-serif" }}>
          {job.title}
        </span>
        <span className="text-[#72797e] whitespace-nowrap flex-shrink-0" style={{ fontSize: 12, lineHeight: "14px", ...S }}>
          Due {formatDue(job.dueDate)}
        </span>
        <Chip label={chip.label} bg={chip.bg} color={chip.color} />
      </div>

      {/* Row 2: tags */}
      <div className="flex flex-wrap gap-2">
        <Chip label={job.brand} bg="#e6e9eb" color="#0c2737" />
        {job.channels.slice(0, 2).map((ch) => (
          <Chip key={ch} label={ch} bg="#e6e9eb" color="#0c2737" />
        ))}
        <Chip label={job.priority} bg={priChip.bg} color={priChip.color} />
      </div>

      {/* Row 3: reviewer + action button */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {activeStage?.assignedTo && (
            <>
              <Avatar initials={activeStage.assignedTo.initials} />
              <span style={{ fontSize: 12, lineHeight: "14px", color: "#0c2737", whiteSpace: "nowrap", ...SB }}>
                {activeStage.assignedTo.name}
              </span>
              <span style={{ fontSize: 12, lineHeight: "14px", color: "#72797e", whiteSpace: "nowrap", ...S }}>
                {activeStage.name}
              </span>
            </>
          )}
        </div>
        <Link
          href={`/job/${job.id}`}
          style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, padding: "8px 12px", borderRadius: 8, border: "1px solid #48801c", color: "#48801c", fontSize: 12, lineHeight: "14px", textDecoration: "none", ...S }}
        >
          {needsReview ? "Review" : "View Job"}
          <ArrowRight />
        </Link>
      </div>
    </div>
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

export default function ApprovalsPage() {
  const [tab, setTab] = useState<Tab>("awaiting");

  const tabs: { key: Tab; label: string; jobs: Job[] }[] = [
    { key: "awaiting",  label: "Awaiting Me", jobs: AWAITING  },
    { key: "active",    label: "All Active",  jobs: ALL_ACTIVE },
    { key: "completed", label: "Completed",   jobs: COMPLETED  },
    { key: "returned",  label: "Returned",    jobs: RETURNED   },
  ];

  const currentJobs = tabs.find((t) => t.key === tab)!.jobs;
  const overdueCount = ALL_JOBS.filter((j) => j.status === "active" && j.dueDate < new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center" style={{ height: 32, marginBottom: 16 }}>
        <h1 className="text-[#0c2737]" style={{ fontSize: 24, lineHeight: "28px", letterSpacing: "-0.144px", fontWeight: 700, ...S }}>
          My Approvals
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {/* Metric cards */}
        <div className="flex gap-4">
          <MetricCard value={AWAITING.length}   label="Awaiting My Review"  sub="Jobs that need your action" />
          <MetricCard value={overdueCount}       label="Jobs Overdue"        sub={overdueCount === 0 ? "All within due date" : "Past due date"} />
          <MetricCard value={COMPLETED.length}   label="Approved this Week"  sub="Jobs approved by you" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(({ key, label, jobs }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive ? "#0077ac" : "transparent",
                  color: isActive ? "#ffffff" : "#0077ac",
                  fontSize: 12, lineHeight: "14px", ...S,
                }}
              >
                {label}
                {key === "awaiting" && jobs.length > 0 && (
                  <span
                    className="inline-flex items-center justify-center rounded-full"
                    style={{
                      width: 16, height: 16,
                      backgroundColor: "#ffffff",
                      color: "#0077ac",
                      fontSize: 12, ...S,
                    }}
                  >
                    {jobs.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-2 pb-4">
          {currentJobs.length === 0 ? (
            <p className="text-sm text-[#72797e] py-8 text-center" style={S}>No jobs in this category.</p>
          ) : (
            currentJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
}
