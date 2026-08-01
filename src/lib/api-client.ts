/** Authenticated fetch helpers for Class 365 Sea Notes APIs. */

export async function fetchApiJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path, { credentials: "include" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
