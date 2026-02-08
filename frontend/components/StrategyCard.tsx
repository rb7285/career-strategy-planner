import React from "react";

type StrategyData = {
  recommended_role?: string;
  decision_rationale?: string;
  priority_focus_areas?: string[];
};

type StrategyCardProps = {
  data?: StrategyData | Record<string, unknown>;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export default function StrategyCard({ data }: StrategyCardProps) {
  const recommendedRole =
    typeof (data as StrategyData | undefined)?.recommended_role === "string"
      ? (data as StrategyData).recommended_role
      : "";
  const decisionRationale =
    typeof (data as StrategyData | undefined)?.decision_rationale === "string"
      ? (data as StrategyData).decision_rationale
      : "";
  const focusAreas = toStringArray(
    (data as StrategyData | undefined)?.priority_focus_areas
  );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-lg hover:shadow-black/30">
      <h3 className="text-lg font-semibold text-white">Strategy Recommendation</h3>
      <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-emerald-200">
          Recommended role
        </p>
        <p className="mt-1 text-base font-semibold text-white">
          {recommendedRole || "Recommendation will appear here."}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Decision rationale
        </p>
        <p className="mt-2 text-sm text-zinc-300">
          {decisionRationale || "Rationale will appear after analysis."}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Priority focus areas
        </p>
        {focusAreas.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">None yet</p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 break-words pl-5 text-sm text-zinc-300">
            {focusAreas.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
