-- 1. Helper functions (public schema, not auth)
CREATE OR REPLACE FUNCTION public.jwt_org_id()
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'org_id', '')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.jwt_role()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role', '')::text;
$$ LANGUAGE sql STABLE;

-- 2. Auto-tag org_id/user_id on insert
ALTER TABLE simulation_runs
  ALTER COLUMN user_id SET DEFAULT auth.uid(),
  ALTER COLUMN org_id SET DEFAULT public.jwt_org_id();

ALTER TABLE geodata_layers
  ALTER COLUMN org_id SET DEFAULT public.jwt_org_id();

-- 3. Auto-create profile on signup (corrected column name)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, org_id, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (new.raw_app_meta_data->>'org_id')::uuid,
    COALESCE(new.raw_app_meta_data->>'role', 'field-agent')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Seed two demo orgs
INSERT INTO orgs (id, name, slug) VALUES
('aa111111-1111-1111-1111-111111111111', 'Ministry of Lands', 'ministry-lands'),
('bb222222-2222-2222-2222-222222222222', 'Global Forest Watch', 'gfw-ngo');

-- 5. Replace the broad org-wide policy with role-specific ones
DROP POLICY IF EXISTS "Users can read/write simulation_runs in their org" ON simulation_runs;

CREATE POLICY "Admins have full access to org data"
ON simulation_runs
FOR ALL
TO authenticated
USING (
    public.jwt_org_id() = org_id
    AND public.jwt_role() = 'admin'
);

CREATE POLICY "Field agents can view org data"
ON simulation_runs
FOR SELECT
TO authenticated
USING (
    public.jwt_org_id() = org_id
);

CREATE POLICY "Field agents can insert their own runs"
ON simulation_runs
FOR INSERT
TO authenticated
WITH CHECK (
    public.jwt_org_id() = org_id
    AND auth.uid() = user_id
    AND public.jwt_role() = 'field-agent'
);