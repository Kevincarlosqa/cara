"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Clock, MapPin, Plus } from "lucide-react";
import { LogoMark, Sparkle } from "@/components/brand/logo";
import { formatPostDate, type Post } from "@/content/blog";
import { FAQ } from "@/content/faq";
import { CATEGORY_PHOTOS, PHOTOS, unsplash, type Photo } from "@/content/images";
import type { LandingData } from "@/lib/landing";
import { CARA_CATEGORIES, CATEGORY_LABELS } from "@/lib/labels";
import { cn, formatMoney } from "@/lib/utils";
import { INSTAGRAM_URL, InstagramIcon, waLink } from "./icons";
import { Counter, FadeUp, Reveal, RevealLines, ScrollFillText, Tilt, VelocityMarquee } from "./motion-kit";
import { Particles } from "./particles";
import { TLink } from "./transition";

type Service = LandingData["services"][number];
const EASE = [0.22, 1, 0.36, 1] as const;
const hours = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60}` : ""}` : `${min} min`);

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow mb-5 flex items-center gap-3 text-rose", className)}>
      <span className="h-px w-8 bg-current" aria-hidden />
      {children}
    </p>
  );
}

/* ─── Cinta ───────────────────────────────────────────────────────────── */

export function Marquee() {
  const WORDS = ["Headspa", "Faciales", "Corporales", "Rituales", "Calma", "Glow", "Drenaje", "Respira"];
  return (
    <div className="overflow-hidden border-y border-paper/10 bg-plum py-6 text-paper md:py-8" aria-hidden>
      <VelocityMarquee baseVelocity={-2}>
        {WORDS.map((w, i) => (
          <span key={w} className="flex items-center gap-10 pr-10 font-display text-5xl font-light md:text-7xl">
            <span className={i % 2 ? "text-gradient-light italic" : ""}>{w}</span>
            <Sparkle className="h-5 w-5 text-gold md:h-6 md:w-6" />
          </span>
        ))}
      </VelocityMarquee>
    </div>
  );
}

/* ─── Los tres pilares ────────────────────────────────────────────────── */

