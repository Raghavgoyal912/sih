"use client";

import { useState } from "react";

interface Project {
  id: string;
  code: string;
  title: string;
  category: string;
  status: string;
  lead: string;
  progressLabel: string;
  progressValue: number;
  tags: string[];
  date: string;
}

const PROJECTS: Project[] = [
  {
    id: "p1",
    code: "TGR-IND-094",
    title: "Peri-Urban Cadastre & Land Tenure Mapping",
    category: "cadastral active",
    status: "In Progress",
    lead: "Dr. Aisha M. (National Land Commission)",
    progressLabel: "Validation & Survey Metric",
    progressValue: 68,
    tags: ["GIS", "Community Demarcation"],
    date: "Oct 24, 2024",
  },
  {
    id: "p2",
    code: "TGR-IND-182",
    title: "Tribal Valley Customary Boundary Review",
    category: "indigenous",
    status: "Under Review",
    lead: "Carlos V. & Forestry Welfare Board",
    progressLabel: "Satellite Discrepancy Audits",
    progressValue: 92,
    tags: ["Satellite", "Customary Law"],
    date: "Yesterday",
  },
  {
    id: "p3",
    code: "TGR-IND-051",
    title: "Rural Agrarian Parcel Demarcation Pilot",
    category: "cadastral active",
    status: "Field Phase",
    lead: "Sarah Jenkins (Cadastral Services)",
    progressLabel: "Drone Orthomosaic Vector Plotting",
    progressValue: 45,
    tags: ["Field Survey", "Drone DEM"],
    date: "2 hours ago",
  },
  {
    id: "p4",
    code: "TGR-IND-309",
    title: "State Mineral Rights Registry Audit",
    category: "cadastral",
    status: "Archival Phase",
    lead: "Marcus Thorne (Geological Survey of India)",
    progressLabel: "Title De-duplication & Encumbrance",
    progressValue: 84,
    tags: ["Subsurface", "Mining Rights"],
    date: "3 days ago",
  },
];

