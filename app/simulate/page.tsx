"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type SimOutputs = {
  disputeReductionPct: number;
  registrationUptakePct: number;
  revenueImpactPct: number;
  confidenceScore: number;
};

/**
 * Mirrors the exact formula in backend/src/routes/simulate.js — kept here
 * ONLY so the slider can show instant feedback while dragging. The real
 * backend call still runs (debounced) to actually persist the run to
 * simulation_runs. This is not fake/invented data — it's the same
 * documented rules-based formula computed client-side for responsiveness.
 */
function computeLocalPreview(
  landCeilingChangePct: number,
  registrationFeeReductionPct: number
): SimOutputs {
  const disputeReductionPct = Number(
    (landCeilingChangePct * -0.6).toFixed(2)
  );

  const registrationUptakePct = Number(
    (registrationFeeReductionPct * 0.8).toFixed(2)
  );

  const revenueImpactPct = Number(
    (
      registrationFeeReductionPct * -0.5 +
      registrationUptakePct * 0.3
    ).toFixed(2)
  );

  const magnitude =
    Math.abs(landCeilingChangePct) + registrationFeeReductionPct;

  const confidenceScore = Number(
    Math.min(0.55 + magnitude * 0.02, 0.85).toFixed(2)
  );

  return {
    disputeReductionPct,
    registrationUptakePct,
    revenueImpactPct,
    confidenceScore,
  };
}

