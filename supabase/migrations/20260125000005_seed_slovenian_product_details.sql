-- Seed comprehensive Slovenian product data with ingredients, usage, warnings
-- This updates existing products with full Slovenian content

-- Update 4Endurance products with Slovenian details
UPDATE public.shop_products SET
  name_sl = '4Endurance Pro Absolute 84 kapsul',
  short_description_sl = 'Močan VO2 max booster na osnovi adaptogenov in beta-alanina za daljšo vzdržljivost.',
  description_sl = 'Absolute je visoko učinkovit dodatek, zasnovan za povečanje VO2 max, moči in vzdržljivosti. Pomaga vzdržljivostnim športnikom hitreje izboljšati zmogljivost in doseči višji VO2 max, kot ga omogoča samo trening. Formuliran z visoko učinkovitimi adaptogeni in beta-alaninom izboljšuje učinkovitost kisika, pospešuje pretok krvi in zmanjšuje mišično acidozo.',
  ingredients_sl = 'Beta-alanin 1500 mg, Cordyceps micelij ekstrakt 800 mg (od tega cordyceps kisline 56 mg, polisaharidi 80 mg), ATPro Matrix 500 mg, Ashwagandha koreninski ekstrakt 150 mg, Rhodiola koreninski ekstrakt 150 mg, Senactiv 50 mg, Krom 200 µg. Prehransko dopolnilo. Sestavine: beta-alanin, cordyceps micelij ekstrakt, ATPro Matrix (kalcijev piruvat, natrijeve soli ortofosforne kisline, riboza), ashwagandha koreninski ekstrakt, rhodiola koreninski ekstrakt, sredstvo proti sprijemanju: magnezijeve soli maščobnih kislin, Senactiv, krom pikolinat, veganska kapsula.',
  usage_instructions_sl = 'Na dan treninga vzemite 4 kapsule 30 do 45 minut pred vadbo. Na dan počitka vzemite 2 kapsuli zjutraj in 2 kapsuli popoldne. Vrhunec učinka Absolute dosežete 21. dan uporabe, zato ciljajte 21. dan kot dan tekme/dirke ali pomembnega treninga. Po dveh ciklih jemanja izdelka prenehajte za vsaj 3 tedne.',
  warnings_sl = 'OPOZORILO: Uporaba tega izdelka ni priporočljiva za osebe, ki jemljejo beta-blokatorje ali antihipertenzive. V tem primeru se posvetujte z zdravnikom. Uporaba tega izdelka je odsvetovana tudi osebam, ki jemljejo antidepresive, antipsihotike, zdravila za shizofrenijo, bipolarno motnjo in podobna psihiatrična zdravila.',
  nutrition_facts = '[{"name": "Beta-alanin", "amount": "1500 mg", "dv": "*"}, {"name": "Cordyceps micelij ekstrakt", "amount": "800 mg", "dv": "*"}, {"name": "ATPro Matrix", "amount": "500 mg", "dv": "*"}, {"name": "Ashwagandha ekstrakt", "amount": "150 mg", "dv": "*"}, {"name": "Rhodiola ekstrakt", "amount": "150 mg", "dv": "*"}, {"name": "Krom", "amount": "200 µg", "dv": "500%"}]'::jsonb,
  brand = '4Endurance Pro',
  weight = '84 kapsul',
  dosage = '4 kapsule dnevno',
  stock = 25,
  price = 49.99
WHERE slug ILIKE '%absolute%' OR slug ILIKE '%4endurance-pro-absolute%';

