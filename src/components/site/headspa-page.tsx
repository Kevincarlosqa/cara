"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, Droplets, Feather, Leaf, Moon, Sparkles, Wind } from "lucide-react";
import { Sparkle } from "@/components/brand/logo";
import { PHOTOS, unsplash } from "@/content/images";
import type { LandingData } from "@/lib/landing";
import { formatMoney } from "@/lib/utils";
import { FadeUp, Magnetic, RevealLines } from "./motion-kit";
import { TLink } from "./transition";

type Service = LandingData["services"][number];
const EASE = [0.22, 1, 0.36, 1] as const;

const BENEFITS = [
  { icon: Droplets, title: "Raíz limpia", text: "Retira sebo, residuos de producto y células muertas que el champú no alcanza." },
  { icon: Leaf, title: "Cuero cabelludo en equilibrio", text: "Menos grasa a mitad del día, menos picazón y menos descamación." },
  { icon: Moon, title: "Calma profunda", text: "El masaje craneal lento baja las revoluciones. Muchas se quedan dormidas." },
  { icon: Wind, title: "Tensión que se suelta", text: "Sienes, nuca, cuello y hombros: donde se acumula el estrés de la semana." },
  { icon: Sparkles, title: "Brillo y volumen", text: "Un cabello que nace en una raíz sana se ve más liviano y luminoso." },
  { icon: Feather, title: "Un momento solo tuyo", text: "Noventa minutos sin pantallas, con luz baja, aromas y agua tibia." },
];

function FloatingChip({ children, className, delay }: { children: React.ReactNode; className: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.9, ease: EASE }}
      className={`absolute z-10 ${className}`}
    >
      {/* La flotación es CSS (compositor), no un bucle de JavaScript. */}
      <span className="flex animate-float items-center gap-2 rounded-full border border-ink/5 bg-paper/95 px-4 py-2 text-xs font-semibold shadow-[0_18px_40px_-20px_rgba(23,20,18,.5)]" style={{ animationDelay: `${-delay * 2}s` }}>
        <Sparkle className="h-2.5 w-2.5 text-rose" />
        {children}
      </span>
    </motion.span>
  );
}

export function HeadspaHero({ signature }: { signature?: Service }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.12]);
  return (
    <section ref={ref} aria-labelledby="headspa-title" className="relative overflow-hidden bg-linear-to-b from-sand/70 via-ivory to-ivory">
      <div className="mesh" aria-hidden>
        <i style={{ width: "42vw", height: "42vw", right: "-10vw", top: "-10vw", color: "#d9c2a3", opacity: 0.7 }} />
        <i style={{ width: "34vw", height: "34vw", left: "-10vw", bottom: "-12vw", color: "#d8d2c6", opacity: 0.8, animationDelay: "-9s" }} />
      </div>
      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 pt-36 pb-24 md:px-10 md:pt-44 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow mb-5 flex items-center gap-3 text-rose"><span className="h-px w-8 bg-current" aria-hidden />Ritual japonés para el cuero cabelludo</p>
          <h1 id="headspa-title" className="sr-only">Headspa</h1>
          <RevealLines as="p" lines={["Headspa,", <em key="e" className="text-gradient pr-3">la calma empieza</em>, "por la raíz"]} className="font-display text-[clamp(3.4rem,8.6vw,8.8rem)] leading-[0.88] font-light" />
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-soft">El cuero cabelludo es piel, y una piel muy exigida. El headspa lo limpia, lo exfolia y lo nutre mientras un masaje craneal largo y una cascada de agua tibia te desconectan por completo.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <TLink href={signature ? `/reservar?servicio=${signature.id}` : "/reservar"} className="btn-shine inline-flex h-13 items-center rounded-full bg-ink px-8 text-sm font-semibold text-paper">Reservar Headspa Signature</TLink>
            </Magnetic>
            {signature ? <p className="text-sm text-muted">desde <strong className="text-ink tabular-nums">{formatMoney(signature.basePriceCents)}</strong> · {signature.durationMin} min</p> : null}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px]">
          <motion.div initial={{ clipPath: "ellipse(0% 0% at 50% 50%)" }} animate={{ clipPath: "ellipse(50% 50% at 50% 50%)" }} transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 }} className="relative aspect-[3/4] overflow-hidden">
            <motion.div style={{ y, scale }} className="absolute inset-[-8%]">
              <Image src={unsplash(PHOTOS.hairWash)} alt={PHOTOS.hairWash.alt} fill priority sizes="(min-width: 1024px) 40vw, 90vw" className="grade object-cover" />
            </motion.div>
            <div className="ripples" aria-hidden><span /><span /><span /><span /></div>
          </motion.div>
          <span className="pointer-events-none absolute inset-[-14px] animate-breathe rounded-[50%] border border-gold/50" aria-hidden />
          <FloatingChip className="top-[12%] -left-4 md:-left-12" delay={1.2}>Diagnóstico capilar</FloatingChip>
          <FloatingChip className="top-[48%] -right-3 md:-right-10" delay={1.4}>Cascada de agua tibia</FloatingChip>
          <FloatingChip className="bottom-[10%] left-[6%]" delay={1.6}>90 minutos</FloatingChip>
        </div>
      </div>
    </section>
  );
}

