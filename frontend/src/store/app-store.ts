import { create } from "zustand";
import type { Comment, Filters, Group, ID, ImageItem, PaletteItem, PersistedAppState, Tag } from "@/core/types/domain";
import {
  createComment,
  createGroup,
  createImageItem,
  createPaletteColor,
  createPaletteItem,
  createTag,
  type CreateImageInput,
  type CreatePaletteInput,
} from "@/lib/factories/entities";
import { emptyPersistedAppState, loadPersistedAppState, savePersistedAppState } from "@/lib/storage/local-storage";
import { createIsoDate } from "@/lib/utils/date";
import { cleanText, normalizeText } from "@/lib/utils/text";

const initialFilters: Filters = {
  query: "",
};

type AppStoreState = PersistedAppState & {
  filters: Filters;
};

type AppStoreActions = {
  addGroup: (name: string) => boolean;
  updateGroup: (groupId: ID, name: string) => boolean;
  deleteGroup: (groupId: ID) => void;
  addTag: (name: string) => boolean;
  updateTag: (tagId: ID, name: string) => boolean;
  deleteTag: (tagId: ID) => void;
  addImage: (input: CreateImageInput) => void;
  updateImage: (imageId: ID, updates: Partial<Pick<ImageItem, "title" | "imageUrl" | "groupIds" | "tagIds">>) => void;
  deleteImage: (imageId: ID) => void;
  addImageComment: (imageId: ID, content: string) => void;
  updateImageComment: (imageId: ID, commentId: ID, content: string) => void;
  addPalette: (input: CreatePaletteInput) => void;
  updatePalette: (
    paletteId: ID,
    updates: Partial<Pick<PaletteItem, "title" | "groupIds" | "tagIds">> & { colors?: string[] },
  ) => void;
  deletePalette: (paletteId: ID) => void;
  addPaletteComment: (paletteId: ID, content: string) => void;
  updatePaletteComment: (paletteId: ID, commentId: ID, content: string) => void;
  setQuery: (query: string) => void;
  setGroupFilter: (groupId?: ID) => void;
  setTagFilter: (tagId?: ID) => void;
  clearFilters: () => void;
  resetState: () => void;
};

export type AppStore = AppStoreState & AppStoreActions;

function persistState(state: AppStoreState): void {
  savePersistedAppState({
    images: state.images,
    palettes: state.palettes,
    groups: state.groups,
    tags: state.tags,
  });
}

function hasDuplicateName<TItem extends { id: ID; name: string }>(
  items: TItem[],
  name: string,
  ignoreId?: ID,
): boolean {
  const normalizedName = normalizeText(name);

  return items.some((item) => item.id !== ignoreId && normalizeText(item.name) === normalizedName);
}

function persistableState(state: AppStore): AppStoreState {
  return {
    images: state.images,
    palettes: state.palettes,
    groups: state.groups,
    tags: state.tags,
    filters: state.filters,
  };
}

function updateComment(comments: Comment[], commentId: ID, content: string): Comment[] {
  const updatedAt = createIsoDate();

  return comments.map((comment) =>
    comment.id === commentId
      ? {
          ...comment,
          content: cleanText(content),
          updatedAt,
        }
      : comment,
  );
}

function removeId(ids: ID[], idToRemove: ID): ID[] {
  return ids.filter((id) => id !== idToRemove);
}

const persistedState = loadPersistedAppState();

