import { act, renderHook } from "@testing-library/react";
import { useTagsPageController } from "@/features/tags/hooks/use-tags-page-controller";
import { useAppStore } from "@/store/app-store";

describe("useTagsPageController", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAppStore.getState().resetState();
  });

  it("creates a tag through the controller", () => {
    const { result } = renderHook(() => useTagsPageController());

    act(() => {
      result.current.handleOpenCreateTag();
    });

    expect(result.current.isFormDialogOpen).toBe(true);

    act(() => {
      expect(result.current.handleSubmitTag({ name: "Minimalista" })).toBe(true);
    });

    expect(result.current.tags).toHaveLength(1);
    expect(result.current.tags[0].name).toBe("Minimalista");
    expect(result.current.isFormDialogOpen).toBe(false);
  });

  it("edits a selected tag and exits edit mode after save", () => {
    const { result } = renderHook(() => useTagsPageController());

    act(() => {
      result.current.handleSubmitTag({ name: "Minimalista" });
    });

    act(() => {
      result.current.handleEditTag(result.current.tags[0]);
    });

    expect(result.current.editingTag?.name).toBe("Minimalista");
    expect(result.current.isFormDialogOpen).toBe(true);
    expect(result.current.submitLabel).toBe("Salvar tag");

    act(() => {
      expect(result.current.handleSubmitTag({ name: "Editorial" })).toBe(true);
    });

    expect(result.current.editingTag).toBeUndefined();
    expect(result.current.isFormDialogOpen).toBe(false);
    expect(result.current.tags[0].name).toBe("Editorial");
  });

  it("closes the form dialog and clears edit state", () => {
    const { result } = renderHook(() => useTagsPageController());

    act(() => {
      result.current.handleSubmitTag({ name: "Minimalista" });
    });

    act(() => {
      result.current.handleEditTag(result.current.tags[0]);
    });

    act(() => {
      result.current.handleCloseFormDialog();
    });

    expect(result.current.isFormDialogOpen).toBe(false);
    expect(result.current.editingTag).toBeUndefined();
  });

  it("sets and cancels the tag selected for deletion", () => {
    const { result } = renderHook(() => useTagsPageController());

    act(() => {
      result.current.handleSubmitTag({ name: "Minimalista" });
    });

    const tagId = result.current.tags[0].id;

    act(() => {
      result.current.handleRequestDeleteTag(tagId);
    });

    expect(result.current.deletingTag?.id).toBe(tagId);

    act(() => {
      result.current.handleCancelDeleteTag();
    });

    expect(result.current.tags).toHaveLength(1);
    expect(result.current.deletingTag).toBeUndefined();
  });

  it("deletes when deletion is confirmed", () => {
    const { result } = renderHook(() => useTagsPageController());

    act(() => {
      result.current.handleSubmitTag({ name: "Minimalista" });
    });

    const tagId = result.current.tags[0].id;

    act(() => {
      result.current.handleRequestDeleteTag(tagId);
    });

    act(() => {
      result.current.handleConfirmDeleteTag();
    });

    expect(result.current.tags).toEqual([]);
    expect(result.current.deletingTag).toBeUndefined();
  });
});
