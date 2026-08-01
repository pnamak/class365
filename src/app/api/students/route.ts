import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const students = await prisma.student.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    data: students.map((student) => ({
      id: student.externalId,
      name: student.name,
      email: student.email,
      yearLevel: student.yearLevel,
      band: student.band,
      homeroom: student.homeroom,
      program: student.program,
      status: student.status,
      gpa: student.gpa,
      attendanceRate: student.attendanceRate,
      advisor: student.advisor,
      guardian: student.guardian,
      guardianEmail: student.guardianEmail,
      enrolledAt: student.enrolledAt,
      avatar: student.avatar,
      creditsEarned: student.creditsEarned,
      creditsRequired: student.creditsRequired,
      electiveSlots: student.electiveSlots,
      electiveFilled: student.electiveFilled,
    })),
    source: "prisma",
    foundation: "sea-notes-saas-starter-kit",
  });
}
