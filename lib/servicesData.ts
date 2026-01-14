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

S termičnim delovanjem omogoča boljšo cirkulacijo krvi, ki je ključnega pomena za celjenje v akutni fazi poškodbe. S svojim mehanizmom prav tako pospešuje dovod kisika v celicah, kar omogoča hitrejšo regeneracijo. Deluje tudi blagodejno in zmanjšuje bolečino.

Čas trajanje zdravljenja s TECAR terapijo je odvisen od vrste poškodbe in bolečine. Sama terapija traja med 15 in 30 min in se pogosto kombinira z manualno terapijo in aktivnim gibanjem. Po prvi TECAR terapiji se pričakuje zmanjšanje bolečine za 20-25 % v primerjavi z začetno bolečino.

Glavni cilj terapije je stimulacija telesu lastnih fizioloških procesov celjenja. TECAR terapija skrajša čas zdravljenja ter pozitivno vpliva na krepitev notranjih obnovitvenih sposobnosti tkiv. S termičnim delovanjem omogoča boljšo cirkulacijo krvi, ki je ključnega pomena za celjenje v akutni fazi poškodbe.`,
    howItWorks: `TECAR terapija temelji na prenosu visoko-frekvenčne (448 kHZ) elektromagnetne energije. Deluje v kapacitivnem in rezistivnem načinu, kar omogoča ciljanje različnih globin tkiva. S termičnim učinkom spodbuja naravne procese regeneracije.

Gre za neinvazivno visokofrekvenčno energijo, ki spodbuja biološke procese samoregeneracije v celicah. TECAR aparatura vključuje premično elektrodo, fiksno elektrodo in kontaktno kremo. S termičnim delovanjem omogoča boljšo cirkulacijo krvi, ki je ključnega pomena za celjenje v akutni fazi poškodbe.`,
    benefits: [
      'Zmanjšanje bolečine za 20-25% že po prvi terapiji',
      'Pospeševanje celjenja in regeneracije tkiva',
      'Sproščanje hipertoničnih mišic',
      'Povečanje obsega gibljivosti',
      'Izboljšanje krvnega obtoka',
      'Zmanjševanje edema',
      'Podpora vnetnim procesom',
      'Trajno blokiranje živčnih impulzov',
      'Vazodilatacija z večjim lokalnim pretokom krvi',
      'Pospeševanje resorpcije hematomov',
      'Aktivacija presnovnih reakcij',
      'Povečanje zmogljivosti'
    ],
    indications: [
      'Bolečine v hrbtu (specifične in nespecifične)',
      'Artroza kolka in kolena',
      'Sklepni artritis',
      'Sindrom zamrznjene rame',
      'Skakalno koleno in teniški komolec',
      'Sindrom karpalnega kanala',
      'Vnetje sklepov in ovojnic',
      'Po rekusntrukciji sprednje križne vezi (ACL)',
      'Poškodbe ligamentov (npr. SLAP lezija)',
      'Poškodba upogibovalk kolena',
      'Mišične bolečine in vnetja živcev',
      'Poškodba zadnjih stegenskih strun',
      'Tendinitisi',
      'Adhezivni kapsulitisi',
      'Teniški in golfski komolci',
      'Burzitisi',
      'Pubalgije',
      'Zlomi in zvini',
      'Plantarni fasciitis',
      'Brazgotine'
    ],
    contraindications: [
      'Nosečnost (previdnost okoli trebuha)',
      'Motnje senzibilitete',
      'Vnetne spremembe na koži in odprte rane',
      'Krvavitve',
      'Maligna stanja',
      'Vročinska stanja in infekcije',
      'Kovinski predmeti na koži in aktivne implantirane medicinske naprave',
      'Previdnost pri rastnih conah otrok',
      'Srčni spodbujevalnik (pacemaker)'
    ],
    price: 40,
    duration: 30
  },
  'moti-physio': {
    slug: 'moti-physio',
    name: 'Moti Physio - Analiza drže',
    shortDescription: 'Natančna 3D digitalna analiza telesne drže in gibalnih vzorcev.',
    longDescription: `Zakaj je ocena drže pomembna? Slaba telesna drža lahko povzroči ali poslabša nevromišično-skeletne simptome, kot sta bolečina v križu in vratu, ter moti našo kinetično verigo. Naprava Moti Physio omogoča natančno odkrivanje in odpravljanje neravnovesij.

Mnogi športniki imajo mišični disbalans, ki jim preprečuje rezultatsko napredovanje. Naprava Moti Physio omogoča odkrivanje teh neravnovesij ter preventivno oziroma zgodnje ukrepanje. Naprava uporablja vrhunsko 3D slikovno tehnologijo za natančno merjenje in analizo drže.

S stalnim spremljanjem drže otrok lahko naprava beleži spremembe skozi čas. To omogoča zgodnje ukrepanje, če pride do poslabšanja stanja, in prilagoditev terapij glede na razvoj skolioze ali drugih asimetrij. Naprava je neinvazivna, kar pomeni, da ni izpostavljenosti sevanju. To omogoča varno in pogosto spremljanje otrokove drže brez tveganja za zdravje.`,
    howItWorks: `Naprava Moti Physio uporablja vrhunsko 3D slikovno tehnologijo za natančno merjenje in analizo drže z virtualno rekonstrukcijo (PAViR) podjetja MGsolutions. Naprava meri nevromišično-skeletne disfunkcije po 10 znanstvenih merilih, 24 telesnih orientacijskih točkah in 87 vrst asimetričnih mišičnih stanj ter jih prikaže v 3D skeletnem modelu.

