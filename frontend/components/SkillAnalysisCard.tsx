import React from "react";

type RoleFit = {
  role?: string;
  fit_score?: number;
  notes?: string;
};

type SkillAnalysisData = {
  summary?: string;
  strengths?: string[];
  gaps?: string[];
  role_fit?: RoleFit[];
};

type SkillAnalysisCardProps = {
  data?: SkillAnalysisData | Record<string, unknown>;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export default function SkillAnalysisCard({ data }: SkillAnalysisCardProps) {
  const summary =
    typeof (data as SkillAnalysisData | undefined)?.summary === "string"
      ? (data as SkillAnalysisData).summary
      : "";
  const strengths = toStringArray((data as SkillAnalysisData | undefined)?.strengths);
  const gaps = toStringArray((data as SkillAnalysisData | undefined)?.gaps);
  const roleFit = Array.isArray((data as SkillAnalysisData | undefined)?.role_fit)
    ? ((data as SkillAnalysisData).role_fit as RoleFit[])
    : [];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-lg hover:shadow-black/30">
      <h3 className="text-lg font-semibold text-white">Skill Analysis</h3>
      <p className="mt-2 text-sm text-zinc-400">
        {summary || "Summary will appear after analysis."}
      </p>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Strengths</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {strengths.length === 0 ? (
            <span className="text-xs text-zinc-500">None yet</span>
          ) : (
            strengths.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
              >
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Gaps</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {gaps.length === 0 ? (
            <span className="text-xs text-zinc-500">None yet</span>
          ) : (
            gaps.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200"
              >
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Role fit</p>
        <div className="mt-3 space-y-2">
          {roleFit.length === 0 ? (
            <p className="text-xs text-zinc-500">Role fit details will appear here.</p>
          ) : (
            roleFit.map((item, index) => (
              <div
                key={`${item.role ?? "role"}-${index}`}
                className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2"
              >
                <div className="flex items-center justify-between text-sm text-white">
                  <span className="font-medium">{item.role ?? "Role"}</span>
                  <span className="text-xs text-zinc-400">
                    Fit score: {item.fit_score ?? "N/A"}
                  </span>
                </div>
                {item.notes && (
                  <p className="mt-1 text-xs text-zinc-400">{item.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
