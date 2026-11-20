"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import { Sparkle } from "@/components/brand/logo";
import { PHOTOS, unsplash, type Photo } from "@/content/images";
import { Magnetic } from "./motion-kit";
import { Particles } from "./particles";
import { TLink } from "./transition";

const SILK = [0.22, 1, 0.36, 1] as const;
const noop = () => () => {};
const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

/** CARA a lo ancho, con las letras repartidas como en el logo. */
function BigWord({ className }: { className: string }) {
  return (
    <span className={`flex w-[88vw] justify-between font-brand leading-[0.8] font-medium select-none md:w-[80vw] ${className}`}>
      {[..."CARA"].map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
          <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.6, ease: SILK, delay: 0.2 + i * 0.09 }}>
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Sello giratorio que lleva a reservar. */
function Badge() {
  return (
    <TLink href="/reservar" aria-label="Reservar una cita" data-cursor="Reservar" className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-ink text-paper shadow-[0_30px_60px_-24px_rgba(23,20,18,.7)] md:h-36 md:w-36">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text className="fill-current text-[14px] tracking-[0.32em] uppercase" fontFamily="var(--font-jost)">
          <textPath href="#badge-circle">Reserva tu ritual · headspa · faciales ·</textPath>
        </text>
      </svg>
      <Sparkle className="h-6 w-6 text-peach transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-180" />
    </TLink>
  );
}

/** Óvalo lateral: entra desde abajo, flota despacio y se mueve con el cursor. Todo con transform. */
function SideOval({ photo, label, x, y, delay, floatDelay }: { photo: Photo; label: string; x: MotionValue<number>; y: MotionValue<number>; delay: number; floatDelay: string }) {
  return (
    <motion.div initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.8, ease: SILK, delay }}>
      <motion.div style={{ x, y }}>
        <div className="animate-float" style={{ animationDelay: floatDelay }}>
          <div className="mirror-sheen relative aspect-[3/4.2] overflow-hidden rounded-[50%] shadow-[0_30px_70px_-30px_rgba(28,24,21,.55)]">
            <Image src={unsplash(photo)} alt={photo.alt} fill sizes="14vw" priority className="grade object-cover" />
          </div>
          <p className="eyebrow mt-4 text-center text-ink-soft">{label}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Hero "el óvalo": una ventana con la forma de un rostro deja ver la foto y pinta de claro
 * la parte del logotipo que queda dentro. Al hacer scroll el óvalo se abre hasta llenar la pantalla.
 * Rendimiento: el cursor solo mueve capas con transform (nada se repinta al mover el mouse).
 */
export function Hero() {
  const desktop = useSyncExternalStore(noop, isDesktop, () => true);
  return <HeroScene key={desktop ? "desktop" : "mobile"} desktop={desktop} />;
}

function HeroScene({ desktop }: { desktop: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Un poco de inercia sobre el scroll: la apertura se siente líquida y no a saltos.
  const p = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  // Parallax y luz que siguen al cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 18 });
  const sy = useSpring(my, { stiffness: 45, damping: 18 });
  const leftX = useTransform(sx, (v) => v * -34);
  const leftY = useTransform(sy, (v) => v * -22);
  const rightX = useTransform(sx, (v) => v * 30);
  const rightY = useTransform(sy, (v) => v * 20);
  const centerX = useTransform(sx, (v) => v * 8);
  const counterX = useTransform(centerX, (v) => -v);

  const oval = desktop ? "ellipse(15% 33% at 50% 57%)" : "ellipse(36% 25% at 50% 58%)";
  const clipPath = useTransform(p, [0, 0.6], [oval, "ellipse(85% 85% at 50% 50%)"]);
  // En escritorio la foto llena todo el ancho y la cara queda enorme: se parte reducida para que el rostro
  // entero quepa en el óvalo, y crece hasta 1 antes de que el óvalo se abra lo bastante para ver sus bordes.
  const imgScale = useTransform(p, desktop ? [0, 0.25] : [0, 0.8], desktop ? [0.62, 1] : [1.14, 1]);
  const wordY = useTransform(p, [0, 0.45], ["0%", "-45%"]);
  const wordScale = useTransform(p, [0, 0.45], [1, 1.12]);
  const wordOpacity = useTransform(p, [0.05, 0.4], [1, 0]);
  const sideLeft = useTransform(p, [0, 0.5], ["0%", "-70%"]);
  const sideRight = useTransform(p, [0, 0.5], ["0%", "70%"]);
  const sideOpacity = useTransform(p, [0.05, 0.35], [1, 0]);
  const introOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const introY = useTransform(p, [0, 0.15], [0, -30]);
  const frameScale = useTransform(p, [0, 0.35], [1, 1.7]);
  const frameOpacity = useTransform(p, [0, 0.25], [1, 0]);
  const shade = useTransform(p, [0.3, 0.75], [0.05, 0.62]);
  const line1 = useTransform(p, [0.56, 0.76], ["110%", "0%"]);
  const line2 = useTransform(p, [0.6, 0.8], ["110%", "0%"]);
  const ctaOpacity = useTransform(p, [0.7, 0.88], [0, 1]);
  const ctaY = useTransform(p, [0.7, 0.88], [24, 0]);
  const eyebrowOpacity = useTransform(p, [0.55, 0.72], [0, 1]);

  if (reduced) {
    return (
      <section id="inicio" aria-label="Cara Sanctuary" className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-plum text-paper">
        <Image src={unsplash(PHOTOS.heroCenter)} alt={PHOTOS.heroCenter.alt} fill priority sizes="100vw" className="grade object-cover opacity-55" />
        <div className="relative px-5 pb-16 md:px-10">
          <h1 className="font-display text-6xl leading-none font-light">Belleza que empieza por la calma.</h1>
          <TLink href="/reservar" className="mt-6 inline-flex h-12 items-center rounded-full bg-paper px-7 text-sm font-semibold text-ink">Reservar</TLink>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="inicio"
      aria-label="Cara Sanctuary"
      className="relative h-[230vh] bg-ivory"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* Malla de color cálida */}
        <div className="mesh" aria-hidden>
          <i style={{ width: "48vw", height: "48vw", left: "-10vw", top: "-16vw", color: "#e3cdb4", opacity: 0.8 }} />
          <i style={{ width: "44vw", height: "44vw", right: "-8vw", top: "-6vw", color: "#d8d2c6", opacity: 0.9, animationDelay: "-8s" }} />
        </div>

        {/* Cabecera editorial: aquí vive la frase, lejos de las fotos */}
        <motion.div style={{ opacity: introOpacity, y: introY }} className="pointer-events-none absolute inset-x-0 top-24 mx-auto flex max-w-[1400px] items-start justify-between gap-6 px-5 md:top-28 md:px-10">
          <div>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1, ease: SILK }} className="eyebrow text-ink-soft">
              Salud & belleza · Lima
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 1, ease: SILK }} className="mt-3 hidden max-w-[16rem] font-display text-[1.3rem] leading-snug text-ink-soft italic md:block">
              Un santuario para tu cabeza, tu rostro y tu cuerpo.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1, ease: SILK }} className="flex flex-col items-end">
            <p className="eyebrow hidden text-right leading-loose text-ink-soft md:block">
              01 Headspa
              <br />
              02 Faciales
              <br />
              03 Corporales
            </p>
          </motion.div>
        </motion.div>

        {/* Óvalos laterales, por debajo del logotipo */}
        {desktop ? (
          <>
            <motion.div style={{ x: sideLeft, opacity: sideOpacity }} className="absolute bottom-[7%] left-[6%] w-[13vw] max-w-[230px]">
              <SideOval photo={PHOTOS.hairWash} label="Headspa" x={leftX} y={leftY} delay={0.6} floatDelay="0s" />
            </motion.div>
            <motion.div style={{ x: sideRight, opacity: sideOpacity }} className="absolute right-[7%] bottom-[15%] w-[11vw] max-w-[200px]">
              <SideOval photo={PHOTOS.facial} label="Faciales" x={rightX} y={rightY} delay={0.75} floatDelay="-4.5s" />
            </motion.div>
          </>
        ) : null}

        {/* Marco dorado que respira alrededor del óvalo */}
        <motion.div style={{ scale: frameScale, opacity: frameOpacity, x: centerX }} className="pointer-events-none absolute inset-0" aria-hidden>
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: SILK, delay: 0.5 }}
            className="absolute top-[57%] left-1/2 block h-[calc(50dvh+34px)] w-[calc(72vw+34px)] -translate-x-1/2 -translate-y-1/2 md:h-[calc(66dvh+34px)] md:w-[calc(30vw+34px)]"
          >
            <span className="block h-full w-full animate-breathe rounded-[50%] border border-gold/60" />
          </motion.span>
        </motion.div>

        {/* Logotipo en tinta (fuera del óvalo) */}
        <motion.div style={{ y: wordY, scale: wordScale, opacity: wordOpacity }} className="absolute inset-x-0 top-[36%] flex -translate-y-1/2 justify-center md:top-[calc(220px_+_min(21vw,30dvh)_*_0.4)]">
          <h1 aria-label="Cara Sanctuary">
            <BigWord className="text-[27vw] text-ink md:text-[min(21vw,30dvh)]" />
          </h1>
        </motion.div>

        {/* El óvalo */}
        <motion.div style={{ clipPath, x: centerX }} className="absolute inset-0">
          <motion.div initial={{ scale: 1.25, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2.2, ease: SILK }} className="absolute inset-0">
            {/* En escritorio la caja es más alta (1/0,62) para que, reducida, siga cubriendo toda la pantalla */}
            <motion.div style={{ scale: imgScale }} className={desktop ? "absolute inset-x-0 -inset-y-[31%]" : "absolute inset-0"}>
              <Image src={unsplash(PHOTOS.heroCenter)} alt={PHOTOS.heroCenter.alt} fill priority sizes="100vw" className={desktop ? "object-cover object-[50%_48%]" : "object-cover object-[50%_30%]"} />
            </motion.div>
          </motion.div>
          <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-linear-to-t from-plum via-plum/70 to-plum/10" />
          {/* Mismo logotipo, en claro: solo se ve dentro del óvalo */}
          <motion.div style={{ y: wordY, scale: wordScale, opacity: wordOpacity, x: counterX }} className="absolute inset-x-0 top-[36%] flex -translate-y-1/2 justify-center md:top-[calc(220px_+_min(21vw,30dvh)_*_0.4)]" aria-hidden>
            <BigWord className="text-[27vw] text-paper md:text-[min(21vw,30dvh)]" />
          </motion.div>

          {/* Texto al abrirse: cada línea sube desde su máscara, al ritmo del scroll */}
          <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-8 px-5 pb-12 text-paper md:px-10 md:pb-16">
            <div>
              <motion.p style={{ opacity: eyebrowOpacity }} className="eyebrow mb-4 text-peach">Cara Sanctuary · Lima</motion.p>
              <p className="max-w-4xl font-display text-[clamp(3.2rem,7.6vw,8rem)] leading-[0.9] font-light">
                <span className="block overflow-hidden pb-[0.12em]"><motion.span style={{ y: line1 }} className="block">Belleza que empieza</motion.span></span>
                <span className="-mt-[0.12em] block overflow-hidden pb-[0.14em]"><motion.span style={{ y: line2 }} className="block"><em className="text-gradient-light pr-2">por la calma.</em></motion.span></span>
              </p>
              <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <TLink href="/reservar" className="btn-shine inline-flex h-13 items-center rounded-full bg-paper px-8 text-sm font-semibold text-ink transition-colors hover:bg-peach">Reserva tu ritual</TLink>
                </Magnetic>
                <TLink href="/headspa" className="inline-flex h-13 items-center rounded-full border border-paper/40 bg-ink/20 px-8 text-sm font-semibold transition-colors hover:bg-paper/10">Descubre el headspa</TLink>
              </motion.div>
            </div>
            <motion.div style={{ opacity: ctaOpacity }} className="mr-16 mb-16 hidden md:block"><Badge /></motion.div>
          </div>
        </motion.div>

        <Particles colors={["#b8976a", "#d9c2a3", "#fbf8f3", "#8a6a4f"]} count={18} glints={0.4} opacity={0.75} />

      </div>
    </section>
  );
}