Na voljo sta statična in dinamična analiza (počep z rokami nad glavo, test ravnotežja na eni nogi) za natančno oceno pacientove drže in nevromišično-skeletne funkcije. Zagotavlja jasne in lahko razumljive rezultate v uporabniku prijaznem formatu.`,
    benefits: [
      'Zgodnje odkrivanje skolioze in asimetrij',
      'Prepoznavanje 87 vrst asimetričnih mišičnih stanj',
      'Natančna 3D digitalna analiza brez sevanja',
      'Personaliziran program vadbe na podlagi rezultatov',
      'Spremljanje napredka skozi čas',
      'Preventiva pred poškodbami kinetične verige',
      'Varno za otroke in odrasle',
      'Objektivna in natančna meritev po 10 znanstvenih merilih'
    ],
    indications: [
      'Bolečine v križu in vratu',
      'Sum na skoliozo ali kifozo',
      'Mišična neravnovesja pri športnikih',
      'Preventivni pregledi za otroke v razvoju',
      'Slabša telesna drža',
      'Poškodbe kinetične verige',
      'Asimetrija ramen ali medenice',
      'Statične in dinamične disfunkcije'
    ],
    contraindications: [
      'Ni znanih kontraindikacij (naprava je neinvazivna)'
    ],
    price: 120,
    duration: 30
  },
  'elektrostimulacija': {
    slug: 'elektrostimulacija',
    name: 'Elektrostimulacija',
    shortDescription: 'Fizikalna terapija z električnimi impulzi za zmanjšanje bolečin in krepitev mišic.',
    longDescription: `Elektrostimulacijska terapija je vrsta fizikalne terapije, ki s pomočjo električnega toka in električnih impulzov zmanjšuje bolečine, pospešuje celični metabolizem in hitrejše celjenje. Električni impulzi preko elektrod na koži prehajajo globlje v tkivo.

Poznamo dve vrsti elektrostimulacije: TENS (za zdravljenje bolečine) in FES (za zdravljenje oslabljenih mišic). TENS stimulira senzorična živčna vlakna in zmanjšuje bolečino, medtem ko FES draži živčno-mišična vlakna in izvablja mišične kontrakcije za krepitev mišic.

Zdravljenje s TENS-om lahko traja vse dokler se bolečina ne zmanjša ali izgine. Zdravljenje s FES-om je odvisno od cilja; za izboljšanje mišične vzdržljivosti je povprečen čas do 6 tednov, za sprostitev po vadbi pa zadostuje že ena terapija.`,
    howItWorks: `TENS (Transkutana električna živčna stimulacija) uporablja nizkofrekvenčne električne tokove, ki stimulirajo senzorična živčna vlakna po principu "teorije vrat". FES (Funkcionalna električna stimulacija) s pomočjo električnih impulzov draži živčno-mišična vlakna in izvablja mišične kontrakcije. To spodbuja celični metabolizem in hitrejše celjenje.`,
    benefits: [
      'Takojšnje zmanjšanje bolečine',
      'Mišične kontrakcije za krepitev mišic',
      'Pospešen celični metabolizem in regeneracija',
      'Sproščanje endorfinov (naravnih zaviralcev bolečine)',
      'Splošna sprostitev telesa',
      'Izboljšana prekrvavitev tkiv',
      'Mišična rekuperacija',
      'Trening mišične moči in vzdržljivosti'
    ],
    indications: [
      'Mišične in sklepne bolečine',
      'Atrofirane mišice (po operacijah ali poškodbah)',
      'Mišične lezije in krči',
      'Zmanjšan obseg gibljivosti',
      'Sindrom težkih nog',
      'Patelofemoralni sindrom',
      'Nestabilnost sklepov (nestabilna rama, gleženj)',
      'Postoperativna rehabilitacijska stanja',
      'Bolezen mišične distrofije',
      'Venska in arterijska insuficienca',
      'Hemiplegično stopalo in rama',
      'Spastičnost udov',
      'Inkontinenca'
    ],
    contraindications: [
      'Organske okvare srca (aritmija)',
      'Srčni spodbujevalnik ali defibrilator',
      'Nosečnost',
      'Kovinski implanti v predelu aplikacije',
      'Maligna obolenja (rakava obolenja)',
      'Akutna vnetja in infekcije (febrilna stanja)',
      'Motnje senzorike kože',
      'Motnje strjevanja krvi',
      'Krvni strdki (tveganje za pljučno embolijo)',
      'Akutne krvavitve',
      'Izpahi'
    ],
    price: 20,
    duration: 20
  },
  'magnetna-terapija': {
    slug: 'magnetna-terapija',
    name: 'Magnetna Terapija',
    shortDescription: 'Neinvazivna terapija z magnetnimi polji za regeneracijo in lajšanje bolečin.',
    longDescription: `Magnetna terapija je neinvazivna metoda zdravljenja, ki z uporabo pulzirajočih elektromagnetnih polj deluje protibolečinsko, protivnetno in regeneracijsko. Magnetna polja povečujejo količino kisika v celicah in pospešujejo celično regeneracijo.

