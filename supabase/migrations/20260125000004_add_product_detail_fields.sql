-- Add structured fields for product details (ingredients, usage, warnings, etc.)
ALTER TABLE public.shop_products
ADD COLUMN IF NOT EXISTS ingredients TEXT,
ADD COLUMN IF NOT EXISTS ingredients_sl TEXT,
ADD COLUMN IF NOT EXISTS nutrition_facts JSONB,
ADD COLUMN IF NOT EXISTS usage_instructions TEXT,
ADD COLUMN IF NOT EXISTS usage_instructions_sl TEXT,
ADD COLUMN IF NOT EXISTS warnings TEXT,
ADD COLUMN IF NOT EXISTS warnings_sl TEXT,
ADD COLUMN IF NOT EXISTS faq JSONB,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS short_description_sl TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS weight TEXT,
ADD COLUMN IF NOT EXISTS dosage TEXT;

-- Add index for faster searches
CREATE INDEX IF NOT EXISTS idx_shop_products_name_sl ON public.shop_products USING gin(to_tsvector('simple', COALESCE(name_sl, '')));
CREATE INDEX IF NOT EXISTS idx_shop_products_description_sl ON public.shop_products USING gin(to_tsvector('simple', COALESCE(description_sl, '')));

COMMENT ON COLUMN public.shop_products.ingredients IS 'Product ingredients list (English)';
COMMENT ON COLUMN public.shop_products.ingredients_sl IS 'Product ingredients list (Slovenian)';
COMMENT ON COLUMN public.shop_products.nutrition_facts IS 'JSON object with nutrition facts table data';
COMMENT ON COLUMN public.shop_products.usage_instructions IS 'How to use the product (English)';
COMMENT ON COLUMN public.shop_products.usage_instructions_sl IS 'How to use the product (Slovenian)';
COMMENT ON COLUMN public.shop_products.warnings IS 'Product warnings and contraindications (English)';
COMMENT ON COLUMN public.shop_products.warnings_sl IS 'Product warnings and contraindications (Slovenian)';
COMMENT ON COLUMN public.shop_products.faq IS 'JSON array of FAQ items [{q, a}]';
COMMENT ON COLUMN public.shop_products.short_description_sl IS 'Short product description for cards (Slovenian)';
