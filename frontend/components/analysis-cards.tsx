import React from "react";

type SkillAnalysisCardProps = {
  data?: Record<string, unknown>;
};

type StrategyCardProps = {
  data?: Record<string, unknown>;
};

type MarketInsightsCardProps = {
  data?: Record<string, unknown>;
};

const baseCardClass =
  "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-lg hover:shadow-black/30";

export function SkillAnalysisCard({ data }: SkillAnalysisCardProps) {
  return (
    <section className={baseCardClass}>
      <h3 className="text-lg font-semibold text-white">Skill Analysis</h3>
      <p className="mt-2 text-sm text-zinc-400">
        Strengths, gaps, and role fit based on your profile.
      </p>
      <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-zinc-950/80 p-4 text-xs text-zinc-200">
        {JSON.stringify(data ?? {}, null, 2)}
      </pre>
    </section>
  );
}

export function StrategyCard({ data }: StrategyCardProps) {
  return (
    <section className={baseCardClass}>
      <h3 className="text-lg font-semibold text-white">Strategy Recommendation</h3>
      <p className="mt-2 text-sm text-zinc-400">
        Recommended role, alternatives, and priority focus areas.
      </p>
      <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-zinc-950/80 p-4 text-xs text-zinc-200">
        {JSON.stringify(data ?? {}, null, 2)}
      </pre>
    </section>
  );
}

export function MarketInsightsCard({ data }: MarketInsightsCardProps) {
  return (
    <section className={baseCardClass}>
      <h3 className="text-lg font-semibold text-white">Market Insights</h3>
      <p className="mt-2 text-sm text-zinc-400">
        In-demand skills, emerging trends, and market gaps.
      </p>
      <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-zinc-950/80 p-4 text-xs text-zinc-200">
        {JSON.stringify(data ?? {}, null, 2)}
      </pre>
    </section>
  );
}
