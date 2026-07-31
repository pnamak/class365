/**
 * Idempotent demo seed for App Platform boots.
 * Runs prisma/seed.ts only when no users exist yet.
 */
import { PrismaClient } from "@prisma/client";
import { spawnSync } from "node:child_process";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log(`Seed skipped — ${count} user(s) already present.`);
    return;
  }

  console.log("No users found — running demo seed...");
  const result = spawnSync("npx", ["tsx", "prisma/seed.ts"], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

main()
  .catch((error) => {
    console.error("ensure-seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
