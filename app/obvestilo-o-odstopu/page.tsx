import { companyData } from "@/lib/companyData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obvestilo o pravici do odstopa | ORI 369",
  description: "Obvestilo o pravici do odstopa od pogodbe – ORI 369.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-10 text-3xl font-bold text-gray-900 md:text-4xl">Obvestilo o pravici do odstopa</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Pravica do odstopa</h2>
            <p>
              Kot potrošnik imate pri pogodbah, sklenjenih na daljavo (spletna rezervacija ali nakup),
              pravico, da v 14 dneh od sklenitve pogodbe oziroma prevzema izdelka odstopite od pogodbe
              brez navedbe razloga. Obvestilo o odstopu nam pošljite na {companyData.email} ali na
              naslov {companyData.legalName}, {companyData.legalAddress}.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Izjeme</h2>
            <p>
              Za storitve, ki se izvajajo na določen datum ali v določenem terminu (rezervirane
              obravnave, delavnice), pravica do odstopa po opravljeni storitvi ne velja. Pri izdelkih
              odstop ni mogoč za izdelke, ki zaradi narave niso primerni za vračilo (npr. odprta
              zapečatena dopolnila, izdelki po meri).
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">3. Vračilo</h2>
            <p>
              Po odstopu vrnemo vsa prejeta plačila v največ 14 dneh, z enakim plačilnim sredstvom, ki
              ste ga uporabili. Izdelke vrnete na naslov {companyData.businessAddress} v 14 dneh od
              obvestila o odstopu; neposredne stroške vračila izdelkov nosi kupec.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
