-- Add display_order column to services table for dropdown menu ordering
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update display_order for services in the desired dropdown menu order
-- 1. Posvet in predstavitev
UPDATE public.services SET display_order = 1 WHERE slug = 'posvet-in-predstavitev';

-- 2. Prva posvetovalna obravnava
UPDATE public.services SET display_order = 2 WHERE slug = 'prva-posvetovalna-obravnava';

-- 3. Prvi pregled + meritev s Physio Motio + celovit personaliziran plan
UPDATE public.services SET display_order = 3 WHERE slug = 'physio-motio-pregled';

-- 4. Limfna drenaža trebuha ali brazilska Madeiro terapija
UPDATE public.services SET display_order = 4 WHERE slug = 'limfna-drenaza-trebuha-ali-brazilska-madeiro-terapija';

-- 5. Oblikovanje TNZ (if exists, otherwise skip)
UPDATE public.services SET display_order = 5 WHERE slug = 'oblikovanje-tnz';

-- 6. Elektrostimulacija
UPDATE public.services SET display_order = 6 WHERE slug = 'elektrostimulacija';

-- 7. Manualna Terapija
UPDATE public.services SET display_order = 7 WHERE slug = 'manualna-terapija';

-- 8. TECAR Terapija
UPDATE public.services SET display_order = 8 WHERE slug = 'tecar-terapija';

-- 9. Magnetna Terapija
UPDATE public.services SET display_order = 9 WHERE slug = 'magnetna-terapija';

-- 10. MIS
UPDATE public.services SET display_order = 10 WHERE slug = 'mis';

-- 11. Laserska Terapija
UPDATE public.services SET display_order = 11 WHERE slug = 'laserska-terapija';

-- 12. Media Taping Terapija
UPDATE public.services SET display_order = 12 WHERE slug = 'media-taping-terapija';

-- 13. Cupping
UPDATE public.services SET display_order = 13 WHERE slug = 'cupping';

-- 14. Dryneedeling Terapija
UPDATE public.services SET display_order = 14 WHERE slug = 'dryneedeling-terapija';

-- Other therapies (continue numbering)
UPDATE public.services SET display_order = 15 WHERE slug = 'iteracare';
UPDATE public.services SET display_order = 16 WHERE slug = 'individualno-vodeno-dihanje';
UPDATE public.services SET display_order = 17 WHERE slug = 'individualna-protibolecinska-antistresna-vadba';
UPDATE public.services SET display_order = 18 WHERE slug = 'moti-physio-3d-analiza-telesa-in-drze';
UPDATE public.services SET display_order = 19 WHERE slug = 'uvodna-3d-meritev-telesa-analiza-osebni-program';
UPDATE public.services SET display_order = 20 WHERE slug = 'prvi-pregled';
UPDATE public.services SET display_order = 21 WHERE slug = 'physio-motio-meritev';
UPDATE public.services SET display_order = 22 WHERE slug = 'platinium-dekompresijska-miza';
UPDATE public.services SET display_order = 23 WHERE slug = 'cryoscreen';
UPDATE public.services SET display_order = 24 WHERE slug = 'udarni-valovi-shock-wave';
UPDATE public.services SET display_order = 25 WHERE slug = 'ultra-zvok';
UPDATE public.services SET display_order = 26 WHERE slug = 'scalar-wave-cosmic-communicator';

-- Packages at the end (display_order 100+)
UPDATE public.services SET display_order = 100 WHERE slug = 'paket-3-obravnave';
UPDATE public.services SET display_order = 101 WHERE slug = 'aktivacija-paket-3';
UPDATE public.services SET display_order = 102 WHERE slug = 'paket-6-obravnav';
UPDATE public.services SET display_order = 103 WHERE slug = 'osvescanje-telesa-paket-6';
UPDATE public.services SET display_order = 104 WHERE slug = 'paket-9-obravnav';
UPDATE public.services SET display_order = 105 WHERE slug = 'univerzum-paket-9';
UPDATE public.services SET display_order = 106 WHERE slug = 'aktivacija';