Srednje-frekvenčna magnetna polja prehajajo skozi celotno telo in vplivajo na vse celice, kar izboljšuje metabolizem in prekrvavitev. Terapija spodbuja celično regeneracijo in aktivira tvorbo novih krvnih žil, kar je ključno za celjenje poškodb.`,
    howItWorks: `Magnetna polja nizkih in srednjih frekvenc prodirajo skozi telo in delujejo na celične membrane. Povečujejo prepustnost celic, kar omogoča boljši vnos kisika in hranil ter hitrejše odstranjevanje toksinov. To aktivira naravne procese regeneracije tkiv in limfno drenažo.`,
    benefits: [
      'Zmanjšanje bolečine in vnetij',
      'Izboljšana mikrocirkulacija krvi in limfe',
      'Povečana oksigenacija celic',
      'Pospešena regeneracija mehkih tkiv in kosti',
      'Krepitev imunskega sistema',
      'Izboljšan metabolizem',
      'Aktivacija tvorbe novih krvnih žil'
    ],
    indications: [
      'Kronične bolečine in vnetna stanja',
      'Kronične bolečine v hrbtenici in sklepih',
      'Poškodbe mišic, tetiv in ligamentov',
      'Artritis in revmatizem',
      'Osteoporoza (pospešuje mineralizacijo kosti)',
      'Postoperativna stanja in zvini',
      'Nevralgije in migrene',
      'Lom kosti (pospešuje celjenje)',
      'Športne poškodbe'
    ],
    contraindications: [
      'Srčni spodbujevalnik (pacemaker)',
      'Nosečnost',
      'Krvavitve (aktivne krvavitve)',
      'Hipotenzija (nizek krvni tlak)',
      'Maligna obolenja',
      'Tuberkuloza',
      'Akutne infekcije'
    ],
    price: 30,
    duration: 20
  },
  'laserska-terapija': {
    slug: 'laserska-terapija',
    name: 'Laserska Terapija',
    shortDescription: 'Neinvazivna metoda z laserskimi žarki za pospešitev celjenja.',
    longDescription: `Laserska terapija je neinvazivna metoda zdravljenja, ki s pomočjo laserskih svetlobnih žarkov stimulira človeško tkivo za pospešitev celjenja, zmanjševanje bolečine ter pospeševanje regeneracije. Metoda je popolnoma neboleča in varna.

Laserska svetloba prodre globoko v tkivo in sproži biokemične reakcije na celični ravni. Povečuje prepustnost celične membrane in spodbuja regeneracijo poškodovanih celic.`,
    howItWorks: `Laserski žarki v celicah (v mitohondrijih) spodbudijo tvorbo adenozin trifosfata (ATP), ki je glavni vir energije za celice. Ta energija se porabi za hitrejšo delitev celic in regeneracijo tkiva, zmanjšanje vnetnih procesov in hitrejše celjenje ran.`,
    benefits: [
      'Hitro zmanjšanje bolečine in vnetja',
      'Pospešeno celjenje ran in brazgotin',
      'Regeneracija mehkih tkiv (mišice, ligamenti)',
      'Zmanjšanje oteklin in edemov',
      'Izboljšana mikrocirkulacija',
      'Spodbujanje delovanja imunskega sistema',
      'Povečana celična presnova'
    ],
    indications: [
      'Akutne in kronične bolečine',
      'Športne poškodbe (zvini, natrganine)',
      'Vnetja tetiv (tendinitis, epikondilitis)',
      'Artritis in revmatična obolenja',
      'Razjede na koži in rane',
      'Postoperativne brazgotine',
      'Bolečine v hrbtenici'
    ],
    contraindications: [
      'Oči (direktno obsevanje - nevarnost poškodbe mrežnice)',
      'Maligna obolenja (področje tumorja)',
      'Področje ščitnice',
      'Nosečnost (predel trebuha)',
      'Epilepsija',
      'Fotosenzibilnost kože'
    ],
    price: 10,
    duration: 10
  },
  'manualna-terapija': {
    slug: 'manualna-terapija',
    name: 'Manualna Terapija',
    shortDescription: 'Strokovne ročne tehnike za sproščanje napetosti in izboljšanje gibljivosti.',
    longDescription: `Manualna terapija je strokovna tehnika, pri kateri terapevt z rokami obvladuje, sprošča in mobilizira mišice, sklepe in mehka tkiva. Primerna za vse vrste mišično-skeletnih težav. V ORI 369 jo kombiniramo z naprednimi tehnologijami.

Z raztegovanjem tkiva, mobilizacije in manipulacije se poveča obseg gibanja in fleksibilnost. S pomočjo manualne terapije se obnovi ali izboljša funkcija prizadetega dela telesa, kar je ključno pri rehabilitaciji po poškodbah ali operacijah.

Trajanje zdravljenja je odvisno od vrste in resnosti poškodbe. Pri akutnih stanjih se izboljšanje pojavi hitro (3-6 terapij), pri kroničnih pa lahko traja dlje.`,
    howItWorks: `Manualna terapija deluje na več ravneh:
• Mehanski učinek: Mobilizacija in manipulacija sklepov ter raztegovanje mehkih tkiv.
• Nevrološki učinek: Zmanjševanje bolečinskih dražljajev preko živčnega sistema.
• Biokemični učinek: Zmanjševanje vnetnih procesov in izboljšanje presnove.`,
    benefits: [
      'Sproščanje mišične napetosti',
      'Izboljšanje gibljivosti sklepov',
      'Zmanjšanje bolečine',
      'Obnova funkcije prizadetega dela telesa',
      'Izboljšanje mišičnega ravnovesja',
      'Zmanjšanje stresa in sprostitev telesa',
      'Povečana stabilnost'
    ],
    indications: [
      'Mišično – skeletne bolečine',
      'Mišične napetosti',
      'Poškodbe mehkih tkiv',
      'Zmanjšan obseg giba v sklepu',
      'Artritična stanja',
      'Športne poškodbe',
      'Rehabilitacija po in pred operacijo',
      'Telesne asimetrije',
      'Glavoboli',
      'Bolečine v hrbtenici'
    ],
    contraindications: [
      'Hude poškodbe hrbtenice (zlomi)',
      'Akutni zlomi',
      'Akutne nevrološke motnje (npr. akutna možganska kap)',
      'Kostne okužbe (septični artritis)',
      'Nezdravljena hipertenzija',
      'Akutna vnetja',
      'Tumorji',
      'Huda bolečina, ki se poslabša z gibanjem',
      'Motnje strjevanja krvi'
    ],
    price: 30,
    duration: 20
  },
  'mis': {
    slug: 'mis',
    name: 'MIS - Magnetna Indukcijska Stimulacija',
    shortDescription: 'Revolucionarna terapija z magnetnim poljem visoke intenzivnosti.',
    longDescription: `Magnetna indukcijska stimulacija (MIS) je revolucionarna terapija, ki z inovativnim pristopom zagotavlja izjemne rezultate. Nezdrave celice napolni in stimulira z izboljšano oksigenacijo in cirkulacijo ter jim povrne normalno delovanje.

