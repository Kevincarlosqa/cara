import type { Metadata } from "next";
import { CatalogPage } from "@/components/site/catalog-page";
import { CARA_CATEGORIES } from "@/lib/labels";
import { getLandingData } from "@/lib/landing";

export const metadata: Metadata = { title: "Carta de servicios", description: "Headspa, faciales, corporales, masajes y rituales en Cara Sanctuary, Lima. Duraciones y precios a la vista." };

export default async function ServiciosPage() {
  const { services } = await getLandingData();
  return (
    <CatalogPage
      eyebrow="Carta · Cara Sanctuary"
      title="El mundo"
      accent="puede esperar"
      intro="Headspa, faciales y corporales con la misma calma de siempre. Elige por categoría o busca tu tratamiento; las duraciones y los precios están a la vista."
      services={services.filter((s) => CARA_CATEGORIES.includes(s.category))}
      categories={CARA_CATEGORIES}
      heroClass="bg-linear-to-b from-sand/60 to-ivory"
    />
  );
}
