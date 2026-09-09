-- Helper function to get user org_id (public schema, not auth)
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- Enable RLS on all tables (districts added)
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE geodata_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Public read-only (demo GIS/search)
CREATE POLICY "Public read access for documents"
ON documents FOR SELECT USING (true);

CREATE POLICY "Public read access for geodata"
ON geodata_layers FOR SELECT USING (true);

CREATE POLICY "Public read access for districts"
ON districts FOR SELECT USING (true);

-- Member policies (read/write within org)
CREATE POLICY "Users can read/write simulation_runs in their org"
ON simulation_runs FOR ALL
USING (org_id = public.get_user_org_id())
WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "Users can read/write workspaces in their org"
ON workspaces FOR ALL
USING (org_id = public.get_user_org_id())
WITH CHECK (org_id = public.get_user_org_id());

-- Admin policies (full control over org profiles)
CREATE POLICY "Admins can manage all profiles in org"
ON profiles FOR ALL
USING (
  org_id = public.get_user_org_id() AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);