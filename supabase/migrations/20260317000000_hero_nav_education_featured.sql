-- Add show_on_hero flag to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS show_on_hero BOOLEAN DEFAULT FALSE;

-- Add featured flag to education_courses table
ALTER TABLE public.education_courses ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Create site_settings table for nav visibility and other global settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  nav_hidden_items TEXT[] DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default row
INSERT INTO public.site_settings (id, nav_hidden_items)
VALUES (1, '{}')
ON CONFLICT (id) DO NOTHING;

-- RLS: only admins write, anyone reads
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
