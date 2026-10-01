-- ORI 369 – MIS in Magnetna stimulacija sta ista naprava (potrjeno z lastnikom)
-- Združi v eno kartico/stran: ostane "Magnetna stimulacija (MIS)".
-- Zapise nič ne briše – MIS se samo skrije javno (active = false).

BEGIN;

UPDATE services
SET name = 'Magnetna stimulacija (MIS)'
WHERE slug = 'magnetna-terapija';

UPDATE services
SET active = false
WHERE slug = 'mis';

COMMIT;