export function Pillars({ counts }: { counts: Record<"HEADSPA" | "FACIAL" | "BODY", number> }) {
  const pillars = [
    { key: "HEADSPA" as const, n: "01", href: "/headspa", title: "Headspa", tag: "Cabeza", text: "El ritual japonés para tu cuero cabelludo: limpieza profunda, masaje craneal y cascada de agua tibia.", photo: PHOTOS.hairWash },
    { key: "FACIAL" as const, n: "02", href: "/servicios", title: "Faciales", tag: "Rostro", text: "Protocolos a medida para una piel luminosa, firme y en calma. Del glow diario al antiage.", photo: PHOTOS.facial },
    { key: "BODY" as const, n: "03", href: "/servicios", title: "Corporales", tag: "Cuerpo", text: "Drenaje linfático, maderoterapia y envolturas para desinflamar, modelar y renovar.", photo: PHOTOS.spaStill },
  ];
  return (
    <section aria-labelledby="pilares" className="mx-auto max-w-[1400px] px-3 py-24 md:px-6 md:py-36">
      <div className="mb-12 grid gap-6 px-2 md:mb-16 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <Eyebrow>Tres caminos, una misma calma</Eyebrow>
          <RevealLines lines={["¿Hoy qué te", <em key="e" className="text-gradient pr-2">pide el cuerpo?</em>]} className="font-display text-[clamp(3rem,7.4vw,7rem)] leading-[0.92] font-light" />
        </div>
        <FadeUp>
          <p className="max-w-md text-ink-soft md:justify-self-end">Cuidamos tu cabeza, tu rostro y tu cuerpo con el mismo principio: sin prisa, con manos expertas y productos profesionales. Elige por dónde empezar.</p>
        </FadeUp>
      </div>
      <div className="group/p flex h-[150vh] min-h-[900px] flex-col gap-3 md:h-[78vh] md:min-h-[600px] md:flex-row">
        {pillars.map((w, i) => (
          <motion.div
            key={w.key}
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.3, ease: EASE, delay: i * 0.12 }}
            className="relative min-h-0 flex-1 transition-[flex-grow] duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] md:hover:grow-[1.9] md:has-[:focus-visible]:grow-[1.9]"
          >
          <TLink
            href={w.href}
            data-cursor="Ver"
            className="group absolute inset-0 block overflow-hidden rounded-[2.5rem]"
          >
            <span className="absolute inset-0 transition-transform duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] will-change-transform group-hover:scale-110">
              <Image src={unsplash(w.photo)} alt={w.photo.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="grade object-cover" />
            </span>
            <span className="absolute inset-0 bg-linear-to-t from-plum/85 via-plum/20 to-transparent" />
            <span className="absolute inset-0 bg-ink/40 opacity-0 transition-opacity duration-700 group-hover/p:opacity-100 group-hover:!opacity-0" />
            <span className="absolute top-6 left-6 flex items-center gap-3 text-paper md:top-8 md:left-8">
              <span className="font-brand text-xs tracking-[0.3em]">{w.n}</span>
              <span className="h-px w-8 bg-paper/60" />
              <span className="eyebrow">{w.tag}</span>
            </span>
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-paper md:p-9">
              <span className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2">
                <span className="block font-display text-6xl leading-none font-light md:text-7xl xl:text-8xl">{w.title}</span>
                <span className="mt-4 block max-w-xs text-sm leading-relaxed opacity-0 transition-[opacity,translate] duration-700 max-md:opacity-90 md:translate-y-3 md:group-hover:translate-y-0 md:group-hover:opacity-90">{w.text}</span>
                <span className="eyebrow mt-3 block text-peach">{counts[w.key]} tratamientos</span>
              </span>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-paper/40 transition-all duration-700 group-hover:rotate-45 group-hover:bg-paper group-hover:text-ink"><ArrowUpRight className="h-5 w-5" aria-hidden /></span>
            </span>
          </TLink>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Manifiesto ──────────────────────────────────────────────────────── */

export function Manifesto({ services }: { services: number }) {
  return (
    <section aria-label="Nuestra filosofía" className="relative overflow-hidden bg-plum text-paper">
      <div className="mesh opacity-50" aria-hidden>
        <i style={{ width: 640, height: 640, left: "-12%", top: "-22%", color: "#6b4f39" }} />
        <i style={{ width: 540, height: 540, right: "-10%", bottom: "-22%", color: "#5b4a3e", animationDelay: "-10s" }} />
      </div>
      <Particles colors={["#d9c2a3", "#b8976a", "#efe4cf", "#fbf8f3"]} count={26} glints={0.35} opacity={0.75} />
      <div className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-44">
        <Eyebrow className="text-peach">Cara: «rostro», en español</Eyebrow>
        <ScrollFillText
          text="Cara es rostro, es gesto, es la forma en que te miras al espejo. Creamos un _santuario donde la belleza empieza por la _calma: desde la raíz de tu cabello hasta la punta de los pies."
          className="max-w-6xl font-display text-[clamp(2.3rem,5.4vw,5.4rem)] leading-[1.04] font-light"
        />
        <dl className="mt-24 grid grid-cols-2 gap-10 border-t border-paper/15 pt-12 md:grid-cols-4">
          {[
            { node: <Counter to={14.7} decimals={1} suffix=" mil" />, l: "personas en nuestra comunidad" },
            { node: <Counter to={services} />, l: "tratamientos en carta" },
            { node: <Counter to={90} suffix="′" />, l: "de headspa Signature" },
            { node: <Counter to={3} />, l: "pilares: cabeza, rostro y cuerpo" },
          ].map((k, i) => (
            <Reveal key={k.l} delay={i * 0.1} y={40} className="flex flex-col-reverse">
              <dt className="mt-3 max-w-[12rem] text-sm text-paper/65">{k.l}</dt>
              <dd className="font-display text-6xl leading-none font-light md:text-7xl">{k.node}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ─── La carta, de un vistazo ─────────────────────────────────────────── */

export function ServiceIndex({ services }: { services: Service[] }) {
  const rows = useMemo(
    () =>
      CARA_CATEGORIES.map((category) => {
        const list = services.filter((s) => s.category === category);
        return list.length ? { category, count: list.length, from: Math.min(...list.map((s) => s.basePriceCents)), names: list.slice(0, 3).map((s) => s.name) } : null;
      }).filter((r) => r !== null),
    [services],
  );
  const [active, setActive] = useState(rows[0]?.category);
  return (
    <section aria-labelledby="carta" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>La carta, de un vistazo</Eyebrow>
          <motion.h2 id="carta" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.92] font-light">
            Todo lo que <em className="text-gradient pr-2">sabemos hacer</em>
          </motion.h2>
        </div>
        <TLink href="/servicios" className="group inline-flex items-center gap-2 text-sm font-semibold">
          <span className="relative">Ver la carta completa<span className="absolute inset-x-0 -bottom-1 h-px origin-left bg-ink transition-transform duration-500 group-hover:scale-x-0" /></span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
        </TLink>
      </div>
      <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
        <ul className="border-t border-ink/15">
          {rows.map((r, i) => (
            <Reveal as="li" key={r.category} delay={i * 0.07} y={36} className="border-b border-ink/15">
              <TLink
                href={r.category === "HEADSPA" ? "/headspa" : "/servicios"}
                onPointerEnter={() => setActive(r.category)}
                onFocus={() => setActive(r.category)}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 py-6"
              >
                <span className="font-brand text-xs tracking-[0.25em] text-muted">0{i + 1}</span>
                <span>
                  <span className={cn("block font-display text-4xl leading-tight font-light transition-[color,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:text-5xl", active === r.category ? "translate-x-3 text-rose italic" : "")}>{CATEGORY_LABELS[r.category]}</span>
                  <span className={cn("mt-1 block pl-0.5 text-sm text-muted transition-[opacity,translate] duration-700 ease-[cubic-bezier(.22,1,.36,1)]", active === r.category ? "translate-x-3 opacity-100" : "opacity-0 max-lg:opacity-100")}>{r.names.join(" · ")}</span>
                </span>
                <span className="shrink-0 text-right text-xs text-muted tabular-nums">
                  {r.count} · desde {formatMoney(r.from)}
                </span>
              </TLink>
            </Reveal>
          ))}
        </ul>
        {/* Vista previa: las fotos se apilan dentro de un óvalo y solo cambia su opacidad. */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="relative h-[70vh] max-h-[640px] overflow-hidden rounded-[50%] bg-sand">
              {rows.map((r) => (
                <Image key={r.category} src={unsplash(CATEGORY_PHOTOS[r.category])} alt="" fill sizes="30vw" className={cn("grade object-cover transition-[opacity,transform] duration-1000 ease-out", active === r.category ? "scale-100 opacity-100" : "scale-110 opacity-0")} />
              ))}
              <span className="absolute inset-0 rounded-[50%] ring-1 ring-paper/40 ring-inset" aria-hidden />
            </div>
            <p className="mt-5 text-center font-display text-2xl italic text-ink-soft">{active ? CATEGORY_LABELS[active] : ""}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── El ritual de headspa, paso a paso ───────────────────────────────── */

export const HEADSPA_STEPS: Array<{ title: string; text: string; photo: Photo; min: string }> = [
  { title: "Diagnóstico", text: "Con una cámara capilar miramos tu cuero cabelludo de cerca: grasa, sensibilidad, descamación o folículos obstruidos.", photo: PHOTOS.oilDrop, min: "5′" },
  { title: "Doble limpieza", text: "Un aceite tibio disuelve el sebo y los residuos; un champú suave limpia sin resecar.", photo: PHOTOS.hairWash, min: "10′" },
  { title: "Exfoliación", text: "Retiramos células muertas para que el folículo respire. Como una limpieza facial, pero en la raíz.", photo: PHOTOS.mask, min: "10′" },
  { title: "Masaje craneal", text: "Presión lenta en sienes, nuca y coronilla. Es el momento en que casi todas se quedan dormidas.", photo: PHOTOS.faceMassage, min: "25′" },
  { title: "Cascada de agua", text: "Un hilo de agua tibia y constante cae sobre tu cabeza. Tan relajante como suena.", photo: PHOTOS.citrus, min: "15′" },
  { title: "Mascarilla y vapor", text: "Activos elegidos según tu diagnóstico, con vapor para que penetren. Cerramos con secado y masaje de hombros.", photo: PHOTOS.spaStill, min: "25′" },
];

function StepImage({ step }: { step: number }) {
  const s = HEADSPA_STEPS[step]!;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[50%] bg-plum">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={step} className="absolute inset-0" initial={{ clipPath: "circle(0% at 50% 50%)", scale: 1.25 }} animate={{ clipPath: "circle(75% at 50% 50%)", scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}>
          <Image src={unsplash(s.photo)} alt={s.photo.alt} fill sizes="(min-width: 1024px) 38vw, 90vw" className="grade object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="ripples" aria-hidden><span /><span /><span /><span /></div>
      <span className="absolute inset-0 rounded-[50%] ring-1 ring-paper/30 ring-inset" aria-hidden />
    </div>
  );
}

/** Seis pasos fijados al scroll: la lista avanza a la izquierda y la imagen cambia dentro de un óvalo con ondas de agua. */
export function HeadspaRitual({ cta = true }: { cta?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useTransform(scrollYProgress, [0.02, 0.98], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(HEADSPA_STEPS.length - 1, Math.max(0, Math.floor(v * HEADSPA_STEPS.length)))));

  return (
    <section ref={ref} aria-labelledby="ritual" className={cn("relative bg-plum text-paper", !reduced && "lg:h-[360vh]")}>
      <div className="mesh opacity-40" aria-hidden>
        <i style={{ width: 600, height: 600, right: "-10%", top: "10%", color: "#6b4f39" }} />
      </div>
      <div className={cn("relative mx-auto max-w-[1400px] px-5 py-24 md:px-10", !reduced && "lg:sticky lg:top-0 lg:flex lg:h-dvh lg:items-center lg:pt-24 lg:pb-8")}>
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
          <div className="flex flex-col justify-center">
            <Eyebrow className="text-peach">El ritual Signature · 90 minutos</Eyebrow>
            <motion.h2 id="ritual" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.4rem,4vw,4.2rem)] leading-[0.95] font-light">
              Seis pasos para <em className="text-gradient-light pr-2">volver a ti</em>
            </motion.h2>
            {/* Escritorio: lista que se ilumina según el paso */}
            <div className="relative mt-8 hidden pl-8 lg:block">
              <span className="absolute top-0 bottom-0 left-0 w-px bg-paper/15" aria-hidden />
              <motion.span style={{ scaleY: reduced ? 1 : bar }} className="absolute top-0 bottom-0 left-0 w-px origin-top bg-linear-to-b from-gold to-peach" aria-hidden />
              <ol className="space-y-1">
                {HEADSPA_STEPS.map((s, i) => (
                  <li key={s.title} className="relative">
                    <span className={cn("absolute top-[0.95rem] -left-[2.32rem] h-2.5 w-2.5 rounded-full border transition-all duration-500", i <= step ? "border-gold bg-gold" : "border-paper/30 bg-plum")} aria-hidden />
                    <div className={cn("transition-opacity duration-700", i === step ? "opacity-100" : "opacity-35")}>
                      <p className="flex items-baseline gap-4 py-1.5">
                        <span className="font-brand text-xs tracking-[0.25em] text-peach">0{i + 1}</span>
                        <span className="font-display text-2xl font-light xl:text-3xl">{s.title}</span>
                        <span className="ml-auto text-xs text-paper/50 tabular-nums">{s.min}</span>
                      </p>
                      <AnimatePresence initial={false}>
                        {i === step ? (
                          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="max-w-md overflow-hidden pb-2 pl-10 text-sm leading-relaxed text-paper/75">
                            {s.text}
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {/* Móvil: tarjetas en columna */}
            <ol className="mt-10 space-y-10 lg:hidden">
              {HEADSPA_STEPS.map((s, i) => (
                <li key={s.title}>
                  <FadeUp>
                    <div className="relative mb-5 aspect-[4/5] w-3/4 overflow-hidden rounded-[50%]">
                      <Image src={unsplash(s.photo)} alt={s.photo.alt} fill sizes="75vw" className="grade object-cover" />
                    </div>
                    <p className="font-brand text-xs tracking-[0.25em] text-peach">0{i + 1} · {s.min}</p>
                    <p className="mt-1 font-display text-4xl font-light">{s.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-paper/75">{s.text}</p>
                  </FadeUp>
                </li>
              ))}
            </ol>
            {cta ? (
              <div className="mt-10 flex flex-wrap gap-3 lg:hidden">
                <TLink href="/reservar?servicio=svc_headspa-signature-cara" className="btn-shine inline-flex h-12 items-center rounded-full bg-paper px-7 text-sm font-semibold text-ink transition-colors hover:bg-peach">Reservar Headspa Signature</TLink>
                <TLink href="/headspa" className="inline-flex h-12 items-center rounded-full border border-paper/30 px-7 text-sm font-semibold transition-colors hover:bg-paper/10">Todo sobre el headspa</TLink>
              </div>
            ) : null}
          </div>
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="flex flex-col items-center gap-8">
            <div className="relative aspect-[3/4] h-[min(62dvh,620px)]">
              <StepImage step={step} />
              <motion.p key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-paper px-5 py-2 text-xs font-semibold whitespace-nowrap text-ink">
                Paso {step + 1} de {HEADSPA_STEPS.length} · {HEADSPA_STEPS[step]!.title}
              </motion.p>
            </div>
            {cta ? (
              <div className="flex flex-wrap justify-center gap-3">
                <TLink href="/reservar?servicio=svc_headspa-signature-cara" className="btn-shine inline-flex h-12 items-center rounded-full bg-paper px-7 text-sm font-semibold text-ink transition-colors hover:bg-peach">Reservar Headspa Signature</TLink>
                <TLink href="/headspa" className="inline-flex h-12 items-center rounded-full border border-paper/30 px-7 text-sm font-semibold transition-colors hover:bg-paper/10">Todo sobre el headspa</TLink>
              </div>
            ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Rituales destacados (carril horizontal) ─────────────────────────── */

export function Rituals({ services }: { services: Service[] }) {
  const lane = useRef<HTMLUListElement>(null);
  const progress = useMotionValue(0);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });
  // Cada tarjeta toma una foto de su categoría, sin repetir mientras haya opciones.
  const pools: Partial<Record<Service["category"], Photo[]>> = { RITUAL: [PHOTOS.massageOil, PHOTOS.hotStones, PHOTOS.citrus], HEADSPA: [PHOTOS.hairWash, PHOTOS.faceMassage], FACIAL: [PHOTOS.facial, PHOTOS.facialMask, PHOTOS.mask], BODY: [PHOTOS.spaStill, PHOTOS.backMassage], MASSAGE: [PHOTOS.backMassage, PHOTOS.hotStones], COUPLE: [PHOTOS.hotStones] };
  const used: Record<string, number> = {};
  const photos = services.map((s) => {
    const pool = pools[s.category] ?? [CATEGORY_PHOTOS[s.category]];
    const n = (used[s.category] = (used[s.category] ?? -1) + 1);
    return pool[n % pool.length]!;
  });
  const step = (dir: 1 | -1) => {
    const el = lane.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };
  return (
    <section aria-labelledby="rituales" className="relative overflow-hidden bg-sand/70 py-24 md:py-32">
      <div className="mx-auto mb-10 flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-6 px-5 md:px-10">
        <div>
          <Eyebrow>Los favoritos de la casa</Eyebrow>
          <motion.h2 id="rituales" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.92] font-light">Rituales para <em className="text-gradient pr-2">perder la noción del tiempo</em></motion.h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Anterior" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-paper"><ArrowLeft className="h-4 w-4" aria-hidden /></button>
          <button type="button" onClick={() => step(1)} aria-label="Siguiente" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-paper"><ArrowLeft className="h-4 w-4 rotate-180" aria-hidden /></button>
          <TLink href="/servicios" className="ml-3 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">Toda la carta <ArrowUpRight className="h-4 w-4" aria-hidden /></TLink>
        </div>
      </div>
      <ul
        ref={lane}
        className="scrollbar-none flex cursor-grab snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto overscroll-x-contain px-5 pb-2 select-none active:cursor-grabbing md:scroll-px-10 md:px-10"
        onScroll={(e) => {
          const el = e.currentTarget;
          progress.set(el.scrollWidth > el.clientWidth ? el.scrollLeft / (el.scrollWidth - el.clientWidth) : 0);
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !lane.current) return;
          drag.current = { active: true, moved: false, x: e.clientX, left: lane.current.scrollLeft };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const el = lane.current;
          if (!d.active || !el) return;
          const dx = e.clientX - d.x;
          if (!d.moved && Math.abs(dx) > 6) {
            d.moved = true;
            el.style.scrollSnapType = "none";
          }
          if (d.moved) el.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          const el = lane.current;
          drag.current.active = false;
          if (el) el.style.scrollSnapType = "";
        }}
        onPointerLeave={() => {
          const el = lane.current;
          drag.current.active = false;
          if (el) el.style.scrollSnapType = "";
        }}
        onClickCapture={(e) => {
          // Si fue un arrastre, no se abre la tarjeta.
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {services.map((s, i) => (
          <Reveal as="li" key={s.id} delay={Math.min(i, 3) * 0.08} y={60} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[29vw] xl:w-[25vw]">
            <TLink href={`/reservar?servicio=${s.id}`} className="group block" data-cursor="Reservar" draggable={false}>
              <div className="relative h-[54vh] max-h-[560px] overflow-hidden rounded-t-[999px] rounded-b-[2rem]">
                <Image src={unsplash(photos[i]!)} alt={photos[i]!.alt} fill draggable={false} sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 29vw, 78vw" className="grade object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
                <span className="absolute top-5 left-1/2 -translate-x-1/2 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-semibold tracking-wide">{CATEGORY_LABELS[s.category]}</span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-3xl leading-tight font-light transition-colors group-hover:text-rose">{s.name}</h3>
                  <p className="mt-1 line-clamp-2 max-w-xs text-sm text-muted">{s.description}</p>
                </div>
                <p className="shrink-0 text-right text-sm font-semibold tabular-nums">{formatMoney(s.basePriceCents)}<span className="block text-xs font-normal text-muted">{hours(s.durationMin)}</span></p>
              </div>
            </TLink>
          </Reveal>
        ))}
        <li aria-hidden className="w-px shrink-0" />
      </ul>
      {/* Avance del carril */}
      <div className="mx-auto mt-10 max-w-[1400px] px-5 md:px-10">
        <div className="relative h-px w-full bg-ink/15">
          <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-linear-to-r from-rose-deep via-gold to-rose" />
        </div>
      </div>
    </section>
  );
}

/* ─── Encuentra tu ritual ─────────────────────────────────────────────── */

const NEEDS = [
  { key: "mind", label: "Desconectar la mente", hint: "Estrés, tensión en la cabeza, dormir mejor" },
  { key: "skin", label: "Una piel luminosa", hint: "Opaca, deshidratada o con un evento cerca" },
  { key: "body", label: "Sentirme ligera", hint: "Hinchazón, pesadez, retención" },
  { key: "all", label: "Un poco de todo", hint: "Quiero el santuario completo" },
] as const;
const TIMES = [
  { key: "short", label: "Menos de una hora" },
  { key: "mid", label: "Hora y media" },
  { key: "long", label: "Dos horas o más" },
] as const;
const MATCH: Record<(typeof NEEDS)[number]["key"], Record<(typeof TIMES)[number]["key"], string>> = {
  mind: { short: "headspa-express", mid: "headspa-signature-cara", long: "ritual-head-face" },
  skin: { short: "facial-cara-glow", mid: "facial-antiage-lifting", long: "ritual-head-face" },
  body: { short: "drenaje-linfatico-corporal", mid: "masaje-con-piedras-calientes", long: "ritual-cara-sanctuary" },
  all: { short: "headspa-express", mid: "ritual-head-face", long: "ritual-cara-sanctuary" },
};

export function RitualFinder({ services }: { services: Service[] }) {
  const [need, setNeed] = useState<(typeof NEEDS)[number]["key"] | null>(null);
  const [time, setTime] = useState<(typeof TIMES)[number]["key"] | null>(null);
  const step = need === null ? 0 : time === null ? 1 : 2;
  const result = need && time ? (services.find((s) => s.slug === MATCH[need][time]) ?? services.find((s) => s.featured)) : null;
  const photo = result ? CATEGORY_PHOTOS[result.category] : PHOTOS.oilDrop;
  const reset = () => {
    setNeed(null);
    setTime(null);
  };

  return (
    <section aria-labelledby="finder" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Eyebrow>Encuentra tu ritual</Eyebrow>
          <motion.h2 id="finder" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.92] font-light">Dos preguntas y <em className="text-gradient pr-2">te recomendamos</em></motion.h2>
          <p className="mt-5 max-w-md text-ink-soft">Si no sabes por dónde empezar, cuéntanos qué buscas. Si aún tienes dudas, una asesora te orienta por WhatsApp.</p>
          <div className="mt-8 flex gap-2" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn("h-1 rounded-full transition-all duration-700", i <= step ? "w-12 bg-rose" : "w-6 bg-ink/15")} />
            ))}
          </div>
        </div>

        <div className="relative min-h-[460px] rounded-[2.5rem] border border-ink/10 bg-paper p-6 shadow-[0_40px_90px_-50px_rgba(28,24,21,.5)] md:p-10" aria-live="polite">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="q1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease: EASE }}>
                <p className="eyebrow text-muted">Pregunta 1 de 2</p>
                <p className="mt-3 font-display text-4xl font-light">¿Qué te pide el cuerpo hoy?</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {NEEDS.map((n, i) => (
                    <motion.button key={n.key} type="button" onClick={() => setNeed(n.key)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className="group rounded-3xl border border-ink/10 p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-rose/50 hover:bg-sand/60">
                      <span className="flex items-center justify-between font-display text-2xl">{n.label}<ArrowUpRight className="h-4 w-4 text-muted transition-transform duration-500 group-hover:rotate-45 group-hover:text-rose" aria-hidden /></span>
                      <span className="mt-1 block text-sm text-muted">{n.hint}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="q2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease: EASE }}>
                <button type="button" onClick={() => setNeed(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Volver</button>
                <p className="eyebrow mt-4 text-muted">Pregunta 2 de 2</p>
                <p className="mt-3 font-display text-4xl font-light">¿Cuánto tiempo tienes?</p>
                <div className="mt-8 grid gap-3">
                  {TIMES.map((t, i) => (
                    <motion.button key={t.key} type="button" onClick={() => setTime(t.key)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className="group flex items-center justify-between rounded-full border border-ink/10 px-6 py-4 text-left transition-all duration-500 hover:border-rose/50 hover:bg-sand/60">
                      <span className="flex items-center gap-3 font-display text-2xl"><Clock className="h-4 w-4 text-rose" aria-hidden />{t.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-muted transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : result ? (
              <motion.div key="r" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="grid gap-6 sm:grid-cols-[0.8fr_1fr] sm:items-center">
                <motion.div initial={{ clipPath: "ellipse(0% 0% at 50% 50%)" }} animate={{ clipPath: "ellipse(50% 50% at 50% 50%)" }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} className="relative aspect-[3/4] overflow-hidden">
                  <Image src={unsplash(photo)} alt={photo.alt} fill sizes="300px" className="grade object-cover" />
                </motion.div>
                <div>
                  <p className="eyebrow flex items-center gap-2 text-rose"><Sparkle className="h-3 w-3" /> Tu ritual ideal</p>
                  <p className="mt-3 font-display text-4xl leading-tight font-light">{result.name}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{result.description}</p>
                  <p className="mt-4 text-sm font-semibold tabular-nums">{result.priceFrom ? "desde " : ""}{formatMoney(result.basePriceCents)} · {hours(result.durationMin)}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <TLink href={`/reservar?servicio=${result.id}`} className="btn-shine inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper">Reservar este ritual</TLink>
                    <button type="button" onClick={reset} className="inline-flex h-11 items-center rounded-full border border-ink/15 px-5 text-sm font-semibold hover:bg-sand">Empezar de nuevo</button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ─── Galería ─────────────────────────────────────────────────────────── */

function GalleryColumn({ photos, y, className }: { photos: Photo[]; y: MotionValue<string>; className?: string }) {
  return (
    <motion.div style={{ y }} className={cn("flex flex-col gap-5 will-change-transform md:gap-7", className)}>
      {photos.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.1} y={80} scale={0.94}>
          <div className={cn("group relative aspect-[3/4] overflow-hidden bg-sand", i % 2 ? "rounded-[2rem]" : "rounded-[50%]")}>
            <Image src={unsplash(p)} alt={p.alt} fill sizes="(min-width: 768px) 30vw, 46vw" className="grade object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110" />
          </div>
        </Reveal>
      ))}
    </motion.div>
  );
}

export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const slow = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["6%", "-8%"]);
  const fast = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["16%", "-18%"]);
  return (
    <section ref={ref} aria-labelledby="galeria" className="relative overflow-hidden py-24 md:py-36">
      <div className="relative mx-auto mb-14 flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-5 md:mb-20 md:px-10">
        <div>
          <Eyebrow>El santuario</Eyebrow>
          <motion.h2 id="galeria" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.8rem,7vw,6.8rem)] leading-[0.92] font-light">Un espacio para <em className="text-gradient pr-2">volver a ti</em></motion.h2>
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-cursor="Seguir" className="group inline-flex items-center gap-3 rounded-full border border-ink/15 py-2 pr-5 pl-2 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-rose-deep via-gold to-peach text-paper"><InstagramIcon className="h-4 w-4" /></span>
          @cara_sanctuary · 14,7 mil
        </a>
      </div>
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-2 gap-5 px-5 md:grid-cols-3 md:gap-7 md:px-10">
        <GalleryColumn y={slow} photos={[PHOTOS.faceMassage, PHOTOS.spaStill]} />
        <GalleryColumn y={fast} photos={[PHOTOS.citrus, PHOTOS.backMassage]} className="mt-20 md:mt-32" />
        <GalleryColumn y={slow} photos={[PHOTOS.hairWash, PHOTOS.mask]} className="hidden md:flex" />
      </div>
    </section>
  );
}

/* ─── Gift card ───────────────────────────────────────────────────────── */

function GiftCard() {
  return (
    <Tilt max={11} innerClassName="rounded-[2rem] shadow-[0_50px_90px_-40px_rgba(23,20,18,.75)]">
      <div className="relative aspect-[1.6] w-full overflow-hidden rounded-[2rem] bg-linear-to-br from-[#2a231e] via-plum to-[#3b2f26] p-7 text-paper md:p-10">
        <span className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ background: "conic-gradient(from 210deg at 70% 30%, transparent, rgba(217,194,163,.55), transparent 30%, rgba(184,151,106,.45), transparent 60%)" }} aria-hidden />
        <LogoMark className="absolute -right-12 -bottom-14 h-72 w-72 text-gold/20" title="" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <p className="wordmark text-gradient-light text-2xl md:text-3xl">Cara</p>
            <Sparkle className="h-5 w-5 text-peach" />
          </div>
          <div>
            <p className="eyebrow text-peach">Gift card · Sanctuary</p>
            <p className="mt-2 font-display text-5xl leading-none font-light md:text-6xl">Regala calma</p>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

export function GiftTeaser() {
  return (
    <section aria-labelledby="regalo" className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-[1fr_1.05fr] lg:items-center">
      <div>
        <Eyebrow>Gift cards</Eyebrow>
        <motion.h2 id="regalo" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.92] font-light">El regalo que <em className="text-gradient pr-2">se siente</em></motion.h2>
        <p className="mt-5 max-w-md text-ink-soft">Por monto o por experiencia: un headspa, un facial o el ritual completo. Digital, con dedicatoria y lista en minutos.</p>
        <ul className="mt-7 space-y-2 text-sm text-ink-soft">
          {["Válida por 12 meses", "Se envía por WhatsApp o correo", "Se puede usar en cualquier tratamiento"].map((t) => (
            <li key={t} className="flex items-center gap-3"><Check className="h-4 w-4 text-rose" aria-hidden /> {t}</li>
          ))}
        </ul>
        <TLink href="/store" className="mt-9 inline-flex h-12 items-center gap-1 rounded-full bg-ink px-7 text-sm font-semibold text-paper transition-colors hover:bg-rose-deep">Elegir una gift card <ArrowUpRight className="h-4 w-4" aria-hidden /></TLink>
      </div>
      <Reveal y={80} scale={0.94}><GiftCard /></Reveal>
    </section>
  );
}

/* ─── Reserva por WhatsApp ────────────────────────────────────────────── */

const SCRIPT: Array<{ from: "me" | "bot"; text: string; buttons?: string[] }> = [
  { from: "me", text: "Hola! Quiero mi headspa de siempre 💆‍♀️" },
  { from: "bot", text: "¡Hola, Lucía! ✨ Soy Alma. ¿Headspa Signature con Alessandra, como la última vez?", buttons: ["Sí, con Alessandra", "Otra terapeuta"] },
  { from: "me", text: "Sí, con Alessandra" },
  { from: "bot", text: "Alessandra tiene libre el jueves:", buttons: ["9:30", "10:30", "11:45"] },
  { from: "me", text: "10:30" },
  { from: "bot", text: "Headspa Signature · Alessandra · jueves 10:30 · S/ 280. ¿Confirmo?", buttons: ["Confirmar", "Cambiar"] },
  { from: "me", text: "Confirmar" },
  { from: "bot", text: "¡Listo! Código CA-7KQ4M. Te recuerdo un día antes ✨" },
];

export function ChatDemo({ whatsappHref }: { whatsappHref: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [count, setCount] = useState(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 80%"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setCount(Math.max(1, Math.min(SCRIPT.length, Math.ceil(p * (SCRIPT.length + 0.5))))));
  const shown = reduced ? SCRIPT.length : count;
  return (
    <section ref={ref} aria-labelledby="chat" className="relative overflow-hidden bg-linear-to-b from-ivory via-blush/70 to-ivory">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Eyebrow>Reserva por WhatsApp, a cualquier hora</Eyebrow>
          <motion.h2 id="chat" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.92] font-light">Tu cita en <em className="text-gradient pr-2">menos de un minuto</em></motion.h2>
          <ul className="mt-8 max-w-md space-y-3">
            {["Te reconoce: sabe tu terapeuta favorita y tu último ritual.", "Consulta la agenda real; nunca inventa precios ni horarios.", "Embarazo, alergias o dudas de salud pasan directo a una especialista."].map((t) => (
              <li key={t} className="flex gap-3 text-ink-soft"><Check className="mt-0.5 h-5 w-5 shrink-0 text-rose" aria-hidden /> {t}</li>
            ))}
          </ul>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-semibold text-paper transition-colors hover:bg-rose-deep">Escribir por WhatsApp</a>
        </div>
        <Reveal y={90} scale={0.95} className="mx-auto w-full max-w-[330px]">
          <div className="overflow-hidden rounded-[2.8rem] border-[10px] border-ink bg-[#efe6dd] shadow-[0_50px_90px_-40px_rgba(23,20,18,.6)]" role="img" aria-label="Ejemplo de conversación con Alma, la asistente de reservas">
            <div className="flex items-center gap-3 bg-plum px-4 py-3 text-paper">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink"><LogoMark className="h-5 w-5" title="" /></span>
              <div>
                <p className="text-sm font-semibold">Cara Sanctuary</p>
                <p className="text-[10px] opacity-80">{shown < SCRIPT.length && SCRIPT[shown]?.from === "bot" ? "escribiendo…" : "en línea"}</p>
              </div>
            </div>
            <div className="flex h-[440px] flex-col justify-end gap-2 overflow-hidden p-3" aria-hidden>
              <AnimatePresence initial={false}>
                {SCRIPT.slice(0, shown).map((m, i) => (
                  <motion.div key={i} layout initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 26 }} className={cn("flex shrink-0 flex-col", m.from === "me" ? "items-end" : "items-start")}>
                    <p className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug", m.from === "me" ? "rounded-br-md bg-[#e9dccb]" : "rounded-bl-md bg-white")}>{m.text}</p>
                    {m.buttons ? (
                      <div className="mt-1 flex max-w-[85%] flex-wrap gap-1">
                        {m.buttons.map((b) => (
                          <span key={b} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-rose-deep">{b}</span>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Después de reservar ─────────────────────────────────────────────── */

const JOURNEY = [
  { title: "Te avisamos", text: "Un recordatorio por WhatsApp 24 horas y otro 2 horas antes, con botones para confirmar, reprogramar o cancelar." },
  { title: "Te conocemos", text: "Tu ficha guarda tu tipo de piel, tu diagnóstico capilar, tus alergias y la temperatura de agua que prefieres." },
  { title: "Sin sorpresas", text: "El precio que viste al reservar queda fijo en tu cita, aunque la carta cambie después." },
  { title: "Te seguimos", text: "Si tu tratamiento funciona mejor en serie, como el headspa anticaída, te sugerimos la siguiente fecha." },
];

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0, 1]);
  return (
    <section aria-labelledby="visita" className="bg-sand/70">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Eyebrow>Después de reservar</Eyebrow>
        <motion.h2 id="visita" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.92] font-light">Nos encargamos <em className="text-gradient pr-2">de lo demás</em></motion.h2>
        <div className="relative mt-16 pl-8 md:pt-10 md:pl-0">
          <span className="absolute top-2 bottom-2 left-[5px] w-px bg-ink/15 md:inset-x-0 md:top-[5px] md:bottom-auto md:h-px md:w-auto" aria-hidden />
          <motion.span style={{ scaleY: progress }} className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-rose md:hidden" aria-hidden />
          <motion.span style={{ scaleX: progress }} className="absolute inset-x-0 top-[5px] hidden h-px origin-left bg-linear-to-r from-rose-deep via-gold to-rose md:block" aria-hidden />
          <ol ref={ref} className="grid gap-10 md:grid-cols-4 md:gap-8">
            {JOURNEY.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="absolute top-2 -left-8 h-[11px] w-[11px] rounded-full bg-rose ring-4 ring-sand md:-top-10 md:left-0" aria-hidden />
                <FadeUp delay={i * 0.1}>
                  <p className="font-display text-5xl leading-none font-light text-rose/70 italic">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-3xl leading-tight">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{step.text}</p>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ─── Journal ─────────────────────────────────────────────────────────── */

export function PostCard({ post, index = 0, large = false }: { post: Post; index?: number; large?: boolean }) {
  return (
    <FadeUp delay={index * 0.08}>
      <TLink href={`/blog/${post.slug}`} className="group block" data-cursor="Leer">
        <div className={cn("relative overflow-hidden bg-sand", large ? "aspect-[4/3] rounded-[2.5rem]" : "aspect-[4/5] rounded-t-[999px] rounded-b-[2rem]")}>
          <Image src={unsplash(post.cover)} alt={post.cover.alt} fill sizes={large ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 30vw, 90vw"} className="grade object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110" />
          <span className="absolute top-5 left-5 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-semibold">{post.category}</span>
        </div>
        <p className="mt-5 flex items-center gap-3 text-xs text-muted">
          <span>{formatPostDate(post.date)}</span>
          <span className="h-px w-4 bg-ink/20" aria-hidden />
          <span>{post.readMin} min de lectura</span>
        </p>
        <h3 className={cn("mt-2 font-display leading-[1.05] font-light transition-colors duration-500 group-hover:text-rose", large ? "text-4xl md:text-5xl" : "text-3xl")}>{post.title}</h3>
        <p className="mt-3 line-clamp-2 max-w-lg text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
      </TLink>
    </FadeUp>
  );
}

export function JournalTeaser({ posts }: { posts: Post[] }) {
  return (
    <section aria-labelledby="journal" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Journal</Eyebrow>
          <motion.h2 id="journal" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.92] font-light">Belleza <em className="text-gradient pr-2">sin prisa</em></motion.h2>
        </div>
        <TLink href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">Todos los artículos <ArrowUpRight className="h-4 w-4" aria-hidden /></TLink>
      </div>
      <div className="grid gap-12 md:grid-cols-3 md:gap-8">
        {posts.slice(0, 3).map((p, i) => (
          <div key={p.slug} className={cn(i === 1 && "md:mt-20")}>
            <PostCard post={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Preguntas frecuentes ────────────────────────────────────────────── */


export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="faq" className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <motion.h2 id="faq" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE }} className="font-display text-[clamp(2.4rem,4vw,4.2rem)] leading-[0.92] font-light">Antes de <em className="text-gradient pr-2">tu visita</em></motion.h2>
        <p className="mt-5 max-w-sm text-ink-soft">¿Te quedó alguna duda? Escríbenos por WhatsApp y te respondemos en minutos.</p>
      </div>
      <ul className="border-t border-ink/15">
        {FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q} className="border-b border-ink/15">
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="group flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className={cn("font-display text-2xl leading-snug transition-colors duration-500 md:text-3xl", isOpen && "text-rose")}>{f.q}</span>
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-all duration-500", isOpen ? "rotate-45 border-transparent bg-ink text-paper" : "group-hover:border-ink/40")}>
                  <Plus className="h-4 w-4" aria-hidden />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.55, ease: EASE }} className="overflow-hidden">
                    <p className="max-w-2xl pb-7 leading-relaxed text-ink-soft">{f.a}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ─── Visítanos ───────────────────────────────────────────────────────── */

export function Visit({ branch }: { branch: LandingData["branches"][number] | undefined }) {
  if (!branch) return null;
  return (
    <section aria-labelledby="visitanos" className="mx-auto max-w-[1400px] px-3 pb-6 md:px-6">
      <Reveal y={80} scale={0.97} className="relative grid overflow-hidden rounded-[3rem] bg-plum text-paper lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[360px] lg:min-h-[560px]">
          <Image src={unsplash(PHOTOS.spaStill)} alt={PHOTOS.spaStill.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="grade object-cover" />
          <span className="absolute inset-0 bg-linear-to-r from-transparent to-plum/40" aria-hidden />
        </div>
        <div className="relative p-8 md:p-14">
          <Eyebrow className="text-peach">Visítanos</Eyebrow>
          <h2 id="visitanos" className="font-display text-5xl leading-[0.95] font-light md:text-6xl">{branch.name}</h2>
          <p className="mt-4 flex items-start gap-2 text-paper/80"><MapPin className="mt-1 h-4 w-4 shrink-0 text-peach" aria-hidden /> {branch.address}, {branch.district}{branch.reference ? <span className="block text-sm text-paper/55"> · {branch.reference}</span> : null}</p>
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-paper/15 pt-6 text-sm">
            {branch.hours.map((h) => (
              <div key={h.label}>
                <dt className="text-paper/55">{h.label}</dt>
                <dd className="mt-1 font-semibold tabular-nums">{h.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <TLink href="/reservar" className="btn-shine inline-flex h-12 flex-1 items-center justify-center rounded-full bg-paper px-6 text-sm font-semibold text-ink transition-colors hover:bg-peach">Reservar online</TLink>
            <a href={waLink(branch.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-paper/30 px-6 text-sm font-semibold transition-colors hover:bg-paper/10">WhatsApp</a>
          </div>
          <TLink href="/contacto" className="mt-6 inline-flex items-center gap-1 text-sm text-paper/70 underline-offset-4 hover:text-paper hover:underline">Cómo llegar y contacto <ArrowUpRight className="h-4 w-4" aria-hidden /></TLink>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Cierre ──────────────────────────────────────────────────────────── */

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const photos = [PHOTOS.hairWash, PHOTOS.facial, PHOTOS.citrus, PHOTOS.backMassage];
  return (
    <section aria-label="Reserva" className="mx-auto max-w-[1400px] px-3 py-20 md:px-6">
      <div ref={ref} className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-peach via-blush to-lilac px-5 py-24 text-center md:py-32">
        <div className="absolute inset-0 hidden grid-cols-4 gap-3 p-3 opacity-90 md:grid" aria-hidden>
          {photos.map((p, i) => (
            <motion.div key={p.id} className="relative overflow-hidden rounded-[50%]" style={{ alignSelf: i % 2 ? "start" : "end", height: "46%" }} initial={{ y: i % 2 ? "-120%" : "120%" }} animate={inView ? { y: "0%" } : undefined} transition={{ duration: 1.4, delay: i * 0.1, ease: EASE }}>
              <Image src={unsplash(p)} alt="" fill sizes="25vw" className="grade object-cover" />
            </motion.div>
          ))}
        </div>
        <div className="relative">
          <Sparkle className="mx-auto mb-6 h-6 w-6 animate-spin-slow text-rose-deep" />
          <h2 className="font-display text-[clamp(3.4rem,10vw,9.5rem)] leading-[0.88] font-light">Te toca <em>a ti</em></h2>
          <p className="mx-auto mt-5 max-w-sm text-ink-soft">Elige tu ritual y tu hora con la agenda real. Es cuestión de un minuto.</p>
          <TLink href="/reservar" data-cursor="Reservar" className="btn-shine mt-8 inline-flex h-14 items-center rounded-full bg-ink px-10 text-sm font-semibold text-paper transition-transform duration-500 hover:scale-105">Reserva tu ritual</TLink>
        </div>
      </div>
    </section>
  );
}
