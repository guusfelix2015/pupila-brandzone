export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHexColor(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith("#") ? trimmed.toUpperCase() : `#${trimmed.toUpperCase()}`;
}

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_PATTERN.test(normalizeHexColor(value));
}

export function parseHexColors(value: string): string[] {
  return value
    .split(/[\n,;]/)
    .map(normalizeHexColor)
    .filter(Boolean);
}

export function stringToHslColor(str: string, saturation = 70, lightness = 45): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
