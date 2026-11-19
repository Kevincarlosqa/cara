"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { LOGO_C_PATH, LOGO_VIEWBOX } from "@/components/brand/logo";

const KEY = "cara-intro";
const EASE = [0.22, 1, 0.36, 1] as const;
const CURTAIN = [0.76, 0, 0.24, 1] as const;
const noop = () => () => {};
const seen = () => {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * Intro: la "C" se dibuja con un trazo, las letras de CARA aparecen desenfocadas y se enfocan,
 * una línea dorada cuenta hasta 100 y la pantalla se abre en dos. Una vez por sesión.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const skip = useSyncExternalStore(noop, seen, () => false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (skip || reduced) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1900);
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = window.setTimeout(() => {
      setDone(true);
      try {
        window.sessionStorage.setItem(KEY, "1");
      } catch {
        // Modo privado sin almacenamiento: se repetirá la intro, sin problema.
      }
    }, 2300);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [skip, reduced]);

  if (skip || reduced) return null;
  return (
    <AnimatePresence>
      {!done ? (
        <motion.div className="fixed inset-0 z-[130]" style={{ animation: "sp-pre-hide 0.01s linear 6s forwards" }} aria-hidden exit={{ opacity: 1 }} transition={{ duration: 1.1 }}>
          {/* Dos mitades que se abren como una puerta corrediza */}
          <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-plum" exit={{ y: "-100%" }} transition={{ duration: 1, ease: CURTAIN }} />
          <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-plum" exit={{ y: "100%" }} transition={{ duration: 1, ease: CURTAIN }} />

          <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-paper" exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }} transition={{ duration: 0.5 }}>
            <svg viewBox={LOGO_VIEWBOX} className="mb-8 h-14 w-14 text-peach" fill="none" stroke="currentColor">
              <motion.path d={LOGO_C_PATH} strokeWidth={5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE }} />
            </svg>
            <p className="wordmark flex text-4xl md:text-6xl">
              {[..."CARA"].map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.35 + i * 0.12 }}
                >
                  {ch}
                </motion.span>
              ))}
            </p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1, duration: 0.8 }} className="eyebrow mt-5 text-paper">
              Sanctuary
            </motion.p>
            <div className="absolute inset-x-0 bottom-10 mx-auto flex w-[min(320px,70vw)] items-center gap-4">
              <span className="relative h-px flex-1 overflow-hidden bg-paper/15">
                <span className="absolute inset-y-0 left-0 bg-linear-to-r from-rose via-gold to-peach" style={{ width: `${count}%` }} />
              </span>
              <span className="w-8 text-right font-brand text-xs tabular-nums text-paper/70">{count}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
