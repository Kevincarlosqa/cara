/**
 * Al arrancar el servidor se precarga la base (en modo demo, la foto de PGlite)
 * en segundo plano, para que la primera visita al panel no pague esa espera.
 * No se espera la promesa: el servidor queda listo de inmediato.
 */
export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  void import("./lib/prisma")
    .then(({ db }) => db())
    .catch((err) => console.warn("[demo] no se pudo precargar la base", err));
}
