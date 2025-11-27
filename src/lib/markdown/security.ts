export function sanitizePath(path: string): string {
  return path
    .replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9._\-/]/g, "")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
}

export function isValidGitHubIdentifier(value: string | undefined | null): boolean {
  if (!value || typeof value !== "string") return false;
  return /^[a-zA-Z0-9._-]+$/.test(value) && value.length > 0 && value.length <= 100;
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeDataUri(dataUri: string): string | null {
  const maxLength = 100000;
  if (dataUri.length > maxLength) return null;
  if (!dataUri.startsWith("data:image/")) return null;
  return dataUri;
}

