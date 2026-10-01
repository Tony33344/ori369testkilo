import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cenik storitev | ORI 369 Maribor",
  description: "Cenik obravnav in paketov ORI 369 Maribor – miofascialna masaža, TECAR, MotioScan meritev in drugi programi za počutje.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
