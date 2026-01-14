export interface ServiceDetail {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  howItWorks: string;
  benefits: string[];
  indications: string[];
  contraindications?: string[];
  price: number;
  duration: number;
  image?: string;
}

export interface TeamMember {
  name: string;
  title: string;
  role: string;
  bio: string;
  longBio: string;
  qualifications: string[];
  specializations: string[];
  phone: string;
  image?: string;
}

export interface TherapyPackage {
  slug: string;
  name: string;
  description: string;
  sessions: number;
  regularPrice: number | null;
  packagePrice: number;
  pricePerSession: number;
  includedServices: string[];
  benefits: string[];
}

export const servicesData: Record<string, ServiceDetail> = {
  'tecar-terapija': {
    slug: 'tecar-terapija',
    name: 'TECAR Terapija',
    shortDescription: 'Napredna terapija s pomočjo radiofrekvenčne energije za regeneracijo tkiv.',
    longDescription: `TECAR terapija je podporna metoda zdravljenja, ki z ustvarjanjem elektromagnetne (toplotne) energije ustvarja protivnetne, regenerativne in protibolečinske učinke. Je diatermična terapija, ki deluje na podlagi prenosa visoko-frekvenčne (frekvenca: 448 kHZ) elektromagnetne energije skozi telo do ciljnega tkiva.

Glavni cilj terapije je stimulacija telesu lastnih fizioloških procesov celjenja. TECAR terapija skrajša čas zdravljenja ter pozitivno vpliva na krepitev notranjih obnovitvenih sposobnosti tkiv.`,
    howItWorks: `TECAR terapija temelji na proizvajanju toplotne energije. Gre za neinvazivno visokofrekvenčno energijo, ki spodbuja biološke procese samoregeneracije v celicah. TECAR aparatura vključuje premično elektrodo, fiksno elektrodo in kontaktno kremo. Deluje v kapacitivnem in rezistivnem načinu.`,
    benefits: ['Pospeševanje celjenja in regeneracije tkiva', 'Zmanjšanje mišičnih krčev', 'Vazodilatacija z večjim lokalnim pretokom krvi', 'Pospeševanje resorpcije hematomov', 'Aktivacija presnovnih reakcij', 'Povečanje zmogljivosti'],
    indications: ['Tendinitisi', 'Adhezivni kapsulitisi', 'Teniški in golfski komolci', 'Burzitisi', 'Artroze kolka in kolena', 'Pubalgije', 'Zlomi in zvini', 'Plantarni fasciitis', 'Bolečine v križu in vratu', 'Brazgotine'],
    price: 40,
    duration: 30
  },
  'elektrostimulacija': {
    slug: 'elektrostimulacija',
    name: 'Elektrostimulacija',
    shortDescription: 'Fizikalna terapija z električnimi impulzi za zmanjšanje bolečin in krepitev mišic.',
    longDescription: `Elektrostimulacijska terapija je vrsta fizikalne terapije, ki s pomočjo električnega toka in električnih impulzov zmanjšuje bolečine, pospešuje celični metabolizem in hitrejše celjenje. Električni impulzi preko elektrod na koži prehajajo globlje v tkivo.

Poznamo dve vrsti elektrostimulacije: TENS (za zdravljenje bolečine) in FES (za zdravljenje oslabljenih mišic).`,
    howItWorks: `TENS z nizkofrekvenčnimi električnimi tokovi stimulira senzorična živčna vlakna in zmanjšuje bolečino. FES s pomočjo električnih impulzov draži živčno-mišična vlakna in izvablja mišične kontrakcije za krepitev mišic.`,
    benefits: ['Takojšnje zmanjšanje bolečine', 'Mišične kontrakcije za krepitev', 'Pospešen celični metabolizem', 'Pospešena celična rast', 'Sproščanje endorfinov', 'Splošna sprostitev telesa'],
    indications: ['Mišične in sklepne bolečine', 'Atrofirane mišice', 'Mišične lezije', 'Zmanjšan obseg gibljivosti', 'Sindrom težkih nog', 'Mišični krči', 'Patelofemoralni sindrom', 'Nestabilnost sklepov', 'Postoperativna stanja'],
    contraindications: ['Organske okvare srca', 'Srčni spodbujevalnik', 'Nosečnost', 'Kovinski implanti'],
    price: 20,
    duration: 20
  },
  'magnetna-terapija': {
    slug: 'magnetna-terapija',
    name: 'Magnetna Terapija',
    shortDescription: 'Neinvazivna terapija z magnetnimi polji za regeneracijo in lajšanje bolečin.',
    longDescription: `Magnetna terapija je neinvazivna metoda zdravljenja, ki z uporabo pulzirajočih elektromagnetnih polj deluje protibolečinsko, protivnetno in regeneracijsko. Magnetna polja povečujejo količino kisika v celicah in pospešujejo regeneracijo.`,
    howItWorks: `Magnetna polja spodbudijo celično regeneracijo in aktivirajo tvorbo novih krvnih žil. Povečujejo mikrocirkulacijo krvi in limfe ter pozitivno vplivajo na imunski sistem.`,
    benefits: ['Zmanjšanje bolečine', 'Protivnetno delovanje', 'Izboljšana cirkulacija krvi', 'Povečana oksigenacija celic', 'Pospešena regeneracija tkiv', 'Krepitev imunskega sistema'],
    indications: ['Kronične bolečine', 'Poškodbe mišic in sklepov', 'Artritis', 'Osteoporoza', 'Postoperativna stanja', 'Športne poškodbe'],
    price: 30,
    duration: 20
  },
  'laserska-terapija': {
    slug: 'laserska-terapija',
    name: 'Laserska Terapija',
    shortDescription: 'Neinvazivna metoda z laserskimi žarki za pospešitev celjenja.',
    longDescription: `Laserska terapija je neinvazivna metoda zdravljenja, ki s pomočjo laserskih svetlobnih žarkov stimulira človeško tkivo za pospešitev celjenja, zmanjševanje bolečine ter pospeševanje regeneracije. Popolnoma neboleča metoda.`,
    howItWorks: `Laserski žarki v celicah spodbudijo tvorbo adenozin trifosfata (ATP), ki je osnovni vir energije za celice. Poveča se celična presnova in aktivirajo procesi regeneracije.`,
    benefits: ['Zmanjšanje bolečine', 'Zmanjšanje vnetja', 'Pospešeno celjenje ran', 'Regeneracija tkiv', 'Zmanjšanje oteklin', 'Izboljšana prekrvavitev'],
    indications: ['Akutne in kronične bolečine', 'Športne poškodbe', 'Vnetja tetiv', 'Artritis', 'Celjenje ran', 'Brazgotine'],
    price: 10,
    duration: 10
  },
  'manualna-terapija': {
    slug: 'manualna-terapija',
    name: 'Manualna Terapija',
    shortDescription: 'Strokovne ročne tehnike za sproščanje napetosti in izboljšanje gibljivosti.',
    longDescription: `Manualna terapija je strokovna tehnika, pri kateri terapevt z rokami obvladuje, sprošča in mobilizira mišice, sklepe in mehka tkiva. Primerna za vse vrste mišično-skeletnih težav. V ORI 369 jo kombiniramo z naprednimi tehnologijami.`,
    howItWorks: `Manualna terapija deluje na več ravneh: mehanski učinek na mišice in sklepe, nevrološki učinek na živčni sistem ter biokemični učinek na presnovne procese.`,
    benefits: ['Sproščanje mišičnih napetosti', 'Izboljšanje gibljivosti sklepov', 'Zmanjšanje bolečine', 'Odprava blokad', 'Izboljšana drža', 'Boljša cirkulacija'],
    indications: ['Bolečine v hrbtenici', 'Mišične napetosti', 'Omejeno gibanje sklepov', 'Glavoboli', 'Športne poškodbe', 'Postoperativna rehabilitacija'],
    price: 30,
    duration: 20
  },
  'mis': {
    slug: 'mis',
    name: 'MIS - Magnetna Indukcijska Stimulacija',
    shortDescription: 'Revolucionarna terapija z magnetnim poljem visoke intenzivnosti.',
    longDescription: `Magnetna indukcijska stimulacija (MIS) je revolucionarna terapija, ki z inovativnim pristopom zagotavlja izjemne rezultate. Nezdrave celice napolni in stimulira z izboljšano oksigenacijo in cirkulacijo ter jim povrne normalno delovanje.`,
    howItWorks: `MIS uporablja pulzirajoče magnetno polje visoke intenzivnosti, ki ustvarja električne tokove v nevronih in omogoča mišično stimulacijo ter sproži akcijski potencial za učinkovito terapijo.`,
    benefits: ['Hiter zdravilni učinek', 'Neboleč postopek', 'Neinvazivna terapija', 'Dolgotrajni rezultati', 'Zmanjšanje vnetij in bolečin', 'Skrajšan čas okrevanja'],
    indications: ['Kronična bolečinska stanja', 'Plantarna fasciitis', 'Tendonitis', 'Kronične tendinopatije', 'Rehabilitacija', 'Mišična regeneracija'],
    price: 30,
    duration: 20
  },
  'cupping': {
    slug: 'cupping',
    name: 'Cupping - Terapija z Ventuzami',
    shortDescription: 'Manualna tehnika z ventuzami za pospešitev regeneracije.',
    longDescription: `Terapija z ventuzami (cupping) je manualna tehnika, ki s pomočjo majhnih skodelic pospešuje celjenje, regeneracijo in lajša bolečine. Vakuum dvigne kožo in podkožno tkivo ter poveča pretok krvi.`,
    howItWorks: `Ventuze ustvarijo negativni pritisk na koži, kar povzroči lokalno vazodilatacijo in povečan pretok krvi. To spodbuja regeneracijo tkiv in sproščanje mišičnih vozlov.`,
    benefits: ['Sproščanje mišičnih napetosti', 'Izboljšana cirkulacija', 'Lajšanje bolečin', 'Pospeševanje regeneracije', 'Detoksikacija', 'Zmanjšanje vnetij'],
    indications: ['Mišične napetosti', 'Bolečine v hrbtu', 'Kronična utrujenost', 'Športne poškodbe', 'Celulitis'],
    price: 30,
    duration: 30
  },
  'dryneedeling': {
    slug: 'dryneedeling',
    name: 'Dry Needling',
    shortDescription: 'Fizioterapevtska metoda s tankimi iglami za sproščanje prožilnih točk.',
    longDescription: `Dry needling je invazivna fizioterapevtska metoda, ki s penetracijo tankih igel stimulira tkivo in sproža proces celjenja. Igla se vstavi neposredno v prožilno točko za sproščanje napetosti.`,
    howItWorks: `Igla prodre v mišično tkivo in stimulira prožilno točko. To povzroči refleksno sprostitev mišice, povečan lokalni pretok krvi in sproščanje endorfinov.`,
    benefits: ['Sproščanje prožilnih točk', 'Takojšnje zmanjšanje bolečine', 'Povečana gibljivost', 'Izboljšana funkcija mišic', 'Dolgotrajna učinkovitost'],
    indications: ['Kronične mišične bolečine', 'Miofascialni sindrom', 'Napetostni glavoboli', 'Bolečine v vratu in hrbtu', 'Športne poškodbe'],
    contraindications: ['Motnje strjevanja krvi', 'Jemanje antikoagulantov', 'Lokalna okužba', 'Nosečnost (določena področja)'],
    price: 30,
    duration: 30
  },
  'media-taping': {
    slug: 'media-taping',
    name: 'Medi Taping',
    shortDescription: 'Elastični trakovi za podporo mišicam in zmanjšanje bolečin.',
    longDescription: `Medi taping je metoda zdravljenja z aplikacijo samolepilnih elastičnih trakov na kožo za odpravljanje bolečin, oteklin in podporo mišicam. Trakovi posnemajo elastičnost kože in omogočajo normalno gibanje.`,
    howItWorks: `Elastični trakovi dvignejo kožo in ustvarijo prostor med kožo in mišičnim tkivom. To izboljša cirkulacijo krvi in limfe ter zmanjšuje pritisk na bolečinske receptorje.`,
    benefits: ['Zmanjšanje bolečine', 'Zmanjšanje oteklin', 'Podpora mišicam', 'Izboljšana cirkulacija', 'Omogoča normalno gibanje', 'Podpora rehabilitaciji'],
    indications: ['Športne poškodbe', 'Mišične napetosti', 'Otekline', 'Limfedem', 'Bolečine v sklepih', 'Preventiva poškodb'],
    price: 10,
    duration: 15
  },
  'iteracare': {
    slug: 'iteracare',
    name: 'iTeraCare',
    shortDescription: 'Teraherčna terapija za globinsko regeneracijo in harmonizacijo.',
    longDescription: `iTeraCare prinaša terapevtsko revolucijo z teraherčnimi valovi, ki lahko bistveno izboljšajo zdravje in kakovost življenja. S pomočjo terahertz valov, svetlobne vibracije in delovanjem globoko v telo vnese novo vibracijo.`,
    howItWorks: `Teraherz elektromagnetni val deluje v frekvenčnem pasu normalne celice. Svetloba vstopa direktno v visceralni predel, doseže kostni mozeg ter globinsko odstranjuje hlad in vlago iz telesa.`,
    benefits: ['Protibolečinsko delovanje', 'Protivnetno delovanje', 'Izboljšana mikrocirkulacija', 'Celična regeneracija', 'Podpora imunskemu sistemu', 'Zmanjševanje stresa'],
    indications: ['Kronične bolečine', 'Vnetna stanja', 'Kronične bolezni', 'Alergije', 'Stres', 'Splošno počutje'],
    price: 20,
    duration: 20
  },
  'ao-scan': {
    slug: 'ao-scan',
    name: 'AO Scan',
    shortDescription: 'Biorezonančna analiza za merjenje in optimizacijo frekvenc.',
    longDescription: `AO Scan je celovito orodje za merjenje in optimizacijo frekvenc. Komunicira s telesom prek subtilnih biofrekvenc in elektromagnetnih signalov, da prepozna področja, ki so morda v neravnovesju.`,
    howItWorks: `Tehnologija AO Scan komunicira s telesom prek subtilnih biofrekvenc in elektromagnetnih signalov. Z opredelitvijo področij v neravnovesju lahko naredite ustrezne spremembe življenjskega sloga.`,
    benefits: ['Celostna analiza stanja', 'Prepoznavanje neravnovesij', 'Personalizirane priporočila', 'Neinvazivna metoda', 'Hitra analiza'],
    indications: ['Preventivna diagnostika', 'Kronična utrujenost', 'Nepojasnjena stanja', 'Optimizacija zdravja'],
    price: 50,
    duration: 30
  },
  'skalarni-valovi': {
    slug: 'skalarni-valovi',
    name: 'Skalarni Valovi',
    shortDescription: 'Uravnovešanje čaker z zemeljskim elementom in skalarnimi valovi.',
    longDescription: `Scalar Wave Cosmic Communicator Earth Element Edition izkorišča zdravilno energijo zemeljskega elementa z uporabo skalarnih valov. Naprava oddaja frekvenčni pas, ki odmeva z zemeljskim elementom in spodbuja ozemljitev, stabilnost in ravnovesje.`,
    howItWorks: `Naprava z dvema Rodinovim navitjema oddaja močno energetsko polje skalarnih valov, ki so skrbno umerjeni za zagotavljanje čiste in močne energije zemeljskega elementa.`,
    benefits: ['Ozemljitev', 'Stabilnost', 'Ravnovesje', 'Zmanjševanje stresa', 'Duhovna rast', 'Harmonizacija energije'],
    indications: ['Stres', 'Anksioznost', 'Energijsko neravnovesje', 'Duhovna rast', 'Meditacija'],
    price: 35,
    duration: 30
  }
};

