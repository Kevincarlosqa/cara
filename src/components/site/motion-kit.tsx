"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Texto que se revela por líneas (cada línea sube desde una máscara). */
export function RevealLines({ lines, className, delay = 0, as: Tag = "h2" }: { lines: ReactNode[]; className?: string; delay?: number; as?: "h1" | "h2" | "p" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.18em]">
          <motion.span
            className="block will-change-transform"
            initial={reduced ? false : { y: "110%", rotate: 2 }}
            animate={inView ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Revela letra por letra (para titulares cortos). */
export function RevealChars({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  return (
    <span ref={ref} className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => (
        <span key={i} className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: "105%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.025 }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function FadeUp({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Marquee cuya velocidad y dirección responden al scroll. */
export function VelocityMarquee({ children, baseVelocity = -2, className }: { children: ReactNode; baseVelocity?: number; className?: string }) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const visible = useInView(box, { margin: "100px 0px" });
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const dir = useRef(1);
  useAnimationFrame((_, delta) => {
    if (reduced || !visible) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    // Envolver entre -50 % y 0 % (el contenido está duplicado).
    let next = x.get() + move;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    x.set(next);
  });
  const translate = useTransform(x, (v) => `${v}%`);
  return (
    <div ref={box} className={cn("overflow-hidden whitespace-nowrap", className)}>
      <motion.div className="flex w-max will-change-transform" style={{ x: translate }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/** Número que cuenta hasta su valor al entrar en pantalla. */
export function Counter({ to, suffix = "", decimals = 0, className }: { to: number; suffix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1600);
      const f = 10 ** decimals;
      setValue(Math.round(to * (1 - Math.pow(1 - p, 4)) * f) / f);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced, decimals]);
  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Botón/enlace magnético: se desplaza hacia el cursor. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => (x.set(0), y.set(0))}
    >
      {children}
    </motion.div>
  );
}

/** Palabras que se "llenan" de tinta según avanza el scroll. */
export function ScrollFillText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  // Nunca por debajo de 3:1 sobre tinta (texto grande, WCAG AA).
  const opacity = useTransform(progress, range, [0.4, 1]);
  const reduced = useReducedMotion();
  const italic = children.startsWith("_");
  const word = italic ? children.slice(1) : children;
  return (
    <>
      <motion.span style={{ opacity: reduced ? 1 : opacity }} className={italic ? "italic text-peach" : undefined}>
        {word}
      </motion.span>{" "}
    </>
  );
}

/** Mechones: líneas fluidas que se dibujan al hacer scroll (transición entre secciones). */
export function Strands({ className, flip = false }: { className?: string; flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(scrollYProgress, [0.05, 0.6], [0, 1]);
  const reduced = useReducedMotion();
  const paths = [
    "M-20 120 C 220 20, 420 220, 720 110 S 1180 40, 1460 140",
    "M-20 140 C 240 50, 460 240, 740 130 S 1200 70, 1460 160",
    "M-20 160 C 260 90, 500 250, 760 150 S 1220 100, 1460 175",
    "M-20 100 C 200 10, 380 190, 700 95 S 1160 20, 1460 120",
    "M-20 180 C 300 120, 520 260, 790 170 S 1240 130, 1460 195",
  ];
  return (
    <div ref={ref} className={cn("pointer-events-none", className)} aria-hidden>
    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className={cn("h-24 w-full md:h-40", flip && "-scale-x-100")}>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={i % 2 ? "#d8d2c6" : "#8a6a4f"}
          strokeOpacity={i % 2 ? 0.55 : 0.8}
          strokeWidth={i === 2 ? 1.6 : 1}
          strokeLinecap="round"
          style={{ pathLength: reduced ? 1 : draw }}
        />
      ))}
    </svg>
    </div>
  );
}

/** Logotipo gigante: cada letra sube desde una máscara y el espaciado se abre al entrar en pantalla. */
export function WordmarkReveal({ className, word = "CARA" }: { className?: string; word?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  return (
    <p ref={ref} className={cn("flex justify-between font-brand leading-[0.8] font-medium select-none", className)} aria-hidden>
      {[...word].map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: "105%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : undefined}
            transition={{ duration: 1.4, ease: EASE, delay: i * 0.09 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </p>
  );
}

/** Hilo dorado en la parte superior que avanza con la lectura. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-linear-to-r from-rose-deep via-gold to-peach" />;
}

/** Aparece al entrar en pantalla: sube, se desvanece y (opcional) se descubre de abajo arriba. Solo transform y opacidad. */
export function Reveal({ children, className, delay = 0, y = 60, scale = 1, as = "div" }: { children: ReactNode; className?: string; delay?: number; y?: number; scale?: number; as?: "div" | "li" }) {
  const reduced = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** Inclina su contenido en 3D siguiendo el cursor, con un brillo que acompaña. */
export function Tilt({ children, className, innerClassName, max = 10 }: { children: ReactNode; className?: string; innerClassName?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 150, damping: 16 });
  const sry = useSpring(ry, { stiffness: 150, damping: 16 });
  const gloss = useTransform(gx, (g) => `radial-gradient(60% 80% at ${g}% 20%, rgba(255,250,240,.38), transparent 70%)`);
  return (
    <div className={cn("[perspective:1200px]", className)}>
      <motion.div
        ref={ref}
        style={reduced ? undefined : { rotateX: srx, rotateY: sry }}
        className={cn("relative overflow-hidden", innerClassName)}
        onPointerMove={(e) => {
          if (reduced || e.pointerType !== "mouse") return;
          const r = ref.current!.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          rx.set(-(py - 0.5) * max * 2);
          ry.set((px - 0.5) * max * 2);
          gx.set(px * 100);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {children}
        <motion.span className="pointer-events-none absolute inset-0" style={{ background: gloss }} aria-hidden />
      </motion.div>
    </div>
  );
}
