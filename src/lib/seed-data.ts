/**
 * Datos de la demo de Cara Sanctuary. Se usa en modo demo (PGlite) y con `npm run db:seed:demo`.
 *
 * Son REALES (Instagram @cara_sanctuary, nov. 2026): el nombre, el rubro (salud y belleza), los tres pilares
 * (headspa, faciales y corporales) y el WhatsApp de reservas.
 * Son de REFERENCIA y deben confirmarse con la marca: dirección, horarios, carta, duraciones y precios.
 * Son FICTICIOS: especialistas, clientes, reservas, ventas, reseñas, stock y costos.
 * No importa "server-only" para poder ejecutarse desde tsx.
 */
import bcrypt from "bcryptjs";
import type { BookingChannel, BookingStatus, DocType, PaymentMethod, PrismaClient, ServiceCategory, StylistLevel } from "@/generated/prisma/client";
import { addDaysKey, localDateKey, wallToUtc, weekdayOf } from "./time";

const TZ = "America/Lima";
const DAY = 86_400_000;
const HISTORY_DAYS = 120;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;
const pick = <T,>(r: Rand, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]!;
const h = (hh: number, mm = 0) => hh * 60 + mm;

// ─── Sede. Dirección y horario por confirmar con la marca. ──────────────────
type Hours = Partial<Record<number, [number, number]>>;
const week = (start: number, end: number): Hours => Object.fromEntries([1, 2, 3, 4, 5, 6].map((d) => [d, [start, end]]));

export const BRANCHES = [
  { slug: "sanctuary", name: "Cara Sanctuary", kind: "spa", district: "Lima", address: "Dirección por confirmar", reference: "Te enviamos la ubicación exacta al confirmar tu cita", lat: -12.1211, lng: -77.0297, phone: "+51947009055", stations: 5, goal: 72_000, hours: { ...week(h(9), h(20)), 0: [h(10), h(16)] } as Hours },
] as const;

// ─── Carta de referencia (por confirmar con la marca) ───────────────────────
interface SeedService {
  slug: string;
  name: string;
  category: ServiceCategory;
  description: string;
  durationMin: number;
  price: number;
  featured?: boolean;
  variants?: Array<[string, number, number]>;
  retouchAfterDays?: number;
  requiresEvaluation?: boolean;
}

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
type Row = [name: string, min: number, price: number, description?: string, extra?: Partial<SeedService>];
const group = (category: ServiceCategory, fallback: string, rows: Row[]): SeedService[] =>
  rows.map(([name, durationMin, price, description, extra]) => ({ slug: slug(name), name, category, durationMin, price, description: description ?? fallback, ...extra }));

export const SERVICES: SeedService[] = [
  ...group("HEADSPA", "Ritual japonés para el cuero cabelludo: limpieza, masaje y agua que relajan desde la raíz.", [
    ["Headspa Signature Cara", 90, 280, "Nuestro ritual de autor: diagnóstico con cámara capilar, doble limpieza, exfoliación, masaje craneal, cascada de agua tibia, mascarilla con vapor y secado.", { featured: true, variants: [["90 minutos", 90, 280], ["120 minutos", 120, 360]] }],
    ["Headspa Express", 45, 160, "La versión esencial: limpieza profunda, masaje craneal y cascada de agua. Ideal para tu hora de almuerzo."],
    ["Headspa Detox", 75, 240, "Exfoliación del cuero cabelludo con arcillas y carbón para retirar grasa, residuos y producto acumulado."],
    ["Headspa Hidratación Profunda", 75, 250, "Para cueros cabelludos secos o con descamación: aceites tibios, mascarilla nutritiva y vapor."],
    ["Headspa Anticaída", 75, 260, "Activos fortalecedores, masaje estimulante y alta frecuencia para acompañar la caída estacional.", { retouchAfterDays: 21 }],
    ["Headspa Zen con Aromaterapia", 90, 290, "Headspa con aceites esenciales, cuencos y masaje de cuello y hombros. Pura calma.", { featured: true }],
  ]),
  ...group("FACIAL", "Protocolo facial según lo que tu piel necesita hoy.", [
    ["Facial Cara Glow", 60, 220, "Limpieza, exfoliación enzimática, masaje y mascarilla: la piel luminosa de los días buenos.", { featured: true }],
    ["Limpieza Facial Profunda", 75, 200, "Extracción cuidadosa, peeling suave y mascarilla calmante a medida."],
    ["Facial Hidrodermoabrasión", 60, 260, "Limpia, exfolia e hidrata con agua a presión y sueros. Sin tiempo de recuperación."],
    ["Facial Antiage Lifting", 75, 300, "Radiofrecuencia y masaje esculpidor para una piel más firme.", { featured: true }],
    ["Facial Piel Sensible", 60, 210, "Calma rojeces y fortalece la barrera con activos suaves."],
    ["Facial Antiacné", 70, 220, "Controla el brillo, limpia los poros y desinflama sin agredir."],
    ["Dermaplaning", 45, 180, "Retira células muertas y vello fino: el maquillaje se funde con la piel."],
    ["Facial Gua Sha y Drenaje", 50, 190, "Masaje con piedra de cuarzo que desinflama, define y relaja la mandíbula."],
    ["Peeling Químico", 45, 230, "Renovación controlada para manchas y textura. Requiere evaluación previa.", { requiresEvaluation: true, retouchAfterDays: 28 }],
  ]),
  ...group("BODY", "Tratamiento corporal para renovar, nutrir y modelar.", [
    ["Drenaje Linfático Corporal", 60, 200, "Maniobras suaves y rítmicas que desinflaman y alivian la retención de líquidos.", { featured: true }],
    ["Masaje Reductor", 60, 190, "Masaje enérgico con activos termogénicos para modelar la figura."],
    ["Maderoterapia", 60, 180, "Instrumentos de madera que trabajan la celulitis y tonifican."],
    ["Exfoliación Corporal Seda", 50, 170, "Sales y aceites que dejan la piel suave como seda."],
    ["Envoltura Detox", 60, 210, "Arcillas y algas que purifican y aligeran el cuerpo."],
    ["Tratamiento Reafirmante", 60, 220, "Radiofrecuencia corporal y activos tensores para una piel más firme."],
  ]),
  ...group("MASSAGE", "Masaje a tu medida, con la presión y el ritmo que prefieras.", [
    ["Masaje Relajante", 60, 180, "Movimientos largos y envolventes para bajar las revoluciones.", { variants: [["60 minutos", 60, 180], ["90 minutos", 90, 250]] }],
    ["Masaje Descontracturante", 60, 200, "Presión profunda para soltar contracturas de espalda, cuello y hombros.", { variants: [["60 minutos", 60, 200], ["90 minutos", 90, 270]] }],
    ["Masaje con Piedras Calientes", 75, 230, "Calor de piedras volcánicas y aceites esenciales."],
    ["Masaje Prenatal", 60, 200, "Cuidado especial durante el embarazo, a partir del segundo trimestre.", { requiresEvaluation: true }],
  ]),
  ...group("RITUAL", "Un recorrido completo para desconectar de principio a fin.", [
    ["Ritual Head & Face", 120, 420, "Headspa Signature y Facial Cara Glow en una sola visita.", { featured: true }],
    ["Ritual Cara Sanctuary", 180, 590, "La experiencia completa: headspa, facial y masaje corporal. Tres horas solo para ti.", { featured: true }],
    ["Ritual Novia Radiante", 150, 520, "Headspa, facial de luminosidad y drenaje, pensado para la semana de tu boda."],
  ]),
  ...group("COUPLE", "Una experiencia compartida, en la misma cabina y al mismo ritmo.", [
    ["Headspa en Pareja", 90, 520, "Dos camillas, dos terapeutas y el mismo ritual Signature."],
    ["Ritual Madre e Hija", 120, 640, "Headspa Express y Facial Cara Glow para compartir."],
  ]),
];

