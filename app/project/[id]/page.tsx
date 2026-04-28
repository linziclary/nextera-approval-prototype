"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProject } from "@/lib/data";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { BrandChip } from "@/components/shared/BrandChip";
import { RequestTypeBadge } from "@/components/shared/RequestTypeBadge";
import { ChannelList } from "@/components/shared/ChannelTag";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar } from "@/components/shared/Avatar";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_ORDER: Record<string, number> = {
  active: 0, returned: 1, approved: 2, cancelled: 3,
};

export default function ProjectJobsPage() {
  const { id } = useParams<{ id: string }>();
  const project = getProject(id);
  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-ink-secondary">
        Project not found.
      </div>
    );
  }

  const jobs = [...project.jobs].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
  );

  const statusCounts = {
    active:   jobs.filter((j) => j.status === "active").length,
    approved: jobs.filter((j) => j.status === "approved").length,
    returned: jobs.filter((j) => j.status === "returned").length,
  };

  const SYNC_ICON =
    project.syncType === "Monday.com" ? (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="3" cy="7" r="2.5" fill="#FF3D57" />
        <circle cx="7" cy="7" r="2.5" fill="#FFCB00" />
        <circle cx="11" cy="7" r="2.5" fill="#00CA72" />
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="12" height="12" rx="2" fill="#0052CC" />
        <path d="M4 7.5L6 9.5L10 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header — on gray */}
      <div className="flex-shrink-0 pt-2 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <Link href="/" className="text-ink-secondary hover:text-nee-blueLink">
                My Approvals
              </Link>
              <span className="text-ink-secondary">/</span>
              <span className="text-ink-primary font-medium">Projects</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-ink-primary tracking-tight leading-7">{project.name}</h1>
              <BrandChip brand={project.brand} />
              <a
                href={project.syncLink}
                className="flex items-center gap-1.5 text-xs text-nee-blueLink hover:underline"
              >
                {SYNC_ICON}
                <span>Linked: {project.syncType}</span>
              </a>
            </div>
            <p className="text-sm text-ink-secondary mt-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="#"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-nee-green text-white hover:bg-nee-greenDark transition-colors"
            >
              + Submit New Job
            </Link>
          </div>
        </div>

        {/* Status summary pills */}
        <div className="flex gap-3 mt-4">
          <StatusPill label="In Review"  value={statusCounts.active}   color="text-nee-blueLink bg-surface-focus border border-edge-focus" />
          <StatusPill label="Approved"   value={statusCounts.approved} color="text-ink-success bg-surface-success border border-[#76bb47]" />
          <StatusPill label="Returned"   value={statusCounts.returned} color="text-ink-alert bg-surface-alert border border-[#f39900]" />
          <StatusPill label="Total Jobs" value={jobs.length}            color="text-ink-primary bg-surface-primary border border-edge-light" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white rounded-lg overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-edge-light bg-surface-primary">
                <Th>Job</Th>
                <Th>Request Type</Th>
                <Th>Channel</Th>
                <Th>Priority</Th>
                <Th>Stage</Th>
                <Th>Reviewer</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => {
                const activeStage = job.stages.find((s) => s.status === "active");
                const isLast = i === jobs.length - 1;
                return (
                  <tr
                    key={job.id}
                    className={`hover:bg-surface-primary transition-colors group ${
                      !isLast ? "border-b border-edge-light" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/job/${job.id}`}
                        className="font-medium text-ink-primary hover:text-nee-blueLink group-hover:underline leading-tight block max-w-[200px]"
                      >
                        {job.title}
                      </Link>
                      <span className="text-xs text-ink-secondary">{job.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <RequestTypeBadge requestType={job.requestType} size="sm" short />
                    </td>
                    <td className="px-4 py-3">
                      <ChannelList channels={job.channels} size="sm" max={2} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={job.priority} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-secondary">
                      {activeStage?.name ?? (job.status === "approved" ? "Complete" : "—")}
                    </td>
                    <td className="px-4 py-3">
                      {activeStage?.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <Avatar reviewer={activeStage.assignedTo} size="xs" />
                          <span className="text-xs text-ink-secondary">
                            {activeStage.assignedTo.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-ink-secondary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-secondary whitespace-nowrap">
                      {formatDate(job.dueDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={job.status} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-ink-secondary tracking-normal whitespace-nowrap">
      {children}
    </th>
  );
}

function StatusPill({
  label, value, color,
}: {
  label: string; value: number; color: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${color}`}>
      <span className="font-bold text-sm">{value}</span>
      <span>{label}</span>
    </div>
  );
}
