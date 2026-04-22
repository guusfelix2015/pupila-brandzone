import { useMemo, useState } from "react";
import type { Comment, ImageItem } from "@/core/types/domain";
import type { CommentFormValues, ImageFormValues } from "@/lib/validation/schemas";
import { filterItemsByGroupAndTag } from "@/lib/filters/filter-items";
import { searchItemsByQuery } from "@/lib/search/search-items";
import { useAppStore } from "@/store/app-store";

export type ImagesPageController = {
  images: ImageItem[];
  groups: ReturnType<typeof useAppStore.getState>["groups"];
  tags: ReturnType<typeof useAppStore.getState>["tags"];
  filters: ReturnType<typeof useAppStore.getState>["filters"];
  isCreateDialogOpen: boolean;
  editingImage?: ImageItem;
  selectedImage?: ImageItem;
  deletingImage?: ImageItem;
  editingComment?: Comment;
  hasFilters: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  handleCreateImage: (values: ImageFormValues) => void;
  handleOpenEditImage: (image: ImageItem) => void;
  handleCloseEditImage: () => void;
  handleUpdateImage: (values: ImageFormValues) => void;
  handleRequestDeleteImage: (imageId: string) => void;
  handleCancelDeleteImage: () => void;
  handleConfirmDeleteImage: () => void;
  handleOpenComments: (image: ImageItem) => void;
  handleCloseComments: () => void;
  handleEditComment: (comment: Comment) => void;
  handleCancelEditComment: () => void;
  handleSubmitComment: (values: CommentFormValues) => void;
  handleQueryChange: (query: string) => void;
  handleGroupFilterChange: (groupId?: string) => void;
  handleTagFilterChange: (tagId?: string) => void;
  handleClearFilters: () => void;
};

export function useImagesPageController(): ImagesPageController {
  const allImages = useAppStore((state) => state.images);
  const groups = useAppStore((state) => state.groups);
  const tags = useAppStore((state) => state.tags);
  const filters = useAppStore((state) => state.filters);
  const addImage = useAppStore((state) => state.addImage);
  const updateImage = useAppStore((state) => state.updateImage);
  const deleteImage = useAppStore((state) => state.deleteImage);
  const addImageComment = useAppStore((state) => state.addImageComment);
  const updateImageComment = useAppStore((state) => state.updateImageComment);
  const setQuery = useAppStore((state) => state.setQuery);
  const setGroupFilter = useAppStore((state) => state.setGroupFilter);
  const setTagFilter = useAppStore((state) => state.setTagFilter);
  const clearFilters = useAppStore((state) => state.clearFilters);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | undefined>();
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>();
  const [deletingImageId, setDeletingImageId] = useState<string | undefined>();
  const [editingComment, setEditingComment] = useState<Comment | undefined>();

  const images = useMemo(() => {
    const searchedImages = searchItemsByQuery(allImages, tags, filters.query);
    return filterItemsByGroupAndTag(searchedImages, filters);
  }, [allImages, filters, tags]);

  const editingImage = allImages.find((image) => image.id === editingImageId);
  const selectedImage = allImages.find((image) => image.id === selectedImageId);
  const deletingImage = allImages.find((image) => image.id === deletingImageId);
  const hasFilters = Boolean(filters.query || filters.groupId || filters.tagId);

  function handleCreateImage(values: ImageFormValues): void {
    addImage(values);
    setCreateDialogOpen(false);
  }

  function handleUpdateImage(values: ImageFormValues): void {
    if (!editingImageId) return;

    updateImage(editingImageId, {
      title: values.title,
      imageUrl: values.imageUrl,
      groupIds: values.groupIds,
      tagIds: values.tagIds,
    });
    setEditingImageId(undefined);
  }

  function handleConfirmDeleteImage(): void {
    if (deletingImageId) {
      deleteImage(deletingImageId);
      setDeletingImageId(undefined);
    }
  }

  function handleCloseComments(): void {
    setSelectedImageId(undefined);
    setEditingComment(undefined);
  }

  function handleSubmitComment(values: CommentFormValues): void {
    if (!selectedImage) {
      return;
    }

    if (editingComment) {
      updateImageComment(selectedImage.id, editingComment.id, values.content);
      setEditingComment(undefined);
      return;
    }

    addImageComment(selectedImage.id, values.content);
  }

  return {
    images,
    groups,
    tags,
    filters,
    isCreateDialogOpen,
    editingImage,
    selectedImage,
    deletingImage,
    editingComment,
    hasFilters,
    setCreateDialogOpen,
    handleCreateImage,
    handleOpenEditImage: (image) => setEditingImageId(image.id),
    handleCloseEditImage: () => setEditingImageId(undefined),
    handleUpdateImage,
    handleRequestDeleteImage: setDeletingImageId,
    handleCancelDeleteImage: () => setDeletingImageId(undefined),
    handleConfirmDeleteImage,
    handleOpenComments: (image) => setSelectedImageId(image.id),
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
