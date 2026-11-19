import type { Metadata } from "next";
import { StorePage } from "@/components/site/store-page";
import { config } from "@/lib/config";
import { getLandingData } from "@/lib/landing";

export const metadata: Metadata = { title: "Gift cards y ritual en casa", description: "Gift cards de headspa, faciales y rituales. Productos profesionales para cuidar tu cuero cabelludo y tu piel en casa." };

export default async function Page() {
  const { products } = await getLandingData();
  return <StorePage products={products} whatsapp={config.WHATSAPP_PUBLIC_NUMBER} demo={config.demoMode} />;
}
