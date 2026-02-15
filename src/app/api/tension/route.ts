import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function computeDerived(sys?: number | null, dia?: number | null, fc?: number | null) {
  const pp = sys && dia ? sys - dia : null;
  const pam = sys && dia ? Math.round((sys + 2 * dia) / 3) : null;
  const ratioTadFc = dia && fc ? parseFloat((dia / fc).toFixed(2)) : null;
  return { pp, pam, ratioTadFc };
}

// POST /api/tension
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { journeeId, heure, delais, position, systolique, diastolique, fc, commentaire } = body;

  if (!journeeId) {
    return NextResponse.json({ error: "journeeId requis" }, { status: 400 });
  }

  const sys = systolique ? parseInt(systolique) : null;
  const dia = diastolique ? parseInt(diastolique) : null;
  const fcVal = fc ? parseInt(fc) : null;
  const { pp, pam, ratioTadFc } = computeDerived(sys, dia, fcVal);

  const entry = await prisma.tensionArterielle.create({
    data: {
      journeeId,
      heure: heure || null,
      delais: delais || null,
      position: position || null,
      systolique: sys,
      diastolique: dia,
      fc: fcVal,
      pp,
      pam,
      ratioTadFc,
      commentaire: commentaire || null,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

// PUT /api/tension
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, heure, delais, position, systolique, diastolique, fc, commentaire } = body;

  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const sys = systolique ? parseInt(systolique) : null;
  const dia = diastolique ? parseInt(diastolique) : null;
  const fcVal = fc ? parseInt(fc) : null;
  const { pp, pam, ratioTadFc } = computeDerived(sys, dia, fcVal);

  const entry = await prisma.tensionArterielle.update({
    where: { id },
    data: {
      heure: heure || null,
      delais: delais || null,
      position: position || null,
      systolique: sys,
      diastolique: dia,
      fc: fcVal,
      pp,
      pam,
      ratioTadFc,
      commentaire: commentaire || null,
    },
  });

  return NextResponse.json(entry);
}

// DELETE /api/tension?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "?id requis" }, { status: 400 });
  }

  await prisma.tensionArterielle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
