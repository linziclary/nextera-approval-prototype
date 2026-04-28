"use client";
import type { Priority } from "@/lib/types";

const config: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
  Crisis:      { label: "Crisis",      bg: "bg-[#ffebe4]", text: "text-[#d04100]", dot: "bg-[#d04100]" },
  Strategic:   { label: "Strategic",   bg: "bg-[#ffefce]", text: "text-[#503513]", dot: "bg-[#503513]" },
  Operational: { label: "Operational", bg: "bg-[#e6e9eb]", text: "text-[#0c2737]", dot: "bg-[#72797e]" },
  "Quick Win": { label: "Fast Track",  bg: "bg-[#e4fad9]", text: "text-[#48801c]", dot: "bg-[#48801c]" },
};

interface Props {
  priority: Priority;
  size?: "sm" | "md";
  showDot?: boolean;
}

export function PriorityBadge({ priority, size = "md", showDot = true }: Props) {
  const c = config[priority];
  const sizeClass = size === "sm"
    ? "text-[11px] px-2 py-0.5"
    : "text-[12px] px-[8px] py-[4px]";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium leading-[14px] ${sizeClass} ${c.bg} ${c.text}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />}
      {c.label}
    </span>
  );
}
