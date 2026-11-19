import { beforeAll, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { PrismaClient } from "@/generated/prisma/client";
import { applyMigrations } from "@/lib/migrations";
import { seedDatabase } from "@/lib/seed-data";
import { getAvailability } from "@/lib/availability";
import { BookingError, createBooking } from "@/lib/booking";
import type { Slot } from "@/lib/availability-engine";
import { addDaysKey, localDateKey } from "@/lib/time";

let prisma: PrismaClient;

beforeAll(async () => {
  const pg = new PGlite();
  await applyMigrations(pg);
  prisma = new PrismaClient({ adapter: new PrismaPGlite(pg) });
  await seedDatabase(prisma);
});

async function firstSlot(branchId: string, items: Array<{ serviceId: string; stylistId?: string }>) {
  const branch = await prisma.branch.findUniqueOrThrow({ where: { id: branchId } });
  const today = localDateKey(new Date(), branch.timezone);
  for (let d = 2; d < 14; d++) {
    const { days } = await getAvailability(prisma, { branchId, items, fromKey: addDaysKey(today, d) });
    if (days[0]!.slots[0]) return days[0]!.slots[0] as Slot;
  }
  throw new Error("sin huecos");
}

describe("reservas", () => {
  it("dos clientes no pueden quedarse el mismo hueco", async () => {
    const branch = await prisma.branch.findUniqueOrThrow({ where: { slug: "sanctuary" } });
    const stylist = await prisma.stylist.findUniqueOrThrow({ where: { slug: "renata-salazar" } });
    const service = await prisma.service.findUniqueOrThrow({ where: { slug: "dermaplaning" } });
    const items = [{ serviceId: service.id, stylistId: stylist.id }];
    const start = new Date((await firstSlot(branch.id, items)).start);

    const results = await Promise.allSettled([
      createBooking(prisma, { branchId: branch.id, phone: "+51911000001", customerName: "Cliente A", items, start, channel: "WEB" }),
      createBooking(prisma, { branchId: branch.id, phone: "+51911000002", customerName: "Cliente B", items, start, channel: "WHATSAPP" }),
    ]);
    const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(failed).toHaveLength(1);
    const err = failed[0]!.reason as BookingError;
    expect(err).toBeInstanceOf(BookingError);
    expect(err.code).toBe("SLOT_TAKEN");
    expect(err.alternatives.length).toBeGreaterThan(0);
  });

  it("una terapeuta no puede tener dos citas a la vez, aunque sea otro servicio", async () => {
    // Daniela hace faciales: se le reserva uno y se comprueba que el bloque no se ofrezca para otro servicio suyo.
    const branch = await prisma.branch.findUniqueOrThrow({ where: { slug: "sanctuary" } });
    const daniela = await prisma.stylist.findUniqueOrThrow({ where: { slug: "daniela-paredes" } });
    const first = await prisma.service.findUniqueOrThrow({ where: { slug: "facial-cara-glow" } });
    const other = await prisma.service.findUniqueOrThrow({ where: { slug: "limpieza-facial-profunda" } });
    const slot = await firstSlot(branch.id, [{ serviceId: first.id, stylistId: daniela.id }]);
    await createBooking(prisma, { branchId: branch.id, phone: "+51911000010", items: [{ serviceId: first.id, stylistId: daniela.id }], start: new Date(slot.start), channel: "WEB" });
    const key = localDateKey(slot.start, branch.timezone);
    const { days } = await getAvailability(prisma, { branchId: branch.id, items: [{ serviceId: other.id, stylistId: daniela.id }], fromKey: key });
    expect(days[0]!.slots.some((s) => s.start < slot.end && slot.start < s.end)).toBe(false);
  });

  it("aplica el límite de reservas activas por cliente", async () => {
    const branch = await prisma.branch.findUniqueOrThrow({ where: { slug: "sanctuary" } });
    const service = await prisma.service.findUniqueOrThrow({ where: { slug: "headspa-express" } });
    const items = [{ serviceId: service.id }];
    const today = localDateKey(new Date(), branch.timezone);
    let created = 0;
    let policyError: BookingError | null = null;
    for (let d = 2; d < 14 && !policyError; d++) {
      const { days } = await getAvailability(prisma, { branchId: branch.id, items, fromKey: addDaysKey(today, d) });
      const s = days[0]!.slots[0];
      if (!s) continue;
      try {
        await createBooking(prisma, { branchId: branch.id, phone: "+51911000099", items, start: new Date(s.start), channel: "WEB" });
        created++;
      } catch (e) {
        policyError = e as BookingError;
      }
    }
    expect(created).toBe(branch.maxActiveBookings);
    expect(policyError?.code).toBe("POLICY");
  });
});
