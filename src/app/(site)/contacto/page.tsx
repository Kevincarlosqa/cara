import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Clock, MapPin, MessageCircle } from "lucide-react";
import { FinalCta } from "@/components/site/home-sections";
import { INSTAGRAM_URL, InstagramIcon, waLink } from "@/components/site/icons";
import { FadeUp, RevealLines } from "@/components/site/motion-kit";
import { TLink } from "@/components/site/transition";
import { PHOTOS, unsplash } from "@/content/images";
import { config } from "@/lib/config";
import { getLandingData } from "@/lib/landing";

export const metadata: Metadata = { title: "Contacto", description: "Visita Cara Sanctuary en Lima. Horarios, ubicación, WhatsApp e Instagram." };

export default async function ContactPage() {
  const { branches } = await getLandingData();
  const b = branches[0];
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Cara Sanctuary Lima")}`;
  const cards = [
    { icon: MessageCircle, title: "WhatsApp", text: "+51 947 009 055", hint: "Respondemos en minutos", href: waLink(config.WHATSAPP_PUBLIC_NUMBER), cta: "Escribir" },
    { icon: InstagramIcon, title: "Instagram", text: "@cara_sanctuary", hint: "14,7 mil personas ya nos siguen", href: INSTAGRAM_URL, cta: "Seguir" },
    { icon: MapPin, title: "Ubicación", text: b ? `${b.address}, ${b.district}` : "Lima, Perú", hint: b?.reference ?? "Te enviamos la ubicación al confirmar", href: maps, cta: "Cómo llegar" },
  ];
  return (
    <>
      <section aria-labelledby="contacto-title" className="relative overflow-hidden bg-linear-to-b from-sand/60 to-ivory">
        <div className="mesh" aria-hidden>
          <i style={{ width: "40vw", height: "40vw", right: "-10vw", top: "-12vw", color: "#d9c2a3", opacity: 0.7 }} />
          <i style={{ width: "32vw", height: "32vw", left: "-8vw", bottom: "-14vw", color: "#d8d2c6", opacity: 0.8, animationDelay: "-9s" }} />
        </div>
        <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 pt-36 pb-24 md:px-10 md:pt-48 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-rose"><span className="h-px w-8 bg-current" aria-hidden />Contacto</p>
            <h1 id="contacto-title" className="sr-only">Contacto</h1>
            <RevealLines as="p" lines={["Ven a", <em key="e" className="text-gradient pr-3">respirar</em>]} className="font-display text-[clamp(3.6rem,11vw,10rem)] leading-[0.86] font-light" />
            <p className="mt-6 max-w-lg text-lg text-ink-soft">Estamos en Lima. Reserva online o escríbenos por WhatsApp: te ayudamos a elegir tu ritual y te enviamos la ubicación exacta al confirmar.</p>
          </div>
          {b ? (
            <FadeUp>
              <div className="rounded-[2.5rem] bg-plum p-8 text-paper md:p-10">
                <p className="eyebrow flex items-center gap-2 text-peach"><Clock className="h-3.5 w-3.5" aria-hidden /> Horario</p>
                <dl className="mt-6 space-y-3">
                  {b.hours.map((h) => (
                    <div key={h.label} className="flex items-baseline justify-between border-b border-paper/15 pb-3">
                      <dt className="font-display text-2xl font-light">{h.label}</dt>
                      <dd className="tabular-nums">{h.value}</dd>
                    </div>
                  ))}
                </dl>
                <TLink href="/reservar" className="btn-shine mt-8 flex h-12 items-center justify-center rounded-full bg-paper text-sm font-semibold text-ink transition-colors hover:bg-peach">Reservar online</TLink>
              </div>
            </FadeUp>
          ) : null}
        </div>
      </section>

      <section aria-label="Canales" className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <ul className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <li key={c.title}>
              <FadeUp delay={i * 0.08}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" data-cursor={c.cta} className="group flex h-full flex-col justify-between gap-10 rounded-[2rem] border border-ink/10 bg-paper p-8 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_40px_80px_-50px_rgba(28,24,21,.6)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-rose/30 text-rose transition-all duration-700 group-hover:bg-rose group-hover:text-paper"><c.icon className="h-5 w-5" /></span>
                  <span>
                    <span className="eyebrow block text-muted">{c.title}</span>
                    <span className="mt-2 block font-display text-3xl leading-tight font-light">{c.text}</span>
                    <span className="mt-2 block text-sm text-muted">{c.hint}</span>
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">{c.cta} <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden /></span>
                  </span>
                </a>
              </FadeUp>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="El espacio" className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 px-5 md:grid-cols-4 md:px-10">
        {[PHOTOS.spaStill, PHOTOS.hairWash, PHOTOS.oilDrop, PHOTOS.facial].map((p, i) => (
          <FadeUp key={p.id} delay={i * 0.08} className={i % 2 ? "md:mt-16" : ""}>
            <div className={`relative aspect-[3/4] overflow-hidden ${i % 2 ? "rounded-[2rem]" : "rounded-[50%]"}`}>
              <Image src={unsplash(p)} alt={p.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="grade object-cover" />
            </div>
          </FadeUp>
        ))}
      </section>

      <FinalCta />
    </>
  );
}
