-- Free wellness questionnaire feature
-- Allows visitors to fill in email + 9 questions and receive a free analysis.
-- Authenticated users have responses linked to their profile and visible in dashboard.

CREATE TABLE IF NOT EXISTS public.questionnaire_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  score INTEGER DEFAULT 0,
  analysis TEXT,
  gdpr_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_email ON public.questionnaire_responses(email);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_user_id ON public.questionnaire_responses(user_id);

ALTER TABLE public.questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can view active questions
CREATE POLICY "Anyone can view active questions" ON public.questionnaire_questions
  FOR SELECT USING (active = TRUE);

-- Anyone can submit a questionnaire response
CREATE POLICY "Anyone can insert questionnaire response" ON public.questionnaire_responses
  FOR INSERT WITH CHECK (TRUE);

-- Users can read their own responses
CREATE POLICY "Users can view their own questionnaire responses" ON public.questionnaire_responses
  FOR SELECT USING (auth.uid() = user_id);

-- updated_at trigger
CREATE TRIGGER update_questionnaire_questions_updated_at BEFORE UPDATE ON public.questionnaire_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 9 default questions
INSERT INTO public.questionnaire_questions (question, category, display_order) VALUES
  ('Ali pogosto občutite bolečine v hrbtu, vratu ali ramenih?', 'pain', 1),
  ('Se počutite kronično utrujeni, kljub zadostnemu spancu?', 'energy', 2),
  ('Imate težave z gibljivostjo sklepov ali togostjo telesa?', 'mobility', 3),
  ('Pogosto občutite stres, napetost ali tesnobo?', 'stress', 4),
  ('Imate težave s spancem (težko zaspite, se zbujate ponoči)?', 'sleep', 5),
  ('Ali imate slabo držo ali sedeč način življenja (več kot 6 ur dnevno)?', 'posture', 6),
  ('Trpite za pogostimi glavoboli ali migreni?', 'pain', 7),
  ('Občutite, da je vaš imunski sistem oslabljen (pogosti prehladi, vnetja)?', 'immunity', 8),
  ('Bi želeli izboljšati svoje splošno počutje in vitalnost?', 'wellness', 9);
