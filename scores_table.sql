-- Update script for scores table
-- This script handles both creating the table if it doesn't exist and updating it if it does

-- Add columns if they don't exist (for existing tables)
ALTER TABLE scores 
ADD COLUMN IF NOT EXISTS visualization_quality_score NUMERIC(5,2);

ALTER TABLE scores 
ADD COLUMN IF NOT EXISTS core_logic_efficiency_score NUMERIC(5,2);

ALTER TABLE scores 
ADD COLUMN IF NOT EXISTS web_app_ux_score NUMERIC(5,2);

ALTER TABLE scores 
ADD COLUMN IF NOT EXISTS engineering_repo_score NUMERIC(5,2);

ALTER TABLE scores 
ADD COLUMN IF NOT EXISTS evaluator_name VARCHAR(255);

ALTER TABLE scores 
ADD COLUMN IF NOT EXISTS evaluated BOOLEAN DEFAULT FALSE;

ALTER TABLE scores 
ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMP WITH TIME ZONE;

-- Update existing records to set evaluated = false where it's null
UPDATE scores 
SET evaluated = false 
WHERE evaluated IS NULL;

-- Ensure the foreign key constraints exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_scores_team_id'
    ) THEN
        ALTER TABLE scores 
        ADD CONSTRAINT fk_scores_team_id 
        FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_scores_problem_id'
    ) THEN
        ALTER TABLE scores 
        ADD CONSTRAINT fk_scores_problem_id 
        FOREIGN KEY (problem_id) REFERENCES problems(problem_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_scores_team_id ON scores(team_id);
CREATE INDEX IF NOT EXISTS idx_scores_problem_id ON scores(problem_id);
CREATE INDEX IF NOT EXISTS idx_scores_evaluated ON scores(evaluated);
CREATE INDEX IF NOT EXISTS idx_scores_total_score ON scores(total_score);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create or update the trigger
DROP TRIGGER IF EXISTS update_scores_updated_at ON scores;
CREATE TRIGGER update_scores_updated_at 
  BEFORE UPDATE ON scores 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();