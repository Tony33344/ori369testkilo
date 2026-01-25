-- Education courses core tables
CREATE TABLE IF NOT EXISTS public.education_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  short_description TEXT,
  long_description TEXT,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced')),
  organizer TEXT DEFAULT 'ORI terapevtski center 369',
  location TEXT DEFAULT 'ORI 369 terapevtski center, Maribor',
  cover_image_url TEXT,
  highlight_color TEXT DEFAULT '#00B5AD',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.education_course_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.education_courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('current','upcoming','past')),
  headline TEXT,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE,
  location TEXT,
  language TEXT DEFAULT 'sl',
  format TEXT DEFAULT 'in_person',
  price NUMERIC(10,2),
  max_participants INTEGER DEFAULT 0 CHECK (max_participants >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, start_at)
);

CREATE TABLE IF NOT EXISTS public.education_course_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.education_course_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','waitlist')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','pending','paid','refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.education_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_course_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read education courses" ON public.education_courses
  FOR SELECT USING (true);

CREATE POLICY "Public read education sessions" ON public.education_course_sessions
  FOR SELECT USING (true);

CREATE POLICY "Registrations visible to owners" ON public.education_course_registrations
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role' OR user_id IS NULL);

CREATE POLICY "Registrations insert by owner" ON public.education_course_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role' OR user_id IS NULL);

CREATE POLICY "Registrations update by owner" ON public.education_course_registrations
  FOR UPDATE USING (auth.uid() = user_id OR auth.role() = 'service_role' OR user_id IS NULL);

-- Seed initial education content
WITH reiki_course AS (
  INSERT INTO public.education_courses (slug, title, subtitle, short_description, long_description, level, location, cover_image_url, highlight_color)
  VALUES (
    'reiki-iniciacija',
    'Reiki iniciacija – Začetni tečaj',
    'Intenzivna priprava na energijsko delo',
    'Spoznajte osnovna načela reikija, inicirajte se in osvojite protokole za delo s sabo in drugimi.',
    'Program vključuje uvod v energijske principe, praktično iniciacijo in protokole za samostojno delo. Pripravljen za manjše skupine do 12 udeležencev.',
    'beginner',
    'ORI terapevtski center 369, Maribor',
    'https://images.unsplash.com/photo-1598553165195-06cb1be4de8d?auto=format&fit=crop&w=1200&q=80',
    '#00B5AD'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    level = EXCLUDED.level,
    location = EXCLUDED.location,
    updated_at = NOW()
  RETURNING id
), mio_course AS (
  INSERT INTO public.education_courses (slug, title, subtitle, short_description, long_description, level, location, cover_image_url, highlight_color)
  VALUES (
    'miofascial-release',
    'Miofascial Release – Somatska delavnica',
    'Napredni pristop za manualne terapevte',
    'Somatsko gibanje, 3 manualne metode in frekvenčni protokoli za sproščanje fascij.',
    'Delavnica je namenjena terapevtom, ki želijo poglobiti razumevanje miofascialnih tehnik. Vključuje praktične protokole in kombinacijio frekvenčnih pristopov.',
    'intermediate',
    'ORI terapevtski center 369, Maribor',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    '#7C3AED'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    level = EXCLUDED.level,
    location = EXCLUDED.location,
    updated_at = NOW()
  RETURNING id
), access_course AS (
  INSERT INTO public.education_courses (slug, title, subtitle, short_description, long_description, level, location, cover_image_url, highlight_color)
  VALUES (
    'access-bars',
    'Access Bars® – Razširjanje zavedanja',
    'Tehnika za sprostitev uma in telesa',
    'Naučite se 32 točk na glavi, ki ob nežnem dotiku sprostijo omejitve na vseh področjih življenja.',
    'Access Bars je proces, ki telesu omogoči, da začne prejemati in opuščati stare vzorce. Delavnica vključuje teorijo, prakso (dve izmenjavi) in certifikat.',
    'beginner',
    'ORI terapevtski center 369, Maribor',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    '#2563EB'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    level = EXCLUDED.level,
    location = EXCLUDED.location,
    updated_at = NOW()
  RETURNING id
)
INSERT INTO public.education_course_sessions (course_id, status, headline, start_at, end_at, location, language, format, price, max_participants)
SELECT
  course_id,
  status,
  headline,
  start_at,
  end_at,
  location,
  language,
  format,
  price,
  max_participants
FROM (
  SELECT
    (SELECT id FROM reiki_course) AS course_id,
    'current'::TEXT AS status,
    'Celodnevna iniciacija (mentor: ORI team)' AS headline,
    TIMESTAMP WITH TIME ZONE '2026-02-19 19:00:00+01' AS start_at,
    TIMESTAMP WITH TIME ZONE '2026-02-19 22:00:00+01' AS end_at,
    'ORI 369 – terapijski center' AS location,
    'sl' AS language,
    'in_person' AS format,
    180.00 AS price,
    12 AS max_participants
  UNION ALL
  SELECT
    (SELECT id FROM mio_course),
    'upcoming',
    'Manualne tehnike + somatsko gibanje',
    TIMESTAMP WITH TIME ZONE '2026-03-08 10:00:00+01',
    TIMESTAMP WITH TIME ZONE '2026-03-08 17:00:00+01',
    'ORI 369 – izobraževalni studio',
    'sl',
    'in_person',
    240.00,
    14
  UNION ALL
  SELECT
    (SELECT id FROM access_course),
    'upcoming',
    'Access Bars certificirana delavnica',
    TIMESTAMP WITH TIME ZONE '2026-04-12 09:00:00+01',
    TIMESTAMP WITH TIME ZONE '2026-04-12 17:00:00+01',
    'ORI 369 – Maribor',
    'sl',
    'in_person',
    280.00,
    10
) AS seed
ON CONFLICT (course_id, start_at) DO NOTHING;
