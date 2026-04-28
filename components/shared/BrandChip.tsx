"use client";
import type { Brand } from "@/lib/types";

const config: Record<Brand, { bg: string; text: string }> = {
  "M&C":  { bg: "bg-brand-mcBg",   text: "text-brand-mc" },
  FPL:    { bg: "bg-brand-fplBg",  text: "text-brand-fpl" },
  NEE:    { bg: "bg-brand-neeBg",  text: "text-brand-nee" },
  NEER:   { bg: "bg-brand-neerBg", text: "text-brand-neer" },
};

interface Props {
  brand: Brand;
  size?: "sm" | "md";
}

export function BrandChip({ brand, size = "md" }: Props) {
  const c = config[brand];
  const sizeClass = size === "sm"
    ? "text-[11px] px-2 py-0.5"
    : "text-[12px] px-[8px] py-[4px]";

  return (
    <span className={`inline-flex items-center rounded-full font-semibold leading-[14px] ${sizeClass} ${c.bg} ${c.text}`}>
      {brand}
    </span>
  );
}
