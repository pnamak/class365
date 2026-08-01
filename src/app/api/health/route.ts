import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverConfig } from "@/lib/settings";

export async function GET() {
  let database: "ok" | "error" = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = "error";
  }

  return NextResponse.json({
    status: database === "ok" ? "healthy" : "degraded",
    service: "class365",
    foundation: "digitalocean/sea-notes-saas-starter-kit",
    checks: {
      database,
      databaseProvider: serverConfig.databaseProvider,
      email: serverConfig.enableEmailIntegration ? "configured" : "disabled",
      storage: serverConfig.Spaces.SPACES_BUCKET_NAME
        ? "configured"
        : "not_configured",
      billing: serverConfig.Stripe.stripeSecretKey
        ? "configured"
        : "not_configured",
      ai: serverConfig.GradientAI.doInferenceApiKey
        ? "configured"
        : "not_configured",
    },
    timestamp: new Date().toISOString(),
  });
}
