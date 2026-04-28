"use client";

interface Metric {
  label: string;
  value: number | string;
  subtext?: string;
  variant?: "default" | "primary" | "alert";
}

interface Props {
  metrics: Metric[];
}

export function MetricBar({ metrics }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {metrics.map((m) => {
        const isPrimary = m.variant === "primary";
        const isAlert   = m.variant === "alert";
        return (
          <div
            key={m.label}
            className="bg-white rounded-lg p-4 flex flex-col gap-1 border border-edge-light"
          >
            <span
              className={`text-[30px] font-bold leading-8 tracking-[-0.225px] ${
                isPrimary ? "text-[#008ac0]" : isAlert ? "text-[#d04100]" : "text-ink-primary"
              }`}
            >
              {m.value}
            </span>
            <span className="text-lg text-ink-primary leading-6">{m.label}</span>
            {m.subtext && (
              <span className="text-sm text-ink-secondary leading-[18px]">{m.subtext}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
