"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MY_QUEUE } from "@/lib/data";
import type { Job, Priority } from "@/lib/types";

const S  = { fontFamily: "'Arial Nova', Arial, sans-serif" } as const;
const SB = { fontFamily: "'Arial Nova', Arial, sans-serif", fontWeight: 700 } as const;

const PRIORITY_CHIP: Record<Priority, { bg: string; color: string }> = {
  Crisis:      { bg: "#ffebe4", color: "#d04100" },
  Strategic:   { bg: "#ffefce", color: "#503513" },
  Operational: { bg: "#e4fad9", color: "#48801c" },
  "Quick Win": { bg: "#e4fad9", color: "#48801c" },
};

function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function NotifCard({ job, onClose }: { job: Job; onClose: () => void }) {
  const isCrisis = job.priority === "Crisis";
  const priChip = PRIORITY_CHIP[job.priority];
  const dueLabel = new Date(job.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div
      style={{
        backgroundColor: "white",
        border: `1px solid ${isCrisis ? "#d04100" : "#e6e9eb"}`,
        borderRadius: 8,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Title */}
      <p style={{ ...SB, fontSize: 14, lineHeight: "18px", color: "#0077ac", margin: 0 }}>
        {job.title}
      </p>

      {/* Status + priority chips */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "4px 8px", borderRadius: 32,
            backgroundColor: "#008ac0", color: "white",
            fontSize: 12, lineHeight: "14px", whiteSpace: "nowrap", ...S,
          }}
        >
          Needs Your Approval
        </span>
        <span
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "4px 8px", borderRadius: 32,
            backgroundColor: priChip.bg, color: priChip.color,
            fontSize: 12, lineHeight: "14px", whiteSpace: "nowrap", ...S,
          }}
        >
          {job.priority}
        </span>
      </div>

      {/* Due date + Review link */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ flex: 1, fontSize: 12, lineHeight: "14px", color: "#72797e", ...S }}>
          Due {dueLabel}
        </span>
        <Link
          href={`/job/${job.id}`}
          onClick={onClose}
          style={{
            display: "inline-flex", alignItems: "center", gap: 2,
            fontSize: 12, lineHeight: "14px", color: "#48801c",
            textDecoration: "none", ...S,
          }}
        >
          Review
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const count = MY_QUEUE.length;

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 200,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #48801c",
          background: "transparent",
          color: "#48801c",
          cursor: "pointer",
          fontSize: 12,
          lineHeight: "14px",
          whiteSpace: "nowrap",
          ...S,
        }}
      >
        Notifications
        {count > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#d04100",
              color: "white",
              fontSize: 12,
              lineHeight: "14px",
              ...S,
            }}
          >
            {count}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            top: 60,
            right: 24,
            width: 280,
            zIndex: 9999,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(12,39,55,0.12)",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "white",
              borderBottom: "1px solid #b5bdc3",
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ flex: 1, ...SB, fontSize: 14, lineHeight: "18px", color: "#0c2737" }}>
              Notifications
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: 0, display: "flex", color: "#72797e",
              }}
            >
              <XIcon />
            </button>
          </div>

          {/* Cards */}
          <div
            style={{
              backgroundColor: "#f8f9fb",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {MY_QUEUE.length === 0 ? (
              <p style={{ fontSize: 12, color: "#72797e", textAlign: "center", padding: "16px 0", margin: 0, ...S }}>
                No pending approvals.
              </p>
            ) : (
              MY_QUEUE.map((job) => (
                <NotifCard key={job.id} job={job} onClose={() => setOpen(false)} />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
