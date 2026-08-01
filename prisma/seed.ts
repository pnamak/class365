import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { toDbRole } from "../src/lib/auth/roles";
import { DEMO_USERS } from "../src/lib/auth";
import {
  courses,
  electiveOfferings,
  invoices,
  studentEnrollments,
  students,
} from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Class 365 (Sea Notes foundation)...");

  for (const demo of DEMO_USERS) {
    const passwordHash = await hashPassword(demo.password);
    await prisma.user.upsert({
      where: { email: demo.email },
      update: {
        name: demo.name,
        role: toDbRole(demo.role),
        title: demo.title,
        avatar: demo.avatar,
        passwordHash,
        emailVerified: true,
      },
      create: {
        email: demo.email,
        name: demo.name,
        role: toDbRole(demo.role),
        title: demo.title,
        avatar: demo.avatar,
        passwordHash,
        emailVerified: true,
        subscription: {
          create: {
            status: "ACTIVE",
            plan: demo.role === "admin" ? "SCHOOL" : "FREE",
          },
        },
      },
    });
  }

  for (const student of students) {
    await prisma.student.upsert({
      where: { externalId: student.id },
      update: {
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
      },
      create: {
        externalId: student.id,
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
      },
    });
  }

  for (const course of courses) {
    await prisma.schoolClass.upsert({
      where: { code: course.code },
      update: {
        title: course.title,
        teacher: course.teacher,
        yearLevels: JSON.stringify(course.yearLevels),
        band: course.band,
        students: course.students,
        schedule: course.schedule,
        mode: course.mode,
        progress: course.progress,
        term: course.term,
        credits: course.credits,
        kind: course.kind,
        seats: course.seats,
      },
      create: {
        code: course.code,
        title: course.title,
        teacher: course.teacher,
        yearLevels: JSON.stringify(course.yearLevels),
        band: course.band,
        students: course.students,
        schedule: course.schedule,
        mode: course.mode,
        progress: course.progress,
        term: course.term,
        credits: course.credits,
        kind: course.kind,
        seats: course.seats,
      },
    });
  }

  // Clear enrollments then recreate from demo data
  await prisma.schoolEnrollment.deleteMany();
  for (const enrollment of studentEnrollments) {
    const student = await prisma.student.findUnique({
      where: { externalId: enrollment.studentId },
    });
    const schoolClass = await prisma.schoolClass.findUnique({
      where: { code: enrollment.courseCode },
    });
    if (!student || !schoolClass) continue;
    await prisma.schoolEnrollment.create({
      data: {
        studentId: student.id,
        classId: schoolClass.id,
        status: enrollment.status,
        term: enrollment.term,
        credits: enrollment.credits,
      },
    });
  }

  for (const invoice of invoices) {
    const student = await prisma.student.findFirst({
      where: { name: invoice.studentName },
    });
    await prisma.invoice.upsert({
      where: { externalId: invoice.id },
      update: {
        studentId: student?.id,
        studentName: invoice.studentName,
        yearLevel: invoice.yearLevel,
        description: invoice.description,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        status: invoice.status,
      },
      create: {
        externalId: invoice.id,
        studentId: student?.id,
        studentName: invoice.studentName,
        yearLevel: invoice.yearLevel,
        description: invoice.description,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        status: invoice.status,
      },
    });
  }

  for (const elective of electiveOfferings) {
    await prisma.electiveOffering.upsert({
      where: { code: elective.code },
      update: {
        title: elective.title,
        yearLevels: JSON.stringify(elective.yearLevels),
        credits: elective.credits,
        seats: elective.seats,
        enrolled: elective.enrolled,
        waitlist: elective.waitlist,
        teacher: elective.teacher,
        term: elective.term,
        category: elective.category,
      },
      create: {
        code: elective.code,
        title: elective.title,
        yearLevels: JSON.stringify(elective.yearLevels),
        credits: elective.credits,
        seats: elective.seats,
        enrolled: elective.enrolled,
        waitlist: elective.waitlist,
        teacher: elective.teacher,
        term: elective.term,
        category: elective.category,
      },
    });
  }

  // Sample Sea Notes note for admin (starter kit parity)
  const admin = await prisma.user.findUnique({
    where: { email: "admin@class365.edu" },
  });
  if (admin) {
    const existing = await prisma.note.count({ where: { userId: admin.id } });
    if (existing === 0) {
      await prisma.note.create({
        data: {
          userId: admin.id,
          title: "Welcome to Class 365 on Sea Notes",
          content:
            "This note comes from the DigitalOcean Sea Notes SaaS starter kit foundation. Auth, Postgres/SQLite via Prisma, Stripe-ready billing, Resend email, and Spaces storage patterns are wired for Class 365.",
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
