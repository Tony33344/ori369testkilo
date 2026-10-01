import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Izobraževanja in delavnice | ORI 369 Maribor",
  description: "Delavnice in izobraževanja ORI 369 – sproščanje, osebna praksa in miofascialne tehnike v Mariboru.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