export function HeadspaBenefits() {
  return (
    <section aria-labelledby="beneficios" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <div className="mb-14 max-w-3xl">
        <p className="eyebrow mb-5 flex items-center gap-3 text-rose"><span className="h-px w-8 bg-current" aria-hidden />Lo que notarás</p>
        <h2 id="beneficios" className="font-display text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.92] font-light">Más que un lavado: <em className="text-gradient pr-2">un reinicio</em></h2>
      </div>
      <ul className="grid gap-px overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <li key={b.title} className="group bg-ivory p-8 transition-colors duration-700 hover:bg-paper md:p-10">
            <FadeUp delay={(i % 3) * 0.08}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-rose/30 text-rose transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-rose group-hover:text-paper">
                <b.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-6 font-display text-3xl font-light">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.text}</p>
            </FadeUp>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HeadspaMenu({ services }: { services: Service[] }) {
  return (
    <section aria-labelledby="menu-headspa" className="bg-sand/70">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-rose"><span className="h-px w-8 bg-current" aria-hidden />Elige tu versión</p>
            <h2 id="menu-headspa" className="font-display text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.92] font-light">Un headspa para <em className="text-gradient pr-2">cada raíz</em></h2>
          </div>
          <TLink href="/servicios" className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">Ver toda la carta <ArrowUpRight className="h-4 w-4" aria-hidden /></TLink>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((s, i) => (
            <motion.li key={s.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ duration: 0.8, ease: EASE, delay: (i % 2) * 0.08 }}>
              <TLink href={`/reservar?servicio=${s.id}`} data-cursor="Reservar" className="group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[2rem] border border-ink/10 bg-paper p-7 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_40px_80px_-50px_rgba(28,24,21,.6)] md:p-9">
                <span className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-peach/0 transition-colors duration-700 group-hover:bg-peach/40" aria-hidden />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="font-brand text-xs tracking-[0.25em] text-muted">0{i + 1}</span>
                    {s.featured ? <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-paper">Favorito</span> : null}
                  </div>
                  <h3 className="mt-4 font-display text-4xl leading-tight font-light transition-colors duration-500 group-hover:text-rose">{s.name}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">{s.description}</p>
                </div>
                <div className="relative flex items-end justify-between">
                  <p className="text-sm text-muted">{s.durationMin} min</p>
                  <p className="flex items-center gap-4"><span className="font-display text-3xl tabular-nums">{formatMoney(s.basePriceCents)}</span><span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-ink group-hover:text-paper"><ArrowUpRight className="h-4 w-4" aria-hidden /></span></p>
                </div>
              </TLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HeadspaForWho() {
  const yes = ["Sientes la raíz grasa al final del día", "Usas mucho champú seco, spray o productos de peinado", "Tienes la cabeza o la nuca tensas por el estrés", "Notas el cabello opaco o sin volumen", "Atraviesas una temporada de caída", "Necesitas desconectarte de verdad"];
  const ask = ["Psoriasis, dermatitis o heridas activas en el cuero cabelludo", "Un tratamiento químico en los últimos 7 días", "Embarazo (lo adaptamos, avísanos al reservar)", "Migrañas frecuentes o hipertensión no controlada"];
  return (
    <section aria-labelledby="para-quien" className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2">
      <div>
        <p className="eyebrow mb-5 flex items-center gap-3 text-rose"><span className="h-px w-8 bg-current" aria-hidden />¿Para quién es?</p>
        <h2 id="para-quien" className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[0.92] font-light">Es para ti <em className="text-gradient pr-2">si…</em></h2>
        <ul className="mt-10 space-y-4">
          {yes.map((t, i) => (
            <FadeUp key={t} delay={i * 0.05}>
              <li className="flex items-center gap-4 border-b border-ink/10 pb-4 font-display text-2xl font-light"><Sparkle className="h-3 w-3 shrink-0 text-rose" /> {t}</li>
            </FadeUp>
          ))}
        </ul>
      </div>
      <div className="self-end rounded-[2.5rem] bg-plum p-8 text-paper md:p-12">
        <p className="eyebrow text-peach">Consúltanos antes si tienes</p>
        <ul className="mt-6 space-y-3 text-paper/85">
          {ask.map((t) => (
            <li key={t} className="flex gap-3 text-sm leading-relaxed"><span className="mt-2 h-px w-4 shrink-0 bg-peach" aria-hidden /> {t}</li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-paper/60">El headspa cuida y acompaña, pero no reemplaza un tratamiento médico. Ante cualquier condición, primero tu dermatólogo.</p>
      </div>
    </section>
  );
}
