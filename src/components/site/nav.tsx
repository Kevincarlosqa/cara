"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Sparkle } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { Magnetic } from "./motion-kit";
import { TLink } from "./transition";

const LINKS = [
  { href: "/headspa", label: "Headspa" },
  { href: "/servicios", label: "Servicios" },
  { href: "/blog", label: "Journal" },
  { href: "/store", label: "Gift cards" },
  { href: "/contacto", label: "Contacto" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Nav({ whatsappHref, instagramHref }: { whatsappHref: string; instagramHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 600 && y > prev && !open);
  });
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a href="#contenido" className="sr-only z-[90] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Saltar al contenido
      </a>
      <motion.header animate={{ y: hidden && !reduced ? "-130%" : "0%" }} transition={{ duration: 0.6, ease: EASE }} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <nav
          aria-label="Principal"
          className={cn(
            "mx-auto grid h-14 max-w-[1400px] grid-cols-[1fr_auto] items-center rounded-full border pr-2 pl-5 transition-all duration-700 md:h-16 lg:grid-cols-[1fr_auto_1fr] lg:pl-3",
            scrolled || open ? "border-ink/8 bg-paper/80 shadow-[0_16px_50px_-28px_rgba(28,24,21,.45)] backdrop-blur-xl" : "border-transparent bg-transparent",
          )}
        >
          <ul className="hidden items-center gap-0.5 text-[13px] font-medium lg:flex">
            {LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(`${l.href}/`));
              return (
                <li key={l.href}>
                  <TLink href={l.href} aria-current={active ? "page" : undefined} className="group relative block rounded-full px-3.5 py-2 transition-colors hover:text-rose xl:px-4">
                    {active ? <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-sand" transition={{ type: "spring", stiffness: 400, damping: 34 }} /> : null}
                    <span className="relative">{l.label}</span>
                    <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-rose transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" aria-hidden />
                  </TLink>
                </li>
              );
            })}
          </ul>
          <TLink href="/" aria-label="Cara Sanctuary, inicio" className="justify-self-start text-[15px] lg:justify-self-center" onClick={() => setOpen(false)}>
            <span className="wordmark text-[1.15rem] md:text-[1.3rem]">Cara</span>
          </TLink>
          <div className="flex items-center justify-end gap-2">
            <TLink href="/login" className="hidden rounded-full px-3 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink xl:block">
              Panel
            </TLink>
            <Magnetic className="hidden sm:block">
              <TLink href="/reservar" className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-ink px-6 text-[13px] font-semibold tracking-wide text-paper">
                <span className="absolute inset-0 translate-y-full rounded-full bg-linear-to-r from-rose-deep via-gold to-rose transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
                <Sparkle className="relative h-3 w-3 transition-transform duration-700 group-hover:rotate-180" />
                <span className="relative">Reservar</span>
              </TLink>
            </Magnetic>
            <button onClick={() => setOpen(!open)} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-ink/5 lg:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
              <span className={cn("h-px w-5 bg-ink transition-transform duration-500", open && "translate-y-[3.5px] rotate-45")} />
              <span className={cn("h-px w-5 bg-ink transition-transform duration-500", open && "-translate-y-[3.5px] -rotate-45")} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-plum px-6 pt-28 pb-10 text-paper lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
          >
            <div className="mesh opacity-50" aria-hidden>
              <i style={{ width: 380, height: 380, right: -90, top: 40, color: "#8a6a4f" }} />
              <i style={{ width: 320, height: 320, left: -80, bottom: 30, color: "#5b4a3e", animationDelay: "-9s" }} />
            </div>
            <ul className="relative space-y-1">
              {[...LINKS, { href: "/reservar", label: "Reservar" }].map((l, i) => (
                <motion.li key={l.href} className="overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: EASE }}>
                    <TLink href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 font-display text-[3.4rem] leading-[1.05]">
                      <span className="font-brand text-xs tracking-[0.3em] text-peach">0{i + 1}</span>
                      <span className={cn(pathname === l.href && "italic text-peach")}>{l.label}</span>
                    </TLink>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="relative space-y-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center justify-center rounded-full bg-paper text-sm font-semibold text-ink">
                Escríbenos por WhatsApp
              </a>
              <div className="flex items-center justify-between text-xs text-paper/70">
                <a href={instagramHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">@cara_sanctuary <ArrowUpRight className="h-3 w-3" aria-hidden /></a>
                <TLink href="/login" onClick={() => setOpen(false)}>Panel</TLink>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
