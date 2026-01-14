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
    longDescription: `TECAR terapija je podporna metoda zdravljenja, ki z ustvarjanjem elektromagnetne (toplotne) energije ustvarja protivnetne, regenerativne in protibolečinske učinke. Naprava v tkivu sproži proces samoceljenja in centralizacijo simptomov.

S termičnim delovanjem omogoča boljšo cirkulacijo krvi, ki je ključnega pomena za celjenje v akutni fazi poškodbe. Pospešuje dovod kisika v celice, kar omogoča hitrejšo regeneracijo.`,
    howItWorks: `TECAR terapija temelji na prenosu visoko-frekvenčne (448 kHZ) elektromagnetne energije. Deluje v kapacitivnem in rezistivnem načinu, kar omogoča ciljanje različnih globin tkiva. S termičnim učinkom spodbuja naravne procese regeneracije.`,
    benefits: [
      'Zmanjšanje bolečine za 20-25% že po prvi terapiji',
      'Pospeševanje celjenja in regeneracije tkiva',
      'Sproščanje hipertoničnih mišic',
      'Povečanje obsega gibljivosti',
      'Izboljšanje krvnega obtoka',
      'Zmanjševanje edema'
    ],
    indications: [
      'Bolečine v hrbtu (specifične in nespecifične)',
      'Artroza kolka in kolena',
      'Sklepni artritis',
      'Sindrom zamrznjene rame',
      'Skakalno koleno in teniški komolec',
      'Sindrom karpalnega kanala',
      'Vnetje sklepov in ovojnic',
      'Poškodbe ligamentov (npr. ACL)',
      'Mišične bolečine in vnetja živcev'
    ],
    contraindications: [
      'Nosečnost (v predelu trebuha)',
      'Motnje senzibilitete',
      'Vnetne spremembe na koži in odprte rane',
      'Krvavitve',
      'Maligna stanja',
      'Vročinska stanja in infekcije',
      'Aktivne implantirane medicinske naprave (npr. pacemaker)',
      'Previdnost pri rastnih conah otrok'
    ],
    price: 40,
    duration: 30
  },
  'elektrostimulacija': {
    slug: 'elektrostimulacija',
    name: 'Elektrostimulacija',
    shortDescription: 'Fizikalna terapija z električnimi impulzi za zmanjšanje bolečin in krepitev mišic.',
    longDescription: `Elektrostimulacijska terapija je vrsta fizikalne terapije, ki s pomočjo električnega toka in električnih impulzov zmanjšuje bolečine, pospešuje celični metabolizem in hitrejše celjenje. Električni impulzi preko elektrod na koži prehajajo globlje v tkivo.

Poznamo dve vrsti elektrostimulacije: TENS (za zdravljenje bolečine) in FES (za zdravljenje oslabljenih mišic). TENS stimulira senzorična živčna vlakna in zmanjšuje bolečino, medtem ko FES draži živčno-mišična vlakna in izvablja mišične kontrakcije za krepitev mišic.`,
    howItWorks: `TENS (Transkutana električna živčna stimulacija) uporablja nizkofrekvenčne električne tokove, ki stimulirajo senzorična živčna vlakna. To zmanjšuje prevajanje bolečinskih dražljajev po živčevju in spodbuja sproščanje endorfinov. FES (Funkcionalna električna stimulacija) pa draži živčno-mišična vlakna in povzroči krčenje mišic, kar je ključno za krepitev atrofiranih mišic.`,
    benefits: [
      'Takojšnje zmanjšanje bolečine',
      'Mišične kontrakcije za krepitev mišic',
      'Pospešen celični metabolizem in regeneracija',
      'Sproščanje endorfinov (naravnih zaviralcev bolečine)',
      'Splošna sprostitev telesa',
      'Izboljšana prekrvavitev tkiv'
    ],
    indications: [
      'Mišične in sklepne bolečine',
      'Atrofirane mišice (po operacijah ali poškodbah)',
      'Mišične lezije in krči',
      'Zmanjšan obseg gibljivosti',
      'Sindrom težkih nog',
      'Patelofemoralni sindrom',
      'Nestabilnost sklepov',
      'Postoperativna rehabilitacijska stanja'
    ],
    contraindications: [
      'Organske okvare srca',
      'Srčni spodbujevalnik (pacemaker)',
      'Nosečnost',
      'Kovinski implanti v predelu aplikacije',
      'Maligna obolenja',
      'Akutna vnetja in infekcije'
    ],
    price: 20,
    duration: 20
  },
  'magnetna-terapija': {
    slug: 'magnetna-terapija',
    name: 'Magnetna Terapija',
    shortDescription: 'Neinvazivna terapija z magnetnimi polji za regeneracijo in lajšanje bolečin.',
    longDescription: `Magnetna terapija je neinvazivna metoda zdravljenja, ki z uporabo pulzirajočih elektromagnetnih polj deluje protibolečinsko, protivnetno in regeneracijsko. Magnetna polja povečujejo količino kisika v celicah in pospešujejo celično regeneracijo.

Srednje-frekvenčna magnetna polja prehajajo skozi celotno telo in vplivajo na vse celice, kar izboljšuje metabolizem in prekrvavitev.`,
    howItWorks: `Magnetna polja nizkih in srednjih frekvenc prodirajo skozi telo in delujejo na celične membrane. Povečujejo prepustnost celic, kar omogoča boljši vnos kisika in hranil ter hitrejše odstranjevanje toksinov. To aktivira naravne procese regeneracije tkiv.`,
    benefits: [
      'Zmanjšanje bolečine in vnetij',
      'Izboljšana mikrocirkulacija krvi in limfe',
      'Povečana oksigenacija celic',
      'Pospešena regeneracija mehkih tkiv in kosti',
      'Krepitev imunskega sistema',
      'Izboljšan metabolizem'
    ],
    indications: [
      'Kronične bolečine v hrbtenici in sklepih',
      'Poškodbe mišic, tetiv in ligamentov',
      'Artritis in revmatizem',
      'Osteoporoza (pospešuje mineralizacijo kosti)',
      'Postoperativna stanja in zvini',
      'Nevralgije in migrene'
    ],
    contraindications: [
      'Srčni spodbujevalnik (pacemaker)',
      'Nosečnost',
      'Krvavitve',
      'Hipotenzija (nizek krvni tlak)',
      'Maligna obolenja',
      'Tuberkuloza'
    ],
    price: 30,
    duration: 20
  },
  'laserska-terapija': {
    slug: 'laserska-terapija',
    name: 'Laserska Terapija',
    shortDescription: 'Neinvazivna metoda z laserskimi žarki za pospešitev celjenja.',
    longDescription: `Laserska terapija je neinvazivna metoda zdravljenja, ki s pomočjo laserskih svetlobnih žarkov stimulira človeško tkivo za pospešitev celjenja, zmanjševanje bolečine ter pospeševanje regeneracije. Metoda je popolnoma neboleča in varna.

Laserska svetloba prodre globoko v tkivo in sproži biokemične reakcije na celični ravni.`,
    howItWorks: `Laserski žarki v celicah (v mitohondrijih) spodbudijo tvorbo adenozin trifosfata (ATP), ki je glavni vir energije za celice. Ta energija se porabi za hitrejšo delitev celic in regeneracijo tkiva, zmanjšanje vnetnih procesov in hitrejše celjenje ran.`,
    benefits: [
      'Hitro zmanjšanje bolečine in vnetja',
      'Pospešeno celjenje ran in brazgotin',
      'Regeneracija mehkih tkiv (mišice, ligamenti)',
      'Zmanjšanje oteklin in edemov',
      'Izboljšana mikrocirkulacija',
      'Spodbujanje delovanja imunskega sistema'
    ],
    indications: [
      'Akutne in kronične bolečine',
      'Športne poškodbe (zvini, raztrganine)',
      'Vnetja tetiv (tendinitis)',
      'Artritis in revmatična obolenja',
      'Razjede na koži in rane',
      'Postoperativne brazgotine'
    ],
    contraindications: [
      'Oči (direktno obsevanje)',
      'Maligna obolenja',
      'Področje ščitnice',
      'Nosečnost (predel trebuha)',
      'Epilepsija'
    ],
    price: 10,
    duration: 10
  },
  'mis': {
    slug: 'mis',
    name: 'MIS - Magnetna Indukcijska Stimulacija',
    shortDescription: 'Revolucionarna terapija z magnetnim poljem visoke intenzivnosti.',
    longDescription: `Magnetna indukcijska stimulacija (MIS) je revolucionarna terapija, ki z inovativnim pristopom zagotavlja izjemne rezultate. Nezdrave celice napolni in stimulira z izboljšano oksigenacijo in cirkulacijo ter jim povrne normalno delovanje.

S svojim edinstvenim ekscitativnim učinkom se MIS bistveno razlikuje od tradicionalnih terapij, saj uporablja pulzirajoče magnetno polje visoke intenzivnosti.`,
    howItWorks: `Jakosti magnetnega polja ustvarjajo električne tokove v nevronih, kar omogoča globoko mišično stimulacijo. Ko elektromagnetni tok doseže določeno vrednost, se sproži akcijski potencial, ki povzroči krčenje mišic in spodbuja regeneracijo na nivoju, ki ga klasične metode ne dosežejo.`,
    benefits: [
      'Hiter in dolgotrajen zdravilni učinek',
      'Neboleč in neinvaziven postopek',
      'Globoka mišična stimulacija',
      'Izboljšana oksigenacija in cirkulacija',
      'Zmanjšanje toksinov in vnetij',
      'Funkcionalna optimizacija telesa'
    ],
    indications: [
      'Kronična bolečinska stanja',
      'Plantarna fasciitis',
      'Tendonitis in tendinopatije',
      'Športne poškodbe',
      'Mišična regeneracija in atrofija',
      'Bolečine v hrbtu in sklepih'
    ],
    contraindications: [
      'Srčni spodbujevalnik (pacemaker)',
      'Kovinski implanti v predelu aplikacije',
      'Nosečnost',
      'Maligna obolenja',
      'Krvavitve',
      'Aktivne medicinske implantirane naprave'
    ],
    price: 30,
    duration: 20
  },
  'cupping': {
    slug: 'cupping',
    name: 'Cupping - Terapija z Ventuzami',
    shortDescription: 'Manualna tehnika z ventuzami za pospešitev regeneracije.',
    longDescription: `Terapija z ventuzami (cupping), je manualna tehnika, ki s pomočjo majhnih skodelic (ventuz) pospešuje celjenje, regeneracijo in lajša simptome bolečih stanj. Ventuze terapevt namesti na kožo tako, da jo ta posesa vase, ustvari vakuum in poveča cirkulacijo. V terapijji se za cupping uporabljajo silikonske, plastične ali steklene ventuze, skozi katere je moč videti kožno tkivo. Terapija z ventuzami se najpogosteje uporablja za lajšanje simptomov kroničnih bolečin, fibromialgije, bolečin v križu in vratu ter nevralgičnih bolečin.

Terapija z ventuzami je najstarejša tradicionalna kitajska medicinska metoda. Njena uporaba se omenja že v času egipčanskih civilizacij. Danes je to zelo priljubljena metoda v različnih vejah medicine. Alternativno ime cupping-a je Hijama, kar v arabščini pomeni sesati.`,
    howItWorks: `Terapija z vantuzami lahko pospešuje izmenjavo snovi potrebnih za regeneracijo, ter odvod odpadnih snovi in toksinov iz človekovega telesa. Terapija z ventuzami lahko deluje na dva načina:

• Mokra tehnika: Z majhnim prerezom na koži omogočimo takojšnjo odstranitev toksinov skupaj z odpadno krvjo. Na mesto lahko pride sveža kri obogatena s kisikom in hranljivimi sestavinami za tkivo. Prav tako se na ta račun zmanjša oteklina, bolečina in mišična napetost.
• Periferni živčni sistem: Ventuze, ki jih apliciramo na kožo, vzdražijo periferne živce, ti pa pošljejo signale v možgane. Možgani naj bi v tem primeru reagirali po principu t. i. »teorije vrat« zmanjševanja in blokiranja bolečinskih dražljajev in na ta način regulirali bolečino.`,
    benefits: [
      'Zmanjšan občutek bolečine',
      'Zmanjšano vnetje',
      'Izboljšana cirkulacija',
      'Hitrejša regeneracija tkiva',
      'Hitrejše celjenje poškodovanega tkiva',
      'Izboljšano delovanje imunskega sistema',
      'Sprostitev celega telesa',
      'Boljše delovanje organov',
      'Odprava škodljivih snovi iz telesa',
      'Izboljšuje metabolizem kože in delovanje žlez',
      'Spodbuja limfno drenažo'
    ],
    indications: [
      'Kronične bolečine',
      'Bolečine v vratu in križu',
      'Hernija diska',
      'Glavoboli in migrene',
      'Različni utesnitveni sindromi (karpalni kanal, utesnitev rame...)',
      'Vnetna stanja',
      'Otekline',
      'Boleče mišice',
      'Triger točke',
      'Mišični spazmi in mišična zakrčenost',
      'Artritis in spondilitis',
      'Oslabljena gibljivosti sklepov',
      'Športne poškodbe',
      'Hipertenzija',
      'Oslabljena limfa in krvni obtok',
      'Stres in napetost',
      'Astma in bronhitis',
      'Težave s prebavo'
    ],
    contraindications: [
      'Posamezniki s hemofilijo ali anemijo',
      'Posamezniki s srčnim spodbujevalnikom (pacemaker)',
      'Starejše osebe in otroci',
      'Nosečnice in ženske v času menstruacije',
      'Področje zelo suhe, razpokane kože ali opeklin',
      'Področje kožnih ran',
      'Posamezniki s srčno-žilnimi boleznimi',
      'Limfedemi in hematomi nepojasnjenega vzroka',
      'Področje zlomljene kosti ali izpahnjenega sklepa',
      'Mišična distrofija'
    ],
    price: 30,
    duration: 30
  },
  'dryneedeling': {
    slug: 'dryneedeling',
    name: 'Dry Needling',
    shortDescription: 'Fizioterapevtska metoda s tankimi iglami za sproščanje prožilnih točk.',
    longDescription: `Dry needling je invazivna fizioterapevtska metoda, ki s penetracijo tankih igel stimulira tkivo in sproža proces celjenja. Igla se vstavi neposredno v prožilno točko (mišični vozel) za sproščanje kronične napetosti.

V ORI 369 to metodo izvajamo strokovno in varno, z uporabo sterilnih igel za enkratno uporabo.`,
    howItWorks: `Igla prodre v mišično tkivo in stimulira prožilno točko. To povzroči refleksno sprostitev mišice (lokalni odziv), povečan lokalni pretok krvi in sproščanje endorfinov. Metoda deluje neposredno na izvor bolečine v mišici.`,
    benefits: [
      'Sproščanje kroničnih mišičnih vozlov (prožilnih točk)',
      'Takojšnje zmanjšanje bolečine',
      'Povečana gibljivost in fleksibilnost',
      'Izboljšana funkcija mišic',
      'Zmanjšanje vnetnih procesov',
      'Dolgotrajna učinkovitost pri kroničnih stanjih'
    ],
    indications: [
      'Kronične mišične bolečine',
      'Miofascialni bolečinski sindrom',
      'Napetostni glavoboli',
      'Bolečine v vratu, ramenih in hrbtu',
      'Športne poškodbe',
      'Triger točke'
    ],
    contraindications: [
      'Motnje strjevanja krvi',
      'Jemanje antikoagulantov (zdravil proti strjevanju krvi)',
      'Lokalna okužba kože',
      'Nosečnost (določena področja)',
      'Strah pred iglami',
      'Maligna obolenja'
    ],
    price: 30,
    duration: 30
  },
  'media-taping': {
    slug: 'media-taping',
    name: 'Medi Taping',
    shortDescription: 'Elastični trakovi za podporo mišicam in zmanjšanje bolečin.',
    longDescription: `Medi taping je metoda zdravljenja z aplikacijo samolepilnih elastičnih trakov na kožo za odpravljanje bolečin, oteklin in podporo mišicam. Trakovi posnemajo elastičnost kože in omogočajo normalno gibanje, hkrati pa nudijo terapevtski učinek 24 ur na dan.

Fizični učinek dosežemo s kompresijo ali dekompresijo, kar vpliva na fascijo in limfni sistem.`,
    howItWorks: `Elastični trakovi rahlo dvignejo kožo in ustvarijo prostor med kožo in mišičnim tkivom. To izboljša cirkulacijo krvi in limfe, kar pospešuje odvajanje odpadnih snovi in zmanjšuje pritisk na bolečinske receptorje.`,
    benefits: [
      'Zmanjšanje bolečine in oteklin',
      'Podpora mišicam, sklepom in ligamentom',
      'Izboljšana koordinacija in stabilnost',
      'Nudi preventivo pred poškodbami',
      'Zmanjšuje menstrualne bolečine',
      'Omogoča normalno gibanje med rehabilitacijo'
    ],
    indications: [
      'Športne poškodbe (zvini, raztrganine)',
      'Mišične napetosti in bolečine',
      'Otekline in limfedemi',
      'Bolečine v sklepih (npr. artroza kolena)',
      'Vnetja tetiv (ahilova tetiva, teniški komolec)',
      'Glavoboli',
      'Preventiva pri športnih aktivnostih'
    ],
    contraindications: [
      'Alergija na lepilo traku',
      'Odprte rane ali krastasta koža',
      'Globoka venska tromboza',
      'Maligna obolenja na mestu aplikacije',
      'Zelo občutljiva ali vneta koža',
      'Diabetes (previdnost)'
    ],
    price: 10,
    duration: 15
  },
  'iteracare': {
    slug: 'iteracare',
    name: 'iTeraCare',
    shortDescription: 'Teraherčna terapija za globinsko regeneracijo in harmonizacijo.',
    longDescription: `iTeraCare prinaša terapevtsko revolucijo s teraherčnimi valovi, ki lahko bistveno izboljšajo zdravje in kakovost življenja. S pomočjo terahertz valov, svetlobne vibracije in delovanjem globoko v telo vnese novo frekvenco, ki spodbuja celično regeneracijo.

Teraherčni valovi prodrejo globoko v tkiva (do 20-30 cm), kjer spodbujajo pretok energije in odstranjujejo hlad ter vlago iz telesa.`,
    howItWorks: `Teraherz elektromagnetni val deluje v frekvenčnem pasu normalnih, zdravih celic. Ko valovi prodrejo v telo, resonirajo z našimi celicami in jih aktivirajo. Hkrati svetloba vstopa direktno v visceralni predel, doseže kostni mozeg in globinsko odstranjuje energetske blokade.`,
    benefits: [
      'Protibolečinsko in protivnetno delovanje',
      'Izboljšana mikrocirkulacija',
      'Globinska celična regeneracija',
      'Odstranjevanje toksinov in odvečne vlage',
      'Podpora imunskemu sistemu',
      'Zmanjševanje stresa in energetska harmonizacija'
    ],
    indications: [
      'Kronične bolečine in vnetna stanja',
      'Kronične bolezni in oslabljen imunski sistem',
      'Alergije in kožne težave',
      'Stres, utrujenost in energetske blokade',
      'Splošno slabo počutje',
      'Poškodbe tkiv'
    ],
    contraindications: [
      'Kovinski implanti (direktna aplikacija čez njih)',
      'Srčni spodbujevalnik (pacemaker)',
      'Nosečnost',
      'Krvavitve',
      'Akutne infekcije',
      'Maligna obolenja'
    ],
    price: 20,
    duration: 20
  },
  'ao-scan': {
    slug: 'ao-scan',
    name: 'AO Scan',
    shortDescription: 'Biorezonančna analiza za merjenje in optimizacijo frekvenc.',
    longDescription: `AO Scan je celovito orodje za merjenje in optimizacijo frekvenc vašega telesa. Vse je energija in frekvenca; ko se frekvence spremenijo iz optimalnega stanja, se lahko pojavijo težave. AO Scan pomaga prepoznati ta neravnovesja.

Program AO Scan Technology komunicira s telesom prek subtilnih biofrekvenc in elektromagnetnih signalov, da prepozna področja, ki so morda v neravnovesju.`,
    howItWorks: `Tehnologija temelji na principu biorezonance. Naprava skenira frekvence vaših organov, tkiv in sistemov ter jih primerja z optimalnimi vrednostmi. Z opredelitvijo področij, ki potrebujejo pomoč, nato s povratnimi frekvencami optimizira vaše stanje in pomaga doseči harmonijo.`,
    benefits: [
      'Celostna in hitra analiza stanja telesa',
      'Prepoznavanje frekvenčnih neravnovesij',
      'Personalizirana poročila in priporočila',
      'Popolnoma neinvazivna metoda',
      'Podpora pri optimizaciji zdravja in življenjskega sloga'
    ],
    indications: [
      'Preventivna diagnostika',
      'Kronična utrujenost in pomanjkanje energije',
      'Nepojasnjena zdravstvena stanja',
      'Želja po celostnem razumevanju delovanja lastnega telesa',
      'Optimizacija športnih dosežkov'
    ],
    price: 50,
    duration: 30
  },
  'skalarni-valovi': {
    slug: 'skalarni-valovi',
    name: 'Skalarni Valovi',
    shortDescription: 'Uravnovešanje čaker z zemeljskim elementom in skalarnimi valovi.',
    longDescription: `Scalar Wave Cosmic Communicator Earth Element Edition izkorišča zdravilno energijo zemeljskega elementa z uporabo skalarnih valov. Ta napredna tehnologija spodbuja globoko izkušnjo ravnovesja in harmonije v telesu, umu in duhu.

Skalarni valovi so skrbno umerjeni, da zagotovijo čist in močan vir energije, ki spodbuja občutek ozemljitve, stabilnosti in varnosti.`,
    howItWorks: `Naprava z dvema močnima Rodinovim navitjema oddaja močno energetsko polje skalarnih valov. Ti valovi prodrejo globoko v tkiva, kjer spodbujajo celično regeneracijo in izboljšujejo pretok energije skozi čakre in energetske kanale, kar vodi do globoke sprostitve in harmonije.`,
    benefits: [
      'Globoka ozemljitev in stabilnost',
      'Energijsko uravnoteženje čaker',
      'Zmanjševanje stresa in anksioznosti',
      'Spodbujanje duhovne rasti in jasnosti',
      'Harmonizacija telesa, uma in duha',
      'Izboljšano splošno počutje'
    ],
    indications: [
      'Stres, anksioznost in nemir',
      'Energijsko neravnovesje',
      'Potreba po ozemljitvi in stabilnosti',
      'Podpora pri meditaciji in duhovni rasti',
      'Čustvena nihanja'
    ],
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
