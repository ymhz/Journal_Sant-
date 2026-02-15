import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/notes
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { journeeId, heure, commentaire } = body;

  if (!journeeId) {
    return NextResponse.json({ error: "journeeId requis" }, { status: 400 });
  }

  const entry = await prisma.note.create({
    data: {
      journeeId,
      heure: heure || null,
      commentaire: commentaire || "",
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

// PUT /api/notes
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, heure, commentaire } = body;

  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const entry = await prisma.note.update({
    where: { id },
    data: {
      heure: heure || null,
      commentaire: commentaire || "",
    },
  });

  return NextResponse.json(entry);
}

// DELETE /api/notes?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "?id requis" }, { status: 400 });
  }

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
