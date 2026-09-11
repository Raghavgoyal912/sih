"use client";

import { useState, useEffect } from "react";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type SearchResult = {
  id: string;
  title: string;
  snippet: string;
  score: number;
  metadata?: Record<string, any>;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("urban land dispute reduction strategies");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([
    "Western Zone (Reg 07)",
    "Rift Basin Authority",
  ]);
  const [selectedTenancy, setSelectedTenancy] = useState<string[]>([
    "Customary / Allodial",
    "Statutory Freehold",
  ]);

  const runSearch = async (query: string) => {
    if (!query.trim()) return;
    setStatus("loading");
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const res = await fetch(`${API_BASE}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, includeInsight: true }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Search failed (${res.status})`);
      }

      const data = await res.json();
      setResults(data.results || []);
      setInsight(data.insight || null);
      setStatus("idle");
    } catch (err: any) {
      console.error("Search error:", err);
      setErrorMessage(err.message || "Something went wrong while searching. Is the backend running?");
      setResults([]);
      setInsight(null);
      setStatus("error");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handlePreset = (preset: string) => {
    setSearchQuery(preset);
    runSearch(preset);
  };

  const handleCopyCitation = () => {
    if (!insight) return;
    navigator.clipboard.writeText(insight);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("cadastral-search-input");
        if (input) {
          input.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleJurisdiction = (j: string) => {
    setSelectedJurisdictions((prev) =>
      prev.includes(j) ? prev.filter((item) => item !== j) : [...prev, j]
    );
  };

  const toggleTenancy = (t: string) => {
    setSelectedTenancy((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-6rem)]">
      <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-6">
        {/* Top Context Header Strip */}
        <div className="w-full pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-container/60 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-secondary text-xs uppercase tracking-wider font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>Repository Archive • Statutory Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight font-serif">
              Jurisprudence &amp; Cadastral Research Corpus
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
              Inter-jurisdictional legal precedents, verified parcel deeds, and empirical customary tenure documentation across 114 civic registries.
            </p>
          </div>
        </div>

        {/* Primary Search Module */}
        <section className="w-full bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container/60 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
            <div className="relative flex flex-col sm:flex-row items-stretch bg-surface-container-low rounded-lg p-1 focus-within:ring-2 focus-within:ring-secondary focus-within:bg-surface-container-lowest transition-all border border-surface-container">
              <div className="flex items-center pl-3 pr-2 text-primary pointer-events-none">
                <span className="material-symbols-outlined text-[22px]">search</span>
              </div>
              <input
                id="cadastral-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search statutory compendiums, case citations, or parcel IDs..."
                className="w-full bg-transparent py-2.5 px-1 text-sm md:text-base text-primary placeholder:text-on-surface-variant/60 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 pr-1.5 shrink-0 self-center">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Clear Search"
                    className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-surface-container text-on-surface-variant font-mono text-[11px] select-none">
                  <span>⌘</span>K
                </kbd>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-1.5 bg-primary hover:bg-secondary text-on-primary text-xs font-semibold px-4 py-2 rounded transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">manage_search</span>
                  <span>{status === "loading" ? "Searching..." : "Search Archive"}</span>
                </button>
              </div>
            </div>

            {/* Quick Queries */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant pt-1">
              <span className="font-semibold text-primary">Quick Queries:</span>
              {[
                "Customary tenure reform 2024",
                "Agrarian ceiling exemptions",
                "Tribal tenancy alienation",
                "ULPIN boundary dispute",
              ].map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => handlePreset(query)}
                  className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary text-[11px] transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </form>
        </section>

        {status === "idle" && hasSearched && (
          <div className="mb-4 text-xs font-mono text-on-surface-variant">
            {results.length} result{results.length === 1 ? "" : "s"} found
          </div>
        )}

        {/* Main 2-Column Layout (Filters + Results / Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Faceted Filters Sidebar */}
          <aside className="lg:col-span-4 bg-surface-container-lowest p-5 rounded-xl border border-surface-container/60 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="text-xs uppercase font-bold tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
                Faceted Filters
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedJurisdictions([]);
                  setSelectedTenancy([]);
                }}
                className="text-[11px] text-secondary hover:underline font-semibold"
              >
                Reset Filters
              </button>
            </div>

            {/* Jurisdictions Filter */}
            <div>
              <h4 className="text-xs font-bold text-on-surface mb-2.5">Jurisdiction &amp; State</h4>
              <div className="space-y-1.5">
                {[
                  "Western Zone (Reg 07)",
                  "Rift Basin Authority",
                  "Central Highland Zone (Reg 01)",
                  "Coastal Maritime Tehsil",
                  "North-East Autonomous Council",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer hover:text-on-surface select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedJurisdictions.includes(item)}
                      onChange={() => toggleJurisdiction(item)}
                      className="rounded border-outline-variant text-primary focus:ring-primary w-3.5 h-3.5"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tenancy Classification */}
            <div className="pt-3 border-t border-surface-container">
              <h4 className="text-xs font-bold text-on-surface mb-2.5">Tenure Classification</h4>
              <div className="space-y-1.5">
                {[
                  "Customary / Allodial",
                  "Statutory Freehold",
                  "State Trust Land",
                  "Usufructuary Leasehold",
                  "Agrarian Ceiling Reserve",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer hover:text-on-surface select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTenancy.includes(item)}
                      onChange={() => toggleTenancy(item)}
                      className="rounded border-outline-variant text-primary focus:ring-primary w-3.5 h-3.5"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dispute Status */}
            <div className="pt-3 border-t border-surface-container">
              <h4 className="text-xs font-bold text-on-surface mb-2.5">Adjudication Status</h4>
              <div className="space-y-1.5 text-xs text-on-surface-variant">
                <label className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
                  <input type="radio" name="disputeStatus" defaultChecked className="text-primary focus:ring-primary w-3.5 h-3.5" />
                  <span>All Precedents</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
                  <input type="radio" name="disputeStatus" className="text-primary focus:ring-primary w-3.5 h-3.5" />
                  <span>Settled / Binding Ratio</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
                  <input type="radio" name="disputeStatus" className="text-primary focus:ring-primary w-3.5 h-3.5" />
                  <span>Active Caveat / Pending Appeal</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Results & Synthesis Column */}
          <main className="lg:col-span-8 space-y-6">
            {/* Loading state */}
            {status === "loading" && (
              <div className="space-y-4">
                <div className="p-8 rounded-xl bg-surface-container-lowest border border-surface-container text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-3 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
                  <h4 className="text-base font-bold text-primary mb-1">Searching the archive...</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm">
                    Running semantic search against indexed research and policy documents.
                  </p>
                </div>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container space-y-3 animate-pulse"
                  >
                    <div className="h-4 bg-surface-container rounded w-1/3" />
                    <div className="h-5 bg-surface-container rounded w-3/4" />
                    <div className="h-3 bg-surface-container rounded w-full" />
                    <div className="h-3 bg-surface-container rounded w-5/6" />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {status === "error" && (
              <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800">
                <p className="font-semibold text-sm mb-1">Search failed</p>
                <p className="text-xs">{errorMessage}</p>
              </div>
            )}

            {/* Results (real data) */}
            {status === "idle" && hasSearched && results.length > 0 && (
              <div className="space-y-4">
                {insight && (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-secondary/30 shadow-sm flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        <span>AI Insight</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCitation}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-lowest text-xs font-semibold text-primary hover:bg-surface-container transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[15px] text-secondary">
                          {copiedCitation ? "done" : "content_copy"}
                        </span>
                        <span>{copiedCitation ? "Copied!" : "Copy Insight"}</span>
                      </button>
                    </div>
                    <p className="text-xs md:text-sm text-on-surface leading-relaxed">{insight}</p>
                  </div>
                )}

                {results.map((result) => (
                  <article
                    key={result.id}
                    className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                        Relevance: {(result.score * 100).toFixed(1)}%
                      </span>
                      {result.metadata?.is_real_source && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          Verified source
                        </span>
                      )}
                    </div>
 
                    <h3 className="text-base md:text-lg font-bold text-primary mb-2 font-serif">
                      {result.title}
                    </h3>
 
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-3">
                      {result.snippet}
                    </p>
 
                    {result.metadata?.source_url && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-surface-container/60">
                        <span className="text-[11px] text-on-surface-variant italic">
                          {result.metadata.source_name || 'External source'}
                        </span>
                        <a
                          href={result.metadata.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary font-bold hover:text-secondary flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          <span>View Source</span>
                        </a>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {/* Empty state (real, based on actual empty results) */}
            {status === "idle" && hasSearched && results.length === 0 && (
              <div className="p-12 rounded-xl bg-surface-container-lowest border border-surface-container text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-4">
                  <span className="material-symbols-outlined text-[32px]">manage_search</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">No Matching Statutes or Precedents Found</h3>
                <p className="text-xs text-on-surface-variant max-w-md mb-6 leading-relaxed">
                  We could not find records matching your specific query. Try broadening your terms, or check back once more documents have been indexed.
                </p>
                <button
                  type="button"
                  onClick={() => handlePreset("urban land dispute reduction strategies")}
                  className="px-4 py-2 rounded bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors"
                >
                  Reset to Default Query
                </button>
              </div>
            )}

            {/* Initial state, before any search has run */}
            {!hasSearched && status === "idle" && (
              <div className="p-12 rounded-xl bg-surface-container-lowest border border-surface-container text-center flex flex-col items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] mb-3">search</span>
                <p className="text-sm">Enter a query above and click "Search Archive" to begin.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}