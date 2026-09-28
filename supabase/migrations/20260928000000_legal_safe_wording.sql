-- Legally safe wording (ZZdrav 21. člen): no healing claims, no "manualna terapija", no "diagnostika".
-- Slugs are unchanged, so URLs and existing bookings keep working.

BEGIN;

UPDATE services SET name = 'Miofascialna masaža'
WHERE slug = 'manualna-terapija';

UPDATE services SET description = 'Fizioterapevtska metoda s suhim iglanjem za sprostitev napetih mišic.'
WHERE slug = 'dryneedeling-terapija';

UPDATE services SET description = 'Terapija z udarnimi valovi za sprostitev in regeneracijo tkiv.'
WHERE slug = 'udarni-valovi-shock-wave';

UPDATE services SET description = replace(description, 'Celovita diagnostika vašega stanja', 'Celovita analiza vašega počutja')
WHERE slug IN ('physio-motio-pregled', 'uvodna-3d-meritev-telesa-analiza-osebni-program');

UPDATE services SET description = replace(description, 'Hitra diagnostična meritev', 'Hitra meritev')
WHERE slug = 'physio-motio-meritev';

UPDATE services SET description = replace(description, 'Manualna - Storm terapija', 'Storm terapija – miofascialna masaža')
WHERE slug IN ('osvescanje-telesa-paket-6', 'aktivacija-paket-3-obravnave', 'univerzum-paket-9');

UPDATE education_courses SET detailed_description = replace(replace(replace(detailed_description,
    'energijskemu zaznavanju, zdravljenju in notranji transformaciji', 'energijskemu zaznavanju in notranji transformaciji'),
    'Evgen Valek, doktor alternativne medicine in', 'Evgen Valek, M.D.(M.A.),'),
    'energijskega zdravljenja in iniciacij', 'energijskega dela in iniciacij')
WHERE slug = 'reiki-iniciacija';

COMMIT;
