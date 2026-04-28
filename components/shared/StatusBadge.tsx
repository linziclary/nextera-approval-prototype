"use client";
import type { JobStatus } from "@/lib/types";

const config: Record<JobStatus, { label: string; bg: string; text: string }> = {
  active:    { label: "In Review",  bg: "bg-[#e1f5ff]", text: "text-[#0077ac]" },
  approved:  { label: "Approved",   bg: "bg-[#e4fad9]", text: "text-[#48801c]" },
  returned:  { label: "Returned",   bg: "bg-[#ffefce]", text: "text-[#503513]" },
  cancelled: { label: "Cancelled",  bg: "bg-[#ffebe4]", text: "text-[#d04100]" },
};

interface Props {
  status: JobStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: Props) {
  const c = config[status];
  const sizeClass = size === "sm"
    ? "text-[11px] px-2 py-0.5"
    : "text-[12px] px-[8px] py-[4px]";

  return (
    <span className={`inline-flex items-center rounded-full font-medium leading-[14px] ${sizeClass} ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
