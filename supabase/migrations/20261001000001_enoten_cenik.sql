-- ORI 369 – enoten cenik in popravki (navodila v004, 1. 10. 2026)
-- Run in Supabase SQL Editor. Updates only; nothing is deleted.

BEGIN;

-- ---------------------------------------------------------------------------
-- Del 1: cene in trajanja na /terapije in straneh obravnav
-- ---------------------------------------------------------------------------
UPDATE services SET price = 9,  duration = 15 WHERE slug = 'cryoscreen';
UPDATE services SET name = 'Ventuze', price = 19, duration = 20 WHERE slug = 'cupping';
UPDATE services SET price = 19 WHERE slug = 'elektrostimulacija';
UPDATE services SET price = 19 WHERE slug = 'iteracare';
UPDATE services SET price = 9  WHERE slug = 'laserska-terapija';
UPDATE services SET price = 9  WHERE slug = 'media-taping-terapija';
UPDATE services SET slug = 'platinum-dekompresijska-miza',
                  name = 'Dekompresijska miza Platinum',
                  price = 30, duration = 20
WHERE slug = 'platinium-dekompresijska-miza';
UPDATE services SET price = 30 WHERE slug = 'scalar-wave-cosmic-communicator';
UPDATE services SET price = 29 WHERE slug = 'tecar-terapija';
UPDATE services SET price = 39 WHERE slug = 'udarni-valovi-shock-wave';
UPDATE services SET name = 'Ultrazvok', price = 19 WHERE slug = 'ultra-zvok';
UPDATE services SET price = 39 WHERE slug = 'vadba-za-gibljivost';

-- ---------------------------------------------------------------------------
-- Del 3: enotna imena
-- ---------------------------------------------------------------------------
UPDATE services SET name = 'Miofascialna masaža (tehnike po Daltonu)'
WHERE slug = 'miofascialna-masaza';

-- OPOMBA: trajanje MotioScan (30 ali 45 min) je odprto vprašanje za lastnika –
-- zato se trajanje tukaj ne spreminja, samo ime.
UPDATE services SET name = 'MotioScan - 3D analiza gibanja'
WHERE slug = 'moti-physio-3d-analiza-telesa-in-drze';

UPDATE services SET name = 'Preventivni gibalni in kondicijski pregled (meritev + osebni program)'
WHERE slug = 'physio-motio-pregled';

UPDATE services SET name = 'Preventivni gibalni in kondicijski pregled (meritev + osebni program)'
WHERE slug = 'uvodna-3d-meritev-telesa-analiza-osebni-program';

-- Del 1: Sprostitvena akupresura rok – obstaja na /ceniku, dodaj na /terapije
INSERT INTO services (name, slug, description, price, duration, sessions, is_package, active)
SELECT 'Sprostitvena akupresura rok', 'sprostitvena-akupresura-rok',
       'Nežen pritisk na refleksne točke dlani za sprostitev in uravnoteženje.', 29, 30, 1, false, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'sprostitvena-akupresura-rok');

-- ---------------------------------------------------------------------------
-- Del 2: vsebina paketov – enotna imena storitev
-- ---------------------------------------------------------------------------
UPDATE services SET description = replace(description, 'Storm miofascialna masaža', 'Miofascialna masaža (tehnike po Daltonu)')
WHERE is_package = true AND description LIKE '%Storm miofascialna%';

UPDATE services SET description = replace(description, 'Iteracare', 'IteraCare')
WHERE is_package = true AND description LIKE '%Iteracare%';

UPDATE services SET description = replace(description, 'Trakcijska miza', 'Dekompresijska miza')
WHERE is_package = true AND description LIKE '%Trakcijska miza%';

UPDATE services SET description = replace(description, 'MIS Magnetna indukcijska stimulacija', 'Magnetna stimulacija (MIS)')
WHERE is_package = true AND description LIKE '%MIS Magnetna%';

UPDATE services SET description = replace(description, 'Moti-physio Scan', 'MotioScan')
WHERE is_package = true AND description LIKE '%Moti-physio%';

-- ---------------------------------------------------------------------------
-- Del 4: trgovina – izdelki brez cene (0,00 €)
-- ODLOČITEV LASTNIKA: navodila dovoljujejo bodisi vpis cen bodisi izklop.
-- Spodnja vrstica izvede varianto "izklopi". Če želite izdelke pustiti
-- vidne, vrstico izbrišite, preden zaženete ta SQL.
-- ---------------------------------------------------------------------------
UPDATE shop_products SET active = false
WHERE active = true AND (price IS NULL OR price <= 0);

COMMIT;