UPDATE public.shop_products SET
  name_sl = '4Endurance Pro Adaptogen Fuse 60 kapsul',
  short_description_sl = 'Mešanica visokokakovostnih adaptogenov za povečanje VO2 max, moči in obvladovanje stresa.',
  description_sl = 'Adaptogen Fuse je celostna adaptogenska formula za športnike, ki iščejo vse koristi adaptogenov v enem izdelku. Ta mešanica visokokakovostnih adaptogenov bo povečala vaš VO2 max, izboljšala moč in vzdržljivost ter vam pomagala bolje obvladovati vsakodnevni stres. Vsebuje Ashwagandho, Rhodiolo, Ginseng (sibirski, brazilski, koreninski), Schisandro.',
  ingredients_sl = 'Ashwagandha koreninski ekstrakt 400 mg (od tega withanolidi 28 mg), Sibirski ginseng ekstrakt 100 mg, Schisandra sadežni ekstrakt 100 mg, Rhodiola koreninski ekstrakt 75 mg (od tega rosavini 150 mg), Brazilski ginseng koreninski ekstrakt 75 mg, Ginseng koreninski ekstrakt 40 mg (od tega ginsenozidi 32 mg). Prehransko dopolnilo.',
  usage_instructions_sl = 'Vzemite 2 kapsuli na dan z zadostno količino vode. Po možnosti 1 kapsulo v prvi polovici in 1 kapsulo v drugi polovici dneva. Adaptogeni potrebujejo nalaganje v telesu in nimajo takojšnjega učinka. Prvi vidni rezultati jemanja izdelka so vidni po približno 7-10 dneh. Po treh mesecih jemanja izdelka je priporočljiv 3-4 tedenski odmor.',
  warnings_sl = 'Pozor! Izdelek ni primeren za osebe, ki se zdravijo s pomirjevali, antipsihotiki, zdravili za bipolarno motnjo, antidepresivi in podobnimi psihiatričnimi zdravili.',
  nutrition_facts = '[{"name": "Ashwagandha ekstrakt", "amount": "400 mg", "dv": "*"}, {"name": "Sibirski ginseng", "amount": "100 mg", "dv": "*"}, {"name": "Schisandra ekstrakt", "amount": "100 mg", "dv": "*"}, {"name": "Rhodiola ekstrakt", "amount": "75 mg", "dv": "*"}, {"name": "Brazilski ginseng", "amount": "75 mg", "dv": "*"}, {"name": "Ginseng ekstrakt", "amount": "40 mg", "dv": "*"}]'::jsonb,
  brand = '4Endurance Pro',
  weight = '60 kapsul',
  dosage = '2 kapsuli dnevno',
  stock = 30,
  price = 29.99
WHERE slug ILIKE '%adaptogen-fuse%';

UPDATE public.shop_products SET
  name_sl = '4Endurance Pro Cardio Max 60 kapsul',
  short_description_sl = 'Naravni izdelek za podporo najpomembnejši mišici v vašem telesu – srcu.',
  description_sl = 'Cardio Max 4Endurance Pro zagotavlja vse, kar vaše telo potrebuje za optimalno delovanje kardiovaskularnega in živčnega sistema v enem izdelku. Izdelek temelji na koenzimu Q10, kvercetinu in drugih visokokakovostnih sestavinah za podporo srčni mišici in živčnemu sistemu. Visoka stopnja absorpcije s pomočjo ionofora kvercetina.',
  ingredients_sl = 'Ekstrakt grozdnih pešk (95% OPC) 100 mg, Magnezij (kot oksid in citrat) 75 mg, Koencim Q10 50 mg, Kvercetin 50 mg, Kurkuma ekstrakt 50 mg, Črni česen ekstrakt 25:1 50 mg, Vitamin E 4 mg, Vitamin B1 1,1 mg, Selen 18,33 mg.',
  usage_instructions_sl = 'Vzemite 1 kapsulo dnevno z vodo, po možnosti zjutraj po obroku. Koencim Q10 in vitamin E nista topna v vodi, ampak lipofilna (raztopljena v lipidih), zato jih vedno zaužijte po obroku!',
  warnings_sl = 'POZOR! Ni primerno za osebe, ki jemljejo zdravila proti strjevanju krvi, kot je Varfarin. Jemanje koencima Q10 pri diabetikih lahko zmanjša odpornost tkiv na inzulin, zato se pred uporabo posvetujte z zdravnikom! Ne jemljite tega izdelka, če redno jemljete antacide! Ne jemljite tega izdelka, če jemljete zdravila za znižanje krvnega tlaka!',
  nutrition_facts = '[{"name": "Ekstrakt grozdnih pešk", "amount": "100 mg", "dv": "*"}, {"name": "Magnezij", "amount": "75 mg", "dv": "20%"}, {"name": "Koencim Q10", "amount": "50 mg", "dv": "*"}, {"name": "Kvercetin", "amount": "50 mg", "dv": "*"}, {"name": "Vitamin E", "amount": "4 mg", "dv": "33%"}, {"name": "Vitamin B1", "amount": "1,1 mg", "dv": "100%"}, {"name": "Selen", "amount": "18,33 mg", "dv": "33%"}]'::jsonb,
  brand = '4Endurance Pro',
  weight = '60 kapsul',
  dosage = '1 kapsula dnevno',
  stock = 20,
  price = 49.99