export const teamData: TeamMember[] = [
  {
    name: 'Jernej Babij',
    title: 'Ustanovitelj in terapevt',
    role: 'founder',
    bio: 'Ustanovitelj centra ORI 369, strokovnjak za celostne terapevtske pristope.',
    longBio: `Jernej je ustanovitelj centra ORI 369 in vodilni terapevt z bogatimi izkušnjami na področju celostnega zdravljenja. Združuje znanje naprednih terapevtskih tehnologij z globokim razumevanjem človekovega telesa in duha.

V ORI 369 vodi ekipo strokovnjakov in skrbi za nenehno izboljševanje terapevtskih pristopov ter uvajanje najnovejših tehnologij za doseganje optimalnih rezultatov.`,
    qualifications: ['Fizioterapevt', 'Certificiran TECAR terapevt', 'Specialist za manualno terapijo', 'Vodja centra ORI 369'],
    specializations: ['TECAR terapija', 'Manualna terapija', 'Celostni pristop k zdravljenju', 'Športna rehabilitacija'],
    phone: '+386 51 302 206'
  },
  {
    name: 'Evgen Valek M.D.(M.A.)',
    title: 'Alternativni zdravnik in šaman',
    role: 'therapist',
    bio: 'Alternativni zdravnik z diplomo M.D.(M.A.) in Ifa Babalav (šaman).',
    longBio: `Evgen Valek je alternativni zdravnik z bogato mednarodno izobrazbo in izkušnjami. Opravil je tečaj za maserja, postal Reiki mojster in Karuna Gautama mojster. Po študiju za alternativno medicino na Šri Lanki je pridobil diplomo M.D.(M.A.).

Leta 2006 je končal študij IFA v Južni Ameriki in postal Ifa Babalav (šaman). Potoval je po svetu - od indijanskih rezervatov v Ameriki, do kulture Majev, Maurov na Novi Zelandiji in Aboriginov v Avstraliji. Vsa ta znanja in izkušnje zdaj deli v ORI 369.`,
    qualifications: ['M.D.(M.A.) - Alternativna medicina', 'Ifa Babalav (šaman)', 'Reiki mojster', 'Karuna Gautama mojster', 'Certificiran maser', 'Hamam terapevt'],
    specializations: ['Alternativna medicina', 'Šamanske tehnike', 'Energijsko zdravljenje', 'Celostna terapija', 'Meditacija in dihalne tehnike'],
    phone: '+386 41 458 931'
  }
];

