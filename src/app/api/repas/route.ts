import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/repas
// Body: { journeeId, heure?, numeroRepas?, naclG?, kCitrateMeq?, marchePostPrandialeMin?, commentaire?, aliments: [{ alimentId, poidsG }], supplements?: [{ supplementId, quantite?, dosage? }] }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { journeeId, heure, numeroRepas, naclG, kCitrateMeq, marchePostPrandialeMin, commentaire, aliments, supplements } = body;

  if (!journeeId) {
    return NextResponse.json({ error: "journeeId requis" }, { status: 400 });
  }

  const repas = await prisma.repas.create({
    data: {
      journeeId,
      heure: heure || null,
      numeroRepas: numeroRepas ? parseInt(numeroRepas) : null,
      naclG: naclG ? parseFloat(naclG) : null,
      kCitrateMeq: kCitrateMeq ? parseFloat(kCitrateMeq) : null,
      marchePostPrandialeMin: marchePostPrandialeMin ? parseInt(marchePostPrandialeMin) : null,
      commentaire: commentaire || null,
      aliments: {
        create: (aliments || []).map((a: { alimentId: string; poidsG: number }) => ({
          alimentId: a.alimentId,
          poidsG: a.poidsG,
        })),
      },
      supplements: {
        create: (supplements || []).map((s: { supplementId: string; quantite?: number; dosage?: string }) => ({
          supplementId: s.supplementId,
          quantite: s.quantite ?? null,
          dosage: s.dosage ?? null,
        })),
      },
    },
    include: {
      aliments: { include: { aliment: true } },
      supplements: { include: { supplement: true } },
    },
  });

  return NextResponse.json(repas, { status: 201 });
}

// PUT /api/repas
// Body: { id, ...mÃªmes champs que POST }
// Remplace les aliments et supplÃ©ments (delete + recreate)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, heure, numeroRepas, naclG, kCitrateMeq, marchePostPrandialeMin, commentaire, aliments, supplements } = body;

  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  // Supprimer les anciennes relations
  await prisma.repasAliment.deleteMany({ where: { repasId: id } });
  await prisma.repasSupplement.deleteMany({ where: { repasId: id } });

  const repas = await prisma.repas.update({
    where: { id },
    data: {
      heure: heure || null,
      numeroRepas: numeroRepas ? parseInt(numeroRepas) : null,
      naclG: naclG ? parseFloat(naclG) : null,
      kCitrateMeq: kCitrateMeq ? parseFloat(kCitrateMeq) : null,
      marchePostPrandialeMin: marchePostPrandialeMin ? parseInt(marchePostPrandialeMin) : null,
      commentaire: commentaire || null,
      aliments: {
        create: (aliments || []).map((a: { alimentId: string; poidsG: number }) => ({
          alimentId: a.alimentId,
          poidsG: a.poidsG,
        })),
      },
      supplements: {
        create: (supplements || []).map((s: { supplementId: string; quantite?: number; dosage?: string }) => ({
          supplementId: s.supplementId,
          quantite: s.quantite ?? null,
          dosage: s.dosage ?? null,
        })),
      },
    },
    include: {
      aliments: { include: { aliment: true } },
      supplements: { include: { supplement: true } },
    },
  });

  return NextResponse.json(repas);
}

// DELETE /api/repas?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "?id requis" }, { status: 400 });
  }

  await prisma.repas.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
