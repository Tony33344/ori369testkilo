-- Add Slovenian translation fields to shop products and categories
ALTER TABLE public.shop_products
ADD COLUMN IF NOT EXISTS name_sl TEXT,
ADD COLUMN IF NOT EXISTS description_sl TEXT;

ALTER TABLE public.shop_categories
ADD COLUMN IF NOT EXISTS name_sl TEXT,
ADD COLUMN IF NOT EXISTS description_sl TEXT;
