import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/refs
// Returns all reference tables (aliments, solutions, supplements)
export async function GET() {
  const [aliments, solutions, supplements] = await Promise.all([
    prisma.alimentRef.findMany({ orderBy: { nom: "asc" } }),
    prisma.solutionRef.findMany({ orderBy: { nom: "asc" } }),
    prisma.supplementRef.findMany({ orderBy: { nom: "asc" } }),
  ]);

  return NextResponse.json({ aliments, solutions, supplements });
}
