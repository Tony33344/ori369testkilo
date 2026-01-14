/**
 * Script to update services with detailed descriptions from docx files
 * Run with: npx tsx scripts/update-services-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Service descriptions extracted from docx files
const serviceDescriptions = {
  'tecar-terapija': {
    long_description: `TECAR terapija je podporna metoda zdravljenja, ki z ustvarjanjem elektromagnetne (toplotne) energije ustvarja protivnetne, regenerativne in protibolečinske učinke. Je diatermična terapija, ki deluje na podlagi prenosa visoko-frekvenčne (frekvenca: 448 kHZ) elektromagnetne energije skozi telo do ciljnega tkiva pri katerem povzroči celično biostimulacijo, mikrocirkulacijo in hipertermijo.

Glavni cilj terapije je stimulacija telesu lastnih fizioloških procesov celjenja. TECAR terapija skrajša čas zdravljenja ter pozitivno vpliva na krepitev notranjih obnovitvenih sposobnosti tkiv. Uporabljamo jo v kombinaciji z manualno terapijo in na ta način globinsko zmehčamo mišično tkivo in pospešujemo naravne presnovne procese.`,
    how_it_works: `TECAR terapija je oblika zdravljenja, ki temelji na proizvajanju toplotne energije. Gre za neinvazivno visokofrekvenčna energijo, ki spodbuja biološke procese samoregeneracije v celicah. S tem spodbuja naravne fiziološke procese tkiva in metabolizma, kar posledično pospešuje celjenje.

TECAR aparatura vključuje premično elektrodo (fizioterapevti jo rokujejo), fiksno elektrodo (je v stiku s kožo pacienta in deluje kot prevodnik), ter kontaktno kremo. TECAR terapija deluje v dveh načinih prenosa energije: kapacitivnem in rezistivnem načinu.`,
    benefits: [
      'Pospeševanje celjenja in regeneracije tkiva',
      'Zmanjšanje mišičnih krčev',
      'Vazodilatacija z večjim lokalnim pretokom krvi',
      'Pospeševanje resorpcije hematomov',
      'Aktivacija presnovnih reakcij',
      'Povečanje zmogljivosti'
    ],
    indications: [
      'Tendinitisi',
      'Adhezivni kapsulitisi',
      'Teniški in golfski komolci',
      'Burzitisi',
      'Artroze kolka in kolena',
      'Pubalgije',
      'Zlomi in zvini',
      'Plantarni fasciitis',
      'Bolečine v križu in vratu',
      'Brazgotine'
    ],
    price: 40,
    duration: 30
  },
  'elektrostimulacija': {
    long_description: `Elektrostimulacijska terapija je vrsta fizikalne terapije, ki s pomočjo električnega toka in električnih impulzov zmanjšuje bolečine, pospešuje celični metabolizem in hitrejše celjenje. Pri tej terapiji električni impulzi preko elektrod na koži prehajajo globlje v tkivo in povzročijo kemični in električni učinek na celice.

Na celičnem nivoju olajšujejo prehod Ca+, K+ in Na– ionov in depolarizacijo živčnih vlaken ter mišično kontrakcijo. Električni tok nizkih frekvenc (0-200Hz) pri tem deluje direktno in indirektno na vzdražna (mišice in živci) in nevzdražna (kosti in telesna maščoba) mišična tkiva.

Poznamo dve vrsti elektrostimulacije: TENS in FES.`,
    how_it_works: `TENS (transkutana elektro-nevro stimulacija) z nizkofrekvenčnimi električnimi tokovi stimulira mielinizirana aferentna živčna vlakna na koži, kjer je prisotna bolečina. Električni impulz za stimulacijo senzoričnih živcev mora biti dovolj močan, da možgani prej in bolje zaznajo senzorični signal in posledično slabše in manj zaznajo bolečino.

FES (Funkcionalna električna stimulacija) s pomočjo električnih impulzov draži živčno-mišična vlakna in izvablja mišične kontrakcije. Električni impulz vzdraži motorični živec, ki se nahaja vzdolž poteka mišice in pošlje informacijo o signalu v možgane.`,
    benefits: [
      'Takojšnje zmanjšanje bolečine',
      'Mišične kontrakcije za krepitev',
      'Pospešen celični metabolizem',
      'Pospešena celična rast',
      'Sproščanje endorfinov',
      'Splošna sprostitev telesa'
    ],
    indications: [
      'Mišične in sklepne bolečine',
      'Atrofirane mišice',
      'Mišične lezije',
      'Zmanjšan obseg gibljivosti',
      'Sindrom težkih nog',
      'Mišični krči',
      'Patelofemoralni sindrom',
      'Nestabilnost sklepov',
      'Postoperativna stanja'
    ],
    contraindications: [
      'Organske okvare srca (aritmija)',
      'Srčni spodbujevalnik',
      'Nosečnost',
      'Kovinski implanti',
      'Nediagnosticirana akutna poškodba'
    ],
    price: 20,
    duration: 20
  },
  'magnetna-terapija': {
    long_description: `Magnetna terapija je neinvazivna metoda zdravljenja, ki z uporabo pulzirajočih elektromagnetnih polj na človeško telo deluje protibolečinsko, protivnetno in regeneracijsko. Magnetna polja povečujejo količino kisika v celicah, povečujejo cirkulacijo krvi, s tem pa pospešujejo regeneracijo in blagodejno vplivajo na splošno dobro počutje.

Magnetna terapija se uporablja pri zdravljenju poškodb, pooperativnih stanjih, kroničnih boleznih in bolečih stanjih ter preventivi in splošnem dobrem počutju.`,
    how_it_works: `Magnetna polja pri magnetni terapiji spodbudijo celično regeneracijo in aktivirajo tvorbo novih krvnih žil. Pri tem povečujejo mikrocirkulacijo krvi in limfe, kar pozitivno vpliva na aktivacijo imunskega sistema. Magnetna terapija povečuje količino kisika v celicah, kar pozitivno vpliva na proces celjenja in poživitev celic ter proizvodnje kolagena.`,
    benefits: [
      'Zmanjšanje bolečine',
      'Protivnetno delovanje',
      'Izboljšana cirkulacija krvi',
      'Povečana oksigenacija celic',
      'Pospešena regeneracija tkiv',
      'Krepitev imunskega sistema'
    ],
    indications: [
      'Kronične bolečine',
      'Poškodbe mišic in sklepov',
      'Artritis',
      'Osteoporoza',
      'Postoperativna stanja',
      'Športne poškodbe'
    ],
    price: 30,
    duration: 20
  },
  'laserska-terapija': {
    long_description: `Laserska terapija je neinvazivna metoda zdravljenja, ki s pomočjo laserskih svetlobnih žarkov stimulira človeško tkivo z namenom pospešitve celjenja, zmanjševanja bolečine ter pospeševanja regeneracije. Laserska svetloba, ki prodre skozi kožo, na celičnem nivoju sproži biokemične reakcije, ki spodbujajo celjenje in obnovo tkiva.

Laserska terapija je popolnoma neinvazivna in neboleča metoda zdravljenja. Pri terapiji bolnik občuti le nežno toploto ali mravljinčenje na mestu aplikacije.`,
    how_it_works: `Laserski žarki v celicah spodbudijo tvorbo adenozin trifosfata (ATP), ki je osnovni vir energije za celice. Poveča se celična presnova in aktivirajo procesi regeneracije. Laserska terapija zmanjšuje vnetja, bolečine in otekline ter pospešuje celjenje ran, mišic, tetiv in drugih tkiv.`,
    benefits: [
      'Zmanjšanje bolečine',
      'Zmanjšanje vnetja',
      'Pospešeno celjenje ran',
      'Regeneracija tkiv',
      'Zmanjšanje oteklin',
      'Izboljšana prekrvavitev'
    ],
    indications: [
      'Akutne in kronične bolečine',
      'Športne poškodbe',
      'Vnetja tetiv',
      'Artritis',
      'Celjenje ran',
      'Brazgotine'
    ],
    price: 10,
    duration: 10
  },
  'manualna-terapija': {
    long_description: `Manualna terapija je strokovna tehnika, pri kateri terapevt z rokami obvladuje, sprošča in mobilizira mišice, sklepe in mehka tkiva. Z nežnimi ročnimi tehnikami terapevt sprošča napetosti, izboljšuje gibljivost sklepov in zmanjšuje bolečino. Primerna je za vse vrste mišično-skeletnih težav.

V ORI 369 manualno terapijo kombiniramo z naprednimi tehnologijami (TECAR, MIS, laser) za doseganje optimalnih rezultatov.`,
    how_it_works: `Manualna terapija deluje na več ravneh: mehanski učinek na mišice in sklepe, nevrološki učinek na živčni sistem ter biokemični učinek na presnovne procese. Terapevt z različnimi tehnikami mobilizira sklepe, sprošča mišice in fascije ter odpravlja adhezije in blokade.`,
    benefits: [
      'Sproščanje mišičnih napetosti',
      'Izboljšanje gibljivosti sklepov',
      'Zmanjšanje bolečine',
      'Odprava blokad',
      'Izboljšana drža',
      'Boljša cirkulacija'
    ],
    indications: [
      'Bolečine v hrbtenici',
      'Mišične napetosti',
      'Omejeno gibanje sklepov',
      'Glavoboli',
      'Športne poškodbe',
      'Postoperativna rehabilitacija'
    ],
    price: 30,
    duration: 20
  },
  'mis': {
    long_description: `Magnetna indukcijska stimulacija (MIS) je revolucionarna terapija, ki z inovativnim pristopom zagotavlja izjemne rezultate. Nezdrave celice napolni in stimulira z izboljšano oksigenacijo in cirkulacijo ter jim povrne normalno delovanje. Izboljša tudi celično absorpcijo kisika in hranilnih snovi, hkrati pa odstrani toksine.

MIS uporablja pulzirajoče magnetno polje visoke intenzivnosti, ki ciljno optimizira delovanje različnih bioloških sistemov.`,
    how_it_works: `Jakosti magnetnega polja ustvarjajo električne tokove v nevronih, kar omogoča mišično stimulacijo. Ko elektromagnetni tok doseže določeno vrednost, se sproži akcijski potencial, ki je ključen za učinkovito terapijo. Pri določeni frekvenci se motorični nevron depolarizira s signalom v nevromotorično enoto, kar povzroči krčenje mišic.`,
    benefits: [
      'Hiter zdravilni učinek',
      'Neboleč postopek',
      'Neinvazivna terapija',
      'Dolgotrajni rezultati',
      'Zmanjšanje vnetij in bolečin',
      'Skrajšan čas okrevanja'
    ],
    indications: [
      'Kronična bolečinska stanja',
      'Plantarna fasciitis',
      'Tendonitis',
      'Kronične tendinopatije',
      'Rehabilitacija',
      'Mišična regeneracija'
    ],
    price: 30,
    duration: 20
  },
  'cupping': {
    long_description: `Terapija z ventuzami (cupping) je manualna tehnika, ki s pomočjo majhnih skodelic (ventuz) pospešuje celjenje, regeneracijo in lajša bolečine. Vakuum, ki nastane pod ventuzo, dvigne kožo in podkožno tkivo, kar povzroči lokalno povečanje pretoka krvi, sproščanje mišičnih napetosti in pospeši limfno drenaž.`,
    how_it_works: `Ventuze ustvarijo negativni pritisk na koži, kar povzroči lokalno vazodilatacijo in povečan pretok krvi. To spodbuja regeneracijo tkiv, sproščanje mišičnih vozlov in odstranjevanje metabolnih odpadkov.`,
    benefits: [
      'Sproščanje mišičnih napetosti',
      'Izboljšana cirkulacija',
      'Lajšanje bolečin',
      'Pospeševanje regeneracije',
      'Detoksikacija',
      'Zmanjšanje vnetij'
    ],
    indications: [
      'Mišične napetosti',
      'Bolečine v hrbtu',
      'Kronična utrujenost',
      'Športne poškodbe',
      'Celulitis'
    ],
    price: 30,
    duration: 30
  },
  'dryneedeling': {
    long_description: `Dry needling (terapija s suhim iglanjem) je invazivna fizioterapevtska metoda, ki s penetracijo tankih igel skozi kožo stimulira tkivo in sproža proces celjenja. Igla se vstavi neposredno v prožilno točko (trigger point), kar povzroči lokalno mišično trzanje in sproščanje napetosti.`,
    how_it_works: `Igla prodre v mišično tkivo in stimulira prožilno točko. To povzroči refleksno sprostitev mišice, povečan lokalni pretok krvi in sproščanje endorfinov. Tehnika je zelo učinkovita pri odpravlanju kroničnih mišičnih napetosti in bolečin.`,
    benefits: [
      'Sproščanje prožilnih točk',
      'Takojšnje zmanjšanje bolečine',
      'Povečana gibljivost',
      'Izboljšana funkcija mišic',
      'Dolgotrajna učinkovitost'
    ],
    indications: [
      'Kronične mišične bolečine',
      'Miofascialni sindrom',
      'Napetostni glavoboli',
      'Bolečine v vratu in hrbtu',
      'Športne poškodbe'
    ],
    contraindications: [
      'Motnje strjevanja krvi',
      'Jemanje antikoagulantov',
      'Lokalna okužba',
      'Nosečnost (določena področja)'
    ],
    price: 30,
    duration: 30
  },
  'media-taping': {
    long_description: `Medi taping je metoda zdravljenja, ki z aplikacijo samolepilnih elastičnih trakov na kožo odpravlja bolečine, otekline in druge simptome poškodb. Trakovi so zasnovani tako, da posnemajo elastičnost kože in omogočajo normalno gibanje, hkrati pa nudijo podporo mišicam in sklepom.`,
    how_it_works: `Elastični trakovi dvignejo kožo in ustvarijo prostor med kožo in mišičnim tkivom. To izboljša cirkulacijo krvi in limfe, zmanjšuje pritisk na bolečinske receptorje in nudi proprioceptivno povratno informacijo za pravilno gibanje.`,
    benefits: [
      'Zmanjšanje bolečine',
      'Zmanjšanje oteklin',
      'Podpora mišicam',
      'Izboljšana cirkulacija',
      'Omogoča normalno gibanje',
      'Podpora rehabilitaciji'
    ],
    indications: [
      'Športne poškodbe',
      'Mišične napetosti',
      'Otekline',
      'Limfedem',
      'Bolečine v sklepih',
      'Preventiva poškodb'
    ],
    price: 10,
    duration: 15
  }
};

// Team members data
const teamMembers = [
  {
    name: 'Jernej Babij',
    title: 'Ustanovitelj in terapevt',
    role: 'founder',
    bio: 'Ustanovitelj centra ORI 369, strokovnjak za celostne terapevtske pristope.',
    long_bio: `Jernej je ustanovitelj centra ORI 369 in vodilni terapevt z bogatimi izkušnjami na področju celostnega zdravljenja. Združuje znanje naprednih terapevtskih tehnologij z globokim razumevanjem človekovega telesa in duha.

V ORI 369 vodi ekipo strokovnjakov in skrbi za nenehno izboljševanje terapevtskih pristopov ter uvajanje najnovejših tehnologij za doseganje optimalnih rezultatov.`,
    qualifications: [
      'Fizioterapevt',
      'Certificiran TECAR terapevt',
      'Specialist za manualno terapijo',
      'Vodja centra ORI 369'
    ],
    specializations: [
      'TECAR terapija',
      'Manualna terapija',
      'Celostni pristop k zdravljenju',
      'Športna rehabilitacija'
    ],
    phone: '+386 51 302 206',
    display_order: 1
  },
  {
    name: 'Evgen Valek M.D.(M.A.)',
    title: 'Alternativni zdravnik in šaman',
    role: 'therapist',
    bio: 'Alternativni zdravnik z diplomo M.D.(M.A.) in Ifa Babalav (šaman).',
    long_bio: `Evgen Valek je alternativni zdravnik z bogato mednarodno izobrazbo in izkušnjami. Svojo pot je začel pri 15 letih kot natakar in animator, nato pa odkril svojo sposobnost pomagati ljudem.

Opravil je tečaj za maserja, postal Reiki mojster in Karuna Gautama mojster. Po napornem iskanju je našel študij za alternativno medicino na Šri Lanki, kjer je pridobil diplomo M.D.(M.A.).

Leta 2006 je končal študij IFA v Južni Ameriki in postal Ifa Babalav (šaman). Delal je v wellness centrih po Sloveniji in zunaj (Harmonija, Costa Pacifica, Grand hotel Donat). Leta 2009 je sodeloval v tekmovanju naj wellness Slovenija, kjer je z ekipo dosegel 2. mesto.

Potoval je po svetu - od indijanskih rezervatov v Ameriki, do kulture Majev v Južni Ameriki, Maurov na Novi Zelandiji in Aboriginov v Avstraliji. Vsa ta znanja in izkušnje zdaj deli v ORI 369.`,
    qualifications: [
      'M.D.(M.A.) - Alternativna medicina (Šri Lanka)',
      'Ifa Babalav (šaman)',
      'Reiki mojster',
      'Karuna Gautama mojster',
      'Certificiran maser',
      'Hamam terapevt'
    ],
    specializations: [
      'Alternativna medicina',
      'Šamanske tehnike',
      'Energijsko zdravljenje',
      'Celostna terapija',
      'Meditacija in dihalne tehnike'
    ],
    phone: '+386 41 458 931',
    display_order: 2
  }
];

// Therapy packages from pricelist images
const therapyPackages = [
  {
    name: 'Uvodni termin + analiza + osebni program',
    slug: 'uvodni-termin',
    description: 'Prvi pregled + meritev s Physio Motio + celovit personaliziran plan terapij in vaj za vrnitev v ravnovesje',
    sessions: 1,
    regular_price: null,
    package_price: 96,
    price_per_session: 96,
    included_services: ['Meritev Physio Motio', 'Analiza gibanja in drže', 'Personaliziran plan terapij', 'Vaje za ravnovesje'],
    benefits: ['Celovita analiza stanja', 'Personaliziran pristop', 'Jasen načrt zdravljenja'],
    display_order: 1
  },
  {
    name: 'Samo meritev Physio Motio',
    slug: 'meritev-physio-motio',
    description: 'Meritev s Physio Motio brez plana terapij',
    sessions: 1,
    regular_price: null,
    package_price: 69,
    price_per_session: 69,
    included_services: ['Meritev Physio Motio', 'Analiza gibanja'],
    benefits: ['Hitra analiza', 'Vpogled v stanje telesa'],
    display_order: 2
  },
  {
    name: 'Paket 3 obravnave',
    slug: 'paket-3-obravnave',
    description: 'Paket treh celostnih obravnav ORI 369',
    sessions: 3,
    regular_price: 225,
    package_price: 210,
    price_per_session: 70,
    included_services: ['3x celostna obravnava ORI 369', 'Manualne tehnike', 'Napredne naprave', 'Vodeno dihanje'],
    benefits: ['Prihranek 15€', 'Kontinuirano zdravljenje', 'Boljši rezultati'],
    display_order: 3
  },
  {
    name: 'Paket 6 obravnav',
    slug: 'paket-6-obravnave',
    description: 'Paket šestih celostnih obravnav ORI 369',
    sessions: 6,
    regular_price: 450,
    package_price: 396,
    price_per_session: 66,
    included_services: ['6x celostna obravnava ORI 369', 'Manualne tehnike', 'Napredne naprave', 'Vodeno dihanje', 'Ledene terapije'],
    benefits: ['Prihranek 54€', 'Intenzivno zdravljenje', 'Trajnejši rezultati'],
    display_order: 4
  },
  {
    name: 'Paket 9 obravnav',
    slug: 'paket-9-obravnave',
    description: 'Najobsežnejši paket devetih celostnih obravnav ORI 369',
    sessions: 9,
    regular_price: 675,
    package_price: 567,
    price_per_session: 63,
    included_services: ['9x celostna obravnava ORI 369', 'Vse napredne naprave', 'Manualne tehnike', 'Celostni pristop', 'Energijsko uravnavanje'],
    benefits: ['Prihranek 108€', 'Celovita transformacija', 'Najboljši rezultati'],
    display_order: 5
  },
  {
    name: 'Paket "Prebudi Telo"',
    slug: 'prebudi-telo',
    description: 'Paket z 3x elektrostimulacijo, 3x Tecar terapijo, 3x Iteracare z masažo, 3x manualno-Storm terapijo in 1x končno obravnavo',
    sessions: 13,
    regular_price: 335,
    package_price: 196,
    price_per_session: 15.08,
    included_services: ['3x Elektrostimulacija', '3x Tecar terapija', '3x Iteracare in masaža', '3x Manualna-Storm terapija', '1x Končna obravnava'],
    benefits: ['Aktivacija telesa', 'Regeneracija', 'Prihranek 139€'],
    display_order: 6
  },
  {
    name: 'Paket "Osveščanje Telesa"',
    slug: 'osvescanje-telesa',
    description: 'Intenziven paket z 6x elektrostimulacijo, 6x Iteracare z masažo, 6x laser, 6x Tecar, 6x manualno-Storm terapijo in 1x končno obravnavo',
    sessions: 31,
    regular_price: 690,
    package_price: 396,
    price_per_session: 12.77,
    included_services: ['6x Elektrostimulacija', '6x Iteracare in masaža', '6x Laser', '6x Tecar terapija', '6x Manualna-Storm terapija', '1x Končna obravnava'],
    benefits: ['Globlja transformacija', 'Celovita regeneracija', 'Prihranek 294€'],
    display_order: 7
  },
  {
    name: 'Paket "Univerzum"',
    slug: 'univerzum',
    description: 'Najobsežnejši paket z 9x elektrostimulacijo, 9x Tecar z masažo, 9x trakcijsko mizo, 9x manualno-Storm terapijo, 9x MIS, 9x skalarnimi valovi, 3x AO Scan in 1x Moti-physio Scan',
    sessions: 58,
    regular_price: 1835,
    package_price: 796,
    price_per_session: 13.72,
    included_services: ['9x Elektrostimulacija', '9x Tecar terapija in masaža', '9x Trakcijska miza', '9x Manualna-Storm terapija', '9x MIS Magnetna indukcijska stimulacija', '9x Skalarni valovi - uravnovešanje čaker', '3x AO Scan', '1x Moti-physio Scan'],
    benefits: ['Popolna transformacija', 'Vse tehnologije ORI 369', 'Prihranek 1039€'],
    display_order: 8
  }
];

// Individual therapy prices from pricelist
const individualPrices = [
  { name: 'Elektrostimulacija', price: 20, duration: 20 },
  { name: 'Tecar terapija', price: 40, duration: 30 },
  { name: 'Media Tape', price: 10, duration: 15 },
  { name: 'Iteracare', price: 20, duration: 20 },
  { name: 'Laser', price: 10, duration: 10 },
  { name: 'Magnetna indukcijska stimulacija (MIS)', price: 30, duration: 20 },
  { name: 'Storm terapija-manualna terapija', price: 30, duration: 20 },
  { name: 'Scan AO', price: 50, duration: 30 },
  { name: 'Motio-physio Scan', price: 120, duration: 30 },
  { name: 'Skalarni valovi - uravnovešanje čaker', price: 35, duration: 30 },
  { name: 'Trakcijska miza', price: 40, duration: 30 },
  { name: 'SU JOK therapy', price: 30, duration: 30 },
  { name: 'Ventuze (Cupping)', price: 30, duration: 30 },
  { name: 'Dry needling', price: 30, duration: 30 },
  { name: 'Individualno vodeno dihanje', price: 30, duration: 30 },
  { name: 'Individualna protibolečinska ali antistresna vadba', price: 40, duration: 60 }
];

async function updateServices() {
  console.log('🔄 Updating services with detailed descriptions...\n');

  for (const [slug, data] of Object.entries(serviceDescriptions)) {
    const { data: existing, error: fetchError } = await supabase
      .from('services')
      .select('id, name')
      .eq('slug', slug)
      .single();

    if (fetchError) {
      console.log(`⚠️ Service ${slug} not found, skipping...`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('services')
      .update({
        long_description: data.long_description,
        how_it_works: data.how_it_works,
        benefits: data.benefits,
        indications: data.indications,
        contraindications: (data as any).contraindications || null,
        price: data.price,
        duration: data.duration
      })
      .eq('slug', slug);

    if (updateError) {
      console.error(`❌ Error updating ${slug}:`, updateError.message);
    } else {
      console.log(`✅ Updated: ${existing.name}`);
    }
  }
}

async function insertTeamMembers() {
  console.log('\n🔄 Inserting team members...\n');

  for (const member of teamMembers) {
    const { data: existing } = await supabase
      .from('team_members')
      .select('id')
      .eq('name', member.name)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('team_members')
        .update(member)
        .eq('id', existing.id);

      if (error) {
        console.error(`❌ Error updating ${member.name}:`, error.message);
      } else {
        console.log(`✅ Updated: ${member.name}`);
      }
    } else {
      const { error } = await supabase
        .from('team_members')
        .insert(member);

      if (error) {
        console.error(`❌ Error inserting ${member.name}:`, error.message);
      } else {
        console.log(`✅ Inserted: ${member.name}`);
      }
    }
  }
}

async function insertTherapyPackages() {
  console.log('\n🔄 Inserting therapy packages...\n');

  for (const pkg of therapyPackages) {
    const { data: existing } = await supabase
      .from('therapy_packages')
      .select('id')
      .eq('slug', pkg.slug)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('therapy_packages')
        .update(pkg)
        .eq('id', existing.id);

      if (error) {
        console.error(`❌ Error updating ${pkg.name}:`, error.message);
      } else {
        console.log(`✅ Updated: ${pkg.name}`);
      }
    } else {
      const { error } = await supabase
        .from('therapy_packages')
        .insert(pkg);

      if (error) {
        console.error(`❌ Error inserting ${pkg.name}:`, error.message);
      } else {
        console.log(`✅ Inserted: ${pkg.name}`);
      }
    }
  }
}

async function main() {
  console.log('='.repeat(50));
  console.log('ORI 369 Database Update Script');
  console.log('='.repeat(50));

  await updateServices();
  await insertTeamMembers();
  await insertTherapyPackages();

  console.log('\n' + '='.repeat(50));
  console.log('✅ Database update completed!');
  console.log('='.repeat(50));
}

main().catch(console.error);
