-- Create the contest table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.contest (
  contest_id integer PRIMARY KEY,
  is_active boolean DEFAULT false,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration_minutes integer DEFAULT 90
);

-- Insert a default contest record if none exists
INSERT INTO public.contest (contest_id, is_active, duration_minutes)
VALUES (3, false, 90)
ON CONFLICT (contest_id) DO NOTHING;

-- Enable RLS (Row Level Security) if needed
ALTER TABLE public.contest ENABLE ROW LEVEL SECURITY;