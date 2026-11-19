import type { Metadata } from "next";
import { HeadspaBenefits, HeadspaForWho, HeadspaHero, HeadspaMenu } from "@/components/site/headspa-page";
import { Faq, FinalCta, HeadspaRitual, Marquee } from "@/components/site/home-sections";
import { getLandingData } from "@/lib/landing";

export const metadata: Metadata = {
  title: "Headspa en Lima",
  description: "Headspa en Cara Sanctuary: ritual japonés para el cuero cabelludo con diagnóstico capilar, doble limpieza, masaje craneal y cascada de agua tibia.",
};

export default async function HeadspaPage() {
  const { services } = await getLandingData();
  const headspa = services.filter((s) => s.category === "HEADSPA" || (s.category === "COUPLE" && s.slug.includes("headspa")));
  const signature = services.find((s) => s.slug === "headspa-signature-cara");
  return (
    <>
      <HeadspaHero signature={signature} />
      <Marquee />
      <HeadspaBenefits />
      <HeadspaRitual cta={false} />
      <HeadspaMenu services={headspa} />
      <HeadspaForWho />
      <Faq />
      <FinalCta />
    </>
  );
}
