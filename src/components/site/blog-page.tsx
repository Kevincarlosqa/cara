"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Sparkle } from "@/components/brand/logo";
import { formatPostDate, type Block, type Post } from "@/content/blog";
import { unsplash } from "@/content/images";
import { cn } from "@/lib/utils";
import { PostCard } from "./home-sections";
import { RevealLines } from "./motion-kit";
import { TLink } from "./transition";

const CATS = ["Todo", "Headspa", "Piel", "Cuerpo", "Bienestar"] as const;

export function BlogIndex({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState<(typeof CATS)[number]>("Todo");
  const [first, ...rest] = posts;
  const list = cat === "Todo" ? rest : posts.filter((p) => p.category === cat);
  return (
    <div>
      <header className="relative overflow-hidden bg-linear-to-b from-sand/60 to-ivory px-5 pt-36 pb-14 md:px-10 md:pt-48">
        <div className="mesh" aria-hidden>
          <i style={{ width: "40vw", height: "40vw", right: "-8vw", top: "-14vw", color: "#d9c2a3", opacity: 0.7 }} />
        </div>
        <div className="relative mx-auto max-w-[1400px]">
          <p className="eyebrow mb-5 flex items-center gap-3 text-rose"><span className="h-px w-8 bg-current" aria-hidden />Journal de Cara</p>
          <RevealLines as="h1" lines={["Belleza", <em key="e" className="text-gradient pr-3">sin prisa</em>]} className="font-display text-[clamp(3.6rem,11vw,10rem)] leading-[0.86] font-light" />
          <p className="mt-6 max-w-lg text-lg text-ink-soft">Guías, rituales y respuestas honestas sobre el cuidado de tu cuero cabelludo, tu piel y tu cuerpo. Escritas por quienes te atienden en cabina.</p>
        </div>
      </header>

      {first && cat === "Todo" ? (
        <section aria-label="Artículo destacado" className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10">
          <TLink href={`/blog/${first.slug}`} className="group grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-center" data-cursor="Leer">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2.5rem] bg-sand">
              <Image src={unsplash(first.cover)} alt={first.cover.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="grade object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105" />
              <span className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-paper/90 px-4 py-1.5 text-xs font-semibold backdrop-blur"><Sparkle className="h-2.5 w-2.5 text-rose" /> Lo último</span>
            </div>
            <div>
              <p className="eyebrow text-rose">{first.category}</p>
              <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[0.95] font-light transition-colors duration-500 group-hover:text-rose">{first.title}</h2>
              <p className="mt-5 max-w-md leading-relaxed text-ink-soft">{first.excerpt}</p>
              <p className="mt-6 flex items-center gap-3 text-xs text-muted">{formatPostDate(first.date)} <span className="h-px w-4 bg-ink/20" /> {first.readMin} min de lectura</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">Leer el artículo <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden /></span>
            </div>
          </TLink>
        </section>
      ) : null}

      <section aria-label="Artículos" className="mx-auto max-w-[1400px] px-5 pb-28 md:px-10">
        <div className="mb-10 flex flex-wrap gap-2 border-t border-ink/10 pt-8" role="tablist" aria-label="Categorías">
          {CATS.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={cn("relative rounded-full px-5 py-2 text-sm font-medium transition-colors", cat === c ? "text-paper" : "text-ink-soft hover:text-ink")}>
              {cat === c ? <motion.span layoutId="blog-cat" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} /> : null}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
        <motion.div layout className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div key={p.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5 }}>
                <PostCard post={p} index={i % 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {!list.length ? <p className="py-16 text-center text-muted">Pronto publicaremos artículos en esta categoría.</p> : null}
      </section>
    </div>
  );
}

function renderInline(text: string) {
  // **negrita** sencilla, sin HTML.
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part));
}

function BlockView({ b }: { b: Block }) {
  if (b.type === "h2") return <h2 id={b.id}>{b.text}</h2>;
  if (b.type === "ul")
    return (
      <ul>
        {b.items.map((it) => (
          <li key={it}>{renderInline(it)}</li>
        ))}
      </ul>
    );
  if (b.type === "quote") return <blockquote>{b.text}</blockquote>;
  return <p>{renderInline(b.text)}</p>;
}

export function Article({ post, related, serviceId }: { post: Post; related: Post[]; serviceId?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "20%"]);
  const toc = post.body.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2");
  return (
    <article>
      <header ref={ref} className="relative overflow-hidden bg-linear-to-b from-sand/60 to-ivory px-5 pt-32 md:px-10 md:pt-44">
        <div className="relative mx-auto max-w-[1100px] text-center">
          <TLink href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Journal</TLink>
          <p className="eyebrow mt-8 text-rose">{post.category} · {post.readMin} min de lectura</p>
          <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.8rem,6.6vw,6.2rem)] leading-[0.92] font-light text-balance">
            {post.title}
          </motion.h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
          <p className="mt-6 text-xs text-muted">Equipo Cara · {formatPostDate(post.date)}</p>
        </div>
        <motion.div initial={{ clipPath: "inset(30% 20% 0% 20% round 999px 999px 0 0)" }} animate={{ clipPath: "inset(0% 0% 0% 0% round 48px 48px 0 0)" }} transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 }} className="relative mx-auto mt-14 aspect-[16/8] max-w-[1400px] overflow-hidden">
          <motion.div style={{ y }} className="absolute inset-[-10%_0]">
            <Image src={unsplash(post.cover)} alt={post.cover.alt} fill priority sizes="100vw" className="grade object-cover" />
          </motion.div>
        </motion.div>
      </header>

      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <p className="eyebrow text-muted">En este artículo</p>
            <ul className="mt-4 space-y-2 border-l border-ink/10 text-sm">
              {toc.map((h) => (
                <li key={h.id}><a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-ink-soft transition-colors hover:border-rose hover:text-ink">{h.text}</a></li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="prose-cara max-w-[720px]">
          {post.body.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
          <p className="mt-10 border-t border-ink/10 pt-6 text-sm text-muted">Este artículo es orientativo y no reemplaza la consulta con un profesional de la salud.</p>
        </div>
      </div>

      {post.service ? (
        <section aria-label="Reserva" className="mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-plum p-8 text-paper md:p-14">
            <div className="mesh opacity-50" aria-hidden><i style={{ width: 420, height: 420, right: -120, top: -160, color: "#8a6a4f" }} /></div>
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-peach">Vívelo en el santuario</p>
                <p className="mt-3 max-w-xl font-display text-4xl leading-tight font-light md:text-5xl">¿Te dieron ganas? Te esperamos en cabina.</p>
              </div>
              <TLink href={serviceId ? `/reservar?servicio=${serviceId}` : "/reservar"} className="btn-shine inline-flex h-13 items-center rounded-full bg-paper px-8 text-sm font-semibold text-ink transition-colors hover:bg-peach">{post.service.label}</TLink>
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="relacionados" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <h2 id="relacionados" className="mb-12 font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.95] font-light">Sigue <em className="text-gradient pr-2">leyendo</em></h2>
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {related.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </section>
    </article>
  );
}
