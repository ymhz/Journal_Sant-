import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/selles
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { journeeId, heure, consistance, commentaire } = body;

  if (!journeeId) {
    return NextResponse.json({ error: "journeeId requis" }, { status: 400 });
  }

  const entry = await prisma.selle.create({
    data: {
      journeeId,
      heure: heure || null,
      consistance: consistance || null,
      commentaire: commentaire || null,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

// PUT /api/selles
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, heure, consistance, commentaire } = body;

  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const entry = await prisma.selle.update({
    where: { id },
    data: {
      heure: heure || null,
      consistance: consistance || null,
      commentaire: commentaire || null,
    },
  });

  return NextResponse.json(entry);
}

// DELETE /api/selles?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "?id requis" }, { status: 400 });
  }

  await prisma.selle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
