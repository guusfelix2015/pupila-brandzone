export function normalizeText(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function cleanText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function getInitialsFromContent(content: string): string {
  const words = content.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
