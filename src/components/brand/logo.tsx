import { cn } from "@/lib/utils";

/**
 * Identidad CARA: logotipo en palo seco geométrico, en mayúsculas y muy espaciado.
 * El isotipo es la "C" del logo: un círculo abierto a la derecha.
 */
export const LOGO_VIEWBOX = "0 0 100 100";
export const LOGO_C_PATH = "M66.5 31.5A26 26 0 1 0 66.5 68.5";

export function LogoMark({ className, title = "Cara" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={cn("h-8 w-8", className)} role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} fill="none" stroke="currentColor">
      <path d={LOGO_C_PATH} strokeWidth={7} />
    </svg>
  );
}

/** Logotipo: C A R A, como el original. */
export function Wordmark({ className, withMark = false }: { className?: string; withMark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {withMark ? <LogoMark className="h-[1.3em] w-[1.3em]" title="" /> : null}
      <span className="wordmark text-[1.25em]">Cara</span>
    </span>
  );
}

/** Destello de cuatro puntas, usado como separador. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="currentColor" aria-hidden>
      <path d="M12 0C12.8 6.6 17.4 11.2 24 12C17.4 12.8 12.8 17.4 12 24C11.2 17.4 6.6 12.8 0 12C6.6 11.2 11.2 6.6 12 0Z" />
    </svg>
  );
}