S svojim edinstvenim ekscitativnim učinkom se MIS bistveno razlikuje od tradicionalnih terapij, saj uporablja pulzirajoče magnetno polje visoke intenzivnosti. Postopek je neinvaziven in neboleč.`,
    howItWorks: `Jakosti magnetnega polja ustvarjajo električne tokove v nevronih, kar omogoča globoko mišično stimulacijo. Ko elektromagnetni tok doseže določeno vrednost, se sproži akcijski potencial, ki povzroči krčenje mišic in spodbuja regeneracijo. To vodi do nastajanja novih krvnih žil in izboljšane prekrvavitve.`,
    benefits: [
      'Hiter in dolgotrajen zdravilni učinek',
      'Neboleč in neinvaziven postopek',
      'Globoka mišična stimulacija',
      'Izboljšana oksigenacija in cirkulacija',
      'Zmanjšanje toksinov in vnetij',
      'Funkcionalna optimizacija telesa',
      'Učinkovitost pri kroničnih stanjih'
    ],
    indications: [
      'Kronična bolečinska stanja',
      'Plantarna fasciitis',
      'Tendonitis in tendinopatije',
      'Športne poškodbe',
      'Mišična regeneracija in atrofija',
      'Bolečine v hrbtu in sklepih',
      'Široko področje patologij'
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
    longDescription: `Dry needling je invazivna fizioterapevtska metoda, ki s penetracijo tankih igel stimulira tkivo in sproža proces celjenja. Igla se vstavi neposredno v prožilno točko (mišični vozel) za sproščanje kronične napetosti. V ORI 369 to metodo izvajamo strokovno in varno, z uporabo sterilnih igel za enkratno uporabo.

Učinkovitost metode dry needling je bila preučena v številnih kliničnih študijah. Študija (Gattie in sodelavci, 2017) je pokazala, da dry needling v kombinaciji z drugimi fizioterapevtskimi metodami zmanjšuje bolečino in izboljšuje funkcijo pri bolnikih z mišično-skeletnimi težavami.`,
    howItWorks: `Igla prodre v mišično tkivo in stimulira prožilno točko. To povzroči refleksno sprostitev mišice (lokalni odziv), povečan lokalni pretok krvi in sproščanje endorfinov. Metoda deluje neposredno na izvor bolečine v mišici in spodbuja naravne regenerativne procese.`,
    benefits: [
      'Sproščanje kroničnih mišičnih vozlov (prožilnih točk)',
      'Takojšnje zmanjšanje bolečine',
      'Povečana gibljivost in fleksibilnost',
      'Izboljšana funkcija mišic',
      'Zmanjšanje vnetnih procesov',
      'Dolgotrajna učinkovitost pri kroničnih stanjih',
      'Hitrejša regeneracija po športnih naporih'
    ],
    indications: [
      'Kronične mišične bolečine',
      'Miofascialni bolečinski sindrom',
      'Napetostni glavoboli',
      'Bolečine v vratu, ramenih in hrbtu',
      'Športne poškodbe',
      'Triger točke',
      'Bolečine v sklepih',
      'Teniški komolec'
    ],
    contraindications: [
      'Motnje strjevanja krvi',
      'Jemanje antikoagulantov (zdravil proti strjevanju krvi)',
      'Lokalna okužba kože',
      'Nosečnost (določena področja)',
      'Strah pred iglami',
      'Maligna obolenja',
      'Akutni zlomi',
      'Hudi hematomi'
    ],
    price: 30,
    duration: 30
  },
  'media-taping': {
    slug: 'media-taping',
    name: 'Medi Taping',
    shortDescription: 'Elastični trakovi za podporo mišicam in zmanjšanje bolečin.',
    longDescription: `Medi taping je metoda zdravljenja z aplikacijo samolepilnih elastičnih trakov na kožo za odpravljanje bolečin, oteklin in podporo mišicam. Trakovi posnemajo elastičnost kože in omogočajo normalno gibanje, hkrati pa nudijo terapevtski učinek 24 ur na dan.

