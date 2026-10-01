import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | ORI 369 Maribor",
  description: "Kontaktirajte center ORI 369 v Mariboru – naslov, telefon, e-pošta, odpiralni čas in lokacija na zemljevidu.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