export default function CollaboratePage() {
  const [activeTab, setActiveTab] = useState<"workspace" | "innovation" | "access">("workspace");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("surveyor");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredProjects = PROJECTS.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category.includes(activeCategory);
    const matchesQuery =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lead.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-6rem)]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-xl border border-surface-container flex items-center gap-3 animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">
            verified
          </span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-on-primary/60 hover:text-on-primary"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header Strip & Navigation Sub-Tabs */}
      <div className="w-full bg-surface-container-lowest border-b border-surface-container shadow-sm px-4 lg:px-8 py-5">
        <div className="max-w-[88rem] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-wider font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">hub</span>
              <span>Civic Horizon • Inter-Agency Network</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Land Governance Collaboration Hub
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
              Collaborative workspace connecting state surveyors, academic researchers, and legal practitioners for cross-jurisdictional tenure harmonization.
            </p>
          </div>

          {/* Sub-view switcher tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-surface-container self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("workspace")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "workspace"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              <span>Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("innovation")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "innovation"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
              <span>Grants &amp; Labs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("access")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "access"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">badge</span>
              <span>Role Access</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-6">
        {/* TAB 1: SHARED WORKSPACE */}
        {activeTab === "workspace" && (
          <div className="space-y-6">
            {/* Phase 2 Civic Pill Banner */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-surface-container shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold block">
                    Statutory Rollout
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-primary">
                    Phase 2 — Multi-Agency Collaborative Demarcation Pilot Active
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  showToast("Phase 2 project creation engine unlocks in next statutory cycle.")
                }
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                <span>Early Access</span>
              </button>
            </div>

            {/* Search & Category Filter Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: "all", label: "All Initiatives (4)" },
                  { id: "cadastral", label: "Cadastral Surveys" },
                  { id: "indigenous", label: "Customary Claims" },
                  { id: "active", label: "Active Demarcations" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setActiveCategory(pill.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                      activeCategory === pill.id
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Live Search Input */}
              <div className="relative w-full sm:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter projects or lead..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-container-lowest text-xs text-primary border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Projects Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProjects.map((p) => (
                <article
                  key={p.id}
                  className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-secondary uppercase">
                            {p.code}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant" />
                          <span className="text-[11px] font-mono text-on-surface-variant">
                            {p.date}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-primary">{p.title}</h3>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                          p.status === "In Progress"
                            ? "bg-secondary-container text-on-secondary-container"
                            : p.status === "Under Review"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-surface-container-high text-primary"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant mb-4">
                      Lead Investigator: <strong className="text-primary font-semibold">{p.lead}</strong>
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-on-surface-variant">{p.progressLabel}</span>
                        <span className="font-bold text-secondary">{p.progressValue}%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-1.5">
                        <div
                          className="bg-secondary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${p.progressValue}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer tags and action */}
                  <div className="pt-3 border-t border-surface-container/60 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-on-surface-variant font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        showToast(`Docket dossier ${p.code} requested for review.`)
                      }
                      className="text-xs text-primary font-bold hover:text-secondary flex items-center gap-1 transition-colors"
                    >
                      <span>Open Workspace</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="p-10 rounded-xl bg-surface-container-lowest border border-surface-container text-center">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">
                  folder_off
                </span>
                <p className="text-sm font-semibold text-primary">No matching initiatives found</p>
                <p className="text-xs text-on-surface-variant mt-1">Try broadening your search query or reset filters.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INNOVATION & GRANTS PORTAL */}
        {activeTab === "innovation" && (
          <div className="space-y-6">
            {/* Impact Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm text-center">
                <span className="text-xs text-on-surface-variant font-semibold">Total Grant Pool</span>
                <span className="text-3xl font-extrabold text-primary block mt-1">₹1.85 Cr</span>
                <span className="text-xs text-secondary font-medium">Active FY2025</span>
              </div>
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm text-center">
                <span className="text-xs text-on-surface-variant font-semibold">Research Proposals</span>
                <span className="text-3xl font-extrabold text-primary block mt-1">142</span>
                <span className="text-xs text-on-surface-variant">Under Review</span>
              </div>
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm text-center">
                <span className="text-xs text-on-surface-variant font-semibold">Tenure Labs</span>
                <span className="text-3xl font-extrabold text-primary block mt-1">8 Partnered</span>
                <span className="text-xs text-secondary font-medium">DoLR &amp; NIC</span>
              </div>
            </div>

            {/* Grant Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded">
                  Open RFP // CY-2025
                </span>
                <h3 className="text-base font-bold text-primary">
                  AI-Assisted Cadastral Topology Verification Grant
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Funding civic tech teams building neural boundary discrepancy detectors for rural land registries.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                  <span className="text-xs font-mono font-bold text-primary">Grant: ₹25,00,000</span>
                  <button
                    type="button"
                    onClick={() => showToast("Grant prospectus downloaded.")}
                    className="text-xs font-semibold text-primary hover:text-secondary"
                  >
                    View Guidelines →
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded">
                  Hackathon Track
                </span>
                <h3 className="text-base font-bold text-primary">
                  Customary Tenure Digital Registry Challenge
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Decentralized provenance protocols for indigenous community land titling and gazetted verification.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                  <span className="text-xs font-mono font-bold text-primary">Prize: ₹15,00,000</span>
                  <button
                    type="button"
                    onClick={() => showToast("Registration link sent to session desk.")}
                    className="text-xs font-semibold text-primary hover:text-secondary"
                  >
                    Register Team →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ROLE-BASED ACCESS GOVERNANCE PREVIEW */}
        {activeTab === "access" && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <h3 className="text-lg font-bold text-primary">National Portal Access</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                Select your institutional credential archetype to preview authorized workspace privileges.
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: "surveyor",
                  title: "Cadastral Surveyor",
                  desc: "Field parcel boundary recording, drone DEM ingest, and vector coordinate certification.",
                  icon: "edit_location",
                },
                {
                  id: "magistrate",
                  title: "Revenue Court Magistrate",
                  desc: "Adjudication of contested deeds, encumbrance caveats, and statutory ceiling variances.",
                  icon: "gavel",
                },
                {
                  id: "researcher",
                  title: "Policy & Academic Fellow",
                  desc: "Differential privacy research queries, macro-economic simulation, and legislative analysis.",
                  icon: "school",
                },
              ].map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    selectedRole === role.id
                      ? "bg-surface-container-low border-secondary shadow-sm"
                      : "bg-surface-container-lowest border-surface-container hover:bg-surface-container-low/50"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-secondary mt-0.5">
                    {role.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{role.title}</span>
                      {selectedRole === role.id && (
                        <span className="material-symbols-outlined text-[18px] text-secondary">
                          check_circle
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                      {role.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                showToast(`Session mock authenticated under [${selectedRole.toUpperCase()}] role privileges.`)
              }
              className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
            >
              Simulate Institutional Sign-In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
