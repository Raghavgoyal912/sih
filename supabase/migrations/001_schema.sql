-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Organizations
CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users (Extends Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES orgs(id),
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Districts
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id),
    name TEXT NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Documents (Research/Policy)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id),
    title TEXT NOT NULL,
    content TEXT,
    metadata JSONB,
    embedding VECTOR(1536), -- Optimized for OpenAI embeddings
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Geodata Layers (Parcels/Hotspots)
CREATE TABLE geodata_layers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id),
    layer_type TEXT CHECK (layer_type IN ('parcel', 'hotspot', 'zone')),
    properties JSONB, -- Stores GeoJSON properties
    geom GEOMETRY(Geometry, 4326), -- PostGIS geometry for spatial queries
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Simulation Runs
CREATE TABLE simulation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id),
    user_id UUID REFERENCES profiles(id),
    inputs JSONB NOT NULL,
    outputs JSONB,
    confidence_score NUMERIC(5,4),
    status TEXT DEFAULT 'pending',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. Workspaces (Phase 2 Collaboration)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id),
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);