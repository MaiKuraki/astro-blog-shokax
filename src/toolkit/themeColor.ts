export type ThemeTokenRef = `var(--${string})`;

export type ThemeColorValue =
  | ThemeTokenRef
  | `#${string}`
  | `rgb(${string})`
  | `rgba(${string})`
  | `hsl(${string})`
  | `hsla(${string})`
  | `oklch(${string})`
  | `oklab(${string})`
  | `color-mix(${string})`;

const warnedContexts = new Set<string>();

function warnInvalidColor(context: string, value: unknown, fallback: ThemeColorValue) {
  if (typeof console === "undefined") return;

  const key = `${context}:${String(value)}`;
  if (warnedContexts.has(key)) return;
  warnedContexts.add(key);

  console.warn(`[theme-config] ${context} 的颜色值无效：${String(value)}，已回退为 ${fallback}`);
}

export function isThemeTokenRef(value: string): value is ThemeTokenRef {
  return /^var\(--[a-z0-9-]+\)$/i.test(value.trim());
}

export function isThemeColorValue(value: string): value is ThemeColorValue {
  const normalized = value.trim();

  return (
    isThemeTokenRef(normalized) ||
    /^#[0-9a-f]{3,8}$/i.test(normalized) ||
    /^rgba?\(.+\)$/i.test(normalized) ||
    /^hsla?\(.+\)$/i.test(normalized) ||
    /^oklch\(.+\)$/i.test(normalized) ||
    /^oklab\(.+\)$/i.test(normalized) ||
    /^color-mix\(.+\)$/i.test(normalized)
  );
}

export function sanitizeThemeColor(
  value: unknown,
  fallback: ThemeColorValue,
  context: string,
): ThemeColorValue {
  if (typeof value !== "string") {
    if (value !== undefined && value !== null) {
      warnInvalidColor(context, value, fallback);
    }
    return fallback;
  }

  const normalized = value.trim();
  if (isThemeColorValue(normalized)) {
    return normalized;
  }

  warnInvalidColor(context, value, fallback);
  return fallback;
}
