import { companyData } from "@/lib/companyData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika zasebnosti | ORI 369",
  description: "Politika zasebnosti ORI 369 – obdelava osebnih podatkov, vaše pravice in kontakt.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-10 text-3xl font-bold text-gray-900 md:text-4xl">Politika zasebnosti</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Upravljavec podatkov</h2>
            <p>
              Upravljavec osebnih podatkov je {companyData.legalName}, {companyData.legalAddress},
              davčna številka {companyData.taxNumber}, matična številka {companyData.registrationNumber}.
              Poslovni naslov: {companyData.businessAddress}. E-pošta: {companyData.email},
              tel.: {companyData.phones.join(' / ')}.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Katere podatke zbiramo</h2>
            <p>
              Zbiramo podatke, ki nam jih posredujete ob rezervaciji termina, prijavi na spletni strani,
              izpolnitvi vprašalnika, naročilu v trgovini ali ob stiku z nami: ime in priimek, e-pošta,
              telefonska številka, podatki o rezervaciji ter – če izpolnite vprašalnik – tudi odgovori
              o vašem počutju in navadah. Odgovori v vprašalniku se lahko nanašajo na vaše počutje in
              zdravstveno stanje, zato jih obdelujemo le na podlagi vaše izrecne privolitve.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">3. Namen in pravna podlaga obdelave</h2>
            <p>
              Podatke obdelujemo za izvedbo rezervacij in storitev, odgovarjanje na povpraševanja,
              pripravo osebne analize na podlagi vprašalnika, izdajo računov ter izpolnitev zakonskih
              obveznosti. Pravna podlaga je izvedba pogodbe ali ukrepov pred sklenitvijo pogodbe,
              zakonska obveznost oziroma vaša privolitev (vprašalnik, e-novice).
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Hramba in posredovanje</h2>
            <p>
              Podatke hranimo le toliko časa, kolikor je potrebno za namen obdelave oziroma kolikor
              to zahtevajo predpisi (npr. računovodski predpisi). Podatkov ne prodajamo in jih ne
              posredujemo tretjim osebam, razen ponudnikom, ki jih potrebujemo za delovanje storitve
              (npr. ponudnik gostovanja in e-pošte) in ki podatke obdelujejo v skladu z GDPR.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">5. Vaše pravice</h2>
            <p>
              Imate pravico do dostopa do svojih podatkov, popravka, izbrisa, omejitve obdelave,
              prenosljivosti ter pravico ugovarjati obdelavi. Privolitev lahko kadar koli preklicete
              na {companyData.email}, ne da bi to vplivalo na zakonitost obdelave pred preklicem.
              Pravico imate tudi do pritožbe pri Informacijskem pooblaščencu RS.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">6. Kontakt</h2>
            <p>
              Za vsa vprašanja o obdelavi osebnih podatkov nam pišite na {companyData.email} ali
              pokličite {companyData.phones[0]}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