const SPA_CATS: ServiceCategory[] = ["HEADSPA", "FACIAL", "BODY", "MASSAGE", "RITUAL", "COUPLE", "HYDRO"];
const SALON_CATS: ServiceCategory[] = [];
const bySlugs = (...cats: ServiceCategory[]) => SERVICES.filter((s) => cats.includes(s.category)).map((s) => s.slug);
const BUFFER: Partial<Record<ServiceCategory, number>> = { HEADSPA: 15, RITUAL: 20, COUPLE: 20, MASSAGE: 15, BODY: 15, FACIAL: 15, HYDRO: 15 };

// ─── Equipo (ficticio) ──────────────────────────────────────────────────────
interface SeedStylist {
  slug: string;
  name: string;
  title: string;
  level: StylistLevel;
  bio: string;
  skills: string[];
  shifts: Array<[string, number[], number, number]>;
}

const ALL_WEEK = [1, 2, 3, 4, 5, 6];
const NO_MON = [2, 3, 4, 5, 6];
const NO_WED = [1, 2, 4, 5, 6];
const MAKE = (slugValue: string, name: string, title: string, level: StylistLevel, bio: string, skills: string[], shifts: SeedStylist["shifts"]): SeedStylist => ({ slug: slugValue, name, title, level, bio, skills, shifts });
const HEAD = [...bySlugs("HEADSPA"), ...bySlugs("COUPLE")];
const FACE = bySlugs("FACIAL");
const BODY = [...bySlugs("BODY"), ...bySlugs("MASSAGE")];
const RITUALS = bySlugs("RITUAL");
const S = "sanctuary";

export const STYLISTS: SeedStylist[] = [
  MAKE("alessandra-rios", "Alessandra Ríos", "Headspa master", "MASTER", "Formada en técnicas japonesas de cuidado del cuero cabelludo.", [...HEAD, ...RITUALS], [[S, NO_MON, h(9), h(14)], [S, NO_MON, h(15), h(20)]]),
  MAKE("camila-ueda", "Camila Ueda", "Terapeuta de headspa", "SENIOR", "Masaje craneal profundo y aromaterapia.", [...HEAD, "masaje-relajante"], [[S, ALL_WEEK, h(9), h(14)], [S, ALL_WEEK, h(15), h(20)], [S, [0], h(10), h(16)]]),
  MAKE("daniela-paredes", "Daniela Paredes", "Cosmiatra master", "MASTER", "Protocolos faciales, antiage y pieles sensibles.", [...FACE, ...RITUALS], [[S, NO_WED, h(9), h(14)], [S, NO_WED, h(15), h(20)]]),
  MAKE("renata-salazar", "Renata Salazar", "Cosmiatra", "SENIOR", "Limpiezas profundas, dermaplaning y gua sha.", [...FACE, "headspa-express", "ritual-madre-e-hija"], [[S, ALL_WEEK, h(9), h(14)], [S, ALL_WEEK, h(15), h(20)]]),
  MAKE("fiorella-vega", "Fiorella Vega", "Terapeuta corporal", "SENIOR", "Drenaje linfático y maderoterapia.", [...BODY, "ritual-cara-sanctuary"], [[S, NO_MON, h(9), h(14)], [S, NO_MON, h(15), h(20)], [S, [0], h(10), h(16)]]),
  MAKE("luana-castro", "Luana Castro", "Terapeuta", "JUNIOR", "Masajes relajantes y headspa express.", [...BODY, "headspa-express", "headspa-en-pareja"], [[S, NO_WED, h(9), h(14)], [S, NO_WED, h(15), h(20)]]),
];

const COMMISSION: Record<StylistLevel, number> = { JUNIOR: 30, SENIOR: 40, MASTER: 50 };

// ─── Tienda: productos de cuidado en casa; precios, costos y stock de ejemplo ──
const PRODUCTS: Array<[sku: string, name: string, brand: string, category: string, price: number, cost: number, featured?: boolean]> = [
  ["DAV-DTX-250", "NaturalTech Detoxifying Scrub Shampoo 250 ml", "Davines", "Cuero cabelludo", 145, 80, true],
  ["DAV-REN-100", "NaturalTech Renewing Superactive 100 ml", "Davines", "Cuero cabelludo", 185, 102],
  ["DAV-ENE-100", "NaturalTech Energizing Superactive 100 ml", "Davines", "Cuero cabelludo", 189, 104],
  ["KER-SPE-250", "Specifique Bain Divalent 250 ml", "Kérastase", "Cuero cabelludo", 165, 92],
  ["KER-GEN-90", "Genesis Sérum Anti-Chute 90 ml", "Kérastase", "Cuero cabelludo", 260, 145, true],
  ["MED-CTE-30", "C-Tetra Vitamin C Serum 30 ml", "Medik8", "Sérums", 210, 118, true],
  ["MED-CRY-30", "Crystal Retinal 3 30 ml", "Medik8", "Sérums", 245, 136],
  ["LRP-CIC-40", "Cicaplast Baume B5+ 40 ml", "La Roche-Posay", "Hidratantes", 79, 42],
  ["LRP-ANT-50", "Anthelios UVmune 400 Fluido 50 ml", "La Roche-Posay", "Protector solar", 99, 54, true],
  ["COS-SNL-100", "Advanced Snail 96 Mucin Essence 100 ml", "COSRX", "Esencias", 89, 46],
  ["COS-BHA-100", "BHA Blackhead Power Liquid 100 ml", "COSRX", "Exfoliantes", 95, 49],
  ["DER-PRE-150", "PreCleanse Oil 150 ml", "Dermalogica", "Limpiadores", 185, 101],
  ["DER-DMF-74", "Daily Microfoliant 74 g", "Dermalogica", "Exfoliantes", 225, 124],
  ["CAR-GUA-01", "Gua sha de cuarzo rosa", "Cara Ritual", "Herramientas", 95, 32, true],
  ["CAR-PEI-01", "Peine de madera para masaje craneal", "Cara Ritual", "Herramientas", 55, 18],
  ["CAR-ACE-50", "Aceite de pre-lavado Camelia 50 ml", "Cara Ritual", "Cuero cabelludo", 85, 30],
];

