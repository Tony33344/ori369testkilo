-- Use the approved title form (ZVPI 19. člen) instead of "doktor alternativne medicine".
UPDATE education_courses
SET detailed_description = replace(detailed_description, 'Evgen Valek, doktor alternativne medicine.', 'Evgen Valek, M.D.(M.A.).')
WHERE slug = 'miofascial-release';
