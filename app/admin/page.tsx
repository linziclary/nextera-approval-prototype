"use client";
import { ALL_JOBS } from "@/lib/data";

const S  = { fontFamily: "'Arial Nova', Arial, sans-serif" } as const;
const SB = { fontFamily: "'Arial Nova', Arial, sans-serif", fontWeight: 700 } as const;

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
          <span
            className="flex-shrink-0 text-[#72797e] truncate"
            style={{ width: 130, fontSize: 12, lineHeight: "14px", ...S }}
          >
            {d.label}
          </span>
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 7, backgroundColor: "#e6e9eb" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span
            className="flex-shrink-0 text-right text-[#0c2737]"
            style={{ width: 20, fontSize: 12, lineHeight: "14px", ...S, fontWeight: 400 }}
          >
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PipelinePage() {
  const activeJobs  = ALL_JOBS.filter((j) => j.status === "active");
  const totalJobs   = ALL_JOBS.length;
  const overdueJobs = ALL_JOBS.filter((j) => j.status === "active" && j.dueDate < new Date().toISOString().slice(0, 10));

  const avgDays = ALL_JOBS.filter((j) => j.status === "approved").length > 0
    ? (ALL_JOBS.filter((j) => j.status === "approved").reduce((a, b) => a + b.daysPending, 0) /
       ALL_JOBS.filter((j) => j.status === "approved").length).toFixed(1)
    : "—";

  const byBrand: Record<string, number> = {};
  for (const j of activeJobs) byBrand[j.brand] = (byBrand[j.brand] ?? 0) + 1;
  const brandData = Object.entries(byBrand)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const cancellationData = [
    { label: "Budget reprioritised", value: 3 },
    { label: "Scope changed",        value: 2 },
    { label: "Duplicate request",    value: 2 },
    { label: "Stakeholder withdrawn",value: 1 },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header — title + subtitle stacked */}
      <div className="flex-shrink-0 flex flex-col gap-1" style={{ marginBottom: 16 }}>
        <h1 className="text-[#0c2737]" style={{ fontSize: 24, lineHeight: "28px", letterSpacing: "-0.144px", fontWeight: 700, ...S }}>
          Pipeline View
        </h1>
        <p className="text-[#72797e]" style={{ fontSize: 14, lineHeight: "18px", ...S }}>
          Approval pipeline data across your projects and jobs
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {/* Row 1: Active Jobs + Jobs Overdue */}
        <div className="flex gap-4">
          <MetricCard
            value={activeJobs.length}
            label="Active Jobs"
            sub="Jobs that are started and not yet completed"
          />
          <MetricCard
            value={overdueJobs.length}
            label="Jobs Overdue"
            sub={overdueJobs.length === 0 ? "Currently all are within due date" : "Past due date"}
          />
        </div>

        {/* Row 2: Total Jobs + Days to Approval */}
        <div className="flex gap-4">
          <MetricCard
            value={totalJobs}
            label="Total Jobs"
            sub="Jobs approved by you this week"
          />
          <MetricCard
            value={avgDays}
            label="Days to Approval"
            sub="Your team's average this week"
          />
        </div>

        {/* 2 chart cards */}
        <div className="flex gap-4">
          <div className="bg-white rounded-lg p-4 flex-1">
            <h3 className="text-[#0c2737] mb-4" style={{ fontSize: 16, lineHeight: "20px", ...SB }}>
              Active Jobs by Brand
            </h3>
            <BarChart data={brandData.length > 0 ? brandData : [{ label: "No data", value: 0 }]} color="#ca8eef" />
          </div>
          <div className="bg-white rounded-lg p-4 flex-1">
            <h3 className="text-[#0c2737] mb-4" style={{ fontSize: 16, lineHeight: "20px", ...SB }}>
              Cancellation Reasons
            </h3>
            <BarChart data={cancellationData} color="#f39900" />
          </div>
        </div>
      </div>
    </div>
  );
}
