import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rezervacija termina | ORI 369 Maribor",
  description: "Rezervirajte termin v centru ORI 369 Maribor – hitra in enostavna spletna rezervacija obravnav.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
