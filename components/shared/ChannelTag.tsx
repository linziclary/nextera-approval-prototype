"use client";
import type { Channel } from "@/lib/types";

interface Props {
  channel: Channel;
  size?: "sm" | "md";
}

export function ChannelTag({ channel, size = "md" }: Props) {
  const sizeClass = size === "sm"
    ? "text-[11px] px-2 py-0.5"
    : "text-[12px] px-[8px] py-[4px]";

  return (
    <span className={`inline-flex items-center rounded-full bg-[#e6e9eb] text-[#0c2737] font-medium leading-[14px] ${sizeClass}`}>
      {channel}
    </span>
  );
}

interface ChannelListProps {
  channels: Channel[];
  size?: "sm" | "md";
  max?: number;
}

export function ChannelList({ channels, size = "md", max = 3 }: ChannelListProps) {
  const visible = channels.slice(0, max);
  const remainder = channels.length - max;
  const sizeClass = size === "sm"
    ? "text-[11px] px-2 py-0.5"
    : "text-[12px] px-[8px] py-[4px]";
  return (
    <span className="inline-flex flex-wrap gap-1">
      {visible.map((ch) => (
        <ChannelTag key={ch} channel={ch} size={size} />
      ))}
      {remainder > 0 && (
        <span className={`inline-flex items-center rounded-full bg-[#e6e9eb] text-[#0c2737] font-medium leading-[14px] ${sizeClass}`}>
          +{remainder}
        </span>
      )}
    </span>
  );
}
