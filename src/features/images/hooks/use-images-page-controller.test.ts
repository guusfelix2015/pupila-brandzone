import { act, renderHook } from "@testing-library/react";
import { useImagesPageController } from "@/features/images/hooks/use-images-page-controller";
import { useAppStore } from "@/store/app-store";

describe("useImagesPageController", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAppStore.getState().resetState();
  });

  it("creates an image and closes the create dialog", () => {
    const { result } = renderHook(() => useImagesPageController());

    act(() => {
      result.current.setCreateDialogOpen(true);
    });

    act(() => {
      result.current.handleCreateImage({
        title: "Referencia institucional",
        imageUrl: "https://example.com/image.png",
        groupIds: [],
        tagIds: [],
      });
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0].title).toBe("Referencia institucional");
    expect(result.current.isCreateDialogOpen).toBe(false);
  });

  it("filters images by query, group and tag", () => {
    const { result } = renderHook(() => useImagesPageController());

    act(() => {
      useAppStore.getState().addGroup("Branding");
      useAppStore.getState().addTag("Minimalista");
    });

    const groupId = useAppStore.getState().groups[0].id;
    const tagId = useAppStore.getState().tags[0].id;

    act(() => {
      result.current.handleCreateImage({
        title: "Moodboard minimalista",
        imageUrl: "https://example.com/image.png",
        groupIds: [groupId],
        tagIds: [tagId],
      });
      result.current.handleCreateImage({
        title: "Campanha colorida",
        imageUrl: "https://example.com/other.png",
        groupIds: [],
        tagIds: [],
      });
    });

    act(() => {
      result.current.handleQueryChange("minimalista");
      result.current.handleGroupFilterChange(groupId);
      result.current.handleTagFilterChange(tagId);
    });

    expect(result.current.hasFilters).toBe(true);
    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0].title).toBe("Moodboard minimalista");

    act(() => {
      result.current.handleClearFilters();
    });

    expect(result.current.images).toHaveLength(2);
  });

  it("opens, adds, edits and closes image comments", () => {
    const { result } = renderHook(() => useImagesPageController());

    act(() => {
      result.current.handleCreateImage({
        title: "Referencia institucional",
        imageUrl: "https://example.com/image.png",
        groupIds: [],
        tagIds: [],
      });
    });

    act(() => {
      result.current.handleOpenComments(result.current.images[0]);
    });

    expect(result.current.selectedImage?.title).toBe("Referencia institucional");

    act(() => {
      result.current.handleSubmitComment({ content: "Comentario inicial" });
    });

    const comment = result.current.selectedImage?.comments[0];

    expect(comment?.content).toBe("Comentario inicial");

    act(() => {
      if (comment) {
        result.current.handleEditComment(comment);
      }
    });

    expect(result.current.editingComment?.content).toBe("Comentario inicial");

    act(() => {
      result.current.handleSubmitComment({ content: "Comentario editado" });
    });

    expect(result.current.selectedImage?.comments[0].content).toBe("Comentario editado");
    expect(result.current.editingComment).toBeUndefined();

    act(() => {
      result.current.handleCloseComments();
    });

    expect(result.current.selectedImage).toBeUndefined();
  });

  it("sets and cancels the image selected for deletion", () => {
    const { result } = renderHook(() => useImagesPageController());

    act(() => {
      result.current.handleCreateImage({
        title: "Referencia institucional",
        imageUrl: "https://example.com/image.png",
        groupIds: [],
        tagIds: [],
      });
    });

    const imageId = result.current.images[0].id;

    act(() => {
      result.current.handleRequestDeleteImage(imageId);
    });

    expect(result.current.deletingImage?.id).toBe(imageId);

    act(() => {
      result.current.handleCancelDeleteImage();
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.deletingImage).toBeUndefined();
  });

  it("deletes when deletion is confirmed", () => {
    const { result } = renderHook(() => useImagesPageController());

    act(() => {
      result.current.handleCreateImage({
        title: "Referencia institucional",
        imageUrl: "https://example.com/image.png",
        groupIds: [],
        tagIds: [],
      });
    });

    const imageId = result.current.images[0].id;

    act(() => {
      result.current.handleRequestDeleteImage(imageId);
    });

    act(() => {
      result.current.handleConfirmDeleteImage();
    });

    expect(result.current.images).toEqual([]);
    expect(result.current.deletingImage).toBeUndefined();
  });
});
