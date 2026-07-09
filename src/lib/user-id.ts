const GUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export function normalizeUserId(value: unknown): string | null {
  if (value == null) return null;

  if (typeof value === 'object' && 'id' in value) {
    return normalizeUserId((value as { id: unknown }).id);
  }

  const id = String(value).trim();
  return GUID_REGEX.test(id) ? id : null;
}

export function normalizeUserIds(values: unknown[]): string[] {
  return values
    .map((value) => normalizeUserId(value))
    .filter((value): value is string => Boolean(value));
}
