import { Footer } from "@/components/site/footer";
import { INSTAGRAM_URL, WhatsAppIcon, waLink } from "@/components/site/icons";
import { ScrollProgress } from "@/components/site/motion-kit";
import { Nav } from "@/components/site/nav";
import { PageTransitionProvider } from "@/components/site/transition";
import { config } from "@/lib/config";
import { getLandingData } from "@/lib/landing";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const data = await getLandingData();
  const wa = waLink(config.WHATSAPP_PUBLIC_NUMBER);
  return (
    <>
      <PageTransitionProvider>
        <ScrollProgress />
        <Nav whatsappHref={wa} instagramHref={INSTAGRAM_URL} />
        <main id="contenido">{children}</main>
        <Footer branches={data.branches} year={data.year} demo={config.demoMode} whatsapp={config.WHATSAPP_PUBLIC_NUMBER} />
        {/* Acceso directo a WhatsApp, siempre a mano */}
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Reservar por WhatsApp"
          data-cursor="Chat"
          className="group fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-[0_18px_40px_-16px_rgba(23,20,18,.7)] transition-transform duration-500 hover:scale-110 md:right-6 md:bottom-6"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2.6s]" aria-hidden />
          <WhatsAppIcon className="relative h-6 w-6" />
        </a>
      </PageTransitionProvider>
    </>
  );
}
