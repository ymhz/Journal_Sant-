import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_EMAIL = "moi@journal-sante.local";

// GET /api/bilan?date=2026-01-14
export async function GET(req: NextRequest) {
  const dateStr = req.nextUrl.searchParams.get("date");
  if (!dateStr) {
    return NextResponse.json({ error: "?date=YYYY-MM-DD requis" }, { status: 400 });
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { email: USER_EMAIL } });
  const date = new Date(dateStr + "T00:00:00.000Z");

  const journee = await prisma.journee.findUnique({
    where: { userId_date: { userId: user.id, date } },
    include: {
      repas: {
        include: { aliments: { include: { aliment: true } } },
      },
      hydratations: { include: { solution: true } },
      mictions: true,
      symptomes: true,
      tensions: true,
      selles: true,
      notes: true,
    },
  });

  if (!journee) {
    return NextResponse.json({ date: dateStr, exists: false, hydrique: null, nutrition: null, electrolytes: null, counts: null });
  }

  // â”€â”€â”€ Hydrique â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const hydTotal = journee.hydratations.reduce((s, e) => s + (e.volumeMl || 0), 0);
  const mictTotal = journee.mictions.reduce((s, e) => s + (e.volumeMl || 0), 0);
  const bilanHydrique = hydTotal - mictTotal;

  // â”€â”€â”€ Nutrition (depuis aliments_ref Ã— poids) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const nutrition = { na: 0, k: 0, kcal: 0, prot: 0, lip: 0, gluc: 0, oxa: 0, ca: 0, mg: 0, fib: 0 };
  journee.repas.forEach((r) => {
    r.aliments.forEach((ra) => {
      const ref = ra.aliment;
      if (ref && ra.poidsG) {
        const ratio = ra.poidsG / 100;
        nutrition.na += Math.round((ref.na || 0) * ratio);
        nutrition.k += Math.round((ref.k || 0) * ratio);
        nutrition.kcal += Math.round((ref.kcal || 0) * ratio);
        nutrition.prot += +((ref.prot || 0) * ratio).toFixed(1);
        nutrition.lip += +((ref.lip || 0) * ratio).toFixed(1);
        nutrition.gluc += +((ref.gluc || 0) * ratio).toFixed(1);
        nutrition.oxa += Math.round((ref.oxa || 0) * ratio);
        nutrition.ca += Math.round((ref.ca || 0) * ratio);
        nutrition.mg += Math.round((ref.mg || 0) * ratio);
        nutrition.fib += +((ref.fib || 0) * ratio).toFixed(1);
      }
    });
  });

  // Arrondir les flottants
  nutrition.prot = +nutrition.prot.toFixed(1);
  nutrition.lip = +nutrition.lip.toFixed(1);
  nutrition.gluc = +nutrition.gluc.toFixed(1);
  nutrition.fib = +nutrition.fib.toFixed(1);

  // â”€â”€â”€ Ã‰lectrolytes (depuis solutions_ref Ã— volume) â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const elecSolutions = { na: 0, k: 0, mg: 0 };
  journee.hydratations.forEach((h) => {
    if (h.solution && h.volumeMl) {
      const ratio = h.volumeMl / 1000;
      elecSolutions.na += Math.round((h.solution.na || 0) * ratio);
      elecSolutions.k += Math.round((h.solution.k || 0) * ratio);
      elecSolutions.mg += Math.round((h.solution.mgSel || 0) * ratio);
    }
  });

  const totalNa = nutrition.na + elecSolutions.na;
  const totalK = nutrition.k + elecSolutions.k;
  const ratioNaK = totalK > 0 ? +(totalNa / totalK).toFixed(2) : null;

  // â”€â”€â”€ Counts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const counts = {
    repas: journee.repas.length,
    hydratations: journee.hydratations.length,
    mictions: journee.mictions.length,
    symptomes: journee.symptomes.length,
    tensions: journee.tensions.length,
    selles: journee.selles.length,
    notes: journee.notes.length,
  };

  // â”€â”€â”€ Tension moyennes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const tensionsAvec = journee.tensions.filter((t) => t.systolique && t.diastolique);
  const tensionMoy = tensionsAvec.length > 0
    ? {
        sys: Math.round(tensionsAvec.reduce((s, t) => s + (t.systolique || 0), 0) / tensionsAvec.length),
        dia: Math.round(tensionsAvec.reduce((s, t) => s + (t.diastolique || 0), 0) / tensionsAvec.length),
        fc: tensionsAvec.filter((t) => t.fc).length > 0
          ? Math.round(tensionsAvec.filter((t) => t.fc).reduce((s, t) => s + (t.fc || 0), 0) / tensionsAvec.filter((t) => t.fc).length)
          : null,
      }
    : null;

  return NextResponse.json({
    date: dateStr,
    exists: true,
    hydrique: {
      hydratation: hydTotal,
      mictions: mictTotal,
      bilan: bilanHydrique,
    },
    nutrition,
    electrolytes: {
      naAlimentaire: nutrition.na,
      naSolutions: elecSolutions.na,
      naTotal: totalNa,
      kAlimentaire: nutrition.k,
      kSolutions: elecSolutions.k,
      kTotal: totalK,
      mgSolutions: elecSolutions.mg,
      ratioNaK,
    },
    tensionMoyenne: tensionMoy,
    counts,
  });
}
