-- Add extended description fields to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS benefits TEXT[];
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS indications TEXT[];
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS contraindications TEXT[];
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS how_it_works TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'therapy';

-- Create team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  role TEXT,
  bio TEXT,
  long_bio TEXT,
  qualifications TEXT[],
  specializations TEXT[],
  image_url TEXT,
  phone TEXT,
  email TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create therapy packages table for the bundled offers
CREATE TABLE IF NOT EXISTS public.therapy_packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sessions INTEGER NOT NULL,
  regular_price DECIMAL(10,2),
  package_price DECIMAL(10,2) NOT NULL,
  price_per_session DECIMAL(10,2),
  included_services TEXT[],
  benefits TEXT[],
  active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for new tables (matching existing pattern)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_packages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view team members" ON public.team_members
  FOR SELECT USING (active = TRUE);

CREATE POLICY "Anyone can view therapy packages" ON public.therapy_packages
  FOR SELECT USING (active = TRUE);

-- Create updated_at triggers
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapy_packages_updated_at BEFORE UPDATE ON public.therapy_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
