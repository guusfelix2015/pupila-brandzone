import type { Comment, Group, ID, ImageItem, PaletteColor, PaletteItem, Tag } from "@/core/types/domain";
import { createIsoDate } from "@/lib/utils/date";
import { createId } from "@/lib/utils/id";
import { cleanText } from "@/lib/utils/text";

export type CreateGroupInput = {
  name: string;
};

export type CreateTagInput = {
  name: string;
};

export type CreateCommentInput = {
  content: string;
};

export type CreateImageInput = {
  title: string;
  imageUrl: string;
  groupIds: ID[];
  tagIds: ID[];
};

export type CreatePaletteInput = {
  title: string;
  colors: string[];
  groupIds: ID[];
  tagIds: ID[];
};

export function createGroup(input: CreateGroupInput): Group {
  return {
    id: createId("group"),
    name: cleanText(input.name),
  };
}

export function createTag(input: CreateTagInput): Tag {
  return {
    id: createId("tag"),
    name: cleanText(input.name),
  };
}

export function createComment(input: CreateCommentInput): Comment {
  return {
    id: createId("comment"),
    content: cleanText(input.content),
    createdAt: createIsoDate(),
  };
}

export function createImageItem(input: CreateImageInput): ImageItem {
  const now = createIsoDate();

  return {
    id: createId("image"),
    title: cleanText(input.title),
    imageUrl: input.imageUrl.trim(),
    groupIds: input.groupIds,
    tagIds: input.tagIds,
    comments: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createPaletteColor(hex: string): PaletteColor {
  return {
    id: createId("color"),
    hex,
  };
}

export function createPaletteItem(input: CreatePaletteInput): PaletteItem {
  const now = createIsoDate();

  return {
    id: createId("palette"),
    title: cleanText(input.title),
    colors: input.colors.map(createPaletteColor),
    groupIds: input.groupIds,
    tagIds: input.tagIds,
    comments: [],
    createdAt: now,
    updatedAt: now,
  };
}
