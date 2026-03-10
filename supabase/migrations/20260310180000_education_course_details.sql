-- Add course detail fields to education_courses table
ALTER TABLE education_courses 
ADD COLUMN IF NOT EXISTS image_url_2 TEXT,
ADD COLUMN IF NOT EXISTS image_url_3 TEXT,
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS program_schedule TEXT,
ADD COLUMN IF NOT EXISTS what_youll_get TEXT,
ADD COLUMN IF NOT EXISTS requirements TEXT;

-- Enable RLS
ALTER TABLE education_courses ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON education_courses;
CREATE POLICY "Public courses are viewable by everyone" ON education_courses
  FOR SELECT USING (true);

-- Admin full access policy  
DROP POLICY IF EXISTS "Admins can do everything" ON education_courses;
CREATE POLICY "Admins can do everything" ON education_courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
