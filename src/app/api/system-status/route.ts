import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";
import { serverConfig } from "@/lib/settings";

export async function GET() {
  const session = await auth();

  let dbOk = false;
  let userCount = 0;
  let studentCount = 0;
  try {
    userCount = await prisma.user.count();
    studentCount = await prisma.student.count();
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json({
    app: "Class 365",
    foundation: "Sea Notes SaaS Starter Kit (DigitalOcean)",
    authenticated: Boolean(session?.user),
    role: session?.user?.role ?? null,
    providers: {
      database: {
        provider: serverConfig.databaseProvider,
        status: dbOk ? "connected" : "error",
        users: userCount,
        students: studentCount,
      },
      email: {
        provider: serverConfig.emailProvider,
        enabled: serverConfig.enableEmailIntegration,
        configured: Boolean(serverConfig.Resend.apiKey),
      },
      storage: {
        provider: serverConfig.storageProvider,
        configured: Boolean(serverConfig.Spaces.SPACES_BUCKET_NAME),
      },
      billing: {
        provider: serverConfig.billingProvider,
        configured: Boolean(serverConfig.Stripe.stripeSecretKey),
        note: "School SaaS subscriptions via Stripe (Sea Notes pattern). Family school-fee invoices use Vanuatu Vatu in SIS billing.",
      },
      ai: {
        provider: "DigitalOcean GradientAI",
        configured: Boolean(serverConfig.GradientAI.doInferenceApiKey),
      },
    },
  });
}
