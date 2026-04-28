"use client";
import type { RequestType } from "@/lib/types";

const config: Record<RequestType, { label: string; short: string; bg: string; text: string }> = {
  "Campaign (Multi-Channel)": {
    label: "Campaign (Multi-Channel)",
    short: "Campaign",
    bg:   "bg-[#e1f5ff]",
    text: "text-[#0077ac]",
  },
  "Single Channel": {
    label: "Single Channel",
    short: "Single Ch.",
    bg:   "bg-[#e4fad9]",
    text: "text-[#48801c]",
  },
  "Existing Project": {
    label: "Existing Project",
    short: "Existing",
    bg:   "bg-[#e6e9eb]",
    text: "text-[#72797e]",
  },
  "Event": {
    label: "Event",
    short: "Event",
    bg:   "bg-[#e6e9eb]",
    text: "text-[#0c2737]",
  },
  "Survey": {
    label: "Survey",
    short: "Survey",
    bg:   "bg-[#e6e9eb]",
    text: "text-[#0c2737]",
  },
};

interface Props {
  requestType: RequestType;
  size?: "sm" | "md";
  short?: boolean;
}

export function RequestTypeBadge({ requestType, size = "md", short = false }: Props) {
  const c = config[requestType];
  const sizeClass = size === "sm"
    ? "text-[11px] px-2 py-0.5"
    : "text-[12px] px-[8px] py-[4px]";

  return (
    <span className={`inline-flex items-center rounded-full font-medium leading-[14px] ${sizeClass} ${c.bg} ${c.text}`}>
      {short ? c.short : c.label}
    </span>
  );
}
