export const PALETTE_VIEW_MODE = {
  GRID: "grid",
  LIST: "list",
  DETAILS: "details",
} as const;

export type PaletteViewMode = (typeof PALETTE_VIEW_MODE)[keyof typeof PALETTE_VIEW_MODE];
