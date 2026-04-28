"use client";
import { useState } from "react";
import Link from "next/link";
import { ALL_JOBS, PROJECTS } from "@/lib/data";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { BrandChip } from "@/components/shared/BrandChip";
import { RequestTypeBadge } from "@/components/shared/RequestTypeBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StageStepper } from "@/components/shared/StageStepper";
import type { Job } from "@/lib/types";

// My submissions = submitted by lclary or mlopez for demo variety
const MY_SUBMISSIONS = ALL_JOBS.filter((j) =>
  ["lclary", "mlopez", "ptran"].includes(j.submittedBy.id)
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function CompactStepper({ job }: { job: Job }) {
  const total = job.stages.filter((s) => s.status !== "skipped").length;
  const done = job.stages.filter((s) => s.status === "completed").length;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {job.stages.filter((s) => s.status !== "skipped").map((s) => (
          <div
            key={s.id}
            className={`h-1.5 w-5 rounded-full ${
              s.status === "completed"
                ? "bg-nee-green"
                : s.status === "active"
                ? "bg-nee-blue"
                : "bg-edge-light"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-ink-secondary">{done}/{total} stages</span>
    </div>
  );
}

function SubmissionCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [revising, setRevising] = useState(false);
  const project = PROJECTS.find((p) => p.id === job.projectId);
  const activeStage = job.stages.find((s) => s.status === "active");

  function handleCancel() {
    if (!cancelReason.trim()) return;
    setCancelled(true);
    setCancelling(false);
  }

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
        job.status === "returned"
          ? "border-[#f39900]"
          : job.priority === "Crisis"
          ? "border-priority-crisis"
          : "border-edge-light"
      }`}
    >
      {/* Returned banner */}
      {job.status === "returned" && job.returnedComment && !revising && (
        <div className="flex items-start gap-3 px-4 py-3 bg-surface-alert border-b border-[#f39900]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
            <path d="M8 2L14 13H2L8 2Z" stroke="#f39900" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 6.5v3" stroke="#f39900" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.5" fill="#f39900" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-ink-alert">
              Returned for Revision — {job.returnedStage} on {job.returnedDate ? formatDate(job.returnedDate) : ""}
            </p>
            <p className="text-xs text-ink-alert mt-0.5 leading-relaxed">{job.returnedComment}</p>
          </div>
          <button
            onClick={() => setRevising(true)}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#f39900] text-white hover:bg-[#d08600] transition-colors"
          >
            Revise & Resubmit
          </button>
        </div>
      )}

      {/* Revise form */}
      {revising && (
        <div className="px-4 py-4 bg-surface-alert border-b border-[#f39900]">
          <p className="text-xs font-semibold text-ink-alert mb-2">
            Revision — Resubmit to {job.returnedStage}
          </p>
          <textarea
            placeholder="Describe the changes you made…"
            rows={2}
            className="w-full text-sm rounded-lg border border-[#f39900] px-3 py-2 text-ink-primary placeholder-ink-secondary/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#5ab2e2] bg-white mb-2"
          />
          <div className="flex gap-2">
            <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-nee-green text-white hover:bg-nee-greenDark transition-colors">
              Resubmit
            </button>
            <button
              onClick={() => setRevising(false)}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white border border-edge text-ink-secondary hover:text-ink-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main card body */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <BrandChip brand={job.brand} size="sm" />
              <RequestTypeBadge requestType={job.requestType} size="sm" short />
            </div>
            <Link
              href={`/job/${job.id}`}
              className="text-sm font-semibold text-ink-primary hover:text-nee-blueLink leading-tight block mb-1"
            >
              {job.title}
            </Link>
            <p className="text-xs text-ink-secondary">{project?.name}</p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <PriorityBadge priority={job.priority} size="sm" />
            {cancelled ? (
              <StatusBadge status="cancelled" size="sm" />
            ) : (
              <StatusBadge status={job.status} size="sm" />
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-edge-light">
          <CompactStepper job={job} />
          {activeStage && (
            <p className="text-xs text-ink-secondary mt-1.5">
              Currently at:{" "}
              <span className="font-medium text-ink-primary">{activeStage.name}</span>
              {activeStage.assignedTo && (
                <> · {activeStage.assignedTo.name}</>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-nee-blueLink hover:underline"
          >
            {expanded ? "Hide details ↑" : "View stage details ↓"}
          </button>
          <div className="flex gap-2">
            {!cancelled && job.status !== "approved" && (
              <button
                onClick={() => setCancelling(!cancelling)}
                className="text-xs text-ink-secondary hover:text-ink-error transition-colors"
              >
                Cancel Job
              </button>
            )}
            <span className="text-xs text-ink-secondary">
              Due {formatDate(job.dueDate)}
            </span>
          </div>
        </div>

        {/* Cancel form — enforced reason */}
        {cancelling && !cancelled && (
          <div className="mt-3 p-3 rounded-lg border border-edge-light bg-white">
            <p className="text-xs font-semibold text-ink-error mb-2">
              Cancellation Reason <span className="text-ink-error">*</span>
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Explain why this job is being cancelled (required)…"
              rows={2}
              className="w-full text-sm rounded-lg border border-[#ec9070] px-3 py-2 text-ink-primary placeholder-ink-secondary/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#5ab2e2] bg-white mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={!cancelReason.trim()}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-ink-error text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Cancellation
              </button>
              <button
                onClick={() => setCancelling(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-edge text-ink-secondary hover:text-ink-primary transition-colors"
              >
                Keep Job
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded stepper */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-edge-light bg-surface-primary">
          <div className="pt-4">
            <StageStepper stages={job.stages} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubmissionsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "returned" | "approved">("all");

  const returnedCount = MY_SUBMISSIONS.filter((j) => j.status === "returned").length;

  const filtered = MY_SUBMISSIONS.filter((j) => {
    if (filter === "all") return true;
    return j.status === filter;
  });

  const subtitle = returnedCount > 0
    ? `${returnedCount} job${returnedCount !== 1 ? "s" : ""} returned for revision`
    : `${MY_SUBMISSIONS.length} job${MY_SUBMISSIONS.length !== 1 ? "s" : ""} submitted`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header — on gray */}
      <div className="flex-shrink-0 pt-2 pb-5">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-ink-primary tracking-tight leading-7">My Submissions</h1>
        </div>
        <p className={`text-base mt-1 ${returnedCount > 0 ? "text-[#503513] font-medium" : "text-ink-primary"}`}>
          {subtitle}
        </p>
        <div className="flex gap-1 mt-4">
          {[
            { key: "all",      label: "All",       count: null },
            { key: "returned", label: "Returned",  count: returnedCount > 0 ? returnedCount : null },
            { key: "active",   label: "In Review",  count: null },
            { key: "approved", label: "Approved",   count: null },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                filter === key
                  ? "bg-nee-navy text-white"
                  : "text-ink-secondary hover:bg-surface-primary hover:text-ink-primary"
              }`}
            >
              {label}
              {count !== null && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    filter === key
                      ? "bg-white/20 text-white"
                      : "bg-[#ffefce] text-[#503513]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 max-w-3xl">
          {filtered.length === 0 ? (
            <p className="text-sm text-ink-secondary py-12 text-center">
              No submissions in this category.
            </p>
          ) : (
            filtered.map((job) => <SubmissionCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
}