Fizični učinek dosežemo s kompresijo ali dekompresijo, kar vpliva na fascijo in limfni sistem. Nevrološki učinek pa vpliva na zaznavanje bolečine na nivoju fascije, ligamentov in kože.`,
    howItWorks: `Elastični trakovi rahlo dvignejo kožo in ustvarijo prostor med kožo in mišičnim tkivom. To izboljša cirkulacijo krvi in limfe, kar pospešuje odvajanje odpadnih snovi in zmanjšuje pritisk na bolečinske receptorje. Aplikacija se prilagodi stanju (tehnika kompresije ali dekompresije).`,
    benefits: [
      'Zmanjšanje bolečine in oteklin',
      'Podpora mišicam, sklepom in ligamentom',
      'Izboljšana koordinacija in stabilnost',
      'Nudi preventivo pred poškodbami',
      'Zmanjšuje menstrualne bolečine',
      'Omogoča normalno gibanje med rehabilitacijo',
      'Izboljšuje tonus in videz kože'
    ],
    indications: [
      'Športne poškodbe (zvini, raztrganine, kontuzije)',
      'Mišične napetosti in bolečine',
      'Otekline in limfedemi',
      'Bolečine v sklepih (npr. artroza kolena, poškodba meniskusa)',
      'Vnetja tetiv (ahilova tetiva, teniški komolec)',
      'Glavoboli',
      'Preventiva pri športnih aktivnostih',
      'Zmanjšana gibljivost (kalcinacije)',
      'Obolenja živčnega sistema'
    ],
    contraindications: [
      'Alergija na lepilo traku',
      'Odprte rane ali krastasta koža',
      'Globoka venska tromboza',
      'Maligna obolenja na mestu aplikacije',
      'Zelo občutljiva ali vneta koža',
      'Diabetes (previdnost)',
      'Bolezni ledvic, srca in ožilja',
      'Transplantacija organov'
    ],
    price: 10,
    duration: 15
  },
  'ao-scan': {
    slug: 'ao-scan',
    name: 'AO Scan',
    shortDescription: 'Biorezonančna analiza za merjenje in optimizacijo frekvenc.',
    longDescription: `AO Scan je celovito orodje za merjenje in optimizacijo frekvenc vašega telesa. Vse je energija in frekvenca; ko se frekvence spremenijo iz optimalnega stanja, se lahko pojavijo težave. AO Scan pomaga prepoznati ta neravnovesja.

Program AO Scan Technology komunicira s telesom prek subtilnih biofrekvenc in elektromagnetnih signalov, da prepozna področja, ki so morda v neravnovesju. To je izobraževalno orodje, ki vam pomaga spoznati delovanje vašega telesa. Naprava deluje na principu kvantne fizike in biorezonance, kjer vsaka celica, organ in sistem v telesu oddaja svojo edinstveno frekvenco. Ko so te frekvence v neravnovesju, AO Scan to zazna in ponudi rešitve za ponovno vzpostavitev harmonije.

Naprava meri čustvena stanja, črevesno floro, hormone, toksine, težke kovine, viruse, bakterije in še veliko več. Rezultati so predstavljeni v podrobnih poročilih z barvnimi grafikoni, ki omogočajo enostavno razumevanje trenutnega stanja telesa.`,
    howItWorks: `Tehnologija temelji na principu biorezonance. Naprava skenira frekvence vaših organov, tkiv in sistemov ter jih primerja z optimalnimi vrednostmi iz obsežne baze podatkov.

Z opredelitvijo področij, ki potrebujejo pomoč, nato s povratnimi frekvencami (frekvenčno optimizacijo) pomaga telesu, da se vrne v svoje naravno stanje ravnovesja. Celoten postopek je popolnoma neinvaziven in varen, saj uporablja le subtilne elektromagnetne signale. Skeniranje se izvaja preko posebnih slušalk ali biosenzorjev.`,
    benefits: [
      'Celostna in hitra analiza stanja telesa (več kot 120.000 frekvenc)',
      'Prepoznavanje frekvenčnih neravnovesij v realnem času',
      'Personalizirana poročila in priporočila za optimizacijo',
      'Popolnoma neinvazivna metoda brez sevanja',
      'Podpora pri optimizaciji zdravja in življenjskega sloga',
      'Optimizacija čaker in meridianov',
      'Zaznavanje čustvenih stanj in blokad',
      'Spremljanje učinkovitosti prehranskih dopolnil',
      'Analiza prisotnosti parazitov, virusov in bakterij',
      'Preverjanje vitaminsko-mineralnega statusa'
    ],
    indications: [
      'Preventivna diagnostika in spremljanje zdravja',
      'Kronična utrujenost in pomanjkanje energije',
      'Nepojasnjena zdravstvena stanja in nelagodje',
      'Želja po celostnem razumevanju delovanja lastnega telesa',
      'Optimizacija športnih dosežkov in regeneracije',
      'Čustveno neravnovesje in stres',
      'Preverjanje kompatibilnosti živil in dopolnil',
      'Alergije in intolerance'
    ],
    contraindications: [
      'Srčni spodbujevalnik (pacemaker)',
      'Nosečnost (prvo trimesečje - preventivno)',
      'Epilepsija (posvet s terapevtom)'
    ],
    price: 50,
    duration: 30
  },
  'skalarni-valovi': {
    slug: 'skalarni-valovi',
    name: 'Skalarni Valovi',
    shortDescription: 'Uravnovešanje čaker z zemeljskim elementom in skalarnimi valovi.',
    longDescription: `Scalar Wave Cosmic Communicator Earth Element Edition izkorišča zdravilno energijo zemeljskega elementa z uporabo skalarnih valov. Ta napredna tehnologija spodbuja globoko izkušnjo ravnovesja in harmonije v telesu, umu in duhu.

Naprava oddaja frekvence, ki odmeva z zemeljskim elementom, kar spodbuja občutek ozemljitve, stabilnosti in varnosti. Skalarni valovi so skrbno umerjeni, da zagotovijo čist in močan vir energije, ki deluje onkraj tridimenzionalnega prostora in časa.

Ta terapija je še posebej učinkovita za tiste, ki se počutijo razpršene, pod stresom ali nepovezane s svojim telesom. Skalarni valovi pomagajo pri restrukturiranju celične vode in izboljšanju medcelične komunikacije. Pomagajo pri odstranjevanju energijskih blokad in povečujejo splošno vitalnost telesa.`,
    howItWorks: `Naprava z dvema močnima Rodinovim navitjema oddaja močno energetsko polje skalarnih valov. Rodinovi oddajniki povečajo frekvenco skalarnih valov in okrepijo njihove učinke, saj ustvarjajo torzijsko polje.