const FIRST = ["María", "Lucía", "Valentina", "Camila", "Daniela", "Andrea", "Sofía", "Fernanda", "Alejandra", "Gabriela", "Nicole", "Paola", "Carolina", "Mariana", "Claudia", "Rosa", "Patricia", "Jimena", "Isabella", "Natalia", "Ana", "Milagros", "Romina", "Kiara", "Brenda", "Estefanía", "Pamela", "Lorena", "Diana", "Vanessa", "Javier", "Luis", "Carlos", "Rodrigo", "Sebastián", "Gonzalo"];
const LAST = ["García", "Rodríguez", "Flores", "Sánchez", "Ramírez", "Torres", "Díaz", "Vargas", "Castillo", "Mendoza", "Rojas", "Chávez", "Gutiérrez", "Salazar", "Paredes", "Benavides", "Delgado", "Valdivia", "Herrera", "Montoya", "Aguilar", "Bustamante", "Ferreyra", "Salas", "Miró Quesada", "Prado", "Olaechea", "Tudela"];

const REVIEW_GOOD = ["Salí flotando. La atención fue impecable de principio a fin.", "El headspa Signature es otro nivel, me quedé dormida en la cascada de agua.", "Por fin alguien me explicó qué le pasa a mi cuero cabelludo. Lo noto distinto.", "Recordatorio por WhatsApp, puntualidad y un trato cálido. Así da gusto.", "El ambiente es precioso, silencioso y huele increíble.", "Volvería solo por el facial. Mi piel brilla.", "El drenaje linfático me deshinchó por completo.", "Reservé en dos minutos y todo estuvo listo al llegar."];
const REVIEW_MID = ["Buen servicio, pero esperé 15 minutos más de la hora de mi cita.", "Me gustó, aunque esperaba que el masaje craneal durara un poco más.", "Todo correcto; el estacionamiento fue complicado."];
const REVIEW_BAD = ["Mi cita se retrasó casi 40 minutos y nadie me avisó.", "Esperaba más por el precio. No me explicaron bien el tratamiento."];

function docNumber(type: DocType, seq: number) {
  const prefix = type === "FACTURA" ? "F001" : type === "BOLETA" ? "B001" : "NV01";
  return `${prefix}-${String(seq).padStart(6, "0")}`;
}

function slotsUsed(list: Array<[number, number]>, s: number, e: number) {
  return list.some(([a, b]) => s < b && a < e);
}

async function inChunks<T>(rows: T[], fn: (chunk: T[]) => Promise<unknown>, size = 1000) {
  for (let i = 0; i < rows.length; i += size) await fn(rows.slice(i, i + size));
}

