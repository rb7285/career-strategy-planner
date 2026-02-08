"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { createCareerPlan } from "@/lib/api";
import MarketInsightsCard from "@/components/MarketInsightsCard";
import SkillAnalysisCard from "@/components/SkillAnalysisCard";
import StrategyCard from "@/components/StrategyCard";
import LoadingState from "@/components/ui/LoadingState";
import RoadmapTimeline from "@/components/sections/RoadmapTimeline";

type CareerPlanResponse = {
  skill_analysis?: Record<string, unknown>;
  market_analysis?: Record<string, unknown>;
  strategy_analysis?: Record<string, unknown>;
  roadmap?: {
    duration_months?: number | string;
    phases?: Array<{ name?: string; focus?: string; weeks?: number[] }>;
    weekly_plan?: Array<{ week?: number; tasks?: string[] }>;
    final_outcome?: string;
  };
};

export default function Home() {
  const [skillsInput, setSkillsInput] = useState("");
  const [experience, setExperience] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CareerPlanResponse | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const skills = useMemo(
    () =>
      skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [skillsInput]
  );

  const hasSkills = skills.length > 0;
  const hasTargetRole = targetRole.trim().length > 0;
  const isFormValid = hasSkills && hasTargetRole;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!isFormValid) {
      setError("Please add at least one skill and a target role.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        user_profile: {
          experience,
          resume_text: `Experience: ${experience}`,
        },
        skills,
        target_roles: targetRole ? [targetRole] : [],
      };

      const data = await createCareerPlan(payload);
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? `We couldn't generate a plan. ${err.message}`
          : "We couldn't generate a plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.45 },
    },
  };

  const cardContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.35 },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(63,63,70,0.35),_transparent_55%)]" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-16">
          <header className="flex flex-col gap-3 sm:gap-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 sm:text-sm">
              AI Career Strategy Planner
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              Plan a decisive, role-aligned career path with AI.
            </h1>
            <p className="max-w-2xl text-base text-zinc-300 sm:text-lg">
              Share your skills, experience, and target role. The planner will
              return skill insights, a strategy recommendation, and a week-by-week
              roadmap.
            </p>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-2xl shadow-black/40 sm:p-6"
            >
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm font-medium text-zinc-300">
                    Skills (comma-separated)
                  </label>
                  <textarea
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
                    rows={3}
                    placeholder="Python, FastAPI, SQL, AWS"
                    value={skillsInput}
                    onChange={(e) => {
                      setSkillsInput(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300">
                    Experience summary
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
                    placeholder="3 years backend engineering, API design, AWS"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300">
                    Target role
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
                    placeholder="Backend Engineer"
                    value={targetRole}
                    onChange={(e) => {
                      setTargetRole(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="mt-2 flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-400 sm:w-auto"
                >
                  Generate career plan
                </button>
                {!isFormValid && !loading && (
                  <p className="text-xs text-zinc-400">
                    Add at least one skill and a target role to continue.
                  </p>
                )}
                {error && <p className="text-sm text-rose-300">{error}</p>}
              </div>
            </form>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
              <h2 className="text-lg font-semibold">What you will get</h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li>Clear strengths and gaps for your target role.</li>
                <li>Market-aligned strategy recommendations.</li>
                <li>A phased roadmap with weekly tasks.</li>
              </ul>
              <div className="mt-6 rounded-xl bg-zinc-950/70 p-4 text-xs text-zinc-400">
                The planner responds with JSON-only outputs so results can be
                reused across agents.
              </div>
            </div>
          </section>

          {loading && (
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <LoadingState />
            </motion.section>
          )}

          {!loading && !result && (
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-400 sm:p-8"
            >
              Submit your details to generate a personalized career plan.
            </motion.section>
          )}

          {!loading && result && (
            <motion.section
              variants={cardContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 lg:grid-cols-3"
            >
              <motion.div variants={cardVariants}>
                <SkillAnalysisCard data={result.skill_analysis} />
              </motion.div>
              <motion.div variants={cardVariants}>
                <MarketInsightsCard data={result.market_analysis} />
              </motion.div>
              <motion.div variants={cardVariants}>
                <StrategyCard data={result.strategy_analysis} />
              </motion.div>
            </motion.section>
          )}

          {!loading && result?.roadmap && (
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              <RoadmapTimeline roadmap={result.roadmap} />
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