Ti valovi prodrejo globoko v tkiva, kjer spodbujajo celično regeneracijo in izboljšujejo pretok energije skozi čakre in energetske kanale. Za razliko od navadnih elektromagnetnih valov, skalarni valovi ne izgubljajo moči z razdaljo in lahko prodrejo skozi kateri koli material. Skalarni valovi so informacijski valovi, ki delujejo neposredno na nivoju DNK.`,
    benefits: [
      'Globoka ozemljitev in stabilnost',
      'Energijsko uravnoteženje čaker in aure',
      'Zmanjševanje kroničnega stresa in anksioznosti',
      'Spodbujanje duhovne rasti in intuitivne jasnosti',
      'Harmonizacija telesa, uma in duha',
      'Izboljšano splošno počutje in vitalnost',
      'Povečana odpornost na elektromagnetni smog (EMF)',
      'Izboljšana kvaliteta spanca',
      'Restrukturiranje celične vode',
      'Pospešena celična regeneracija'
    ],
    indications: [
      'Stres, anksioznost in mentalni nemir',
      'Energijsko neravnovesje in blokade',
      'Potreba po ozemljitvi in notranji stabilnosti',
      'Podpora pri meditaciji in duhovni praksi',
      'Čustvena nihanja in izgorelost',
      'Slaba regeneracija po bolezni',
      'Občutljivost na okoljske frekvence',
      'Kronična utrujenost'
    ],
    contraindications: [
      'Srčni spodbujevalnik (pacemaker)',
      'Akutne psihoze',
      'Epilepsija'
    ],
    price: 35,
    duration: 30
  },
  'iteracare': {
    slug: 'iteracare',
    name: 'iTeraCare',
    shortDescription: 'Teraherčna terapija za globinsko regeneracijo in harmonizacijo.',
    longDescription: `iTeraCare prinaša terapevtsko revolucijo s teraherčnimi valovi, ki lahko bistveno izboljšajo zdravje in kakovost življenja. S pomočjo terahertz valov, svetlobne vibracije in delovanjem globoko v telo vnese novo frekvenco, ki spodbuja celično regeneracijo.

Teraherčni valovi prodrejo globoko v tkiva (do 20-30 cm), kjer spodbujajo pretok energije, izboljšajo prekrvavitev in pospešijo celjenje. Naprava cilja na specifična področja telesa in prinaša ciljno terapijo neposredno v globoka tkiva, kar spodbuja samoobnovo telesa. To stimulira proizvodnjo novih, zdravih matičnih celic v kostnem mozgu.

Posebnost iTeraCare je tudi možnost energitiziranja vode. Redno pitje vode TeraHertz pomaga povečati aktivnost celic, zmanjšati viskoznost krvi, uničuje proste radikale in pomaga pri razstrupljanju telesa. Voda postane "živa", mehka in lažje prehaja skozi celične membrane.`,
    howItWorks: `Teraherz elektromagnetni val deluje v frekvenčnem pasu normalnih, zdravih celic (med infrardečo in mikrovalovno svetlobo). Ko valovi prodrejo v telo, resonirajo z našimi celicami in jih aktivirajo na nivoju jedra.

Hkrati svetloba vstopa direktno v visceralni predel, doseže kostni mozeg in globinsko odstranjuje energetske blokade ter hlad in vlago iz telesa. To stimulira proizvodnjo novih, zdravih matičnih celic in pospešuje mikrocirkulacijo. Naprava uporablja tudi optični kvarc za filtriranje in krepitev valov.`,
    benefits: [
      'Protibolečinsko in protivnetno delovanje',
      'Izboljšana mikrocirkulacija in limfni pretok',
      'Globinska celična regeneracija in reparacija',
      'Odstranjevanje toksinov in odvečne vlage (hladu)',
      'Podpora imunskemu sistemu na celičnem nivoju',
      'Zmanjševanje stresa in energetska harmonizacija',
      'Aktivacija spečih matičnih celic v kostnem mozgu',
      'Uravnavanje delovanja endokrinih žlez',
      'Energiziranje vode za boljšo hidracijo in zdravje',
      'Zmanjšanje viskoznosti krvi'
    ],
    indications: [
      'Kronične bolečine (hrbet, kolena, sklepi)',
      'Kronična vnetna stanja in revmatizem',
      'Oslabljen imunski sistem in utrujenost',
      'Alergije in različne kožne težave',
      'Stres, mentalna izčrpanost in blokade',
      'Splošno slabo počutje in nizka vitalnost',
      'Poškodbe mehkih tkiv in počasno celjenje',
      'Problemi s cirkulacijo',
      'Potreba po razstrupljanju'
    ],
    contraindications: [
      'Kovinski implanti (direktna aplikacija čez njih)',
      'Srčni spodbujevalnik (pacemaker)',
      'Nosečnost',
      'Aktivne krvavitve',
      'Akutne infekcije z visoko vročino',
      'Maligna obolenja',
      'Posamezniki s prirojenimi srčnimi napakami'
    ],
    price: 20,
    duration: 20
  }
};

export const teamData: TeamMember[] = [
  {
    name: 'Jernej Babij',
    title: 'Ustanovitelj in terapevt',
    role: 'founder',
    bio: 'Ustanovitelj Inštituta ŠNUK (Šport, Narava, Umetnost, Kultura) in centra ORI 369.',
    longBio: `Pozdravljeni, moje ime je Jernej Babij, ustanovitelj Inštituta ŠNUK (Šport, Narava, Umetnost, Kultura), kjer podjetnikom, vodstvenemu kadru in širši javnosti ponujam usmerjanje, izobraževanje in usposabljanje o brezplačnih orodjih za izboljšanje splošnega počutja, psihičnega in fizičnega zdravja. Preko inštituta organiziram različne dogodke, kot so ledene kopeli, dihalne vaje, gibanje, zvočne terapije ter večdnevne odmike v naravi (www.wolfpack.si). Moje poslanstvo je, da ljudem ponudim praktične metode in doživetja, ki jih ponovno povežejo z njihovo pravo naravo in naravnim okoljem.