WHERE slug ILIKE '%cardio-max%';

UPDATE public.shop_products SET
  name_sl = '4Endurance Pro Kolagen+ 90 tablet',
  short_description_sl = 'Kolagen vam pomaga pri regeneraciji sklepov in hrustanca ter ohranjanju moči kosti.',
  description_sl = 'Kolagen je telesna beljakovina, ki jo najdemo v koži, hrustancu, vezeh in kosteh. Sprva ga vaše telo proizvaja samo, vendar se njegova proizvodnja s starostjo upočasni. Kolagen+ vključuje vitamin C, ki je bistven za sintezo kolagena. Hidroliziran kolagen v Kolagen+ je razdeljen na majhne delce, imenovane peptidi, ki jih vaše telo lahko absorbira. Hialuronska kislina je bistvena za zdravje hrustanca in sklepov.',
  ingredients_sl = 'Hidroliziran kolagen 2400 mg, Hialuronska kislina 100 mg, Vitamin C 80 mg (100% DPV). Prehransko dopolnilo. Sestavine: sredstvo za povečanje volumna: sorbitol, hidroliziran kolagen, natrijev hijaluronat, sredstvo proti sprijemanju: magnezijev stearat, vitamin C (askorbinska kislina). Lahko vsebuje sledi mleka, soje, oreškov, jajc, zelene, gorčice.',
  usage_instructions_sl = 'Vzemite 4 tablete na dan. Za najboljši učinek vzemite 2 tableti dvakrat na dan po obroku z zadostno količino vode.',
  warnings_sl = 'Ne prekoračite priporočenega dnevnega odmerka. Prehransko dopolnilo ne more nadomestiti uravnotežene in raznovrstne prehrane ter zdravega življenjskega sloga.',
  nutrition_facts = '[{"name": "Hidroliziran kolagen", "amount": "2400 mg", "dv": "*"}, {"name": "Hialuronska kislina", "amount": "100 mg", "dv": "*"}, {"name": "Vitamin C", "amount": "80 mg", "dv": "100%"}]'::jsonb,
  brand = '4Endurance Pro',
  weight = '90 tablet',
  dosage = '4 tablete dnevno',
  stock = 35,
  price = 19.99
WHERE slug ILIKE '%collagen%' OR slug ILIKE '%kolagen%';

-- Update medicinske gobe
UPDATE public.shop_products SET
  name_sl = 'Reishi – Kraljica gob',
  short_description_sl = 'Goba za ravnovesje, imunsko modulacijo in globoko regeneracijo.',
  description_sl = 'Reishi (Ganoderma lucidum) je ena najspoštovanejših zdravilnih gob v tradicionalni kitajski medicini. Znana je po svojih adaptogenih lastnostih, ki pomagajo telesu pri prilagajanju na stres. Podpira imunski sistem, spodbuja kakovosten spanec in pomaga pri vzdrževanju čustvene stabilnosti. Idealna za tiste, ki iščejo globoko regeneracijo in notranje ravnovesje.',
  ingredients_sl = 'Ekstrakt reishi gobe (Ganoderma lucidum), standardiziran na minimum 30% polisaharidov in 2% triterpenov. Veganska kapsula.',
  usage_instructions_sl = 'Vzemite 2 kapsuli dnevno z vodo, po možnosti zjutraj ali zvečer. Za najboljše rezultate uporabljajte vsaj 8 tednov.',
  warnings_sl = 'Posvetujte se z zdravnikom pred uporabo, če jemljete zdravila za redčenje krvi ali imate avtoimunsko bolezen. Ni primerno za nosečnice in doječe matere brez posvetovanja z zdravnikom.',
  stock = 15,
  price = 32.99
