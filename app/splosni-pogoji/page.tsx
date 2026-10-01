import { companyData } from "@/lib/companyData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splošni pogoji poslovanja | ORI 369",
  description: "Splošni pogoji poslovanja ORI 369 – ponudnik, storitve, rezervacije, cene in odgovornost.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-10 text-3xl font-bold text-gray-900 md:text-4xl">Splošni pogoji poslovanja</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Ponudnik</h2>
            <p>
              Storitve ORI 369 izvaja in zaračunava {companyData.legalName}, {companyData.legalAddress},
              davčna številka {companyData.taxNumber}, matična številka {companyData.registrationNumber}.
              Poslovni naslov: {companyData.businessAddress}. E-pošta: {companyData.email},
              tel.: {companyData.phones.join(' / ')}.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Narava storitev</h2>
            <p>
              Storitve ORI 369 so wellness in sprostitvene storitve, namenjene boljšemu počutju,
              gibanju in regeneraciji. Niso zdravstvene storitve, ne vključujejo postavljanja diagnoz
              ali zdravljenja in ne nadomeščajo obiska pri zdravniku. Pri zdravstvenih težavah se
              posvetujte s svojim zdravnikom.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">3. Rezervacije in odpovedi</h2>
            <p>
              Termin lahko rezervirate prek spletne strani, po telefonu ali e-pošti. Za spletno
              rezervacijo je potreben brezplačen uporabniški račun, ki omogoča pregled, spremembo in
              odpoved rezervacij. Odpoved ali prestavitev termina je brezplačna najkasneje 24 ur pred
              terminom; kasneje si pridružujemo pravico do zaračunavanja obravnave.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Cene in plačilo</h2>
            <p>
              Vse cene so v evrih in vključujejo DDV, kjer je ta zaračunan. Plačilo je možno v centru
              ali prek ponujenih spletnih načinov plačila. Akcije in popusti veljajo v objavljenem
              obdobju in se med seboj ne seštevajo, razen če je izrecno navedeno drugače.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">5. Odgovornost</h2>
            <p>
              Udeležba na obravnavah in delavnicah je na lastno odgovornost udeleženca. O morebitnih
              zdravstvenih omejitvah nas pred obiskom obvestite. Za izgubljene osebne predmete v
              centru ne odgovarjamo.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">6. Spremembe in reševanje sporov</h2>
            <p>
              Pogoje lahko občasno posodobimo; veljajo pogoji, objavljeni ob vaši rezervaciji ali
              naročilu. Spore rešujemo sporazumno; če to ni mogoče, je pristojno sodišče v Mariboru.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
