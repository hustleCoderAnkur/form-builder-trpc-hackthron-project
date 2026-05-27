const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function stripHtml(str: string): string {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\u0000/g, "")
    .trim();
}

function sanitizeString(val: unknown, maxLength = 5000): string {
  if (typeof val !== "string") return String(val ?? "");
  return stripHtml(val).slice(0, maxLength);
}

/** Clean answer map before Zod validation — prevents XSS / junk keys */
export function sanitizeAnswers(
  answers: Record<string, unknown>,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(answers)) {
    if (!UUID_RE.test(key)) continue;

    if (typeof val === "string") {
      cleaned[key] = sanitizeString(val);
    } else if (Array.isArray(val)) {
      cleaned[key] = val
        .filter((v) => typeof v === "string")
        .map((v) => sanitizeString(v, 200))
        .slice(0, 20);
    } else if (typeof val === "number" || typeof val === "boolean") {
      cleaned[key] = val;
    }
  }

  return cleaned;
}
