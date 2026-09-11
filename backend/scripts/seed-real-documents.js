// Seeds 7 REAL, citable land governance documents into Supabase, replacing
// the earlier synthetic/demo document set. Each "content" field is an
// ORIGINAL SUMMARY written from the real source (not copied text) — the
// real source_url is stored in metadata so anyone can verify or read the
// original document.
//
// Run from inside the backend/ folder (needs your existing .env):
//   node scripts/seed-real-documents.js

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ORG_ID = 'aa111111-1111-1111-1111-111111111111'; // Ministry of Lands (demo org)

// Titles from the OLD synthetic seed — deleted first so we don't end up
// with a mix of fabricated and real documents.
const OLD_SYNTHETIC_TITLES = [
  'Urban Land Dispute Reduction Strategies in Rapidly Growing Districts',
  'Customary Tenure Reform: A 2024 Policy Review',
  'Agrarian Land Ceiling Exemptions: Impact on Smallholder Farmers',
  'Tribal Tenancy Alienation and Constitutional Safeguards',
  'ULPIN Boundary Dispute Resolution: A Digital Cadastre Case Study',
  'Registration Fee Reduction and Formal Land Transaction Uptake',
  'Land-Use Change Monitoring Through Satellite and Drone Data Fusion',
  'Row Level Security Models for Multi-Agency Land Data Platforms',
  'Microsimulation Approaches to Land Policy Impact Forecasting',
  'Community Verification Inquests: Procedural Guidelines',
  'Digital Public Infrastructure Principles Applied to Land Records',
  'Cross-Agency Collaboration Models for Land Governance Research',
];

