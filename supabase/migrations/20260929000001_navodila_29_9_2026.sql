-- ORI 369 – navodila 29. 9. 2026 (DB-side changes)
-- Run in Supabase SQL Editor. Safe to run once; uses fixed slugs only.
-- Nothing is deleted: hidden rows stay in the database.

BEGIN;

-- ---------------------------------------------------------------------------
-- Rows 12–13: public therapy URL slugs (301 redirects handled in next.config)
-- ---------------------------------------------------------------------------
UPDATE services
SET slug = 'miofascialna-masaza'
WHERE slug = 'manualna-terapija';

UPDATE services
SET slug = 'vadba-za-gibljivost'
WHERE slug = 'individualna-protibolecinska-antistresna-vadba';

-- Row 22: typo in service name
UPDATE services
SET name = 'Platinum – Dekompresijska miza'
WHERE slug = 'platinium-dekompresijska-miza';

-- ---------------------------------------------------------------------------
-- Row 19 + "Seznam za odstranitev": hide homeopathic products from the shop
-- ---------------------------------------------------------------------------
UPDATE shop_products
SET active = false
WHERE slug IN (
  'homeopatske-kapljice',
  'homeopatske-pilule',
  'informirana-homeopatska-voda'
);

-- Hide the empty Homeopatija category as well
UPDATE shop_categories
SET active = false
WHERE slug = 'homeopatija';

-- ---------------------------------------------------------------------------
-- Row 20: Medicinske gobe -> Funkcionalne gobe + neutral descriptions
-- ---------------------------------------------------------------------------
UPDATE shop_categories
SET slug = 'funkcionalne-gobe',
    name = 'Funkcionalne gobe',
    name_sl = 'Funkcionalne gobe',
    description_sl = 'Funkcionalne gobe v obliki prehranskih dopolnil.'
WHERE slug = 'medicinske-gobe';

UPDATE shop_products
SET short_description_sl = 'Funkcionalna goba z dolgo tradicijo uporabe.',
    description_sl = 'Reishi (Ganoderma lucidum) je užitna goba, ki se tradicionalno uporablja v azijski kulinariki in kot prehransko dopolnilo. Izdelek vsebuje izvleček gobe reishi v obliki kapsul.'
WHERE slug = 'reishi';

UPDATE shop_products
SET name_sl = 'Lion''s Mane – funkcionalna goba',
    short_description_sl = 'Funkcionalna goba Hericium erinaceus v obliki dopolnila.',
    description_sl = 'Lion''s Mane (Hericium erinaceus) je užitna goba, ki se tradicionalno uporablja v azijski kulinariki. Izdelek vsebuje izvleček gobe v obliki kapsul.'
WHERE slug = 'lion''s-mane';

-- CBD: soften unsupported claims ("vse koristi konoplje", "podpora pri stresu, spancu")
UPDATE shop_products
SET description_sl = 'CBD olja brez THC, proizvedena iz industrijske konoplje. Polni spekter kanabinoidov, laboratorijsko preverjena čistost. Vsebnost THC pod 0,0 %.'
WHERE slug = 'cbd-olja-(brez-thc)';

-- ---------------------------------------------------------------------------
-- Row 22: duplicated / identical product names
-- ---------------------------------------------------------------------------
-- Remove the duplicated Cordyceps entry (keep the 4Endurance one)
UPDATE shop_products
SET active = false
WHERE slug = 'cordyceps';

-- Three products shared the name "Magnezij - Naravni relaksans"
UPDATE shop_products
SET name_sl = '4Endurance Pro Calcium Zinc Magnesium 60 kapsul',
    description_sl = 'Mineralna formula s kalcijem, cinkom in magnezijem. Magnezij prispeva k zmanjšanju utrujenosti in k normalnemu delovanju mišic.'
WHERE slug = '4endurance-pro-calcium-zinc-magnesium-60-caps';

UPDATE shop_products
SET name_sl = '4Endurance Pro Magnesium Direct 30 vrečk',
    description_sl = 'Magnezij v obliki vrečk za enostavno uživanje. Magnezij prispeva k zmanjšanju utrujenosti in k normalnemu delovanju mišic.'
WHERE slug = '4endurance-pro-magnesium-direct-30-sachets';

UPDATE shop_products
SET name_sl = '4Endurance Pro Sea Magnesium 60 kapsul',
    description_sl = 'Magnezij iz morskega vira v obliki kapsul. Magnezij prispeva k zmanjšanju utrujenosti in k normalnemu delovanju mišic.'
WHERE slug = '4endurance-pro-sea-magnesium-60-caps';

