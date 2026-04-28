"use client";
import type { Reviewer } from "@/lib/types";

interface Props {
  reviewer: Reviewer;
  size?: "xs" | "sm" | "md" | "lg";
  showName?: boolean;
}

const sizeMap = {
  xs: "w-5 h-5 text-[9px]",
  sm: "w-7 h-7 text-[11px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export function Avatar({ reviewer, size = "sm", showName = false }: Props) {
  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
        style={{ backgroundColor: reviewer.avatarColor }}
        title={reviewer.name}
      >
        {reviewer.initials}
      </div>
      {showName && (
        <span className="text-sm text-ink-primary">{reviewer.name}</span>
      )}
    </div>
  );
}
