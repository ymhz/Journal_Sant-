import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_EMAIL = "moi@journal-sante.local";

// GET /api/calendrier?month=2026-01
// Retourne pour chaque jour du mois : nombre d'entrÃ©es par catÃ©gorie
export async function GET(req: NextRequest) {
  const monthStr = req.nextUrl.searchParams.get("month");
  if (!monthStr || !/^\d{4}-\d{2}$/.test(monthStr)) {
    return NextResponse.json({ error: "?month=YYYY-MM requis" }, { status: 400 });
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { email: USER_EMAIL } });

  const [year, month] = monthStr.split("-").map(Number);
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

  const journees = await prisma.journee.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate, lte: endDate },
    },
    include: {
      _count: {
        select: {
          repas: true,
          hydratations: true,
          mictions: true,
          symptomes: true,
          tensions: true,
          selles: true,
          notes: true,
        },
      },
    },
    orderBy: { date: "asc" },
  });

  const days = journees.map((j) => {
    const total = j._count.repas + j._count.hydratations + j._count.mictions
      + j._count.symptomes + j._count.tensions + j._count.selles + j._count.notes;
    return {
      date: j.date.toISOString().slice(0, 10),
      counts: j._count,
      total,
    };
  });

  return NextResponse.json({ month: monthStr, days });
}
