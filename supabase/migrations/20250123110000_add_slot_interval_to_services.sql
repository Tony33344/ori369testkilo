-- Add per-service slot interval configuration
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS slot_interval_min INTEGER NOT NULL DEFAULT 30 CHECK (slot_interval_min > 0 AND slot_interval_min <= 240);

-- Backfill existing rows to ensure consistent value (in case column already existed without defaults)
UPDATE public.services
SET slot_interval_min = 30
WHERE slot_interval_min IS NULL;
