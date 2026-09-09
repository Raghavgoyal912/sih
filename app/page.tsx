import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full bg-surface">
      <div className="max-w-[88rem] mx-auto px-4 lg:px-12 py-4">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="relative w-full pt-8 pb-16 overflow-hidden">
            <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-surface-container-high/60 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -left-28 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-start max-w-5xl">
              <div className="inline-flex items-center gap-2 bg-surface-container-highest px-4 py-1 rounded-full text-xs font-semibold text-primary mb-4 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-secondary">token</span>
                <span className="tracking-wide">
                  National Research Initiative • Powered by Geospatial AI &amp; Public Land Registries
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight max-w-4xl text-left mb-4 leading-[1.15]">
                AI-powered research, mapping, and simulation for land governance policy
              </h1>

              <p className="text-base md:text-lg text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
                Empowering state administrators, policy researchers, and urban planners with verifiable geospatial intelligence, cadastral record analytics, and evidence-based legislative impact modeling.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-container transition-all shadow-md group"
                >
                  <span>Explore the Platform</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  href="/gis"
                  className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary px-6 py-3 rounded-lg text-sm font-semibold hover:bg-surface-container transition-all shadow-sm border border-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">map</span>
                  <span>View National Cadastral Map</span>
                </Link>

                <Link
                  href="/simulate"
                  className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary px-4 py-3 text-sm font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Simulate Policy Impact</span>
                </Link>
              </div>

              {/* Key Metric Grid */}
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container/50">
                <div className="flex flex-col border-l-2 pl-4 border-secondary">
                  <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight">740+</span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
                    Districts Digitized
                  </span>
                  <span className="text-xs font-mono text-secondary mt-1">100% Survey Grid Synced</span>
                </div>
                <div className="flex flex-col border-l-2 pl-4 border-secondary">
                  <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight">142M+</span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
                    Parcel Records Integrated
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant mt-1">Across 28 States &amp; 8 UTs</span>
                </div>
                <div className="flex flex-col border-l-2 pl-4 border-secondary">
                  <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight">48</span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
                    Policy Simulations Run
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant mt-1">Agrarian &amp; Urban Tenure</span>
                </div>
                <div className="flex flex-col border-l-2 pl-4 border-secondary">
                  <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight">99.98%</span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
                    Verifiability Score
                  </span>
                  <span className="text-xs font-mono text-secondary mt-1">SHA-256 Ledger Backed</span>
                </div>
              </div>
            </div>
          </section>

          {/* Cadastral Preview Section */}
          <section className="w-full mb-16" id="cadastral-preview">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container/60">
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-container text-on-primary font-bold">
                      <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-primary">Live Multi-Layer Cadastral Composite</h3>
                      <p className="text-xs text-on-surface-variant">Real-time vector topology synced with Survey of India benchmark points</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono bg-surface-container-low px-3 py-1 rounded">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span>GRID: EPSG 7755 (WGS 84 / India Zone)</span>
                  </div>
                </div>

                <div className="relative w-full h-80 rounded-lg overflow-hidden bg-surface-container-high shadow-inner">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBs-dJ9ROqWdbYFI9OqgUaa0cVUY922-vUFdcWvE7dKlOFWi7Dni2v0ibDELXFaCjsyQEZbTngm91vlCP-eNIRRw0fc2FgqpAShsmpKFS5Lr2jmmWRJzDldpDkyB7zsQVKHA0twizQMAvAKl_aNjpbnPwXT1EFSc7-S3AxZZBHUcafrqoWk8EepzPreynLxMY-oTh1fso2sPih8H81PLpOLLdd-n8BxssSDkbqSzKWyoLEDZAlJ-mEL')",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
                  <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded shadow-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">layers</span>
                    <span className="text-xs font-semibold text-primary">
                      Active Layers: Ortho-rectified Cadastre + Drone DEM 0.05m
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-on-primary">
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span>LAT: 30°19&apos;02&quot; N</span>
                      <span>LON: 78°02&apos;01&quot; E</span>
                      <span>PARCEL ULPIN: UK-04-102-9981</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-secondary px-2.5 py-1 rounded text-on-secondary shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Land Ceiling Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Telemetry feeds */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-surface-container-low p-4 rounded-lg">
                <div>
                  <span className="text-xs uppercase tracking-wider text-secondary font-bold mb-1 block">
                    Telemetry Feeds
                  </span>
                  <h4 className="text-base font-bold text-primary mb-2">Autonomous Tenancy Resolution</h4>
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                    Continuous cross-referencing between Jamabandi records and satellite multi-spectral vegetation indices.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-surface-container-lowest p-3 rounded shadow-sm">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-primary font-medium">Mutation Clearance Latency</span>
                        <span className="text-secondary font-bold">-64%</span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                        <div className="bg-secondary h-1.5 rounded-full" style={{ width: "78%" }} />
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest p-3 rounded shadow-sm">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-primary font-medium">Border Overlap Anomaly Detections</span>
                        <span className="text-on-surface-variant font-bold">1,824 Flaggable</span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: "42%" }} />
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest p-3 rounded shadow-sm">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-primary font-medium">BhuNaksha Shapefile Accuracy</span>
                        <span className="text-primary font-bold">99.4%</span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                        <div className="bg-secondary h-1.5 rounded-full" style={{ width: "96%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Last State Synced: Rajasthan</span>
                  <span className="text-secondary font-mono">2 mins ago</span>
                </div>
              </div>
            </div>
          </section>

          {/* Core National Modules Grid */}
          <section className="w-full mb-16" id="modules">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-secondary text-xs uppercase tracking-wider mb-1 font-bold">
                  <span className="material-symbols-outlined text-[16px]">domain_verification</span>
                  <span>Interoperable Infrastructure</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Core National Modules</h2>
                <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mt-1">
                  Interoperable tools designed for rigorous land tenure evaluation, cadastral mapping, and reform simulation.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <span className="text-xs font-medium text-on-surface-variant">
                  Architecture: Standardised Micro-frontends
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MOD-01 */}
              <div className="group bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-surface-container/60">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">manage_search</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-surface-container-low text-primary">
                      Semantic AI Discovery
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Search &amp; Recommendation</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant mb-4 leading-relaxed">
                    Instant natural language retrieval across central acts, state land tenancy reforms, court precedents, and title adjudication frameworks.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-lg mb-4">
                    <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                      <span>Multi-language NLP • Case law summaries • Cross-state comparative analysis</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-surface-container/40">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-secondary transition-colors"
                  >
                    <span>Launch Search Archive</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                  <span className="text-[11px] font-mono text-on-surface-variant">MOD-01 // NLP-LEX</span>
                </div>
              </div>

              {/* MOD-02 */}
              <div className="group bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-surface-container/60">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">map</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-secondary-container text-on-secondary-container">
                      Cadastral Geospatial Suite
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">GIS Dashboard</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant mb-4 leading-relaxed">
                    High-resolution satellite parcel overlays, boundary dispute heatmaps, and land-use classification vectors updated in real-time.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-lg mb-4">
                    <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                      <span>Survey-of-India aligned • Multi-temporal change detection • Drone orthomosaic support</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-surface-container/40">
                  <Link
                    href="/gis"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-secondary transition-colors"
                  >
                    <span>Launch GIS Dashboard</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                  <span className="text-[11px] font-mono text-on-surface-variant">MOD-02 // GEO-SPAT</span>
                </div>
              </div>

              {/* MOD-03 */}
              <div className="group bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-surface-container/60">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">tune</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-surface-container-high text-on-surface">
                      Predictive Policy Sandbox
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Policy Simulation</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant mb-4 leading-relaxed">
                    Simulate legislative amendments, stamp duty variations, and ceiling act modifications to forecast economic and agrarian outcomes.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-lg mb-4">
                    <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                      <span>Agent-based microeconomic model • Revenue impact forecasting • Dispute risk score</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-surface-container/40">
                  <Link
                    href="/simulate"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-secondary transition-colors"
                  >
                    <span>Launch Policy Simulator</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                  <span className="text-[11px] font-mono text-on-surface-variant">MOD-03 // POL-SIM</span>
                </div>
              </div>

              {/* MOD-04 */}
              <div className="group bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-surface-container/60">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">hub</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-secondary-container text-on-secondary-container">
                      Inter-Agency Network
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Collaboration Hub</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant mb-4 leading-relaxed">
                    Secure, federated workspace connecting revenue officers, academic institutions, survey departments, and civil society legal aid cells.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-lg mb-4">
                    <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                      <span>Role-based access • Peer-reviewed draft repository • Inter-state working groups</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-surface-container/40">
                  <Link
                    href="/collaborate"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-secondary transition-colors"
                  >
                    <span>Launch Collaboration Hub</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                  <span className="text-[11px] font-mono text-on-surface-variant">MOD-04 // COL-FED</span>
                </div>
              </div>
            </div>
          </section>

          {/* DPI Principles Section */}
          <section className="w-full mb-16" id="framework">
            <div className="bg-surface-container-low rounded-2xl p-6 lg:p-10 shadow-sm border border-surface-container/60">
              <div className="max-w-3xl mb-8">
                <span className="text-xs uppercase tracking-wider text-secondary font-bold block mb-1">
                  Governance Baseline
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight mb-2">
                  Built on Digital Public Infrastructure Principles
                </h2>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Adhering to sovereign data architecture principles that ensure uncompromised federal privacy, state autonomy, and verifiable public accountability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between border border-surface-container/40">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-3">
                      <span className="material-symbols-outlined text-[22px]">api</span>
                    </div>
                    <h3 className="text-base font-bold text-primary mb-1">Open Standards &amp; BhuNaksha API</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Complete adherence to OGC web feature specifications (WFS/WMS) ensuring dynamic inter-operation with state-level record digitization protocols.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 flex items-center gap-1 text-xs text-secondary font-semibold">
                    <span className="material-symbols-outlined text-[16px]">done_all</span>
                    <span>OGC Compliant Core</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between border border-surface-container/40">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-3">
                      <span className="material-symbols-outlined text-[22px]">verified_user</span>
                    </div>
                    <h3 className="text-base font-bold text-primary mb-1">Privacy-Preserving Audit Logs</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Zero-knowledge provenance traces ensure that legislative modeling and parcel research queries preserve personal identity and ownership details.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 flex items-center gap-1 text-xs text-secondary font-semibold">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Differential Privacy Enabled</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between border border-surface-container/40">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-3">
                      <span className="material-symbols-outlined text-[22px]">account_balance</span>
                    </div>
                    <h3 className="text-base font-bold text-primary mb-1">Autonomous State Federation</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      States retain complete cryptographic custody of land tenancy data schemas, enabling local legal adaptations without central lock-in.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 flex items-center gap-1 text-xs text-secondary font-semibold">
                    <span className="material-symbols-outlined text-[16px]">share</span>
                    <span>Federated Custody Model</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Statutory Ecosystem Section */}
          <section className="w-full mb-12">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container/60">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                  Statutory Collaboration Ecosystem
                </span>
                <h3 className="text-lg md:text-xl font-bold text-primary mt-1">
                  Partnered with Premier National Land Governance Agencies
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center">
                <div className="flex flex-col items-center justify-center p-4 rounded bg-surface-container-low text-center">
                  <span className="material-symbols-outlined text-primary text-[28px] mb-1">assured_workload</span>
                  <span className="text-xs font-bold text-primary">DoLR</span>
                  <span className="text-[11px] text-on-surface-variant">Dept. of Land Resources</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded bg-surface-container-low text-center">
                  <span className="material-symbols-outlined text-primary text-[28px] mb-1">public</span>
                  <span className="text-xs font-bold text-primary">Survey of India</span>
                  <span className="text-[11px] text-on-surface-variant">National Mapping Agency</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded bg-surface-container-low text-center">
                  <span className="material-symbols-outlined text-primary text-[28px] mb-1">terminal</span>
                  <span className="text-xs font-bold text-primary">NIC</span>
                  <span className="text-[11px] text-on-surface-variant">National Informatics Centre</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded bg-surface-container-low text-center">
                  <span className="material-symbols-outlined text-primary text-[28px] mb-1">gavel</span>
                  <span className="text-xs font-bold text-primary">MoRD</span>
                  <span className="text-[11px] text-on-surface-variant">Ministry of Rural Development</span>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Notice Strip */}
          <section className="w-full mb-8">
            <div className="bg-surface-container-high rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-surface-container">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">Administrative &amp; Legal Notice</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Platform contents are for research, policy analysis and administrative assistance. Official title certificates remain subject to competent revenue court verification under statutory State Land Acts.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 text-xs">
                <span className="font-semibold text-primary hover:underline cursor-pointer">
                  Grievance Redressal
                </span>
                <span className="text-on-surface-variant">•</span>
                <span className="font-semibold text-primary hover:underline cursor-pointer">
                  Nodal Officer Directory
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
