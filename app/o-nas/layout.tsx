import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas | ORI 369 Maribor",
  description: "Spoznajte ekipo, pristop in prostore centra ORI 369 v Mariboru – celostne obravnave za boljše počutje, gibanje in sprostitev.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
