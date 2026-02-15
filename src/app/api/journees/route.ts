import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_ID_DEFAULT = "moi@journal-sante.local";

async function getUser() {
  return prisma.user.findUniqueOrThrow({ where: { email: USER_ID_DEFAULT } });
}

// GET /api/journees?date=2026-01-14
// Retourne la journÃ©e pour cette date (la crÃ©e si elle n'existe pas)
export async function GET(req: NextRequest) {
  const dateStr = req.nextUrl.searchParams.get("date");
  if (!dateStr) {
    return NextResponse.json({ error: "?date=YYYY-MM-DD requis" }, { status: 400 });
  }

  const user = await getUser();
  const date = new Date(dateStr + "T00:00:00.000Z");

  const journee = await prisma.journee.upsert({
    where: { userId_date: { userId: user.id, date } },
    update: {},
    create: { userId: user.id, date },
    include: {
      repas: { include: { aliments: { include: { aliment: true } }, supplements: { include: { supplement: true } } }, orderBy: { heure: "asc" } },
      hydratations: { include: { solution: true }, orderBy: { heure: "asc" } },
      mictions: { orderBy: { heure: "asc" } },
      symptomes: { orderBy: { heure: "asc" } },
      tensions: { orderBy: { heure: "asc" } },
      selles: { orderBy: { heure: "asc" } },
      notes: { orderBy: { heure: "asc" } },
    },
  });

  return NextResponse.json(journee);
}
