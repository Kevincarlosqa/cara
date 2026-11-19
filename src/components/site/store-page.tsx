"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, Gift, ShoppingBag } from "lucide-react";
import { LogoMark, Sparkle } from "@/components/brand/logo";
import type { LandingData } from "@/lib/landing";
import { cn, formatMoney } from "@/lib/utils";
import { waLink } from "./icons";
import { FadeUp, RevealLines, Tilt } from "./motion-kit";
import { Particles } from "./particles";

const BRAND_TONES = ["from-sand to-blush", "from-lilac/70 to-sand", "from-butter to-peach/50", "from-blush to-lilac/60", "from-peach/50 to-sand", "from-linen to-butter", "from-[#dfe3da] to-sand"];
const GIFTS = [
  { name: "Gift Card Digital", range: "S/ 100 a S/ 800", text: "Tú eliges el monto; quien la recibe elige su ritual.", tone: "from-[#2a231e] via-plum to-[#3b2f26]" },
  { name: "Headspa Signature", range: "S/ 280 a S/ 360", text: "Nuestro ritual de autor, de 90 o 120 minutos.", tone: "from-[#4a3a2e] via-[#2a231e] to-plum" },
  { name: "Ritual Head & Face", range: "S/ 420", text: "Headspa Signature y Facial Cara Glow en una sola visita.", tone: "from-[#6b4f39] via-[#3b2f26] to-plum" },
  { name: "Ritual Cara Sanctuary", range: "S/ 590", text: "Tres horas: headspa, facial y masaje corporal.", tone: "from-[#8a6a4f] via-[#4a3a2e] to-plum" },
];

export function StorePage({ products, whatsapp, demo }: { products: LandingData["products"]; whatsapp: string; demo: boolean }) {
  const brands = [...new Set(products.map((p) => p.brand))];
  const [brand, setBrand] = useState<string | null>(null);
  const list = brand ? products.filter((p) => p.brand === brand) : products;
  return (
    <div>
      <section id="gift-cards" aria-labelledby="gift-title" className="relative overflow-hidden bg-plum px-5 pt-36 pb-24 text-paper md:px-10 md:pt-48 md:pb-32">
        <div className="mesh opacity-50" aria-hidden>
          <i style={{ width: 620, height: 620, right: "-10%", top: "-30%", color: "#8a6a4f" }} />
          <i style={{ width: 480, height: 480, left: "-10%", bottom: "-30%", color: "#5b4a3e", animationDelay: "-9s" }} />
        </div>
        <Particles colors={["#d9c2a3", "#b8976a", "#fbf8f3"]} count={40} glints={0.45} opacity={0.8} />
        <div className="relative mx-auto max-w-[1400px]">
          <p className="eyebrow mb-5 flex items-center gap-2 text-peach"><Gift className="h-4 w-4" aria-hidden /> Gift cards</p>
          <h1 id="gift-title" className="sr-only">Gift cards</h1>
          <RevealLines as="p" lines={["Regala", <em key="a" className="text-gradient-light pr-3">calma</em>]} className="font-display text-[clamp(3.6rem,11vw,10rem)] leading-[0.86] font-light" />
          <p className="mt-6 max-w-lg text-lg text-paper/75">Digitales, con dedicatoria y listas en minutos. Válidas por 12 meses en cualquier tratamiento del santuario.</p>
          <ul className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {GIFTS.map((g, i) => (
              <li key={g.name}>
                <FadeUp delay={i * 0.08}>
                  <a href={waLink(whatsapp, `Hola Cara ✨ Quiero regalar una gift card: ${g.name}.`)} target="_blank" rel="noopener noreferrer" data-cursor="Regalar" className="block">
                    <Tilt max={9} innerClassName="rounded-[1.75rem]">
                      <div className={cn("relative flex aspect-[1.25] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-paper/10 bg-linear-to-br p-6", g.tone)}>
                        <span className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ background: "conic-gradient(from 200deg at 70% 30%, transparent, rgba(217,194,163,.55), transparent 35%, rgba(184,151,106,.4), transparent 65%)" }} aria-hidden />
                        <LogoMark className="absolute -right-8 -bottom-10 h-48 w-48 text-gold/15" title="" />
                        <span className="relative flex items-center justify-between">
                          <span className="wordmark text-gradient-light text-lg">Cara</span>
                          <Sparkle className="h-4 w-4 text-peach" />
                        </span>
                        <span className="relative">
                          <span className="block font-display text-3xl leading-tight font-light">{g.name}</span>
                          <span className="mt-1 block text-sm font-semibold text-peach">{g.range}</span>
                          <span className="mt-1 block text-xs text-paper/70">{g.text}</span>
                        </span>
                      </div>
                    </Tilt>
                  </a>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="casa-title" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-rose"><span className="h-px w-8 bg-current" aria-hidden />El ritual en casa</p>
            <h2 id="casa-title" className="font-display text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.92] font-light">Lo que usamos <em className="text-gradient pr-2">en cabina</em></h2>
          </div>
          <p className="max-w-sm text-ink-soft">Te recomendamos qué llevar según tu diagnóstico. Escríbenos y te lo separamos.</p>
        </div>
        <div className="mb-10 flex flex-wrap gap-2">
          {[null, ...brands].map((b) => (
            <button key={b ?? "all"} aria-pressed={brand === b} onClick={() => setBrand(b)} className={cn("relative rounded-full border px-4 py-2 text-sm font-medium transition-colors", brand === b ? "border-transparent text-paper" : "border-ink/15 hover:border-ink/40")}>
              {brand === b ? <motion.span layoutId="brand-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} /> : null}
              <span className="relative">{b ?? "Todas"}</span>
            </button>
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p) => {
              const tone = BRAND_TONES[brands.indexOf(p.brand) % BRAND_TONES.length];
              return (
                <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <a href={waLink(whatsapp, `Hola Cara ✨ Me interesa ${p.brand} ${p.name}. ¿Lo tienen disponible?`)} target="_blank" rel="noopener noreferrer" className="group block" data-cursor="Pedir">
                    <div className={cn("relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-linear-to-br p-6 pt-14 text-center transition-transform duration-700 ease-out group-hover:-translate-y-1", tone)}>
                      <span className="eyebrow text-[10px] text-ink-soft">{p.category}</span>
                      <LogoMark className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 text-paper/60 transition-transform duration-[1400ms] ease-out group-hover:scale-110 group-hover:rotate-12" title="" />
                      <span className="relative font-display text-3xl leading-none font-light md:text-4xl">{p.brand}</span>
                      <span className="absolute right-4 bottom-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-ink text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"><ShoppingBag className="h-4 w-4" aria-hidden /></span>
                    </div>
                    <p className="mt-4 text-sm leading-snug font-medium">{p.name}</p>
                    <p className="mt-0.5 flex items-center justify-between text-sm text-ink-soft tabular-nums">{formatMoney(p.priceCents)} <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden /></p>
                  </a>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        {demo ? <p className="mt-10 text-xs text-muted">Selección de ejemplo: productos, marcas y precios son referenciales hasta confirmarlos con Cara.</p> : null}
      </section>
    </div>
  );
}
