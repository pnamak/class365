import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const classes = await prisma.schoolClass.findMany({
    orderBy: { code: "asc" },
  });

  return NextResponse.json({
    data: classes.map((item) => ({
      ...item,
      yearLevels: safeJsonArray(item.yearLevels),
    })),
    source: "prisma",
  });
}

function safeJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
