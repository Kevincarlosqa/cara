import type { BookingChannel, BookingStatus, DocType, PaymentMethod, Role, ServiceCategory, StylistLevel } from "@/generated/prisma/enums";

export const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

export const CHANNEL_LABELS: Record<BookingChannel, string> = {
  WHATSAPP: "WhatsApp",
  WEB: "Web",
  DASHBOARD: "Dashboard",
  PHONE: "Teléfono",
  WALK_IN: "Walk-in",
};

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  HEADSPA: "Headspa",
  RITUAL: "Rituales",
  COUPLE: "En pareja",
  MASSAGE: "Masajes",
  BODY: "Corporales",
  FACIAL: "Faciales",
  HYDRO: "Hidroterapia",
  CUT: "Corte",
  COLOR: "Color",
  STYLING: "Peinado",
  HAIR_CARE: "Tratamientos",
  NAILS: "Manos y pies",
  MAKEUP: "Maquillaje",
  BROWS_LASHES: "Cejas y pestañas",
  WAX: "Depilación",
};

/** Carta de Cara Sanctuary, en el orden en que se muestra. */
export const CARA_CATEGORIES: ServiceCategory[] = ["HEADSPA", "FACIAL", "BODY", "MASSAGE", "RITUAL", "COUPLE"];
/** Pilares de la marca (los que anuncia en Instagram). */
export const PILLAR_CATEGORIES: ServiceCategory[] = ["HEADSPA", "FACIAL", "BODY"];
/** Se conservan por compatibilidad con el panel: todo lo de Cara es "spa"; no hay salón. */
export const SPA_CATEGORIES: ServiceCategory[] = [...CARA_CATEGORIES, "HYDRO"];
export const SALON_CATEGORIES: ServiceCategory[] = [];

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  YAPE: "Yape",
  PLIN: "Plin",
  TRANSFER: "Transferencia",
  GIFT_CARD: "Gift card",
};

export const DOC_LABELS: Record<DocType, string> = { BOLETA: "Boleta", FACTURA: "Factura", NOTA_VENTA: "Nota de venta" };

export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Dirección",
  ADMIN: "Administración",
  BRANCH_MANAGER: "Gerencia de sede",
  RECEPTION: "Recepción",
  STYLIST: "Especialista",
};

export const LEVEL_LABELS: Record<StylistLevel, string> = { JUNIOR: "Junior", SENIOR: "Senior", MASTER: "Master" };
