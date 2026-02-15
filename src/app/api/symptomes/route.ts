import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/symptomes
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { journeeId, heure, symptome, localisation, intensite, commentaire } = body;

  if (!journeeId) {
    return NextResponse.json({ error: "journeeId requis" }, { status: 400 });
  }

  const entry = await prisma.symptome.create({
    data: {
      journeeId,
      heure: heure || null,
      type: symptome || null,
      localisation: localisation || null,
      intensite10: intensite != null ? Number(intensite) : null,
      commentaire: commentaire || null,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

// DELETE /api/symptomes?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "?id= requis" }, { status: 400 });
  }

  await prisma.symptome.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