export const useAppStore = create<AppStore>()((set, get) => ({
  images: persistedState.images,
  palettes: persistedState.palettes,
  groups: persistedState.groups,
  tags: persistedState.tags,
  filters: initialFilters,

  addGroup: (name) => {
    if (hasDuplicateName(get().groups, name)) {
      return false;
    }

    set((state) => ({
      groups: [...state.groups, createGroup({ name })],
    }));
    persistState(persistableState(get()));

    return true;
  },

  updateGroup: (groupId, name) => {
    if (hasDuplicateName(get().groups, name, groupId)) {
      return false;
    }

    set((state) => ({
      groups: state.groups.map((group) => (group.id === groupId ? { ...group, name: cleanText(name) } : group)),
    }));
    persistState(persistableState(get()));

    return true;
  },

  deleteGroup: (groupId) => {
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== groupId),
      images: state.images.map((image) => ({ ...image, groupIds: removeId(image.groupIds, groupId) })),
      palettes: state.palettes.map((palette) => ({ ...palette, groupIds: removeId(palette.groupIds, groupId) })),
      filters: {
        ...state.filters,
        groupId: state.filters.groupId === groupId ? undefined : state.filters.groupId,
      },
    }));
    persistState(persistableState(get()));
  },

  addTag: (name) => {
    if (hasDuplicateName(get().tags, name)) {
      return false;
    }

    set((state) => ({
      tags: [...state.tags, createTag({ name })],
    }));
    persistState(persistableState(get()));

    return true;
  },

  updateTag: (tagId, name) => {
    if (hasDuplicateName(get().tags, name, tagId)) {
      return false;
    }

    set((state) => ({
      tags: state.tags.map((tag) => (tag.id === tagId ? { ...tag, name: cleanText(name) } : tag)),
    }));
    persistState(persistableState(get()));

    return true;
  },

  deleteTag: (tagId) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== tagId),
      images: state.images.map((image) => ({ ...image, tagIds: removeId(image.tagIds, tagId) })),
      palettes: state.palettes.map((palette) => ({ ...palette, tagIds: removeId(palette.tagIds, tagId) })),
      filters: {
        ...state.filters,
        tagId: state.filters.tagId === tagId ? undefined : state.filters.tagId,
      },
    }));
    persistState(persistableState(get()));
  },

  addImage: (input) => {
    set((state) => ({
      images: [createImageItem(input), ...state.images],
    }));
    persistState(persistableState(get()));
  },

  updateImage: (imageId, updates) => {
    const updatedAt = createIsoDate();

    set((state) => ({
      images: state.images.map((image) =>
        image.id === imageId
          ? {
              ...image,
              ...updates,
              updatedAt,
            }
          : image,
      ),
    }));
    persistState(persistableState(get()));
  },

  deleteImage: (imageId) => {
    set((state) => ({
      images: state.images.filter((image) => image.id !== imageId),
    }));
    persistState(persistableState(get()));
  },

  addImageComment: (imageId, content) => {
    const comment = createComment({ content });
    const updatedAt = createIsoDate();

    set((state) => ({
      images: state.images.map((image) =>
        image.id === imageId ? { ...image, comments: [comment, ...image.comments], updatedAt } : image,
      ),
    }));
    persistState(persistableState(get()));
  },

  updateImageComment: (imageId, commentId, content) => {
    const updatedAt = createIsoDate();

    set((state) => ({
      images: state.images.map((image) =>
        image.id === imageId
          ? { ...image, comments: updateComment(image.comments, commentId, content), updatedAt }
          : image,
      ),
    }));
    persistState(persistableState(get()));
  },

  addPalette: (input) => {
    set((state) => ({
      palettes: [createPaletteItem(input), ...state.palettes],
    }));
    persistState(persistableState(get()));
  },

  updatePalette: (paletteId, updates) => {
    const updatedAt = createIsoDate();

    set((state) => ({
      palettes: state.palettes.map((palette) => {
        if (palette.id !== paletteId) return palette;

        return {
          ...palette,
          title: updates.title ?? palette.title,
          groupIds: updates.groupIds ?? palette.groupIds,
          tagIds: updates.tagIds ?? palette.tagIds,
          colors: updates.colors ? updates.colors.map(createPaletteColor) : palette.colors,
          updatedAt,
        };
      }),
    }));
    persistState(persistableState(get()));
  },

  deletePalette: (paletteId) => {
    set((state) => ({
      palettes: state.palettes.filter((palette) => palette.id !== paletteId),
    }));
    persistState(persistableState(get()));
  },

  addPaletteComment: (paletteId, content) => {
    const comment = createComment({ content });
    const updatedAt = createIsoDate();

    set((state) => ({
      palettes: state.palettes.map((palette) =>
        palette.id === paletteId ? { ...palette, comments: [comment, ...palette.comments], updatedAt } : palette,
      ),
    }));
    persistState(persistableState(get()));
  },

  updatePaletteComment: (paletteId, commentId, content) => {
    const updatedAt = createIsoDate();

    set((state) => ({
      palettes: state.palettes.map((palette) =>
        palette.id === paletteId
          ? { ...palette, comments: updateComment(palette.comments, commentId, content), updatedAt }
          : palette,
      ),
    }));
    persistState(persistableState(get()));
  },

  setQuery: (query) => {
    set((state) => ({
      filters: {
        ...state.filters,
        query,
      },
    }));
  },

  setGroupFilter: (groupId) => {
    set((state) => ({
      filters: {
        ...state.filters,
        groupId,
      },
    }));
  },

  setTagFilter: (tagId) => {
    set((state) => ({
      filters: {
        ...state.filters,
        tagId,
      },
    }));
  },

  clearFilters: () => {
    set({ filters: initialFilters });
  },

  resetState: () => {
    set({
      ...emptyPersistedAppState,
      filters: initialFilters,
    });
    persistState({ ...emptyPersistedAppState, filters: initialFilters });
  },
}));

export const selectImages = (state: AppStore): ImageItem[] => state.images;
export const selectPalettes = (state: AppStore): PaletteItem[] => state.palettes;
export const selectGroups = (state: AppStore): Group[] => state.groups;
export const selectTags = (state: AppStore): Tag[] => state.tags;
export const selectFilters = (state: AppStore): Filters => state.filters;
