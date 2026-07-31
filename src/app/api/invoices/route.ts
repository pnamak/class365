import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json({
    data: invoices.map((invoice) => ({
      id: invoice.externalId,
      studentName: invoice.studentName,
      yearLevel: invoice.yearLevel,
      description: invoice.description,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      status: invoice.status,
    })),
    currency: "VUV",
    source: "prisma",
  });
}
