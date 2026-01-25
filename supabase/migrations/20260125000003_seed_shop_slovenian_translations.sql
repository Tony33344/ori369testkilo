-- Seed Slovenian translations for shop products and categories
-- This adds sample translations to existing products/categories

UPDATE public.shop_categories
SET name_sl = 'Prehranska dopolnila'
WHERE name = 'Supplements' OR slug = 'supplements';

UPDATE public.shop_categories
SET name_sl = 'Funkcionalne gobe'
WHERE name = 'Functional Mushrooms' OR slug = 'functional-mushrooms';

UPDATE public.shop_categories
SET name_sl = 'Homeopatija'
WHERE name = 'Homeopathy' OR slug = 'homeopathy';

UPDATE public.shop_categories
SET name_sl = 'Zeliščni pripravki'
WHERE name = 'Herbal Remedies' OR slug = 'herbal-remedies';

UPDATE public.shop_categories
SET name_sl = 'CBD proizvodi'
WHERE name = 'CBD Products' OR slug = 'cbd-products';

-- Add Slovenian translations for products (examples)
UPDATE public.shop_products
SET 
  name_sl = 'Vitamin D3 - Sončni vitamin',
  description_sl = 'Visoko kakovosten vitamin D3 za krepitev imunskega sistema in zdravja kosti.'
WHERE slug = 'vitamin-d3' OR name ILIKE '%Vitamin D%';

UPDATE public.shop_products
SET 
  name_sl = 'Magnezij - Naravni relaksans',
  description_sl = 'Čist magnezij za boljši spanec in zmanjšanje stresa.'
WHERE slug = 'magnesium' OR name ILIKE '%Magnesium%';

UPDATE public.shop_products
SET 
  name_sl = 'Omega-3 maščobne kisline',
  description_sl = 'Omega-3 iz ribjih olj za zdravje srca in možganov.'
WHERE slug = 'omega-3' OR name ILIKE '%Omega%';
