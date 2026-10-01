import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vprašalnik | ORI 369 Maribor",
  description: "Izpolnite kratek vprašalnik ORI 369 za brezplačno analizo in osebna priporočila za vaše počutje.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
