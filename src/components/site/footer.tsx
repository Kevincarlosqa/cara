import { ArrowUpRight } from "lucide-react";
import { LogoMark, Sparkle } from "@/components/brand/logo";
import type { LandingData } from "@/lib/landing";
import { WordmarkReveal } from "./motion-kit";
import { INSTAGRAM_URL, waLink } from "./icons";
import { TLink } from "./transition";

export function Footer({ branches, year, demo, whatsapp }: Pick<LandingData, "branches" | "year"> & { demo: boolean; whatsapp: string }) {
  const home = branches[0];
  return (
    <footer className="relative overflow-hidden bg-plum text-paper">
      <div className="mesh opacity-40" aria-hidden>
        <i style={{ width: 560, height: 560, right: -160, top: -180, color: "#8a6a4f" }} />
        <i style={{ width: 480, height: 480, left: -140, bottom: -220, color: "#5b4a3e", animationDelay: "-11s" }} />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 pb-8 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-5xl leading-[0.95] font-light md:text-6xl">
              Respira.
              <br />
              <em className="text-gradient-light">Suelta.</em>
              <br />
              Vuelve a ti.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/70">Un santuario de salud y belleza en Lima. Headspa, faciales y corporales para cuidar tu cuero cabelludo, tu piel y tu calma.</p>
            <a href={waLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-paper/25 px-6 text-sm font-semibold transition-colors hover:bg-paper hover:text-ink">
              Reserva por WhatsApp <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
            </a>
          </div>
          {home ? (
            <div>
              <p className="eyebrow mb-5 text-peach">Visítanos</p>
              <p className="text-sm">{home.name}</p>
              <p className="mt-1 text-sm text-paper/65">{home.address} · {home.district}</p>
              <dl className="mt-5 space-y-1.5 text-sm">
                {home.hours.map((h) => (
                  <div key={h.label} className="flex justify-between gap-6 border-b border-paper/10 pb-1.5">
                    <dt className="text-paper/60">{h.label}</dt>
                    <dd className="tabular-nums">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          <nav aria-label="Secciones">
            <p className="eyebrow mb-5 text-peach">Explora</p>
            <ul className="space-y-2 text-sm">
              {[["/headspa", "Headspa"], ["/servicios", "Carta completa"], ["/blog", "Journal"], ["/store", "Gift cards"], ["/reservar", "Reservar"], ["/contacto", "Contacto"]].map(([href, label]) => (
                <li key={href}>
                  <TLink href={href!} className="transition-colors hover:text-peach">{label}</TLink>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Redes">
            <p className="eyebrow mb-5 text-peach">Síguenos</p>
            <ul className="space-y-2 text-sm">
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-peach">Instagram · @cara_sanctuary</a></li>
              <li><a href={waLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-peach">WhatsApp · +51 947 009 055</a></li>
              <li className="pt-3"><TLink href="/login" className="text-paper/60 transition-colors hover:text-peach">Panel del equipo</TLink></li>
              <li><TLink href="/propuesta" className="text-paper/60 transition-colors hover:text-peach">La propuesta</TLink></li>
            </ul>
          </nav>
        </div>

        <WordmarkReveal className="mt-24 text-[23vw] text-paper/95 xl:text-[20rem]" />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 pt-5 text-xs text-paper/60">
          <p className="flex items-center gap-2"><LogoMark className="h-4 w-4" title="" /> © {year} Cara Sanctuary · Salud y belleza</p>
          <p className="flex items-center gap-2"><Sparkle className="h-2.5 w-2.5 text-peach" /> Headspa · Faciales · Corporales</p>
          {demo ? <p className="w-full text-paper/45">Sitio de demostración preparado como propuesta. Fotos de referencia; carta, precios y horarios por confirmar con la marca.</p> : null}
        </div>
      </div>
    </footer>
  );
}