WHERE slug ILIKE '%reishi%';

UPDATE public.shop_products SET
  name_sl = 'Lion''s Mane – Možganska moč',
  short_description_sl = 'Goba za fokus, spomin in nevroregeneracijo.',
  description_sl = 'Lion''s Mane (Hericium erinaceus) je edinstvena goba, znana po svojih nevroprotektivnih lastnostih. Raziskave kažejo, da lahko spodbuja proizvodnjo živčnega rastnega faktorja (NGF), ki je ključen za zdravje nevronov. Idealna za študente, profesionalce in vse, ki si želijo izboljšati kognitivne funkcije, fokus in spomin.',
  ingredients_sl = 'Ekstrakt Lion''s Mane gobe (Hericium erinaceus), standardiziran na minimum 30% polisaharidov. Veganska kapsula.',
  usage_instructions_sl = 'Vzemite 2 kapsuli dnevno z vodo. Za kognitivne koristi priporočamo redno uporabo vsaj 4 tedne.',
  warnings_sl = 'Posvetujte se z zdravnikom pred uporabo, če imate alergije na gobe. Ni primerno za nosečnice in doječe matere brez posvetovanja z zdravnikom.',
  stock = 20,
  price = 38.99
WHERE slug ILIKE '%lion%' OR slug ILIKE '%mane%';

UPDATE public.shop_products SET
  name_sl = 'Cordyceps – Energija in vzdržljivost',
  short_description_sl = 'Goba za naravno energijo, vzdržljivost in optimalno dihanje.',
  description_sl = 'Cordyceps (Cordyceps sinensis) je goba, ki tradicionalno velja za močan naravni stimulant energije. Podpira učinkovito izrabo kisika, povečuje vzdržljivost in pomaga pri regeneraciji po fizičnem naporu. Idealna za športnike in aktivne posameznike, ki želijo naravno povečati svojo zmogljivost.',
  ingredients_sl = 'Ekstrakt cordyceps gobe (Cordyceps sinensis), standardiziran na minimum 7% cordyceps kisline in 25% polisaharidov. Veganska kapsula.',
  usage_instructions_sl = 'Vzemite 2 kapsuli dnevno z vodo. Za športne koristi vzemite 30-60 minut pred vadbo.',
  warnings_sl = 'Posvetujte se z zdravnikom pred uporabo, če jemljete imunosupresivna zdravila. Ni primerno za nosečnice in doječe matere brez posvetovanja z zdravnikom.',
  stock = 25,
  price = 35.99
WHERE slug ILIKE '%cordyceps%';

-- Update Homeopatija
UPDATE public.shop_products SET
  name_sl = 'Homeopatske kapljice – Subtilna podpora',
  short_description_sl = 'Tradicionalne homeopatske kapljice za hormonski red in čustveno stabilnost.',
  description_sl = 'Homeopatske kapljice so nežen, a učinkovit način podpore telesu pri vzpostavljanju ravnovesja. Pripravljene po tradicionalnih homeopatskih metodah, te kapljice pomagajo pri hormonskem redu, stresni odpornosti in čustveni stabilnosti. Primerne za občutljive osebe, ki iščejo subtilno podporo.',
  ingredients_sl = 'Homeopatska formula v vodnem mediju. Brez alkohola.',
  usage_instructions_sl = '10 kapljic pod jezik 2-3x dnevno ali po navodilih terapevta.',
  warnings_sl = 'Homeopatija je komplementarna metoda in ne nadomešča konvencionalne medicine. Posvetujte se z zdravnikom v primeru resnih zdravstvenih težav.',
  stock = 30,
  price = 24.99
WHERE slug ILIKE '%homeopatske-kapljice%';

