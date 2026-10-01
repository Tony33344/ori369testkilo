import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MotioScan – 3D analiza drže | ORI 369 Maribor",
  description: "MotioScan 3D meritev telesne drže in gibanja v centru ORI 369 Maribor – ocena drže, osebni načrt gibanja in vaj.",
};

export default function MotioScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
