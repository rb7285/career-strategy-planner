import React from "react";

type MarketInsightsData = {
  in_demand_skills?: string[];
  emerging_skills?: string[];
};

type MarketInsightsCardProps = {
  data?: MarketInsightsData | Record<string, unknown>;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export default function MarketInsightsCard({ data }: MarketInsightsCardProps) {
  const inDemand = toStringArray(
    (data as MarketInsightsData | undefined)?.in_demand_skills
  );
  const emerging = toStringArray(
    (data as MarketInsightsData | undefined)?.emerging_skills
  );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-lg hover:shadow-black/30">
      <h3 className="text-lg font-semibold text-white">Market Insights</h3>
      <p className="mt-2 text-sm text-zinc-400">
        Skills currently in demand and emerging trends.
      </p>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          In-demand skills
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {inDemand.length === 0 ? (
            <span className="text-xs text-zinc-500">None yet</span>
          ) : (
            inDemand.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200"
              >
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Emerging skills
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {emerging.length === 0 ? (
            <span className="text-xs text-zinc-500">None</span>
          ) : (
            emerging.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200"
              >
                {item}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
