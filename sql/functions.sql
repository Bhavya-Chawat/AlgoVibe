-- SQL function to find a team by normalized name
-- Run this in Supabase SQL editor once
CREATE OR REPLACE FUNCTION public.find_team_by_normalized_name(input text)
RETURNS TABLE(team_id bigint, team_name text, pass text, created_at timestamptz)
LANGUAGE sql STABLE
AS $$
  SELECT team_id, team_name, pass, created_at
  FROM public.teams
  WHERE regexp_replace(lower(team_name), '[^a-z0-9]', '', 'g') = input
  LIMIT 1;
$$;

-- Grant execute to authenticated (optional but useful if you call from server with service key not needed)
-- GRANT EXECUTE ON FUNCTION public.find_team_by_normalized_name(text) TO authenticated;
