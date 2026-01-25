-- Add additional base fields to education_courses
ALTER TABLE public.education_courses
  ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_attendees INTEGER DEFAULT 0 CHECK (max_attendees >= 0),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'sl',
  ADD COLUMN IF NOT EXISTS start_time TIME;
