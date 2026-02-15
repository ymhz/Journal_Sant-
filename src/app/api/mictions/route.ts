import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/mictions
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { journeeId, heure, volumeMl, saturation10, moussePct, odeurDesc, odeur10, sg, pH, sang, commentaire } = body;

  if (!journeeId) {
    return NextResponse.json({ error: "journeeId requis" }, { status: 400 });
  }

  const entry = await prisma.miction.create({
    data: {
      journeeId,
      heure: heure || null,
      volumeMl: volumeMl ? parseFloat(volumeMl) : null,
      saturation10: saturation10 != null ? parseInt(saturation10) : null,
      moussePct: moussePct != null ? parseInt(moussePct) : null,
      odeurDesc: odeurDesc || null,
      odeur10: odeur10 != null ? parseInt(odeur10) : null,
      sg: sg || null,
      pH: pH ? parseFloat(pH) : null,
      sang: sang || null,
      commentaire: commentaire || null,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

// PUT /api/mictions
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, heure, volumeMl, saturation10, moussePct, odeurDesc, odeur10, sg, pH, sang, commentaire } = body;

  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const entry = await prisma.miction.update({
    where: { id },
    data: {
      heure: heure || null,
      volumeMl: volumeMl ? parseFloat(volumeMl) : null,
      saturation10: saturation10 != null ? parseInt(saturation10) : null,
      moussePct: moussePct != null ? parseInt(moussePct) : null,
      odeurDesc: odeurDesc || null,
      odeur10: odeur10 != null ? parseInt(odeur10) : null,
      sg: sg || null,
      pH: pH ? parseFloat(pH) : null,
      sang: sang || null,
      commentaire: commentaire || null,
    },
  });

  return NextResponse.json(entry);
}

// DELETE /api/mictions?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "?id requis" }, { status: 400 });
  }

  await prisma.miction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
