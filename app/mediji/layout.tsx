import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mediji | ORI 369 Maribor",
  description: "Objave in medijski prispevki centra ORI 369 Maribor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