export async function seedDatabase(prisma: PrismaClient, opts: { now?: Date; password?: string } = {}) {
  const r = rng(20261119);
  const now = opts.now ?? new Date();
  const todayKey = localDateKey(now, TZ);

  // Sedes, horarios y cierres
  const branchIds: Record<string, string> = {};
  for (const [i, b] of BRANCHES.entries()) {
    const created = await prisma.branch.create({
      data: {
        id: `br_${b.slug}`,
        slug: b.slug, name: b.name, district: b.district, city: "Lima", address: b.address, reference: b.reference,
        lat: b.lat, lng: b.lng, phone: b.phone, stations: b.stations, timezone: TZ, sortOrder: i,
        monthlyGoalCents: b.goal * 100,
        googleReviewUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Cara Sanctuary ${b.district}`)}`,
        hours: { create: Object.entries(b.hours).map(([weekday, range]) => ({ weekday: Number(weekday), startMin: range![0], endMin: range![1] })) },
      },
    });
    branchIds[b.slug] = created.id;
  }
  const year = Number(todayKey.slice(0, 4));
  for (const id of Object.values(branchIds)) {
    await prisma.branchClosure.create({
      data: { branchId: id, startsAt: wallToUtc(`${year}-12-25`, 0, TZ), endsAt: wallToUtc(`${year}-12-26`, 0, TZ), reason: "Feriado: Navidad" },
    });
  }

  // Servicios + variantes
  const serviceIds: Record<string, string> = {};
  const serviceMeta: Record<string, SeedService> = {};
  for (const [i, s] of SERVICES.entries()) {
    const created = await prisma.service.create({
      data: {
        id: `svc_${s.slug}`,
        slug: s.slug, name: s.name, category: s.category, description: s.description, durationMin: s.durationMin,
        priceCents: s.price * 100, priceFrom: true, bufferMin: BUFFER[s.category] ?? 5,
        retouchAfterDays: s.retouchAfterDays ?? null, requiresEvaluation: s.requiresEvaluation ?? false,
        featured: s.featured ?? false, sortOrder: i,
        variants: s.variants ? { create: s.variants.map(([name, durationMin, price], j) => ({ name, durationMin, priceCents: price * 100, sortOrder: j })) } : undefined,
      },
    });
    serviceIds[s.slug] = created.id;
    serviceMeta[s.slug] = s;
  }
  for (const b of BRANCHES) {
    const cats = b.kind === "spa" ? SPA_CATS : SALON_CATS;
    await prisma.branchService.createMany({
      data: SERVICES.filter((s) => cats.includes(s.category)).map((s) => ({ branchId: branchIds[b.slug]!, serviceId: serviceIds[s.slug]! })),
    });
  }

  // Equipo
  const stylistIds: Record<string, string> = {};
  for (const st of STYLISTS) {
    const created = await prisma.stylist.create({
      data: {
        id: `sty_${st.slug}`,
        slug: st.slug, name: st.name, title: st.title, level: st.level, bio: st.bio,
        commissionPct: COMMISSION[st.level], retailPct: 10, monthlyGoalCents: (st.level === "MASTER" ? 26_000 : st.level === "SENIOR" ? 19_000 : 12_000) * 100,
        services: { create: [...new Set(st.skills)].map((s) => ({ serviceId: serviceIds[s]! })) },
        schedules: { create: st.shifts.flatMap(([b, days, startMin, endMin]) => days.map((weekday) => ({ branchId: branchIds[b]!, weekday, startMin, endMin }))) },
      },
    });
    stylistIds[st.slug] = created.id;
  }
  await prisma.timeOff.createMany({
    data: [
      { stylistId: stylistIds["renata-salazar"]!, kind: "VACATION", startsAt: wallToUtc(addDaysKey(todayKey, 5), 0, TZ), endsAt: wallToUtc(addDaysKey(todayKey, 8), 0, TZ), reason: "Vacaciones" },
      { stylistId: stylistIds["camila-ueda"]!, kind: "TRAINING", startsAt: wallToUtc(addDaysKey(todayKey, 3), h(9), TZ), endsAt: wallToUtc(addDaysKey(todayKey, 3), h(13), TZ), reason: "Capacitación en tricología" },
    ],
  });

  // Clientes (ficticios). El número es un marcador: los envíos reales están bloqueados en modo demo.
  const customers: Array<{ id: string; phone: string; name: string }> = [];
  const usedPhones = new Set<string>();
  for (let i = 0; i < 800; i++) {
    let phone: string;
    do phone = `+519${String(Math.floor(r() * 1e8)).padStart(8, "0")}`;
    while (usedPhones.has(phone));
    usedPhones.add(phone);
    customers.push({ id: `cus_${i.toString(36).padStart(4, "0")}`, phone, name: `${pick(r, FIRST)} ${pick(r, LAST)}` });
  }
  customers[0] = { ...customers[0]!, phone: "+51999111222", name: "Lucía Benavides" };
  const birthdayIn = (offset: number) => {
    const d = new Date(`${addDaysKey(todayKey, offset)}T12:00:00Z`);
    d.setUTCFullYear(1985 + Math.floor(r() * 20));
    return d;
  };
  await prisma.customer.createMany({
    data: customers.map((c, i) => ({
      id: c.id, phone: c.phone, name: c.name,
      email: i % 3 === 0 ? `${c.name.split(" ")[0]!.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}${i}@correo.demo` : null,
      marketingOptIn: r() < 0.68,
      birthday: i % 60 === 0 ? birthdayIn(Math.floor(r() * 7)) : r() < 0.55 ? birthdayIn(Math.floor(r() * 365)) : null,
      tags: i === 0 ? ["VIP"] : r() < 0.07 ? ["VIP"] : r() < 0.05 ? ["Piel sensible"] : [],
      allergies: r() < 0.05 ? pick(r, ["Látex", "Ácido salicílico", "Frutos secos (aceites)", "Lavanda"]) : null,
      skinType: r() < 0.5 ? pick(r, ["Seca", "Mixta", "Grasa", "Sensible", "Normal"]) : null,
      hairType: r() < 0.5 ? pick(r, ["Cuero cabelludo graso", "Cuero cabelludo seco", "Caída", "Teñido", "Fino"]) : null,
      customFields: r() < 0.4 ? { presion: pick(r, ["Suave", "Media", "Fuerte"]), aroma: pick(r, ["Lavanda", "Eucalipto", "Cítrico", "Sin aroma"]), bebida: pick(r, ["Té", "Espumante", "Agua con gas", "Café"]) } : undefined,
      createdAt: new Date(now.getTime() - Math.floor(r() * 500) * DAY),
    })),
  });

  // Reservas: 180 días atrás y 14 adelante, sin solapes por especialista ni por puesto.
  const busy = new Map<string, Array<[number, number]>>();
  const stationLoad = new Map<string, Array<[number, number]>>();
  const bookings: Array<{ id: string; code: string; customerId: string; branchId: string; status: BookingStatus; channel: BookingChannel; startsAt: Date; endsAt: Date; totalCents: number; createdAt: Date; confirmedAt: Date | null; completedAt: Date | null; cancelledAt: Date | null; cancelReason: string | null; reminder24hSentAt: Date | null; reviewRequestedAt: Date | null; depositCents: number; depositPaidAt: Date | null }> = [];
  const items: Array<{ bookingId: string; serviceId: string; variantId: null; stylistId: string; position: number; startsAt: Date; endsAt: Date; busyUntil: Date; durationMin: number; priceCents: number }> = [];
  const usedCodes = new Set<string>();
  const noShows = new Map<string, number>();
  const regulars = customers.slice(0, 280);
  const flakyList = customers.filter((_, i) => i % 11 === 7);
  const flaky = new Set(flakyList.map((c) => c.id));
  const lastSeen = new Map<string, number>();
  let n = 0;

  for (let d = -HISTORY_DAYS; d <= 14; d++) {
    const key = addDaysKey(todayKey, d);
    const wd = weekdayOf(key);
    // Temporada: crecimiento suave y fin de semana más lleno. Sirve para que las gráficas cuenten algo.
    const growth = (d + HISTORY_DAYS) / HISTORY_DAYS;
    const weekend = wd === 6 ? 0.1 : wd === 5 ? 0.05 : wd === 1 ? -0.08 : 0;
    const baseFill = d > 0 ? 0.5 - d * 0.025 : 0.34 + growth * 0.14 + weekend;
    for (const st of STYLISTS) {
      for (const [branchSlug, days, startMin, endMin] of st.shifts) {
        if (!days.includes(wd)) continue;
        const branch = BRANCHES.find((b) => b.slug === branchSlug)!;
        let cursor = startMin + (r() < 0.5 ? 0 : 30);
        while (cursor < endMin - 20) {
          const usable = st.skills.filter((s) => {
            const svc = serviceMeta[s];
            return svc && (branch.kind === "spa" ? SPA_CATS : SALON_CATS).includes(svc.category);
          });
          if (!usable.length) break;
          let svcSlug = pick(r, usable);
          for (let t = 0; t < 4; t++) {
            const c = serviceMeta[svcSlug]!;
            if (c.featured || r() < Math.min(1, 170 / c.price)) break;
            svcSlug = pick(r, usable);
          }
          const svc = serviceMeta[svcSlug]!;
          const buffer = BUFFER[svc.category] ?? 5;
          // Variante más corta como precio base; algunos eligen la larga.
          const longVariant = svc.variants && r() < 0.35 ? svc.variants[svc.variants.length - 1]! : null;
          const dur = longVariant ? longVariant[1] : svc.durationMin;
          if (cursor + dur > endMin) {
            cursor += 15;
            continue;
          }
          if (r() > baseFill) {
            cursor += pick(r, [30, 45, 60]);
            continue;
          }
          const start = wallToUtc(key, cursor, TZ).getTime();
          const end = start + dur * 60_000;
          const until = end + buffer * 60_000;
          const sBusy = busy.get(st.slug) ?? [];
          const bLoad = stationLoad.get(branchSlug) ?? [];
          const concurrent = bLoad.filter(([a, b]) => start < b && a < until).length;
          if (slotsUsed(sBusy, start, until) || concurrent >= branch.stations) {
            cursor += 30;
            continue;
          }
          sBusy.push([start, until]);
          busy.set(st.slug, sBusy);
          bLoad.push([start, until]);
          stationLoad.set(branchSlug, bLoad);

          let customer = r() < 0.72 ? pick(r, regulars) : pick(r, customers);
          const isPast = end < now.getTime();
          const roll = r();
          // El no-show baja con el tiempo: antes de los recordatorios era ~6 %, ahora ~2 %.
          const noShowCut = 0.92 + 0.02 + 0.04 * (1 - growth);
          const status: BookingStatus = isPast
            ? roll < 0.87 ? "COMPLETED" : roll < 0.92 ? "CANCELLED" : roll < noShowCut ? "NO_SHOW" : "COMPLETED"
            : start < now.getTime() ? "IN_PROGRESS" : roll < 0.86 ? "CONFIRMED" : roll < 0.95 ? "PENDING" : "CANCELLED";
          const cr = r();
          // WhatsApp y web ganan peso con el tiempo: la adopción se ve en la analítica.
          const wa = 0.32 + growth * 0.26;
          const channel: BookingChannel = cr < wa ? "WHATSAPP" : cr < wa + 0.16 ? "WEB" : cr < wa + 0.32 ? "PHONE" : cr < wa + 0.4 ? "DASHBOARD" : "WALK_IN";
          const price = (longVariant ? longVariant[2] : svc.price) * 100;
          let code: string;
          do code = `CA-${Math.floor(r() * 36 ** 5).toString(36).toUpperCase().padStart(5, "2").replace(/[01OI]/g, "7")}`;
          while (usedCodes.has(code));
          usedCodes.add(code);
          const id = `bk_${(n++).toString(36).padStart(5, "0")}`;
          const createdAt = new Date(start - (1 + Math.floor(r() * 12)) * DAY);
          if (status === "NO_SHOW") {
            if (!flaky.has(customer.id)) customer = pick(r, flakyList);
            noShows.set(customer.id, (noShows.get(customer.id) ?? 0) + 1);
          }
          if (status === "COMPLETED") lastSeen.set(customer.id, Math.max(lastSeen.get(customer.id) ?? 0, start));
          const hasDeposit = price >= 40_000 && r() < 0.5;
          bookings.push({
            id, code, customerId: customer.id, branchId: branchIds[branchSlug]!, status, channel,
            startsAt: new Date(start), endsAt: new Date(end), totalCents: price, createdAt,
            confirmedAt: status === "PENDING" ? null : createdAt,
            completedAt: status === "COMPLETED" ? new Date(end) : null,
            cancelledAt: status === "CANCELLED" ? new Date(start - DAY) : null,
            cancelReason: status === "CANCELLED" ? pick(r, ["Viaje", "Se sintió mal", "Cambio de planes", "Trabajo"]) : null,
            reminder24hSentAt: isPast ? new Date(start - DAY) : null,
            reviewRequestedAt: status === "COMPLETED" && r() < 0.8 ? new Date(end + 2 * 3_600_000) : null,
            depositCents: hasDeposit ? Math.round(price * 0.3) : 0,
            depositPaidAt: hasDeposit ? createdAt : null,
          });
          items.push({
            bookingId: id, serviceId: serviceIds[svcSlug]!, variantId: null, stylistId: stylistIds[st.slug]!, position: 0,
            startsAt: new Date(start), endsAt: new Date(end), busyUntil: new Date(until), durationMin: dur, priceCents: price,
          });
          if (status === "CANCELLED") {
            sBusy.pop();
            bLoad.pop();
          }
          cursor += dur + buffer + (r() < 0.35 ? 15 : 0);
        }
      }
    }
  }
  await inChunks(bookings, (c) => prisma.booking.createMany({ data: c }));
  await inChunks(items, (c) => prisma.bookingItem.createMany({ data: c }));
  for (const [customerId, count] of noShows) await prisma.customer.update({ where: { id: customerId }, data: { noShowCount: count } });

  // Tienda y stock
  const productRows = PRODUCTS.map(([sku, name, brand, category, price, cost, featured]) => ({ id: `prd_${sku.toLowerCase()}`, sku, name, brand, category, priceCents: price * 100, costCents: cost * 100, featured: featured ?? false }));
  await prisma.product.createMany({ data: productRows });
  await prisma.productStock.createMany({
    data: BRANCHES.flatMap((b) =>
      productRows
        .map((p) => {
          const min = 3 + Math.floor(r() * 3);
          // Alrededor del 15 % por debajo del mínimo, para que la alerta tenga algo que mostrar.
          return { productId: p.id, branchId: branchIds[b.slug]!, minQty: min, qty: r() < 0.15 ? Math.floor(r() * min) : min + 2 + Math.floor(r() * 16) };
        }),
    ),
  });

  // Caja de hoy abierta en cada sede, con el movimiento típico del día.
  const sessionByBranch = new Map<string, string>();
  for (const b of BRANCHES) {
    const session = await prisma.cashSession.create({
      data: {
        id: `cash_${b.slug}`, branchId: branchIds[b.slug]!, openedByName: "Recepción", openingCents: 30_000,
        openedAt: wallToUtc(todayKey, h(8, 45), TZ),
        movements: { create: [{ kind: "OUT", amountCents: 4_500, reason: "Compra de insumos de limpieza", createdAt: wallToUtc(todayKey, h(10), TZ) }] },
      },
    });
    sessionByBranch.set(branchIds[b.slug]!, session.id);
  }

  // Ventas: cada reserva completada se cobró. Una parte suma producto (venta cruzada).
  const sales: Array<{ id: string; cashSessionId: string | null; docType: DocType; docNumber: string; branchId: string; customerId: string; bookingId: string; method: PaymentMethod; subtotalCents: number; discountCents: number; tipCents: number; totalCents: number; pointsEarned: number; createdAt: Date }> = [];
  const saleItems: Array<{ saleId: string; kind: "SERVICE" | "PRODUCT"; name: string; serviceId?: string; productId?: string; stylistId: string; qty: number; unitCents: number; totalCents: number; commissionCents: number }> = [];
  const pointsByCustomer = new Map<string, number>();
  const seq: Record<DocType, number> = { BOLETA: 0, FACTURA: 0, NOTA_VENTA: 0 };
  const stockMoves: Array<{ productId: string; branchId: string; delta: number; kind: "SALE"; createdAt: Date }> = [];
  const stylistById = new Map(STYLISTS.map((s) => [stylistIds[s.slug]!, s]));
  const serviceNameById = new Map(SERVICES.map((s) => [serviceIds[s.slug]!, s.name]));
  bookings.forEach((b, idx) => {
    if (b.status !== "COMPLETED") return;
    const it = items[idx]!;
    const st = stylistById.get(it.stylistId)!;
    const docRoll = r();
    const docType: DocType = docRoll < 0.84 ? "BOLETA" : docRoll < 0.96 ? "FACTURA" : "NOTA_VENTA";
    seq[docType]++;
    const saleId = `sal_${idx.toString(36)}`;
    const mRoll = r();
    const method: PaymentMethod = mRoll < 0.42 ? "CARD" : mRoll < 0.72 ? "YAPE" : mRoll < 0.8 ? "PLIN" : mRoll < 0.95 ? "CASH" : "TRANSFER";
    const discount = r() < 0.08 ? Math.round(b.totalCents * 0.1) : 0;
    const tip = r() < 0.22 ? pick(r, [500, 1000, 2000, 3000]) : 0;
    let subtotal = b.totalCents;
    saleItems.push({ saleId, kind: "SERVICE", name: serviceNameById.get(it.serviceId) ?? "Servicio", serviceId: it.serviceId, stylistId: it.stylistId, qty: 1, unitCents: it.priceCents, totalCents: it.priceCents, commissionCents: Math.round(((it.priceCents - discount) * COMMISSION[st.level]) / 100) });
    // La venta cruzada crece con el tiempo (11 % → 22 %).
    const age = (now.getTime() - b.startsAt.getTime()) / (HISTORY_DAYS * DAY);
    if (r() < 0.22 - 0.11 * age) {
      const p = pick(r, productRows);
      subtotal += p.priceCents;
      saleItems.push({ saleId, kind: "PRODUCT", name: `${p.brand} ${p.name}`, productId: p.id, stylistId: it.stylistId, qty: 1, unitCents: p.priceCents, totalCents: p.priceCents, commissionCents: Math.round(p.priceCents * 0.1) });
      stockMoves.push({ productId: p.id, branchId: b.branchId, delta: -1, kind: "SALE", createdAt: b.endsAt });
    }
    const total = subtotal - discount + tip;
    const points = Math.floor((subtotal - discount) / 100);
    pointsByCustomer.set(b.customerId, (pointsByCustomer.get(b.customerId) ?? 0) + points);
    sales.push({ id: saleId, cashSessionId: localDateKey(b.endsAt, TZ) === todayKey ? (sessionByBranch.get(b.branchId) ?? null) : null, docType, docNumber: docNumber(docType, seq[docType]), branchId: b.branchId, customerId: b.customerId, bookingId: b.id, method, subtotalCents: subtotal, discountCents: discount, tipCents: tip, totalCents: total, pointsEarned: points, createdAt: b.endsAt });
  });
  await inChunks(sales, (c) => prisma.sale.createMany({ data: c }));
  await inChunks(saleItems, (c) => prisma.saleItem.createMany({ data: c }));
  await inChunks(stockMoves, (c) => prisma.stockMovement.createMany({ data: c }));
  await inChunks([...pointsByCustomer.entries()], async (c) => {
    await prisma.loyaltyEntry.createMany({ data: c.map(([customerId, points]) => ({ customerId, points, reason: "Puntos acumulados por visitas", createdAt: now })) });
  });
  for (const [customerId, points] of pointsByCustomer) await prisma.customer.update({ where: { id: customerId }, data: { loyaltyPoints: points } });

  // Asistencia: últimos 14 días (ayer hacia atrás, y hoy solo entrada).
  const attendance: Array<{ stylistId: string; branchId: string; checkIn: Date; checkOut: Date | null }> = [];
  for (let d = -14; d <= 0; d++) {
    const key = addDaysKey(todayKey, d);
    const wd = weekdayOf(key);
    for (const st of STYLISTS) {
      const shifts = st.shifts.filter(([, days]) => days.includes(wd));
      if (!shifts.length) continue;
      const first = Math.min(...shifts.map((s) => s[2]));
      const last = Math.max(...shifts.map((s) => s[3]));
      const late = r() < 0.12 ? 8 + Math.floor(r() * 18) : -Math.floor(r() * 8);
      const checkIn = wallToUtc(key, first + late, TZ);
      if (checkIn.getTime() > now.getTime()) continue;
      const out = wallToUtc(key, last + Math.floor(r() * 15), TZ);
      attendance.push({ stylistId: stylistIds[st.slug]!, branchId: branchIds[shifts[0]![0]]!, checkIn, checkOut: out.getTime() < now.getTime() ? out : null });
    }
  }
  await prisma.attendance.createMany({ data: attendance });

  // Gift cards y paquetes
  const giftRows = Array.from({ length: 34 }, (_, i) => {
    const initial = pick(r, [100, 200, 300, 500, 800]) * 100;
    const used = r();
    const balance = used < 0.45 ? initial : used < 0.75 ? Math.round(initial * 0.4) : 0;
    const created = now.getTime() - Math.floor(r() * 170) * DAY;
    return { code: `GIFT-${(46656 + i * 739).toString(36).toUpperCase()}`, initialCents: initial, balanceCents: balance, buyerName: `${pick(r, FIRST)} ${pick(r, LAST)}`, recipientName: `${pick(r, FIRST)} ${pick(r, LAST)}`, status: balance === 0 ? ("REDEEMED" as const) : ("ACTIVE" as const), createdAt: new Date(created), expiresAt: new Date(created + 365 * DAY) };
  });
  await prisma.giftCard.createMany({ data: giftRows });
  const PACKS: Array<[string, number, number]> = [
    ["Headspa Signature × 4", 4, 1000], ["Headspa Anticaída × 6", 6, 1380],
    ["Facial Cara Glow × 4", 4, 790], ["Facial Antiage Lifting × 5", 5, 1350], ["Drenaje Linfático × 8", 8, 1440], ["Maderoterapia × 10", 10, 1600],
  ];
  await prisma.customerPackage.createMany({
    data: Array.from({ length: 56 }, (_, i) => {
      const [name, totalSessions, price] = pick(r, PACKS);
      const created = now.getTime() - Math.floor(r() * 150) * DAY;
      const soon = i % 9 === 0;
      return { customerId: regulars[i * 3]!.id, name, totalSessions, usedSessions: Math.floor(r() * totalSessions), priceCents: price * 100, createdAt: new Date(created), expiresAt: new Date(soon ? now.getTime() + (5 + Math.floor(r() * 20)) * DAY : created + 365 * DAY) };
    }),
  });

  // Reseñas
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  await prisma.review.createMany({
    data: Array.from({ length: 220 }, (_, i) => {
      const b = pick(r, completed);
      const roll = r();
      const rating = roll < 0.74 ? 5 : roll < 0.92 ? 4 : roll < 0.97 ? 3 : roll < 0.99 ? 2 : 1;
      const it = items[bookings.indexOf(b)]!;
      const replied = rating >= 4 ? r() < 0.55 : r() < 0.25 && i > 8;
      return {
        branchId: b.branchId, customerId: b.customerId, stylistId: it.stylistId, bookingId: b.id,
        source: r() < 0.72 ? ("GOOGLE" as const) : ("INTERNAL" as const), rating,
        comment: r() < 0.72 ? (rating >= 4 ? pick(r, REVIEW_GOOD) : rating === 3 ? pick(r, REVIEW_MID) : pick(r, REVIEW_BAD)) : null,
        reply: replied ? "¡Gracias por tus palabras! Nos encanta tenerte en Cara." : null,
        repliedAt: replied ? new Date(b.endsAt.getTime() + 2 * DAY) : null,
        createdAt: new Date(Math.min(now.getTime() - i * 3_600_000, b.endsAt.getTime() + 5 * 3_600_000)),
      };
    }),
  });

  // Campos configurables de la ficha
  await prisma.customerFieldDef.createMany({
    data: [
      { key: "presion", label: "Presión de masaje preferida", type: "SELECT", options: ["Suave", "Media", "Fuerte"], sortOrder: 0 },
      { key: "agua", label: "Temperatura del agua (headspa)", type: "SELECT", options: ["Tibia", "Templada", "Caliente"], sortOrder: 1 },
      { key: "aroma", label: "Aroma favorito", type: "SELECT", options: ["Lavanda", "Eucalipto", "Cítrico", "Sin aroma"], sortOrder: 1 },
      { key: "bebida", label: "Bebida de bienvenida", type: "SELECT", options: ["Té", "Espumante", "Agua con gas", "Café"], sortOrder: 2 },
      { key: "embarazo", label: "Embarazo en curso", type: "BOOLEAN", sensitive: true, sortOrder: 3 },
      { key: "hipertension", label: "Hipertensión u otra condición a considerar", type: "TEXT", sensitive: true, sortOrder: 4 },
      { key: "contraindicaciones", label: "Contraindicaciones firmadas", type: "TEXT", sensitive: true, sortOrder: 5 },
    ],
  });

  // Ficha de ejemplo
  await prisma.customer.update({
    where: { id: customers[0]!.id },
    data: {
      preferredBranchId: branchIds.sanctuary, preferredStylistId: stylistIds["alessandra-rios"], skinType: "Mixta", hairType: "Cuero cabelludo graso", notes: "Prefiere citas a primera hora. Cabina con luz baja y agua tibia.",
      customFields: { presion: "Media", agua: "Tibia", aroma: "Eucalipto", bebida: "Té", embarazo: false },
    },
  });
  await prisma.technicalNote.createMany({
    data: [
      { customerId: customers[0]!.id, stylistId: stylistIds["alessandra-rios"]!, title: "Diagnóstico capilar", formula: "Exfoliante de arcilla verde + sérum Renewing. Agua tibia, 6 min de cascada.", body: "Cuero cabelludo graso en coronilla, sensible en nuca. Mejoró la descamación respecto a la visita anterior.", createdAt: new Date(now.getTime() - 50 * DAY) },
      { customerId: customers[0]!.id, stylistId: stylistIds["daniela-paredes"]!, title: "Facial Cara Glow", formula: null, body: "Piel mixta, deshidratada en mejillas. Evitar ácido salicílico alto; responde bien a niacinamida.", createdAt: new Date(now.getTime() - 10 * DAY) },
    ],
  });
  await prisma.customerPackage.create({ data: { customerId: customers[0]!.id, name: "Headspa Signature × 4", totalSessions: 4, usedSessions: 1, priceCents: 100_000, expiresAt: new Date(now.getTime() + 200 * DAY) } });
  await prisma.waitlistEntry.create({
    data: { customerId: customers[5]!.id, branchId: branchIds.sanctuary!, serviceIds: [serviceIds["headspa-signature-cara"]!], stylistId: stylistIds["alessandra-rios"]!, dateFrom: now, dateTo: new Date(now.getTime() + 10 * DAY), notes: "Solo mañanas" },
  });

  // Conversaciones de ejemplo
  const convo = async (customerIdx: number, branchSlug: string, status: "BOT" | "HUMAN", unread: number, lines: Array<["CUSTOMER" | "BOT" | "STAFF", string, number]>) => {
    const c = customers[customerIdx]!;
    const last = lines[lines.length - 1]!;
    await prisma.conversation.create({
      data: {
        phone: c.phone, customerId: c.id, branchId: branchIds[branchSlug], status, aiPaused: status === "HUMAN", unreadCount: unread,
        lastMessageAt: new Date(now.getTime() - last[2] * 60_000),
        lastInboundAt: new Date(now.getTime() - Math.min(...lines.filter((l) => l[0] === "CUSTOMER").map((l) => l[2])) * 60_000),
        messages: { create: lines.map(([author, body, minsAgo]) => ({ direction: author === "CUSTOMER" ? "IN" : "OUT", author, body, createdAt: new Date(now.getTime() - minsAgo * 60_000) })) },
      },
    });
  };
  await convo(0, "sanctuary", "BOT", 0, [
    ["CUSTOMER", "Hola! Quería agendar mi headspa de siempre 💆‍♀️", 95],
    ["BOT", "¡Hola, Lucía! ✨ Qué gusto saludarte. ¿Headspa Signature con Alessandra, como la última vez?", 94],
    ["CUSTOMER", "Sí, con Alessandra porfa. Jueves en la mañana?", 92],
    ["BOT", "Alessandra tiene libre el jueves a las 9:30, 10:30 y 11:45. ¿Cuál prefieres?", 91],
    ["CUSTOMER", "10:30 perfecto", 90],
    ["BOT", "Listo ✨ Tu cita quedó confirmada: Headspa Signature con Alessandra, jueves 10:30. Código CA-7KQ4M. Usaremos una sesión de tu paquete. Te recordaremos un día antes.", 89],
  ]);
  await convo(12, "sanctuary", "HUMAN", 2, [
    ["CUSTOMER", "Buenas, estoy embarazada de 5 meses, ¿puedo hacerme el headspa?", 40],
    ["BOT", "Gracias por contarnos 🙏 Es importante: te comunico con una especialista para evaluarlo contigo.", 39],
    ["STAFF", "Hola, soy Alessandra. Sí, adaptamos el ritual: sin aceites esenciales y con la camilla inclinada. ¿Te queda bien el miércoles?", 30],
    ["CUSTOMER", "Sí! A qué hora?", 12],
    ["CUSTOMER", "Y puedo ir con mi mamá?", 11],
  ]);
  await convo(27, "sanctuary", "BOT", 1, [["CUSTOMER", "Hola, ¿cuánto cuesta el headspa y cuánto dura?", 8]]);
  await convo(44, "sanctuary", "BOT", 0, [
    ["CUSTOMER", "Hola, ¿tienen gift cards para regalar?", 300],
    ["BOT", "¡Sí! Tenemos gift cards digitales desde S/ 100 y por experiencias como el Headspa Signature ✨ ¿Te muestro las opciones?", 299],
    ["CUSTOMER", "Sí porfa, para mi mamá", 298],
    ["BOT", "Qué lindo detalle 💛 El favorito para regalar es el Ritual Head & Face (S/ 420). Te paso el enlace y una asesora te ayuda con la dedicatoria.", 297],
  ]);

  // Usuarios del panel. Dominio ficticio a propósito: la demo no debe usar correos reales de la empresa.
  const passwordHash = await bcrypt.hash(opts.password ?? "demo1234", 10);
  const users: Array<{ email: string; name: string; role: "OWNER" | "ADMIN" | "BRANCH_MANAGER" | "RECEPTION" | "STYLIST"; branches?: string[]; stylist?: string }> = [
    { email: "direccion@cara.demo", name: "Dirección general", role: "OWNER" },
    { email: "admin@cara.demo", name: "Administración", role: "ADMIN" },
    { email: "gerencia@cara.demo", name: "Gerencia del Sanctuary", role: "BRANCH_MANAGER", branches: ["sanctuary"] },
    { email: "recepcion@cara.demo", name: "Recepción", role: "RECEPTION", branches: ["sanctuary"] },
    { email: "alessandra@cara.demo", name: "Alessandra Ríos", role: "STYLIST", stylist: "alessandra-rios" },
  ];
  for (const u of users) {
    await prisma.user.create({
      data: {
        id: `usr_${u.email.split("@")[0]!.replace(/[^a-z0-9]/g, "")}`,
        email: u.email, name: u.name, role: u.role, passwordHash,
        stylistId: u.stylist ? stylistIds[u.stylist] : null,
        branches: u.branches ? { create: u.branches.map((b) => ({ branchId: branchIds[b]! })) } : undefined,
      },
    });
  }

  // Campañas pasadas (simuladas)
  const camp = (name: string, segment: string, daysAgo: number, audience: number, read: number, booked: number, revenue: number, message: string) => ({
    name, segment, message, status: "SENT" as const, simulated: true, audience, delivered: Math.round(audience * 0.97), readCount: Math.round(audience * read), booked, revenueCents: revenue * 100,
    createdById: "usr_direccion", sentAt: new Date(now.getTime() - daysAgo * DAY), createdAt: new Date(now.getTime() - daysAgo * DAY),
  });
  await prisma.campaign.createMany({
    data: [
      camp("Te extrañamos: 15 % en tu próximo headspa", "AT_RISK", 12, 148, 0.74, 21, 5920, "Hola {nombre} 💛 Hace un tiempo que no te vemos en Cara. Tu próximo headspa tiene 15 % de regalo esta semana. ¿Te reservo?"),
      camp("Cumpleañeros del mes", "BIRTHDAY", 26, 62, 0.81, 14, 3780, "¡Feliz mes, {nombre}! 🎂 Tu regalo: un Facial Gua Sha de cortesía con tu próximo headspa."),
      camp("Del headspa al facial", "SALON_ONLY", 41, 310, 0.63, 27, 7240, "{nombre}, ya conoces nuestro headspa. ¿Y si esta vez cuidamos también tu piel? Facial Cara Glow con 10 %."),
      camp("Agenda libre del martes", "LOYAL", 55, 96, 0.78, 18, 3260, "{nombre}, quedan espacios este martes en el Sanctuary. Reserva hoy y llévate un masaje de cuello de cortesía ✨"),
    ],
  });

  // Registro de auditoría de ejemplo
  await prisma.auditLog.createMany({
    data: [
      { userId: "usr_direccion", userName: "Dirección general", action: "Inició sesión", entity: "Sesión", createdAt: new Date(now.getTime() - 3_600_000) },
      { userId: "usr_recepcion", userName: "Recepción", action: "Abrió caja", entity: "Caja", detail: "Cara Sanctuary · S/ 300.00", createdAt: wallToUtc(todayKey, h(8, 45), TZ) },
      { userId: "usr_gerencia", userName: "Gerencia del Sanctuary", action: "Ajustó stock", entity: "Inventario", detail: "Davines Detoxifying Scrub · +6 unidades", createdAt: new Date(now.getTime() - 26 * 3_600_000) },
      { userId: "usr_admin", userName: "Administración", action: "Lanzó campaña", entity: "Campañas", detail: "Te extrañamos: 15 % en tu próximo headspa", createdAt: new Date(now.getTime() - 12 * DAY) },
    ],
  });

  return { bookings: bookings.length, customers: customers.length, sales: sales.length };
}
