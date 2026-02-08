"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type RoadmapPhase = {
  name?: string;
  focus?: string;
  weeks?: number[];
};

type WeeklyPlan = {
  week?: number;
  tasks?: string[];
};

type RoadmapData = {
  phases?: RoadmapPhase[];
  weekly_plan?: WeeklyPlan[];
  final_outcome?: string;
};

type RoadmapTimelineProps = {
  roadmap?: RoadmapData | null;
};

export default function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  const phases = roadmap?.phases ?? [];
  const weeklyPlan = roadmap?.weekly_plan ?? [];
  const [openPhase, setOpenPhase] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const weeksByPhase = useMemo(() => {
    return phases.map((phase) => {
      if (!phase?.weeks || phase.weeks.length === 0) {
        return weeklyPlan;
      }
      return weeklyPlan.filter((week) =>
        phase.weeks?.includes(week.week ?? -1)
      );
    });
  }, [phases, weeklyPlan]);

  const phaseVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.3 },
    },
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">Roadmap Timeline</h3>
        <p className="text-sm text-zinc-400">
          {roadmap?.final_outcome ??
            "A phased roadmap will appear once your plan is generated."}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {phases.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-500">
            No phases available yet.
          </p>
        ) : (
          phases.map((phase, index) => {
            const isOpen = openPhase === index;
            return (
              <motion.div
                key={`${phase?.name ?? "phase"}-${index}`}
                variants={phaseVariants}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-zinc-800 bg-zinc-950/60"
              >
                <button
                  type="button"
                  onClick={() => setOpenPhase(isOpen ? null : index)}
                  className="flex w-full flex-col items-start justify-between gap-3 px-4 py-3 text-left sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      {phase?.name ?? `Phase ${index + 1}`}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {phase?.focus ?? "Focus area to be defined"}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {isOpen ? "Collapse" : "Expand"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                      className="overflow-hidden border-t border-zinc-800"
                    >
                      <div className="space-y-3 px-4 py-4">
                        {(weeksByPhase[index] ?? []).length === 0 ? (
                          <p className="text-sm text-zinc-500">
                            Weekly plan not available for this phase.
                          </p>
                        ) : (
                          (weeksByPhase[index] ?? []).map((week, weekIndex) => (
                            <div
                              key={`phase-${index}-week-${week?.week ?? weekIndex}`}
                              className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
                            >
                              <p className="text-sm font-medium text-white">
                                Week {week?.week ?? weekIndex + 1}
                              </p>
                              <ul className="mt-2 list-disc space-y-1 break-words pl-5 text-xs text-zinc-300">
                                {(week?.tasks ?? []).map((task, taskIndex) => (
                                  <li key={`${task}-${taskIndex}`}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