Pred približno desetimi leti sem se soočil z resno poškodbo, ki je nastala zaradi prekomernega forsiranja in neposlusanja svojega telesa. Ne samo fizično tudi mentalno sem večkrat zaznal, da um ki prosto skače in se vrti ne služi ampak lahko močno blokira telo in duha. To obdobje je postalo moja pomembna življenjska prelomnica, saj sem bil prisiljen raziskati, kako ponovno vzpostaviti ravnovesje v telesu. Začel sem preizkušati številne tehnike samoregulacije, da bi pomiril živčni sistem in prekinil nenehen odziv boja, bega ali zamrznitve, ki povečuje bolečino in zmanjšuje gibljivost.

Moje raziskovanje me je vodilo skozi številne projekte, in vmes sem odprl tudi trgovino s športnimi dodatki, saj sem ves čas iskal, kako telo in um lahko delujeta bolj optimalno. Na tej poti pa sem doumel, da je ključno najprej obvladati osnove – dih, dotik, gibanje, pitje čiste informirane vode, način, kako in kaj jemo, predvsem lokalno in nepredelano hrano – saj so to temelji našega dobrega počutja in zdravja. Šele ko so osnove obvladane, imajo dodatki smisel, saj takrat telesu resnično lahko služijo kot podpora in ne kot nadomestek.

Med drugim sem začel izvajati tudi ekspedicije v naravo in dogodke ledenih potopov. Ti dogodki niso namenjeni zgolj potapljanju v mrzlo vodo; gre za vzpostavitev globljega stika z lastnim telesom in odstranjevanje omejujočih prepričanj, ki jih ustvarja um. Ledene kopeli namreč omogočajo, da stopimo iz cone udobja, presežemo mentalne blokade in odkrijemo nove razsežnosti notranje moči in prisotnosti.

V procesu raziskovanja sem vse bolj spoznaval, kako naravni pristopi in skrb za miselno ter fizično higieno omogočajo večjo umirjenost ter prisotnost v trenutku. Moje raziskovanje me je vodilo v naravo, kjer sem doživel, kako močno narava s svojimi frekvencami pomirja in vrača v ravnovesje. Ugotovil sem, da je potrebno ne le skrbeti za telesno higieno, temveč tudi za mentalno: odstranjevati miselno in fizično navlako, ki smo jo skozi leta nabrali, saj ta navlaka ovira delovanje našega uma in telesa. To je kot računalnik z odprtimi zavihki – četudi naloge ne izvajamo aktivno, še vedno trošijo procesorsko moč in omejujejo našo učinkovitost.

Moja pot me je vodila tudi k ustanovitvi JB fit d.o.o., kjer se ukvarjam z oddajanjem nepremičnin, svetovanjem in usposabljanjem. V zadnjem času pa sem vso svojo energijo in strokovnost usmeril v razvoj in izvajanje sistema REVIVE, ki je namenjen celostnemu zdravju in dobremu počutju.

Verjamem, da je raziskovanje teh naravnih pristopov, učenje ter prenos tega znanja na druge pomembno, saj živimo v dobi, kjer smo preplavljeni z informacijami in včasih nimamo prostora za predah. Zaradi tega postaja naše živčevje preobremenjeno, mi pa vse bolj nevrotični. Tu nastopi vloga centra ORI 369, kjer lahko posamezniki sredi urbanega okolja najdejo prostor, ki jih znova poveže z naravo, omogoči notranji mir in vrnitev k sebi.

Vizija centra ORI 369:

Moj najnovejši cilj v centru ORI 369 je ljudem ponuditi trenutek oddiha, priložnost za vrnitev k sebi in vzpostavitev globoke povezanosti s samim seboj. S tem namenom želim ustvariti prostor, kjer bodo ljudje ob medsebojnem razumevanju in podpori našli stik s svojim notranjim jazom. Moje poslanstvo je izboljševanje splošnega počutja in kakovosti življenja, ki ga dosežem s pomočjo gibanja, dihanja, mrzle vode, narave, simbolov, frekvenc ter moderne tehnologije, ki ljudem omogoča, da se ponovno povežejo s sabo.`,
    qualifications: ['Ustanovitelj Inštituta ŠNUK', 'Izkušnje z ekspedicijami v naravo', 'Specialist za ledene kopeli', 'Dihalne tehnike', 'Energijske terapije', 'Vodja ekspedicij', 'Certificiran terapevt'],
    specializations: ['Celostni pristop k zdravljenju', 'Ledene terapije', 'Dihalne vaje', 'Gibanje v naravi', 'Zvočne terapije', 'Sistem REVIVE'],
    phone: '00386 51 302 206'
  },
  {
    name: 'Evgen Valek M.D.(M.A.)',
    title: 'Alternativni zdravnik in šaman',
    role: 'therapist',
    bio: 'Alternativni zdravnik z diplomo M.D.(M.A.) in Ifa Babalav (šaman).',
    longBio: `Živel sem mladostniško življenje, ki ni bilo glih posuto z rožicami. Bil sem vagabund in z svojim malim kolesom dosegel marsikatero destinacijo vsa oklica me je poznala. Dokaj hitro sem se seznanil z cigareti, alkoholom, lahko drogo. Prihajam iz turističnega kraja – Podčetrtek, kjer sem tudi začel s svojo bogato kariero, ki se je začela zelo zgodaj. Že pri 15 letih sem pričel delati kot natakar in animator. Tri leta kasneje, pa sem se tudi preizkusil kot reševalec iz vode.

