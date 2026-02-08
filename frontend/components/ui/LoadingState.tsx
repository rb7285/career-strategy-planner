"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const steps = [
  "Analyzing skills",
  "Scanning market trends",
  "Designing career strategy",
  "Building roadmap",
];

export default function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-8 text-center text-sm text-zinc-200 shadow-lg shadow-black/40">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
        Processing
      </div>
      <div className="relative h-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={steps[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-base font-medium text-white"
          >
            {steps[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <motion.div
        className="flex items-center gap-2"
        aria-hidden="true"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/40" />
      </motion.div>
    </div>
  );
}
