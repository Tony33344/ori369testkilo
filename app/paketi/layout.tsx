import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paketi obravnav | ORI 369 Maribor",
  description: "Paketi obravnav ORI 369 Maribor – Aktivacija, Osveščanje Telesa in Univerzum za vaše počutje in gibanje.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
