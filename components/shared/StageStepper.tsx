"use client";
import type { Stage } from "@/lib/types";

interface Props {
  stages: Stage[];
  compact?: boolean;
}

export function StageStepper({ stages, compact = false }: Props) {
  return (
    <div className="flex flex-col gap-0">
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1;
        return (
          <div key={stage.id} className="flex gap-3">
            {/* Line + icon column */}
            <div className="flex flex-col items-center" style={{ width: 28, flexShrink: 0 }}>
              <StepIcon status={stage.status} />
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[20px] ${
                    stage.status === "completed"
                      ? "bg-nee-green"
                      : stage.status === "skipped"
                      ? "bg-edge-light"
                      : "bg-edge"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className={`flex flex-col ${isLast ? "pb-0" : "pb-3"} min-w-0`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-sm font-medium leading-tight ${
                    stage.status === "active"
                      ? "text-ink-primary"
                      : stage.status === "completed"
                      ? "text-ink-secondary"
                      : stage.status === "skipped"
                      ? "text-ink-secondary line-through"
                      : "text-ink-secondary"
                  }`}
                >
                  {stage.name}
                </span>
                {stage.status === "active" && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-nee-blue/10 text-nee-blue border border-nee-blue/20 font-medium leading-none">
                    Active
                  </span>
                )}
                {stage.status === "skipped" && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-surface-primary text-ink-secondary border border-edge-light leading-none">
                    Not Required
                  </span>
                )}
              </div>
              {!compact && stage.assignedTo && stage.status !== "skipped" && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Avatar reviewer={stage.assignedTo} size="xs" />
                  <span className="text-xs text-ink-secondary">{stage.assignedTo.name}</span>
                  {stage.completedDate && (
                    <span className="text-xs text-ink-secondary ml-1">
                      · {formatDate(stage.completedDate)}
                    </span>
                  )}
                  {stage.dueDate && stage.status === "active" && (
                    <span className="text-xs text-ink-secondary ml-1">
                      · Due {formatDate(stage.dueDate)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepIcon({ status }: { status: Stage["status"] }) {
  if (status === "completed") {
    return (
      <div className="w-6 h-6 rounded-full bg-nee-green flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="w-6 h-6 rounded-full border-2 border-nee-blue bg-nee-blue/10 flex items-center justify-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-nee-blue" />
      </div>
    );
  }
  if (status === "skipped") {
    return (
      <div className="w-6 h-6 rounded-full border-2 border-edge-light bg-surface-primary flex items-center justify-center flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 2l6 6M8 2l-6 6" stroke="#b5bdc3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  // upcoming
  return (
    <div className="w-6 h-6 rounded-full border-2 border-edge bg-white flex-shrink-0" />
  );
}

function Avatar({ reviewer, size = "sm" }: { reviewer: { initials: string; avatarColor: string }; size?: "xs" | "sm" }) {
  const dim = size === "xs" ? "w-4 h-4 text-[9px]" : "w-6 h-6 text-[11px]";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ backgroundColor: reviewer.avatarColor }}
    >
      {reviewer.initials}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
