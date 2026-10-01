import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obravnave | ORI 369 Maribor",
  description: "Pregled obravnav v centru ORI 369 Maribor – miofascialna masaža, TECAR, vadba za gibljivost, sprostitev in regeneracija.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
