"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import { Sparkle } from "@/components/brand/logo";

const LABELS: Record<string, string> = { "/": "Inicio", "/headspa": "Headspa", "/servicios": "Servicios", "/blog": "Journal", "/store": "Gift cards", "/contacto": "Contacto", "/reservar": "Reserva", "/propuesta": "Propuesta" };
// Cinco paneles verticales en tonos de la marca: caen como cortinas de seda, del centro hacia afuera.
const PANELS = Array.from({ length: 5 }, (_, i) => ({ i, delay: Math.abs(i - 2) * 0.06, color: ["#2a231e", "#1c1815", "#171412", "#1c1815", "#2a231e"][i]! }));

const Ctx = createContext<(href: string) => void>(() => {});
export const usePageTransition = () => useContext(Ctx);

/**
 * Transición entre páginas: cinco cortinas cubren la pantalla, la página cambia detrás
 * y se retiran hacia arriba cuando la nueva ya está lista. Funciona en todos los navegadores.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const [label, setLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const target = useRef<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const navigate = useCallback(
    (href: string) => {
      const path = href.split(/[?#]/)[0]!;
      if (reduced) {
        router.push(href);
        return;
      }
      if (path === pathname && !href.includes("?")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      target.current = path;
      setLabel(LABELS[path] ?? "");
      setPhase("cover");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => startTransition(() => router.push(href)), 480);
    },
    [pathname, reduced, router],
  );

  // Retira las baldosas cuando la ruta ya cambió y terminó de cargar.
  useEffect(() => {
    if (phase !== "cover" || isPending || target.current !== pathname) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    const t = window.setTimeout(() => setPhase("reveal"), 120);
    return () => window.clearTimeout(t);
  }, [phase, isPending, pathname]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = window.setTimeout(() => setPhase("idle"), 800);
    return () => window.clearTimeout(t);
  }, [phase]);

  const value = useMemo(() => navigate, [navigate]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {phase !== "idle" ? (
          <div className="pointer-events-auto fixed inset-0 z-[120] flex" aria-hidden>
            {PANELS.map((t) => (
              <motion.span
                key={t.i}
                className="-mx-px block h-full flex-1"
                style={{ background: t.color, transformOrigin: phase === "cover" ? "50% 0%" : "50% 100%" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: phase === "cover" ? 1 : 0 }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: phase === "cover" ? t.delay : 0.12 + t.delay }}
              />
            ))}
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-paper" initial={{ opacity: 0, y: 14 }} animate={phase === "cover" ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }} transition={{ duration: 0.4, delay: phase === "cover" ? 0.3 : 0 }}>
              <Sparkle className="mb-4 h-4 w-4 animate-spin-slow text-peach" />
              <span className="font-display text-5xl font-light italic md:text-7xl">{label}</span>
              <span className="wordmark mt-4 text-[11px] text-paper/60">Cara</span>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

/** Enlace interno que dispara la transición. Abre en otra pestaña con Ctrl/⌘ como un enlace normal. */
export function TLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const navigate = usePageTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };
  return <Link href={href} onClick={handle} {...props} />;
}
