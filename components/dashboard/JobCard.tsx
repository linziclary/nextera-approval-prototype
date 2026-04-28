"use client";
import Link from "next/link";
import type { Job } from "@/lib/types";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { BrandChip } from "@/components/shared/BrandChip";
import { RequestTypeBadge } from "@/components/shared/RequestTypeBadge";
import { ChannelList } from "@/components/shared/ChannelTag";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar } from "@/components/shared/Avatar";
import { CURRENT_USER } from "@/lib/data";

interface Props {
  job: Job;
  projectName?: string;
}

export function JobCard({ job }: Props) {
  const activeStage = job.stages.find((s) => s.status === "active");
  const isCrisis  = job.priority === "Crisis";
  const isOverdue = job.dueDate < new Date().toISOString().split("T")[0];
  const isMyTurn  = activeStage?.assignedTo?.id === CURRENT_USER.id;

  return (
    <Link
      href={`/job/${job.id}`}
      className={`block bg-white rounded-2xl border hover:shadow-card transition-shadow ${
        isCrisis ? "border-priority-crisisBorder" : "border-edge-light"
      }`}
    >
      {/* Crisis urgent strip */}
      {isCrisis && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-0 mb-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-priority-crisisBg border border-priority-crisisBorder w-full">
            <span className="w-2 h-2 rounded-full bg-priority-crisis animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold text-priority-crisis">
              Crisis — Auto-escalates if not actioned within 4 hours
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header: title + priority */}
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-ink-primary leading-tight">
              {job.title}
            </p>
          </div>
          <PriorityBadge priority={job.priority} size="sm" />
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <RequestTypeBadge requestType={job.requestType} size="sm" short />
          <ChannelList channels={job.channels} size="sm" max={2} />
          <BrandChip brand={job.brand} size="sm" />
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-edge-light">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar reviewer={job.submittedBy} size="xs" />
            <span className="text-sm text-ink-secondary truncate max-w-[110px]">
              {job.submittedBy.name}
            </span>
            {activeStage && (
              <span className="text-sm text-ink-secondary truncate hidden sm:block">
                · {activeStage.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isOverdue && (
              <span className="text-xs font-semibold text-[#d04100]">Overdue</span>
            )}
            {job.status !== "active" ? (
              <StatusBadge status={job.status} size="sm" />
            ) : isMyTurn ? (
              <span className="text-xs font-semibold text-[#0077ac] flex items-center gap-1">
                Review now
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : (
              <span className="text-sm text-ink-secondary">{job.daysPending}d pending</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