export const packagesData: TherapyPackage[] = [
  {
    slug: 'uvodni-termin',
    name: 'Uvodni termin + analiza',
    description: 'Prvi pregled + meritev s Physio Motio + celovit personaliziran plan terapij in vaj za vrnitev v ravnovesje',
    sessions: 1,
    regularPrice: null,
    packagePrice: 96,
    pricePerSession: 96,
    includedServices: ['Meritev Physio Motio', 'Analiza gibanja in drže', 'Personaliziran plan terapij', 'Vaje za ravnovesje'],
    benefits: ['Celovita analiza stanja', 'Personaliziran pristop', 'Jasen načrt zdravljenja']
  },
  {
    slug: 'paket-3-obravnave',
    name: 'Paket 3 obravnave',
    description: 'Paket treh celostnih obravnav ORI 369',
    sessions: 3,
    regularPrice: 225,
    packagePrice: 210,
    pricePerSession: 70,
    includedServices: ['3x celostna obravnava ORI 369', 'Manualne tehnike', 'Napredne naprave', 'Vodeno dihanje'],
    benefits: ['Prihranek 15€', 'Kontinuirano zdravljenje', 'Boljši rezultati']
  },
  {
    slug: 'paket-6-obravnave',
    name: 'Paket 6 obravnav',
    description: 'Paket šestih celostnih obravnav ORI 369',
    sessions: 6,
    regularPrice: 450,
    packagePrice: 396,
    pricePerSession: 66,
    includedServices: ['6x celostna obravnava ORI 369', 'Manualne tehnike', 'Napredne naprave', 'Vodeno dihanje', 'Ledene terapije'],
    benefits: ['Prihranek 54€', 'Intenzivno zdravljenje', 'Trajnejši rezultati']
  },
  {
    slug: 'paket-9-obravnave',
    name: 'Paket 9 obravnav',
    description: 'Najobsežnejši paket devetih celostnih obravnav ORI 369',
    sessions: 9,
    regularPrice: 675,
    packagePrice: 567,
    pricePerSession: 63,
    includedServices: ['9x celostna obravnava ORI 369', 'Vse napredne naprave', 'Manualne tehnike', 'Celostni pristop', 'Energijsko uravnavanje'],
    benefits: ['Prihranek 108€', 'Celovita transformacija', 'Najboljši rezultati']
  },
  {
    slug: 'prebudi-telo',
    name: 'Paket "Prebudi Telo"',
    description: 'Paket z elektrostimulacijo, Tecar terapijo, Iteracare z masažo in manualno-Storm terapijo',
    sessions: 13,
    regularPrice: 335,
    packagePrice: 196,
    pricePerSession: 15.08,
    includedServices: ['3x Elektrostimulacija', '3x Tecar terapija', '3x Iteracare in masaža', '3x Manualna-Storm terapija', '1x Končna obravnava'],
    benefits: ['Aktivacija telesa', 'Regeneracija', 'Prihranek 139€']
  },
  {
    slug: 'osvescanje-telesa',
    name: 'Paket "Osveščanje Telesa"',
    description: 'Intenziven paket z elektrostimulacijo, Iteracare, laser, Tecar in manualno terapijo',
    sessions: 31,
    regularPrice: 690,
    packagePrice: 396,
    pricePerSession: 12.77,
    includedServices: ['6x Elektrostimulacija', '6x Iteracare in masaža', '6x Laser', '6x Tecar terapija', '6x Manualna-Storm terapija', '1x Končna obravnava'],
    benefits: ['Globlja transformacija', 'Celovita regeneracija', 'Prihranek 294€']
  },
  {
    slug: 'univerzum',
    name: 'Paket "Univerzum"',
    description: 'Najobsežnejši paket z vsemi tehnologijami ORI 369',
    sessions: 58,
    regularPrice: 1835,
    packagePrice: 796,
    pricePerSession: 13.72,
    includedServices: ['9x Elektrostimulacija', '9x Tecar terapija in masaža', '9x Trakcijska miza', '9x Manualna-Storm terapija', '9x MIS', '9x Skalarni valovi', '3x AO Scan', '1x Moti-physio Scan'],
    benefits: ['Popolna transformacija', 'Vse tehnologije ORI 369', 'Prihranek 1039€']
  }
];

export const individualPrices = [
  { name: 'Elektrostimulacija', price: 20, duration: 20 },
  { name: 'Tecar terapija', price: 40, duration: 30 },
  { name: 'Media Tape', price: 10, duration: 15 },
  { name: 'Iteracare', price: 20, duration: 20 },
  { name: 'Laser', price: 10, duration: 10 },
  { name: 'MIS - Magnetna indukcijska stimulacija', price: 30, duration: 20 },
  { name: 'Storm terapija - manualna terapija', price: 30, duration: 20 },
  { name: 'Scan AO', price: 50, duration: 30 },
  { name: 'Motio-physio Scan', price: 120, duration: 30 },
  { name: 'Skalarni valovi - uravnovešanje čaker', price: 35, duration: 30 },
  { name: 'Trakcijska miza', price: 40, duration: 30 },
  { name: 'SU JOK therapy', price: 30, duration: 30 },
  { name: 'Ventuze (Cupping)', price: 30, duration: 30 },
  { name: 'Dry needling', price: 30, duration: 30 },
  { name: 'Individualno vodeno dihanje', price: 30, duration: 30 },
  { name: 'Individualna protibolečinska vadba', price: 40, duration: 60 }
];
