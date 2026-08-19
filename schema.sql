-- Full Schema Setup for AlgoVibe 2025

-- 1. Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  team_id SERIAL PRIMARY KEY,
  team_name TEXT NOT NULL,
  pass TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create members table
CREATE TABLE IF NOT EXISTS public.members (
  member_id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES public.teams(team_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  usn TEXT,
  email TEXT,
  phone_number TEXT,
  section TEXT,
  github_profile TEXT,
  linkedin_profile TEXT,
  role TEXT CHECK (role IN ('Leader', 'Member')) DEFAULT 'Member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'evaluator', 'contestant')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create contest table
CREATE TABLE IF NOT EXISTS public.contest (
  contest_id INTEGER PRIMARY KEY,
  is_active BOOLEAN DEFAULT false,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 90
);

-- Insert default contest record
INSERT INTO public.contest (contest_id, is_active, duration_minutes)
VALUES (3, false, 90)
ON CONFLICT (contest_id) DO NOTHING;

-- 5. Create scores table
CREATE TABLE IF NOT EXISTS public.scores (
  score_id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES public.teams(team_id) ON DELETE CASCADE,
  problem_id INTEGER NOT NULL,
  submission_id INTEGER,
  visualization_quality_score NUMERIC(5, 2),
  core_logic_efficiency_score NUMERIC(5, 2),
  web_app_ux_score NUMERIC(5, 2),
  engineering_repo_score NUMERIC(5, 2),
  total_score NUMERIC(5, 2),
  feedback TEXT,
  evaluator_name VARCHAR(255),
  evaluated BOOLEAN DEFAULT false,
  evaluated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Allow public/anon select & insert policies for app operation
CREATE POLICY "Allow public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public insert teams" ON public.teams FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Allow public insert members" ON public.members FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read contest" ON public.contest FOR SELECT USING (true);
CREATE POLICY "Allow public read user_roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Allow public read scores" ON public.scores FOR SELECT USING (true);
