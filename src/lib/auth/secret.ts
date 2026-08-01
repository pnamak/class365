const INVALID_VALUES = new Set([
  "",
  "undefined",
  "null",
  "your-AUTH-secret",
  "change-me",
]);

const DEV_FALLBACK = "class365-dev-secret-change-me";
const PROD_FALLBACK =
  "class365-do-fallback-secret-set-AUTH_SECRET-in-app-platform";

function readConfiguredSecret(): string | undefined {
  for (const raw of [process.env.AUTH_SECRET, process.env.NEXTAUTH_SECRET]) {
    if (!raw) continue;
    const value = raw.trim();
    if (!value) continue;
    if (INVALID_VALUES.has(value)) continue;
    // Ignore the production emergency fallback if it was injected earlier.
    if (value === PROD_FALLBACK) continue;
    return value;
  }
  return undefined;
}

/**
 * Resolve Auth.js secret for DigitalOcean / local.
 * Missing AUTH_SECRET in production is the usual cause of:
 * "Server error — There is a problem with the server configuration."
 */
export function resolveAuthSecret(): {
  secret: string;
  source: "env" | "fallback";
} {
  const configured = readConfiguredSecret();
  if (configured) {
    process.env.AUTH_SECRET = configured;
    return { secret: configured, source: "env" };
  }

  const fallback =
    process.env.NODE_ENV === "production" ? PROD_FALLBACK : DEV_FALLBACK;

  if (process.env.NODE_ENV === "production") {
    console.error(
      "[auth] AUTH_SECRET is missing or placeholder. Set a strong AUTH_SECRET in DigitalOcean App Platform → Settings → App-Level Environment Variables. Using a temporary fallback so sign-in can proceed.",
    );
  }

  // Ensure Auth.js env inference also sees a value.
  process.env.AUTH_SECRET = fallback;
  return { secret: fallback, source: "fallback" };
}

export function isAuthSecretConfigured(): boolean {
  return Boolean(readConfiguredSecret());
}
