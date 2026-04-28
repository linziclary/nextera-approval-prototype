import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { NotificationsPanel } from "@/components/layout/NotificationsPanel";

export const metadata: Metadata = {
  title: "NextEra Approval Hub",
  description: "Job Approval & Review — NextEra Energy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#eef1f3] text-ink-primary font-sans">
        <div className="flex h-screen p-6 gap-6 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {children}
          </main>
        </div>
        <NotificationsPanel />
      </body>
    </html>
  );
}