-- Update CBD izdelki
UPDATE public.shop_products SET
  name_sl = 'CBD olja (brez THC) – Premium kakovost',
  short_description_sl = 'Premium CBD olja brez THC, laboratorijsko preverjena.',
  description_sl = 'Naša premium CBD olja je proizvedena lokalno iz certificiranega industrijskega konoplja. Vsebuje polni spekter kanabinoidov brez THC (pod 0,0%), kar zagotavlja vse koristi konoplje brez psihoaktivnih učinkov. Laboratorijsko preverjena za čistost in potentnost. Idealna za podporo pri stresu, spancu in splošnem počutju.',
  ingredients_sl = 'CBD (kanabidiol) iz industrijskega konoplja, MCT olje (srednjeverižni trigliceridi iz kokosovega olja). Brez THC.',
  usage_instructions_sl = 'Začnite z 1-2 kapljicama pod jezik, držite 60 sekund, nato pogoltnite. Postopoma povečujte odmerek po potrebi. Ne prekoračite 70 mg CBD dnevno.',
  warnings_sl = 'Ni primerno za osebe mlajše od 18 let, nosečnice in doječe matere. Posvetujte se z zdravnikom, če jemljete druga zdravila. Ne vozite po uporabi, dokler ne veste, kako CBD vpliva na vas.',
  stock = 40,
  price = 45.99
WHERE slug ILIKE '%cbd-olja%';

-- Update osebno svetovanje
UPDATE public.shop_products SET
  name_sl = 'Osebno svetovanje – Prilagojeni protokoli',
  short_description_sl = 'Individualno svetovanje in personalizirani protokoli za vaše cilje.',
  description_sl = 'Naše osebno svetovanje ponuja celovit pristop k vašemu zdravju in počutju. V okviru posvetovanja analiziramo vaše trenutno stanje, cilje in potrebe ter pripravimo personaliziran protokol, ki vključuje prehransko dopolnjevanje, življenjski slog in terapevtske pristope. Primerno za vse, ki si želijo strokovno vodenje na poti do optimalnega zdravja.',
  usage_instructions_sl = 'Rezervirajte termin preko naše spletne strani ali nas kontaktirajte. Svetovanje traja 60-90 minut.',
  warnings_sl = 'Svetovanje ne nadomešča zdravniške obravnave. V primeru zdravstvenih težav se vedno posvetujte z zdravnikom.',
  stock = 100,
  price = 0
WHERE slug ILIKE '%svetovanje%' OR slug ILIKE '%osebno%';

-- Ensure all products have active status and some default stock
UPDATE public.shop_products 
SET 
  stock = COALESCE(NULLIF(stock, 0), 10),
  active = true
WHERE active = true AND stock = 0;

-- Update categories with Slovenian names
UPDATE public.shop_categories SET
  name_sl = '4Endurance / Nduranz Pro',
  description_sl = 'Najmočnejše formule za energijo, vzdržljivost, hormonsko ravnovesje in optimalno delovanje telesa.'
WHERE slug = '4endurance-nduranz-pro';

UPDATE public.shop_categories SET
  name_sl = 'Medicinske gobe',
  description_sl = 'Moč funkcionalnih gob za imunsko stabilnost, fokus, dihanje in regeneracijo.'
WHERE slug = 'medicinske-gobe';

UPDATE public.shop_categories SET
  name_sl = 'Homeopatija',
  description_sl = 'Subtilna, a močna naravna podpora biološkemu ravnovesju telesa.'
WHERE slug = 'homeopatija';

UPDATE public.shop_categories SET
  name_sl = 'Zeliščni pripravki slovenskih zeliščarjev',
  description_sl = 'Moč lokalne tradicije, ročnega znanja in čistih slovenskih zelišč.'
WHERE slug = 'zeliscni-pripravki';

UPDATE public.shop_categories SET
  name_sl = 'Green Spirit – Premium CBD linija',
  description_sl = 'Lokalno, laboratorijsko preverjeno in najvišje kakovosti.'
WHERE slug = 'green-spirit';

UPDATE public.shop_categories SET
  name_sl = 'Individualno svetovanje & Personalizirani protokoli',
  description_sl = 'Osebno svetovanje in protokoli po meri.'
WHERE slug = 'svetovanje';
