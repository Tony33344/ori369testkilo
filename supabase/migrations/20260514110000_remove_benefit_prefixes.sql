-- Remove "1x", "2x", "3x", etc. prefixes from package benefits
UPDATE public.services
SET benefits = (
  SELECT ARRAY(
    SELECT REGEXP_REPLACE(benefit, '^\d+x\s+', '', 'i')
    FROM unnest(benefits) AS benefit
    WHERE benefit IS NOT NULL AND benefit != ''
  )
)
WHERE benefits IS NOT NULL AND benefits != '{}' AND array_length(benefits, 1) > 0;
