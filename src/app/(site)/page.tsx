import { Hero } from "@/components/site/hero";
import { ChatDemo, Faq, FinalCta, GiftTeaser, Gallery, HeadspaRitual, JournalTeaser, Journey, Manifesto, Marquee, Pillars, RitualFinder, Rituals, ServiceIndex, Visit } from "@/components/site/home-sections";
import { INSTAGRAM_URL, waLink } from "@/components/site/icons";
import { Preloader } from "@/components/site/preloader";
import { POSTS } from "@/content/blog";
import { FAQ } from "@/content/faq";
import { config } from "@/lib/config";
import { getLandingData } from "@/lib/landing";

export default async function Home() {
  const data = await getLandingData();
  const home = data.branches[0];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "DaySpa",
      name: "Cara Sanctuary",
      description: "Santuario de salud y belleza en Lima: headspa, faciales y tratamientos corporales.",
      url: config.APP_URL,
      sameAs: [INSTAGRAM_URL],
      telephone: home?.phone,
      address: home ? { "@type": "PostalAddress", streetAddress: home.address, addressLocality: home.district, addressRegion: home.city, addressCountry: "PE" } : undefined,
      geo: home ? { "@type": "GeoCoordinates", latitude: home.lat, longitude: home.lng } : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  const count = (c: string) => data.services.filter((s) => s.category === c).length;
  // Los favoritos: primero los rituales y el headspa destacado, luego el resto de destacados.
  const featured = [...data.services.filter((s) => s.featured)].sort((a, b) => Number(b.category === "RITUAL" || b.category === "HEADSPA") - Number(a.category === "RITUAL" || a.category === "HEADSPA")).slice(0, 7);

  return (
    <>
      <Preloader />
      <Hero />
      <Marquee />
      <Pillars counts={{ HEADSPA: count("HEADSPA"), FACIAL: count("FACIAL"), BODY: count("BODY") }} />
      <Manifesto services={data.services.length} />
      <ServiceIndex services={data.services} />
      <HeadspaRitual />
      <Rituals services={featured} />
      <RitualFinder services={data.services} />
      <Gallery />
      <GiftTeaser />
      <ChatDemo whatsappHref={waLink(config.WHATSAPP_PUBLIC_NUMBER)} />
      <Journey />
      <JournalTeaser posts={POSTS} />
      <Faq />
      <Visit branch={home} />
      <FinalCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
