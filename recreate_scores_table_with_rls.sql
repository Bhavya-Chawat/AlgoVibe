-- Drop and recreate scores table with RLS policies
-- This script drops the existing scores table and creates a new one with RLS policies

-- Drop existing table and constraints
DROP TABLE IF EXISTS scores CASCADE;

-- Create the new scores table with the correct schema
CREATE TABLE public.scores (
  score_id serial NOT NULL,
  team_id integer NOT NULL,
  problem_id integer NOT NULL,
  submission_id integer NULL,
  visualization_quality_score numeric(5, 2) NULL,
  core_logic_efficiency_score numeric(5, 2) NULL,
  web_app_ux_score numeric(5, 2) NULL,
  engineering_repo_score numeric(5, 2) NULL,
  total_score numeric(5, 2) NULL,
  feedback text NULL,
  evaluator_name character varying(255) NULL,
  evaluated boolean NULL DEFAULT false,
  evaluated_at timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT scores_pkey PRIMARY KEY (score_id),
  CONSTRAINT fk_scores_problem_id FOREIGN KEY (problem_id) REFERENCES problems (problem_id) ON DELETE CASCADE,
  CONSTRAINT fk_scores_submission_id FOREIGN KEY (submission_id) REFERENCES submissions (submission_id) ON DELETE SET NULL,
  CONSTRAINT fk_scores_team_id FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scores_team_id ON public.scores USING btree (team_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_scores_problem_id ON public.scores USING btree (problem_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_scores_submission_id ON public.scores USING btree (submission_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_scores_evaluated ON public.scores USING btree (evaluated) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_scores_total_score ON public.scores USING btree (total_score) TABLESPACE pg_default;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger
CREATE TRIGGER update_scores_updated_at 
  BEFORE UPDATE ON scores 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Evaluator can insert scores" ON scores
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Evaluator can update scores" ON scores
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Everyone can read scores" ON scores
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Evaluator can delete scores" ON scores
  FOR DELETE TO authenticated
  USING (true);