import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trgovina | ORI 369 Maribor",
  description: "Spletna trgovina ORI 369 – prehranska dopolnila, funkcionalne gobe in izdelki za aktivno življenje.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
