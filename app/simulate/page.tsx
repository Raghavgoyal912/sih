"use client";

import { useState, useMemo } from "react";

export default function SimulatePage() {
  const [ceiling, setCeiling] = useState<number>(5);
  const [fee, setFee] = useState<number>(25);
  const [activePreset, setActivePreset] = useState<string>("Base Scenario");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  
  // Heuristic model calculations
  const metrics = useMemo(() => {
    const formRate = (61.4 + fee * 0.45 - ceiling * 0.2).toFixed(1);
    const rev = (40.1 - fee * 0.15 + ceiling * 0.35).toFixed(1);
    const parcels = Math.round(11610 + fee * 120 + ceiling * 80);
    const regDays = Math.max(18, Math.round(94 - fee * 1.8 - ceiling * 0.5));
    const deedsK = (28.4 + fee * 0.42 + ceiling * 0.1).toFixed(1);
    const inclusion = Math.min(99, Math.round(52 + fee * 0.85 - ceiling * 0.3));
    const dispute = Math.max(2.1, 8.4 - fee * 0.12 - ceiling * 0.05).toFixed(1);

    return {
      formalizationRate: formRate,
      revenueM: rev,
      parcelCount: parcels,
      registrationDays: regDays,
      deedsCountK: deedsK,
      inclusionScore: inclusion,
      disputeRisk: dispute,
    };
  }, [ceiling, fee]);

  const handlePreset = (name: string, newCeiling: number, newFee: number) => {
    setActivePreset(name);
    setCeiling(newCeiling);
    setFee(newFee);
    triggerPulse();
  };

  const handleReset = () => {
    setActivePreset("Base Scenario");
    setCeiling(5);
    setFee(25);
    triggerPulse();
  };

  const triggerPulse = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 250);
  };

  const handleSaveScenario = () => {
    setSavedFeedback("Scenario configuration saved to session ledger!");
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  const handleExportPDF = () => {
    setSavedFeedback("Generating official statutory assessment PDF report...");
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-6rem)]">
      {/* Top Banner & Presets Strip */}
      <div className="w-full px-4 lg:px-8 py-5 bg-surface-container-lowest border-b border-surface-container shadow-sm">
        <div className="max-w-[88rem] mx-auto space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded">
                  Analytical Work-Plane
                </span>
                <span className="text-on-surface-variant font-mono text-xs">•</span>
                <span className="text-xs font-mono text-on-surface-variant">
                  Model: Heuristic Micro-Rules v3.4
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                Cadastral Policy Impact Simulator
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
                Simulate fiscal yield, formalization velocity, and parcel distribution under proposed legislative amendments.
              </p>
            </div>

            {/* Top Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveScenario}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                <span>Save Scenario</span>
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span>Export Assessment PDF</span>
              </button>
            </div>
          </div>

          {savedFeedback && (
            <div className="p-2.5 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{savedFeedback}</span>
            </div>
          )}

          {/* Preset Buttons & Baseline Readout */}
          <div className="pt-2 border-t border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold mr-1">
                Presets:
              </span>
              {[
                { name: "Base Scenario", c: 5, f: 25 },
                { name: "Agrarian Reform 2025", c: -10, f: 35 },
                { name: "Urban Infill Incentive", c: 15, f: 10 },
                { name: "Revenue Maximization", c: 0, f: 0 },
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handlePreset(p.name, p.c, p.f)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    activePreset === p.name
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-on-surface-variant">
              <span className="bg-surface-container-low px-2 py-0.5 rounded border border-surface-container">
                Baseline: FY2024 Audited Cadastre
              </span>
              <span className="bg-surface-container-low px-2 py-0.5 rounded border border-surface-container">
                Cohort: 428,500 Parcels
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workplane */}
      <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Policy Levers */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">tune</span>
                  <h2 className="text-base font-bold text-primary">Policy Levers &amp; Scope</h2>
                </div>
                <span className="text-[11px] font-mono text-secondary font-bold">Interactive</span>
              </div>

              {/* Lever 1: Land Ceiling Adjustment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-primary block">
                      Land Ceiling Adjustment
                    </label>
                    <span className="text-[11px] text-on-surface-variant">
                      Relative to Statutory Model Cap
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-primary bg-surface-container px-2 py-0.5 rounded">
                    {ceiling >= 0 ? `+${ceiling.toFixed(1)}%` : `${ceiling.toFixed(1)}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="0.5"
                  value={ceiling}
                  onChange={(e) => {
                    setCeiling(parseFloat(e.target.value));
                    setActivePreset("Custom");
                    triggerPulse();
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                  <span>-20% Strict Redistribution</span>
                  <span>Baseline (0%)</span>
                  <span>+20% Consolidation</span>
                </div>
              </div>

              {/* Lever 2: Stamp Duty Fee Reduction */}
              <div className="space-y-2 pt-2 border-t border-surface-container/60">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-primary block">
                      Stamp Duty &amp; Registration Fee Reduction
                    </label>
                    <span className="text-[11px] text-on-surface-variant">
                      Subsidy applied to title registration
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                    {fee.toFixed(1)}% Reduced
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={fee}
                  onChange={(e) => {
                    setFee(parseFloat(e.target.value));
                    setActivePreset("Custom");
                    triggerPulse();
                  }}
                  className="w-full accent-secondary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                  <span>0% (Standard Rates)</span>
                  <span>25% (Moderate Relief)</span>
                  <span>50% (Max Incentive)</span>
                </div>
              </div>

              {/* Additional Toggles */}
              <div className="pt-2 border-t border-surface-container/60 space-y-2.5">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                  Conditional Provisions
                </h4>

                <label className="flex items-center justify-between text-xs text-on-surface cursor-pointer p-2 rounded bg-surface-container-low hover:bg-surface-container transition-colors">
                  <span>Tenancy Formalization Fast-Track Window</span>
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                </label>

                <label className="flex items-center justify-between text-xs text-on-surface cursor-pointer p-2 rounded bg-surface-container-low hover:bg-surface-container transition-colors">
                  <span>Agrarian Conversion Surcharge (+12%)</span>
                  <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
                </label>

                <label className="flex items-center justify-between text-xs text-on-surface cursor-pointer p-2 rounded bg-surface-container-low hover:bg-surface-container transition-colors">
                  <span>Customary Clan Land Protection Buffer</span>
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                </label>
              </div>

              <button
                type="button"
                onClick={triggerPulse}
                className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Recalculate Projections</span>
              </button>
            </div>
          </div>

          {/* Right Column: Projected Impact Metrics */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary KPI Row */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-transform duration-150 ${
                isSimulating ? "scale-[0.99] opacity-90" : "scale-100 opacity-100"
              }`}
            >
              <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-sm flex flex-col justify-between">
                <span className="text-xs text-on-surface-variant font-semibold">
                  Formalization Velocity
                </span>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-secondary tracking-tight">
                    {metrics.formalizationRate}%
                  </span>
                </div>
                <span className="text-[11px] text-secondary font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +12.4% vs Baseline
                </span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-sm flex flex-col justify-between">
                <span className="text-xs text-on-surface-variant font-semibold">
                  Projected Fiscal Yield
                </span>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-primary tracking-tight">
                    ${metrics.revenueM}M
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Annualized Treasury Run-rate
                </span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-sm flex flex-col justify-between">
                <span className="text-xs text-on-surface-variant font-semibold">
                  Registered Parcels
                </span>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-primary tracking-tight">
                    {metrics.parcelCount.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] text-secondary font-medium">
                  Newly Formalized Titles
                </span>
              </div>
            </div>

            {/* Secondary Indicators Panel */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container shadow-sm space-y-5">
              <h3 className="text-xs uppercase font-bold tracking-wider text-primary border-b border-surface-container pb-2">
                Secondary Administrative Indicators
              </h3>

              {/* Bar 1: Registration Time */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface font-medium">Average Registration Latency</span>
                  <span className="font-mono font-bold text-primary">{metrics.registrationDays} days</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, metrics.registrationDays)}%` }}
                  />
                </div>
              </div>

              {/* Bar 2: Formalized Deeds */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface font-medium">Deeds Formalized (Annual)</span>
                  <span className="font-mono font-bold text-secondary">{metrics.deedsCountK}k Deeds</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, parseFloat(metrics.deedsCountK) * 2)}%` }}
                  />
                </div>
              </div>

              {/* Bar 3: Marginal Land Inclusion */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface font-medium">Smallholder Inclusion Index</span>
                  <span className="font-mono font-bold text-primary">{metrics.inclusionScore} / 100</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.inclusionScore}%` }}
                  />
                </div>
              </div>

              {/* Bar 4: Dispute Risk Index */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface font-medium">Tenure Dispute Likelihood</span>
                  <span className="font-mono font-bold text-rose-600">{metrics.disputeRisk}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, parseFloat(metrics.disputeRisk) * 10)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Scenario Comparative Summary */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-sm">
              <h4 className="text-xs uppercase font-bold tracking-wider text-primary mb-3">
                Scenario Variance Ledger
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-container text-on-surface-variant font-mono">
                      <th className="py-2">Dimension</th>
                      <th className="py-2">FY24 Base</th>
                      <th className="py-2">Simulated</th>
                      <th className="py-2">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container/60">
                    <tr>
                      <td className="py-2 font-medium text-primary">Formalization Velocity</td>
                      <td className="py-2 text-on-surface-variant">52.0%</td>
                      <td className="py-2 font-bold text-secondary">{metrics.formalizationRate}%</td>
                      <td className="py-2 text-secondary font-mono">
                        +{(parseFloat(metrics.formalizationRate) - 52.0).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-primary">Net Treasury Yield</td>
                      <td className="py-2 text-on-surface-variant">$38.2M</td>
                      <td className="py-2 font-bold text-primary">${metrics.revenueM}M</td>
                      <td className="py-2 text-primary font-mono">
                        {(parseFloat(metrics.revenueM) - 38.2 >= 0 ? "+" : "") +
                          (parseFloat(metrics.revenueM) - 38.2).toFixed(1)}
                        M
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-primary">Court Injunction Risk</td>
                      <td className="py-2 text-on-surface-variant">9.2%</td>
                      <td className="py-2 font-bold text-emerald-600">{metrics.disputeRisk}%</td>
                      <td className="py-2 text-emerald-600 font-mono">
                        {(parseFloat(metrics.disputeRisk) - 9.2).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
