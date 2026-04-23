import { useMemo, useState } from "react";
import type { Comment, PaletteItem } from "@/core/types/domain";
import type { CommentFormValues, PaletteFormValues } from "@/lib/validation/schemas";
import { filterItemsByGroupAndTag } from "@/lib/filters/filter-items";
import { searchItemsByQuery } from "@/lib/search/search-items";
import { parseHexColors } from "@/lib/utils/colors";
import { useAppStore } from "@/store/app-store";

export type PalettesPageController = {
  palettes: PaletteItem[];
  groups: ReturnType<typeof useAppStore.getState>["groups"];
  tags: ReturnType<typeof useAppStore.getState>["tags"];
  filters: ReturnType<typeof useAppStore.getState>["filters"];
  isCreateDialogOpen: boolean;
  editingPalette?: PaletteItem;
  selectedPalette?: PaletteItem;
  deletingPalette?: PaletteItem;
  editingComment?: Comment;
  hasFilters: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  handleCreatePalette: (values: PaletteFormValues) => void;
  handleOpenEditPalette: (palette: PaletteItem) => void;
  handleCloseEditPalette: () => void;
  handleUpdatePalette: (values: PaletteFormValues) => void;
  handleRequestDeletePalette: (paletteId: string) => void;
  handleCancelDeletePalette: () => void;
  handleConfirmDeletePalette: () => void;
  handleOpenComments: (palette: PaletteItem) => void;
  handleCloseComments: () => void;
  handleEditComment: (comment: Comment) => void;
  handleCancelEditComment: () => void;
  handleSubmitComment: (values: CommentFormValues) => void;
  handleQueryChange: (query: string) => void;
  handleGroupFilterChange: (groupId?: string) => void;
  handleTagFilterChange: (tagId?: string) => void;
  handleClearFilters: () => void;
};

export function usePalettesPageController(): PalettesPageController {
  const allPalettes = useAppStore((state) => state.palettes);
  const groups = useAppStore((state) => state.groups);
  const tags = useAppStore((state) => state.tags);
  const filters = useAppStore((state) => state.filters);
  const addPalette = useAppStore((state) => state.addPalette);
  const updatePalette = useAppStore((state) => state.updatePalette);
  const deletePalette = useAppStore((state) => state.deletePalette);
  const addPaletteComment = useAppStore((state) => state.addPaletteComment);
  const updatePaletteComment = useAppStore((state) => state.updatePaletteComment);
  const setQuery = useAppStore((state) => state.setQuery);
  const setGroupFilter = useAppStore((state) => state.setGroupFilter);
  const setTagFilter = useAppStore((state) => state.setTagFilter);
  const clearFilters = useAppStore((state) => state.clearFilters);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPaletteId, setEditingPaletteId] = useState<string | undefined>();
  const [selectedPaletteId, setSelectedPaletteId] = useState<string | undefined>();
  const [deletingPaletteId, setDeletingPaletteId] = useState<string | undefined>();
  const [editingComment, setEditingComment] = useState<Comment | undefined>();

  const palettes = useMemo(() => {
    const searchedPalettes = searchItemsByQuery(allPalettes, tags, filters.query);
    return filterItemsByGroupAndTag(searchedPalettes, filters);
  }, [allPalettes, filters, tags]);

  const editingPalette = allPalettes.find((palette) => palette.id === editingPaletteId);
  const selectedPalette = allPalettes.find((palette) => palette.id === selectedPaletteId);
  const deletingPalette = allPalettes.find((palette) => palette.id === deletingPaletteId);
  const hasFilters = Boolean(filters.query || filters.groupId || filters.tagId);

  function handleCreatePalette(values: PaletteFormValues): void {
    addPalette({
      title: values.title,
      colors: parseHexColors(values.colorsText),
      groupIds: values.groupIds,
      tagIds: values.tagIds,
    });
    setCreateDialogOpen(false);
  }

  function handleUpdatePalette(values: PaletteFormValues): void {
    if (!editingPaletteId) return;

    updatePalette(editingPaletteId, {
      title: values.title,
      colors: parseHexColors(values.colorsText),
      groupIds: values.groupIds,
      tagIds: values.tagIds,
    });
    setEditingPaletteId(undefined);
  }

  function handleConfirmDeletePalette(): void {
    if (deletingPaletteId) {
      deletePalette(deletingPaletteId);
      setDeletingPaletteId(undefined);
    }
  }

  function handleCloseComments(): void {
    setSelectedPaletteId(undefined);
    setEditingComment(undefined);
  }

  function handleSubmitComment(values: CommentFormValues): void {
    if (!selectedPalette) {
      return;
    }

    if (editingComment) {
      updatePaletteComment(selectedPalette.id, editingComment.id, values.content);
      setEditingComment(undefined);
      return;
    }

    addPaletteComment(selectedPalette.id, values.content);
  }

  return {
    palettes,
    groups,
    tags,
    filters,
    isCreateDialogOpen,
    editingPalette,
    selectedPalette,
    deletingPalette,
    editingComment,
    hasFilters,
    setCreateDialogOpen,
    handleCreatePalette,
    handleOpenEditPalette: (palette) => setEditingPaletteId(palette.id),
    handleCloseEditPalette: () => setEditingPaletteId(undefined),
    handleUpdatePalette,
    handleRequestDeletePalette: setDeletingPaletteId,
    handleCancelDeletePalette: () => setDeletingPaletteId(undefined),
    handleConfirmDeletePalette,
    handleOpenComments: (palette) => setSelectedPaletteId(palette.id),
    handleCloseComments,
    handleEditComment: setEditingComment,
    handleCancelEditComment: () => setEditingComment(undefined),
    handleSubmitComment,
    handleQueryChange: setQuery,
    handleGroupFilterChange: setGroupFilter,
    handleTagFilterChange: setTagFilter,
    handleClearFilters: clearFilters,
  };
}
