/**
 * Normalize app/public URL for Auth.js on platforms like DigitalOcean App Platform.
 * Never write an invalid value into process.env.AUTH_URL — Node stringifies
 * `undefined` as "undefined", which causes `TypeError: Invalid URL`.
 */
export function resolvePublicUrl(
  ...candidates: Array<string | undefined>
): string | undefined {
  for (const raw of candidates) {
    if (!raw) continue;
    const trimmed = raw.trim().replace(/\/$/, "");
    if (!trimmed) continue;
    // Node stringifies missing env writes as "undefined" / "null".
    if (/^(undefined|null)$/i.test(trimmed)) continue;

    // Host-only values (no protocol) are common on some PaaS bindings.
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      const url = new URL(withProtocol);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      if (!url.hostname || url.hostname === "undefined" || url.hostname === "null") {
        continue;
      }
      return url.origin;
    } catch {
      // try next candidate
    }
  }
  return undefined;
}

/** Apply a valid AUTH_URL when possible; otherwise leave unset (trustHost). */
export function applyAuthUrlFromEnv(): void {
  const resolved = resolvePublicUrl(
    process.env.AUTH_URL,
    process.env.BASE_URL,
    process.env.NEXTAUTH_URL,
    process.env.APP_URL,
  );

  if (resolved) {
    process.env.AUTH_URL = resolved;
    process.env.BASE_URL = process.env.BASE_URL || resolved;
  } else {
    // Avoid poisoning Auth.js with the literal string "undefined".
    delete process.env.AUTH_URL;
  }

  // DigitalOcean / reverse-proxy safe default (Auth.js v5).
  if (!process.env.AUTH_TRUST_HOST) {
    process.env.AUTH_TRUST_HOST = "true";
  }
}
