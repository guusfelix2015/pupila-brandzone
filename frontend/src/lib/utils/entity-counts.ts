import type { ID, ImageItem, PaletteItem } from "@/core/types/domain";

export type EntityCounts = {
  images: number;
  palettes: number;
  total: number;
};

export function getGroupCounts(images: ImageItem[], palettes: PaletteItem[], groupId: ID): EntityCounts {
  const imageCount = images.filter((image) => image.groupIds.includes(groupId)).length;
  const paletteCount = palettes.filter((palette) => palette.groupIds.includes(groupId)).length;

  return {
    images: imageCount,
    palettes: paletteCount,
    total: imageCount + paletteCount,
  };
}

export function getTagCounts(images: ImageItem[], palettes: PaletteItem[], tagId: ID): EntityCounts {
  const imageCount = images.filter((image) => image.tagIds.includes(tagId)).length;
  const paletteCount = palettes.filter((palette) => palette.tagIds.includes(tagId)).length;

  return {
    images: imageCount,
    palettes: paletteCount,
    total: imageCount + paletteCount,
  };
}