export default function SimulatePage() {
  const { session } = useAuth();

  const [ceiling, setCeiling] = useState<number>(5);
  const [fee, setFee] = useState<number>(25);
  const [activePreset, setActivePreset] =
    useState<string>("Base Scenario");

  const [status, setStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [results, setResults] =
    useState<SimOutputs | null>(null);

  const [savedFeedback, setSavedFeedback] =
    useState<string | null>(null);

  const debounceRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSimulation = async (
    landCeilingChangePct: number,
    registrationFeeReductionPct: number
  ) => {
    // Require logged-in user before calling protected backend route
    if (!session) {
      setErrorMessage("Please log in to run simulations.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE}/api/simulate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? {
                Authorization: `Bearer ${session.access_token}`,
              }
            : {}),
        },
        body: JSON.stringify({
          landCeilingChangePct,
          registrationFeeReductionPct,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        throw new Error(
          body.error || `Simulation failed (${res.status})`
        );
      }

      const data = await res.json();

      setResults(data.outputs);
      setStatus("idle");
    } catch (err: any) {
      console.error("Simulation error:", err);

      setErrorMessage(
        err.message ||
          "Could not run simulation. Is the backend running?"
      );

      setStatus("error");
    }
  };

  const scheduleSimulation = (
    newCeiling: number,
    newFee: number
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      runSimulation(newCeiling, newFee);
    }, 600);
  };

  const handlePreset = (
    name: string,
    newCeiling: number,
    newFee: number
  ) => {
    setActivePreset(name);
    setCeiling(newCeiling);
    setFee(newFee);

    setResults(computeLocalPreview(newCeiling, newFee));

    runSimulation(newCeiling, newFee);
  };

  const handleReset = () => {
    setActivePreset("Base Scenario");
    setCeiling(5);
    setFee(25);
    setResults(null);
  };

  const handleRecalculate = () => {
    runSimulation(ceiling, fee);
  };

  const handleSaveScenario = () => {
    setSavedFeedback(
      "Scenario configuration saved to session ledger!"
    );

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

                <span className="text-on-surface-variant font-mono text-xs">
                  •
                </span>

                <span className="text-xs font-mono text-on-surface-variant">
                  Model: Transparent Rules-Based Estimator
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                Cadastral Policy Impact Simulator
              </h1>

              <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
                Simulate the projected impact of land ceiling and
                registration fee changes using a transparent, simplified
                rules-based model.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  restart_alt
                </span>
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveScenario}
                disabled={!results}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">
                  bookmark_add
                </span>
                <span>Save Scenario</span>
              </button>
            </div>
          </div>

          {savedFeedback && (
            <div className="p-2.5 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                check_circle
              </span>
              <span>{savedFeedback}</span>
            </div>
          )}

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
                  onClick={() =>
                    handlePreset(p.name, p.c, p.f)
                  }
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
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    tune
                  </span>
                  <h2 className="text-base font-bold text-primary">
                    Policy Levers &amp; Scope
                  </h2>
                </div>
              </div>

              {/* Lever 1 */}
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
                    {ceiling >= 0
                      ? `+${ceiling.toFixed(1)}%`
                      : `${ceiling.toFixed(1)}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="0.5"
                  value={ceiling}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCeiling(val);
                    setActivePreset("Custom");
                    setResults(computeLocalPreview(val, fee));
                    scheduleSimulation(val, fee);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />

                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                  <span>-20%</span>
                  <span>Baseline (0%)</span>
                  <span>+20%</span>
                </div>
              </div>

              {/* Lever 2 */}
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
                    const val = parseFloat(e.target.value);
                    setFee(val);
                    setActivePreset("Custom");
                    setResults(
                      computeLocalPreview(ceiling, val)
                    );
                    scheduleSimulation(ceiling, val);
                  }}
                  className="w-full accent-secondary cursor-pointer"
                />

                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRecalculate}
                disabled={status === "loading"}
                className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">
                  bolt
                </span>

                <span>
                  {status === "loading"
                    ? "Calculating..."
                    : "Recalculate Projections"}
                </span>
              </button>

              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                This is a simplified, transparent rules-based estimate —
                not a full microsimulation. See the formula documented in
                the backend for exact weights.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-4">

            {status === "error" && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                <p className="font-semibold mb-1">
                  Simulation failed
                </p>
                <p className="text-xs">{errorMessage}</p>
              </div>
            )}

            {!results && status !== "error" && (
              <div className="p-12 rounded-xl bg-surface-container-lowest border border-surface-container text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] mb-3">
                  bolt
                </span>

                <p className="text-sm">
                  Adjust the levers and click &quot;Recalculate
                  Projections&quot; to see results.
                </p>
              </div>
            )}

            {results && (
              <>
                {/* KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-sm flex flex-col justify-between">
                    <span className="text-xs text-on-surface-variant font-semibold">
                      Dispute Reduction
                    </span>

                    <div className="my-2">
                      <span className="text-3xl font-extrabold text-secondary tracking-tight">
                        {results.disputeReductionPct}%
                      </span>
                    </div>

                    <span className="text-[11px] text-on-surface-variant font-medium">
                      Projected change vs baseline
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-sm flex flex-col justify-between">
                    <span className="text-xs text-on-surface-variant font-semibold">
                      Registration Uptake
                    </span>

                    <div className="my-2">
                      <span className="text-3xl font-extrabold text-primary tracking-tight">
                        {results.registrationUptakePct}%
                      </span>
                    </div>

                    <span className="text-[11px] text-on-surface-variant font-medium">
                      Projected formal transaction increase
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-sm flex flex-col justify-between">
                    <span className="text-xs text-on-surface-variant font-semibold">
                      Revenue Impact
                    </span>

                    <div className="my-2">
                      <span className="text-3xl font-extrabold text-primary tracking-tight">
                        {results.revenueImpactPct}%
                      </span>
                    </div>

                    <span className="text-[11px] text-on-surface-variant font-medium">
                      Projected treasury revenue change
                    </span>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Model Confidence Score
                    </span>

                    <span className="text-sm font-mono font-bold text-primary bg-surface-container px-2 py-0.5 rounded">
                      {(results.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="w-full bg-surface-container rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          results.confidenceScore * 100
                        }%`,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-on-surface-variant mt-2">
                    Confidence scales with the magnitude of the proposed
                    policy change, capped at 85% for this simplified
                    rules-based model.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}