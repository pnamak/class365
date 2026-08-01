import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const electives = await prisma.electiveOffering.findMany({
    orderBy: { code: "asc" },
  });

  return NextResponse.json({
    data: electives.map((item) => ({
      id: item.code,
      code: item.code,
      title: item.title,
      yearLevels: safeJsonArray(item.yearLevels),
      credits: item.credits,
      seats: item.seats,
      enrolled: item.enrolled,
      waitlist: item.waitlist,
      teacher: item.teacher,
      term: item.term,
      category: item.category,
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