V tem času sem ugotovil, da imam sposobnost pomagati ljudem. To me je vodilo k temu, da sem opravil tečaj za maserja, Reiki mojstra, Karuna gautama mojstra itd. A zavedal sem se, da je potrebno še veliko več za učinkovito pomoč. Zato sem po napornem iskanju in temeljitem pogovoru z samim sabo našel študij za alternativne medicinde na Šri Lanki. Z mojo novo pridobljeno diplomo (M.D.M.A), sem lahko bolj suvereno stopil na svojo samostojno pot, ki sem jo nekaj let nadaljeval kot direktor svojega s.p.-ja. V termah Olimia sem odprl svojo prvo poslovno enoto in pričel z izvajanjem terapij, predavanji. Vozil sem goste na energetske točke in ustvarjal delavnice z lokalnimi zeliščarji. Tedanje vodstvo term Olimia me je povabilo k sodelovanju v Wellness centru, kjer sem ustvaril svoj lasten alternativni kotiček z različnimi terapijami. Odprli smo tudi prvi Hamam v Sloveniji in seveda sem bil prvi Hamam terapevt. Bil sem tudi asistent pri hoji po žerjavici, ki jo je izvajal Ladislav Medvešček pri njem sem se tudi seznanil z različnimi oblikami alternativnih tehnik zdravljenja. Tako me je pot popeljala v Južno Ameriko, kjer sem, kot najmlajši član prve Slovenske ekipe odšel na študij IFA. In leta 2006 končal, ter postal Ifa Babalav (Šaman).

Kot že vsi vemo, se je potrebno ves čas izpopolnjevati in ker se sem na terapevtskem področju dokaj dobro izuril, sem želel svoje izkušnje in potenciale uporabiti tudi na področju vodenja wellness centra. Da sem lahko uspešen tudi na tem področju, sem uspel dokazati, z zaposlitvijo v wellnessih v Sloveniji in zunaj(Harmonija, Costa Pacifica, Grand hotel Donat). ravno v takšnem obdobju, ko je bilo potrebno narediti neke razvojne premike. V veselje mi je bilo delati na takšnem delovnem mestu, saj je moja organiziranost, discipliniranost, razsodnost, samoiniciativnost, ambicioznost…, lahko prišla do izraza. Tako sem vsakem izmed omenjenih Wellnessov dodal nekaj koristnih novih vidikov, kateri so jim dvignili kakovost. Leta 2009 sem sodeloval v tekmovanju naj wellnes Slovenija, kjer sem z svojo ekipo dosegel 2 mesto. Leta 2009 so me povabili, k sodelovanju z boksarsko zvezo Slovenije in sem se istega leta udeležil svetovnega prvenstva, kot zdravnik M.D.(M.A.) v Milanu. Nemirni duh in želja po iskanju nečesa, znanja, moči, dokazovanja me je vodila naprej 2010 sem odšel v Ameriko, kjer sem obiskal indijanske rezervate in se pri šamanih izobraževal v različnih ritualih. 2013 sem odšel delat na luksuzno ladjo Costa Pacifica. Od tam me je pot zanesla v Južno Ameriko, kjer sem se med drugim seznanil z Kulturo Majev. Nato v Novo Zelandijo, kjer sem delal v kliniki za kiropraktiko in se izobraževal o kulturi Maurov in se spoznaval z njihovo bogato kulturo, ritualih. Ustavil sem se še v Avstraliji obiskal tamkajšnje staroselce Aboridžine in se tudi od njih kaj naučil. Po miru, ki sem ga začutil v sebi in spoznanju, da vse, kar iščem je v meni in že vse imam, sem se odpravil v Maribor, ker sem deloval v Fizioterapiji Reha.

Prišel je čas, da si izpolnim novo željo, pridobim izkušnjo, zato sem pričel z delom varnostnika pri BBR-ju. Delal sem v lokalih, objektih. Ker me je zanimalo delo varnostnika z orožjem sem se zaposlil v Aktiva varovanju. Tedanje vodstvo je v meni videlo velik potencijal in mi omogočilo napredovanje. Zelo hitro sem postal vodja, ter varnostni menedžer na področju intervencije. Postal sem tudi glavni inštuktor za strokovno usposabljanje varnostnega osebja za nošenje orožja in predavatelj v programu nacionalne poklicne kvalifikacije za varnostnike. Ker sem potreboval nove izzive sem se zaposlil v Perutnini Ptuj, kot specialist za fizično varovanje.

Sedaj pa sem tukaj, ponovno med vami. Notranji mir mi ne, da miru. Zato sem se odločil, da bom svoje znanje in izkušnje delil z vami. V eni izmed mojih inicijacij sem dobil poslanstvo, da moram odpreti oči tistim, ki ne vidijo, dvignit tiste, ki so padli, da se zavedo svojega bistva, svojega telesa, svoje okolice in sprejmejo sebe kot popolno kreacijo univerzuma.

Veselim se srečanja z vami, po svojih najboljših močeh vam bom pomagal poiskati odgovore, da boste bolje razumeli svoje zdravstveno stanje in dobili napotke, kako lahko bolj zdravo, suvereno, samozavestno, usmerjeno stopate po poti vašega življenja.

Samo vi ste kreator vaših mislih in samo vi lahko igrate glavno vlogo v vašem filmu in samo od vas je odvisno kakšen bo zaključek vaše kreativnosti.`,
    qualifications: ['M.D.(M.A.) - Alternativna medicina', 'Ifa Babalav (šaman)', 'Reiki mojster', 'Karuna Gautama mojster', 'Certificiran maser', 'Hamam terapevt', 'Reševalec iz vode'],
    specializations: ['Alternativna medicina', 'Šamanske tehnike', 'Energijsko zdravljenje', 'Celostna terapija', 'Meditacija in dihalne tehnike', 'Wellnes vodenje'],
    phone: '00386 41 458 931'
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