-- ---------------------------------------------------------------------------
-- Row 21: Slovenian names/descriptions for products with English-only text
-- ---------------------------------------------------------------------------
UPDATE shop_products
SET name_sl = '4Endurance Pro Alpha Boost 126 kapsul',
    description_sl = 'Formula z aminokislinami, adaptogeni, minerali in shilajitom, namenjena športnikom in aktivnim moškim.'
WHERE slug = '4endurance-pro-alpha-boost-126-caps';

UPDATE shop_products
SET name_sl = '4Endurance Pro Creatine HCL 60 kapsul',
    description_sl = 'Kreatin hidroklorid (HCL) – vir kreatina za športnike. Kreatin povečuje fizično zmogljivost pri zaporednih kratkotrajnih visokointenzivnih naporih.'
WHERE slug = '4endurance-pro-creatine-hcl-60-caps';

UPDATE shop_products
SET name_sl = '4Endurance Pro Glutamine',
    description_sl = '100 % čist fermentiran L-glutamin – aminokislina, namenjena športnikom in aktivnim posameznikom.'
WHERE slug = '4endurance-pro-glutamine';

UPDATE shop_products
SET name_sl = '4Endurance Pro Hydro BCAA (malina/tropiko) 300 g',
    description_sl = 'Športni napitek z razvejanimi aminokislinami (BCAA) in elektroliti za trening.'
WHERE slug = '4endurance-pro-hydro-bcaa-raspberry-tropical-300-g';

UPDATE shop_products
SET name_sl = '4Endurance Pro Iron+ 60 kapsul',
    description_sl = 'Prehransko dopolnilo z železom. Železo prispeva k zmanjšanju utrujenosti in k normalni tvorbi rdečih krvničk.'
WHERE slug = '4endurance-pro-iron-60-caps';

UPDATE shop_products
SET name_sl = '4Endurance Pro Nitrates+ 90 kapsul',
    description_sl = 'Formula s tremi viri nitratov in L-argininom, namenjena športnikom pred treningom.'
WHERE slug = '4endurance-pro-nitrates-90-caps';

UPDATE shop_products
SET name_sl = '4Endurance Pro Vit+Min 90 kapsul',
    description_sl = 'Vitamin-mineralna formula – 25 aktivnih sestavin v eni kapsuli na dan.'
WHERE slug = '4endurance-pro-vit-min-90-caps';

UPDATE shop_products
SET name_sl = '4Endurance Pro Natural Vitamin C 60 kapsul',
    description_sl = 'Naravni vitamin C iz acerole in šipka. Vitamin C prispeva k delovanju imunskega sistema.'
WHERE slug = '4endurance-pro-natural-vitamin-c-60-caps';

UPDATE shop_products
SET name_sl = '4Endurance Pro Potassium Citrate 90 kapsul',
    description_sl = 'Kalij v obliki citrata. Kalij prispeva k normalnemu delovanju mišic in živčnega sistema.'
WHERE slug = '4endurance-pro-potassium-citrate-90-caps';

UPDATE shop_products
SET name_sl = '4Endurance Pro Vitamin B Complex 90 kapsul',
    description_sl = 'Kompleks vitaminov B z dodanim kolinom, inozitolom in PABA. Vitamini B prispevajo k zmanjšanju utrujenosti.'
WHERE slug = '4endurance-pro-vitamin-b-complex-90-caps';

UPDATE shop_products
SET name_sl = 'Nduranz Nrgy Drink 45 1200 g (lubenica)',
    description_sl = 'Športni napitek z ogljikovimi hidrati in elektroliti za trening in tekmovanje.'
WHERE slug = 'nduranz-nrgy-drink-45-1200-g-watermelon';

UPDATE shop_products
SET name_sl = 'Nduranz Nrgy Drink 90 Limited 1200 g (kumara-limeta)',
    description_sl = 'Športni napitek z ogljikovimi hidrati in elektroliti za trening in tekmovanje.'
WHERE slug = 'nduranz-nrgy-drink-90-limited-1200-g-cucumber-lime';

-- ---------------------------------------------------------------------------
-- Row 23: education cover images – replace external stock/Reiki images with
-- locally stored photos of the center
-- ---------------------------------------------------------------------------
UPDATE education_courses
SET cover_image_url = '/images/therapies/IMG_5931-768x513.webp'
WHERE slug = 'delavnica-sproscanja';

UPDATE education_courses
SET cover_image_url = '/images/therapies/IMG_5947-768x513.webp'
WHERE slug = 'miofascial-release';

COMMIT;
