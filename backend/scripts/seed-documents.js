// Seeds ~12 realistic land-governance research documents into Supabase,
// embedding each one via Gemini so /api/search actually returns ranked results.
//
// Run from inside the backend/ folder (needs your existing .env):
//   node scripts/seed-documents.js
//
// Safe to re-run — it checks for existing titles and skips duplicates.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ORG_ID = 'aa111111-1111-1111-1111-111111111111'; // Ministry of Lands (demo org)

const mockDocuments = [
  {
    title: 'Urban Land Dispute Reduction Strategies in Rapidly Growing Districts',
    content:
      'This study examines procedural bottlenecks in urban land dispute resolution across 12 fast-growing districts. Key findings show that pre-litigation mediation, combined with digitized parcel records, reduced average resolution time from 340 days to 95 days. Recommendations include mandatory community verification steps before formal adjudication and standardized digital boundary evidence admissibility rules.',
    tags: ['urban', 'disputes', 'mediation'],
  },
  {
    title: 'Customary Tenure Reform: A 2024 Policy Review',
    content:
      'Reviews recent legislative changes recognizing customary and community land tenure rights alongside statutory freehold systems. Analyzes case studies where customary usufructuary rights were given evidentiary priority over newly digitized cadastral records, and proposes a harmonization framework for reconciling the two systems without displacing traditional landholders.',
    tags: ['customary tenure', 'policy', 'reform'],
  },
  {
    title: 'Agrarian Land Ceiling Exemptions: Impact on Smallholder Farmers',
    content:
      'Analyzes the fiscal and social impact of land ceiling exemptions granted to smallholder agricultural cooperatives. Finds that exemption thresholds set below 5 acres disproportionately excluded marginal farmers from formal registration incentives, and models three alternative threshold structures with projected uptake rates.',
    tags: ['agrarian', 'land ceiling', 'smallholders'],
  },
  {
    title: 'Tribal Tenancy Alienation and Constitutional Safeguards',
    content:
      'Examines legal precedents where tribal land alienation to non-tribal parties was contested under constitutional protection frameworks. Documents patterns across appellate rulings showing that unregistered customary occupation, when evidenced by community demarcation logs, was consistently upheld over later commercial leasehold claims.',
    tags: ['tribal', 'tenancy', 'constitutional'],
  },
  {
    title: 'ULPIN Boundary Dispute Resolution: A Digital Cadastre Case Study',
    content:
      'Documents the rollout of Unique Land Parcel Identification Numbers (ULPIN) in three pilot states and the boundary disputes that emerged during digitization. Drone-based orthomosaic surveys were found admissible as primary evidence in 68% of contested boundary cases, significantly reducing reliance on colonial-era survey stones.',
    tags: ['ULPIN', 'digital cadastre', 'boundary'],
  },
  {
    title: 'Registration Fee Reduction and Formal Land Transaction Uptake',
    content:
      'A cross-state analysis of registration fee reductions between 2019-2023 and their effect on formal land transaction volumes. Finds a consistent positive elasticity: each 10% reduction in registration fees correlated with an average 6-8% increase in formally registered transactions within 18 months.',
    tags: ['registration fees', 'transactions', 'formalization'],
  },
  {
    title: 'Land-Use Change Monitoring Through Satellite and Drone Data Fusion',
    content:
      'Proposes a methodology combining multi-temporal satellite imagery with periodic drone surveys to track land-use change at the district level. Demonstrates 94% classification accuracy for distinguishing agricultural, urban expansion, and forest-cover transitions over a 5-year window.',
    tags: ['land-use', 'remote sensing', 'monitoring'],
  },
  {
    title: 'Row Level Security Models for Multi-Agency Land Data Platforms',
    content:
      'Technical paper on data governance architectures for platforms shared across multiple government agencies with differing access needs. Recommends organization-scoped Row Level Security combined with role-based policies (admin vs field-agent) as a baseline pattern, with public read-only access for non-sensitive aggregate layers.',
    tags: ['data governance', 'security', 'multi-agency'],
  },
  {
    title: 'Microsimulation Approaches to Land Policy Impact Forecasting',
    content:
      'Surveys microsimulation methodologies used by institutions including the World Bank for forecasting the fiscal and social impact of land policy changes, such as ceiling revisions and fee restructuring. Contrasts full agent-based microsimulation against simplified rules-based estimators, noting the latter trades some accuracy for transparency and speed — useful for early-stage policy screening.',
    tags: ['microsimulation', 'policy forecasting', 'methodology'],
  },
  {
    title: 'Community Verification Inquests: Procedural Guidelines',
    content:
      'Outlines standardized procedures for Section 14 Community Verification Inquests used to reconcile customary demarcation logs with statutory survey records. Includes recommended timelines, evidentiary standards, and appeal pathways for disputed outcomes.',
    tags: ['community verification', 'procedure', 'disputes'],
  },
  {
    title: 'Digital Public Infrastructure Principles Applied to Land Records',
    content:
      'Applies Digital Public Infrastructure (DPI) design principles — open standards, federated architecture, and privacy-preserving audit trails — to national land record modernization efforts. Argues that federated state-level data ownership, rather than central consolidation, better preserves state autonomy while enabling interoperability.',
    tags: ['DPI', 'open standards', 'federated architecture'],
  },
  {
    title: 'Cross-Agency Collaboration Models for Land Governance Research',
    content:
      'Case studies of successful collaboration frameworks between ministries, research institutions, and civil society organizations on land governance research. Identifies shared workspace tooling, role-based access, and transparent audit logging as the three most consistently cited enablers of effective cross-agency work.',
    tags: ['collaboration', 'governance', 'research'],
  },
];

async function embedText(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Embedding failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.embedding.values;
}

async function seed() {
  console.log(`Seeding ${mockDocuments.length} documents...`);

  for (const doc of mockDocuments) {
    const { data: existing } = await supabase
      .from('documents')
      .select('id')
      .eq('title', doc.title)
      .maybeSingle();

    if (existing) {
      console.log(`  - Skipping (already exists): ${doc.title}`);
      continue;
    }

    console.log(`  - Embedding: ${doc.title}`);
    const embedding = await embedText(`${doc.title}\n\n${doc.content}`);

    const { error } = await supabase.from('documents').insert({
      org_id: ORG_ID,
      title: doc.title,
      content: doc.content,
      metadata: { tags: doc.tags, district_id: 'cc333333-3333-3333-3333-333333333333' },
      embedding,
    });

    if (error) {
      console.error(`    FAILED: ${error.message}`);
    } else {
      console.log(`    Inserted.`);
    }

    // Small delay to stay well within free-tier rate limits
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});