"use client";
import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getJob, getProject } from "@/lib/data";
import type { Priority, Stage } from "@/lib/types";

const S  = { fontFamily: "'Arial Nova', Arial, sans-serif" } as const;
const SB = { fontFamily: "'Arial', Arial, sans-serif", fontWeight: 700 } as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

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

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <span style={{ fontSize: 12, lineHeight: "14px", color: "#72797e", ...S }}>{label}</span>
      <span style={{ fontSize: 14, lineHeight: "18px", color: "#0c2737", ...S }}>{children}</span>
    </div>
  );
}

// ── Approval Chain ─────────────────────────────────────────────────────────

type StepVariant = "completed" | "active" | "skipped" | "upcoming";

function StepIcon({ variant }: { variant: StepVariant }) {
  if (variant === "completed") {
    return (
      <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 21, height: 21, backgroundColor: "#48801c" }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (variant === "active") {
    return (
      <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 21, height: 21, backgroundColor: "#008ac0" }}>
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "white" }} />
      </div>
    );
  }
  if (variant === "skipped") {
    return (
      <div className="flex items-center justify-center rounded-full border-2 flex-shrink-0" style={{ width: 21, height: 21, borderColor: "#e6e9eb", backgroundColor: "white" }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="#b5bdc3" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  // upcoming
  return (
    <div className="flex items-center justify-center rounded-full border-2 flex-shrink-0" style={{ width: 21, height: 21, borderColor: "#e6e9eb", backgroundColor: "white" }}>
      <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#e6e9eb" }} />
    </div>
  );
}

function ApprovalStep({ stage, isLast, dueContext }: {
  stage: Stage;
  isLast: boolean;
  dueContext?: string;
}) {
  let variant: StepVariant = "upcoming";
  if (stage.status === "completed") variant = "completed";
  else if (stage.status === "active")   variant = "active";
  else if (stage.status === "skipped")  variant = "skipped";

  const isNotRequired = stage.status === "skipped";
  const nameColor =
    variant === "skipped"  ? "#b5bdc3" :
    variant === "completed" ? "#72797e" : "#0c2737";

  const completedDate = stage.completedDate ? `Approved ${new Date(stage.completedDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}` : undefined;
  const dueLabel = stage.dueDate
    ? `Due ${new Date(stage.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
    : dueContext;

  return (
    <div className="flex gap-2">
      {/* Left: connector line + icon */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 21 }}>
        <div style={{ width: 1, flex: 1, minHeight: 8, backgroundColor: "#e6e9eb" }} />
        <StepIcon variant={variant} />
        {!isLast && <div style={{ width: 1, flex: 1, minHeight: 8, backgroundColor: "#e6e9eb" }} />}
      </div>

      {/* Right: label + reviewer */}
      <div className="flex flex-col gap-1 py-2 flex-1 min-w-0">
        <span style={{ ...SB, fontSize: 12, lineHeight: "14px", color: nameColor }}>
          {stage.name}{isNotRequired ? " (Not Required)" : ""}
        </span>
        {stage.assignedTo && !isNotRequired && (
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className="inline-flex items-center justify-center rounded-full text-white flex-shrink-0"
              style={{
                width: 24, height: 24,
                backgroundColor: variant === "completed" ? "#e6e9eb" : "#48801c",
                color: variant === "completed" ? "#72797e" : "white",
                fontSize: 12, lineHeight: "14px", ...S,
              }}
            >
              {stage.assignedTo.initials}
            </span>
            <span style={{ fontSize: 12, lineHeight: "14px", color: "#72797e", ...S }}>
              {stage.assignedTo.name}
            </span>
            {completedDate && (
              <span style={{ fontSize: 12, lineHeight: "14px", color: "#72797e", ...S }}>
                {completedDate}
              </span>
            )}
            {!completedDate && dueLabel && (
              <span style={{ fontSize: 12, lineHeight: "14px", color: "#72797e", ...S }}>
                {dueLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobPage() {
  const { id } = useParams<{ id: string }>();
  const job = getJob(id);
  if (!job) return notFound();
  const project = getProject(job.projectId);

  const priChip = PRIORITY_CHIP[job.priority];
  const [comment, setComment] = useState(
    "Overall, this is a strong start. I suggest we refine the messaging around wind energy's role in community resilience and job creation. Let's also ensure the talent usage rights are ironclad to avoid any future complications."
  );
  const [submitted, setSubmitted] = useState(false);

  const activeStage = job.stages.find((s) => s.status === "active");
  const isMyReview = activeStage?.assignedTo?.id === "jmiles";

  const statusChip = (() => {
    if (job.status === "approved")  return { label: "Complete",            bg: "#e4fad9", color: "#48801c" };
    if (job.status === "returned")  return { label: "Blocked",             bg: "#ffebe4", color: "#d04100" };
    if (job.status === "cancelled") return { label: "Complete",            bg: "#e6e9eb", color: "#72797e" };
    if (isMyReview)                 return { label: "Needs Your Approval", bg: "#008ac0", color: "#ffffff" };
    if (activeStage?.assignedTo)    return { label: "In Review",           bg: "#e1f5ff", color: "#0077ac" };
    return                               { label: "In Progress",           bg: "#e1f5ff", color: "#0077ac" };
  })();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Breadcrumb header */}
      <div className="flex-shrink-0 flex items-center" style={{ height: 32, marginBottom: 16 }}>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2" style={{ fontSize: 14, lineHeight: "18px", color: "#72797e", ...S }}>
            <Link href="/" style={{ color: "#72797e", textDecoration: "none" }}>My Approvals</Link>
            {project && (
              <>
                <span>/</span>
                <Link href="/projects" style={{ color: "#72797e", textDecoration: "none" }}>{project.name}</Link>
              </>
            )}
            <span>/</span>
            <span style={{ ...SB, color: "#0c2737" }}>{job.title}</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-4 h-full items-start">
          {/* Main card */}
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 flex-1 min-w-0">
            {/* Title + status chip */}
            <div className="flex items-start gap-2">
              <h1 className="flex-1 min-w-0 text-[#0c2737]" style={{ fontSize: 24, lineHeight: "28px", letterSpacing: "-0.144px", fontWeight: 700, ...S }}>
                {job.title}
              </h1>
              <Chip label={statusChip.label} bg={statusChip.bg} color={statusChip.color} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Chip label={job.brand} bg="#e6e9eb" color="#0c2737" />
              {job.channels.map((ch) => (
                <Chip key={ch} label={ch} bg="#e6e9eb" color="#0c2737" />
              ))}
              <Chip label={job.priority} bg={priChip.bg} color={priChip.color} />
            </div>

            {/* Metadata row 1 */}
            <div className="flex gap-4">
              <Meta label="Parent Project">{project?.name ?? "—"}</Meta>
              <Meta label="Link">
                <a
                  href="#"
                  className="inline-flex items-center gap-1"
                  style={{ color: "#0077ac", fontSize: 12, lineHeight: "14px", ...S, textDecoration: "none" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="3" cy="7" r="2.5" fill="#FF3D57" />
                    <circle cx="7" cy="7" r="2.5" fill="#FFCB00" />
                    <circle cx="11" cy="7" r="2.5" fill="#00CA72" />
                  </svg>
                  Monday.com
                </a>
              </Meta>
            </div>

            {/* Metadata row 2 */}
            <div className="flex gap-4">
              <Meta label="Initiative">{job.initiative || "Renewables Brand Elevation 2026"}</Meta>
              <Meta label="Due Date">{formatDate(job.dueDate)}</Meta>
            </div>

            {/* Metadata row 3 */}
            <div className="flex gap-4">
              <Meta label="Submitted By">
                <span className="inline-flex items-center gap-1">
                  <span
                    className="inline-flex items-center justify-center rounded-full"
                    style={{ width: 24, height: 24, backgroundColor: "#48801c", color: "white", fontSize: 12, lineHeight: "14px", ...S }}
                  >
                    {job.submittedBy.initials}
                  </span>
                  {job.submittedBy.name}
                </span>
              </Meta>
              <Meta label="Submitted Date">{formatDate(job.submittedDate)}</Meta>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <span style={{ fontSize: 12, lineHeight: "14px", color: "#72797e", ...S }}>Description</span>
              <p style={{ fontSize: 14, lineHeight: "18px", color: "#0c2737", ...S }}>{job.description}</p>
            </div>

            {/* Assets */}
            <div className="flex flex-col gap-2">
              <span style={{ fontSize: 12, lineHeight: "14px", color: "#72797e", ...S }}>Assets to Review</span>
              <div className="flex flex-wrap gap-2">
                {["Creative_Brief_v2.pdf", "Brand_Assets.zip"].map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                    style={{ backgroundColor: "#e1f5ff", color: "#0077ac", fontSize: 12, lineHeight: "14px", ...S }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 1.5h5.5L10 4v6.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-9A.5.5 0 0 1 2 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.5 1.5V4H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Review section */}
            {isMyReview && !submitted && (
              <div className="flex flex-col gap-3 p-3 rounded-xl" style={{ backgroundColor: "#e6e9eb", border: "1px solid #b5bdc3" }}>
                <div style={{ fontSize: 14, lineHeight: "18px", color: "#0c2737" }}>
                  <span style={{ ...SB }}>Your Review </span>
                  <span style={{ ...S }}>as {activeStage?.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: 12, lineHeight: "14px", color: "#0c2737", ...S }}>Comments</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg resize-none outline-none"
                    style={{
                      backgroundColor: "white", border: "1px solid #b5bdc3",
                      padding: "8px 12px", fontSize: 12, lineHeight: "14px",
                      color: "#0c2737", ...S,
                    }}
                  />
                </div>
                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white"
                  style={{ backgroundColor: "#48801c", fontSize: 12, lineHeight: "14px", ...S }}
                >
                  Approve Job
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="7.5" cy="7.5" r="6.5" stroke="white" strokeWidth="1.2" />
                    <path d="M4.5 7.5l2 2 4-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center py-2 rounded-lg"
                    style={{ border: "1px solid #48801c", color: "#48801c", fontSize: 12, lineHeight: "14px", ...S, backgroundColor: "transparent" }}
                  >
                    Request Revisions
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center py-2 rounded-lg"
                    style={{ border: "1px solid #48801c", color: "#48801c", fontSize: 12, lineHeight: "14px", ...S, backgroundColor: "transparent" }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
            {submitted && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "#e4fad9", border: "1px solid #48801c" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#48801c" strokeWidth="1.5" />
                  <path d="M5 8l2 2 4-4" stroke="#48801c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 14, lineHeight: "18px", color: "#48801c", ...SB }}>Job approved successfully.</span>
              </div>
            )}
          </div>

          {/* Approval Chain sidebar */}
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 flex-shrink-0" style={{ width: 300 }}>
            <h2 style={{ fontSize: 16, lineHeight: "20px", fontWeight: 700, color: "#0c2737", ...S }}>
              Approval Chain
            </h2>
            <div className="flex flex-col">
              {job.stages.map((stage, i) => (
                <ApprovalStep
                  key={stage.id}
                  stage={stage}
                  isLast={i === job.stages.length - 1}
                  dueContext={job.dueDate ? `Due ${new Date(job.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}` : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