const realDocuments = [
  {
    title: 'Digital India Land Records Modernisation Programme (DILRMP) — Official Overview',
    content:
      'DILRMP was launched in 2008 by merging two earlier schemes — Computerisation of Land Records and Strengthening of Revenue Administration & Updating of Land Records — with the goal of shifting India from a manual, presumptive land-title system to a digital, conclusive one. Key components include ULPIN (Bhu-Aadhaar), a 14-digit geo-coded Unique Land Parcel Identification Number now adopted across 29 states and UTs; the National Generic Document Registration System, a unified e-registration platform for deeds; and e-Court integration linking land records to the judiciary for faster dispute resolution. As of recent government reporting, over 95% of rural Record of Rights entries nationwide have been computerised.',
    tags: ['DILRMP', 'ULPIN', 'digital land records'],
    sourceUrl: 'https://dolr.gov.in/en/programmes-schemes/dilrmp-2/',
    sourceName: 'Department of Land Resources, Ministry of Rural Development (dolr.gov.in)',
  },
  {
    title: 'Land Policies for Growth and Poverty Reduction (World Bank Policy Research Report)',
    content:
      'This World Bank report argues that secure land tenure improves welfare for the poor — particularly women, whose land rights are often neglected — while creating the investment incentives needed for sustainable growth. It examines multiple mechanisms for strengthening tenure security, weighing their trade-offs, and emphasizes the importance of low-cost land exchange through both rental markets and non-market channels such as inheritance in expanding access for land-poor producers. The report is frequently cited as a foundational reference in land tenure policy design across developing economies.',
    tags: ['land tenure', 'World Bank', 'policy research'],
    sourceUrl: 'https://documents1.worldbank.org/curated/en/485171468309336484/pdf/multi0page.pdf',
    sourceName: 'World Bank Policy Research Report',
  },
  {
    title: 'Urban Land (Ceiling and Regulation) Act, 1976: Impact of Repeal on Housing and Land Supply',
    content:
      'The Urban Land Ceiling and Regulation Act (ULCRA), enacted in 1976 across major states, aimed to curb land speculation and address urban housing shortages by capping vacant urban landholdings. In practice, it was widely criticised for locking up land in litigation and bureaucratic delay rather than freeing it for development. Parliament repealed the Act nationally in 1999, though individual states adopted the repeal on their own timelines (Haryana in 1999, Maharashtra only in 2007). Post-repeal analyses consistently find increased urban land supply, reduced ceiling-related litigation, and accelerated real estate investment in states that repealed earliest.',
    tags: ['urban land ceiling', 'ULCRA', 'housing policy'],
    sourceUrl:
      'https://ccs.in/sites/default/files/2022-10/Urban%20Land%20Ceiling%20Act,%201976%20A%20Critical%20Analysis%20of%20Impact%20on%20Housing.pdf',
    sourceName: 'Centre for Civil Society',
  },
  {
    title: 'Samatha v. State of Andhra Pradesh (1997): Tribal Land Alienation and the Fifth Schedule',
    content:
      'In this landmark ruling, the Supreme Court of India held that government, forest, and tribal lands within Fifth Schedule Scheduled Areas cannot be leased to non-tribal persons or private companies, including for mining operations. The Court reasoned that the state itself qualifies as a "person" barred from transferring such land under the Fifth Schedule, and voided mining leases the Andhra Pradesh government had granted to non-tribal companies. The judgment remains the leading constitutional precedent protecting customary tribal landholding from alienation, and has faced sustained political pressure for dilution in the decades since.',
    tags: ['tribal land', 'Fifth Schedule', 'Supreme Court', 'constitutional law'],
    sourceUrl:
      'https://www.escr-net.org/caselaw/2020/samatha-vs-state-ap-and-ors-air-1997-sc-3297-jt-1997-6-sc-449-1997-4-scale-746/',
    sourceName: 'AIR 1997 SC 3297 (via ESCR-Net case law database)',
  },
  {
    title: "DILRMP Implementation in Rajasthan: Legal and Administrative Assessment",
    content:
      "A field study by India's National Institute of Public Finance and Policy (NIPFP) examining the legal and administrative instruments governing land administration in Rajasthan, and how they interact with DILRMP's rollout. The study identifies gaps between the scheme's goal of conclusive digital titling and the state's continuing reliance on manual, presumptive record-keeping practices, and offers recommendations for strengthening revenue administration capacity and record integration.",
    tags: ['DILRMP', 'Rajasthan', 'state implementation'],
    sourceUrl: 'https://macrofinance.nipfp.org.in/releases/DILRMP.html',
    sourceName: 'National Institute of Public Finance and Policy (NIPFP)',
  },
  {
    title: "Assessing DILRMP's Impact in Himachal Pradesh and Maharashtra",
    content:
      'A comparative field assessment of DILRMP digitisation progress across Himachal Pradesh and Maharashtra. The study finds that digitising land records alone does not resolve underlying disputes when the source records themselves contain longstanding inaccuracies — digitisation can simply make old errors more visible rather than correcting them. It recommends giving states greater flexibility in how they spend DILRMP funds, tailored to their specific administrative bottlenecks, rather than a uniform national approach.',
    tags: ['DILRMP', 'impact assessment', 'Himachal Pradesh', 'Maharashtra'],
    sourceUrl:
      'https://www.ideasforindia.in/topics/miscellany/digital-india-land-records-modernisation-programme-assessing-impact-in-himachal-pradesh-and-maharashtra.html',
    sourceName: 'Ideas for India',
  },
  {
    title: 'Stamp Duty Reduction and Property Registration Uptake: State-Level Evidence',
    content:
      "Multiple Indian states have used temporary stamp duty and circle-rate reductions to encourage formal property registration. West Bengal's mid-2021 cut — a 2% stamp duty reduction paired with a 10% circle-rate reduction — was followed by a 64% year-on-year increase in Kolkata property registrations, with 56% of that year's registered units filed after the cut took effect. Delhi and Karnataka have implemented comparable measures. The 2024 Union Budget explicitly encouraged states to further moderate stamp duty rates as a formalization tool, with additional incentives proposed for properties purchased by women.",
    tags: ['stamp duty', 'registration', 'formalization'],
    sourceUrl: 'https://www.kanakkupillai.com/learn/stamp-duty-and-registration-charges-india/',
    sourceName: 'State stamp duty notifications, compiled via Kanakkupillai / Deccan Herald (Union Budget 2024 coverage)',
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
  console.log('Removing old synthetic demo documents...');
  const { error: deleteError, count } = await supabase
    .from('documents')
    .delete({ count: 'exact' })
    .in('title', OLD_SYNTHETIC_TITLES);

  if (deleteError) {
    console.error('  Warning: failed to delete old documents:', deleteError.message);
  } else {
    console.log(`  Removed ${count ?? 0} old synthetic documents.`);
  }

  console.log(`\nSeeding ${realDocuments.length} real, sourced documents...`);

  for (const doc of realDocuments) {
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
      metadata: {
        tags: doc.tags,
        source_url: doc.sourceUrl,
        source_name: doc.sourceName,
        is_real_source: true,
      },
      embedding,
    });

    if (error) {
      console.error(`    FAILED: ${error.message}`);
    } else {
      console.log(`    Inserted.`);
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  console.log('\nDone. All documents now carry real, verifiable source citations.');
}

seed().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});