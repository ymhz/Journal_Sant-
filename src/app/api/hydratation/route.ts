import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/hydratation
// Body: { journeeId, heure?, volumeMl?, solutionId?, periodeRepas?, commentaire? }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { journeeId, heure, volumeMl, solutionId, periodeRepas, commentaire } = body;

  if (!journeeId) {
    return NextResponse.json({ error: "journeeId requis" }, { status: 400 });
  }

  const entry = await prisma.hydratation.create({
    data: {
      journeeId,
      heure: heure || null,
      volumeMl: volumeMl ? parseFloat(volumeMl) : null,
      solutionId: solutionId || null,
      periodeRepas: periodeRepas || null,
      commentaire: commentaire || null,
    },
    include: { solution: true },
  });

  return NextResponse.json(entry, { status: 201 });
}

// PUT /api/hydratation
// Body: { id, ...mÃªmes champs }
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, heure, volumeMl, solutionId, periodeRepas, commentaire } = body;

  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const entry = await prisma.hydratation.update({
    where: { id },
    data: {
      heure: heure || null,
      volumeMl: volumeMl ? parseFloat(volumeMl) : null,
      solutionId: solutionId || null,
      periodeRepas: periodeRepas || null,
      commentaire: commentaire || null,
    },
    include: { solution: true },
  });

  return NextResponse.json(entry);
}

// DELETE /api/hydratation?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "?id requis" }, { status: 400 });
  }

  await prisma.hydratation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
