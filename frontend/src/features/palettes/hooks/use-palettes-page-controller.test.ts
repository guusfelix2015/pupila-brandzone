import { act, renderHook } from "@testing-library/react";
import { usePalettesPageController } from "@/features/palettes/hooks/use-palettes-page-controller";
import { PALETTE_VIEW_MODE } from "@/features/palettes/types/palette-view-mode";
import { useAppStore } from "@/store/app-store";

describe("usePalettesPageController", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAppStore.getState().resetState();
  });

  it("creates a palette and closes the create dialog", () => {
    const { result } = renderHook(() => usePalettesPageController());

    act(() => {
      result.current.setCreateDialogOpen(true);
    });

    act(() => {
      result.current.handleCreatePalette({
        title: "Paleta institucional",
        colorsText: "#ffffff, #123abc",
        groupIds: [],
        tagIds: [],
      });
    });

    expect(result.current.palettes).toHaveLength(1);
    expect(result.current.palettes[0].title).toBe("Paleta institucional");
    expect(result.current.palettes[0].colors.map((color) => color.hex)).toEqual(["#FFFFFF", "#123ABC"]);
    expect(result.current.isCreateDialogOpen).toBe(false);
  });

  it("starts in grid mode and changes palette view mode", () => {
    const { result } = renderHook(() => usePalettesPageController());

    expect(result.current.viewMode).toBe(PALETTE_VIEW_MODE.GRID);

    act(() => {
      result.current.handleViewModeChange(PALETTE_VIEW_MODE.LIST);
    });

    expect(result.current.viewMode).toBe(PALETTE_VIEW_MODE.LIST);

    act(() => {
      result.current.handleViewModeChange(PALETTE_VIEW_MODE.DETAILS);
    });

    expect(result.current.viewMode).toBe(PALETTE_VIEW_MODE.DETAILS);
  });

  it("filters palettes by query, group and tag", () => {
    const { result } = renderHook(() => usePalettesPageController());

    act(() => {
      useAppStore.getState().addGroup("Branding");
      useAppStore.getState().addTag("Minimalista");
    });

    const groupId = useAppStore.getState().groups[0].id;
    const tagId = useAppStore.getState().tags[0].id;

    act(() => {
      result.current.handleCreatePalette({
        title: "Paleta minimalista",
        colorsText: "#ffffff",
        groupIds: [groupId],
        tagIds: [tagId],
      });
      result.current.handleCreatePalette({
        title: "Paleta vibrante",
        colorsText: "#123abc",
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
    expect(result.current.palettes).toHaveLength(1);
    expect(result.current.palettes[0].title).toBe("Paleta minimalista");

    act(() => {
      result.current.handleClearFilters();
    });

    expect(result.current.palettes).toHaveLength(2);
  });

  it("opens, adds, edits and closes palette comments", () => {
    const { result } = renderHook(() => usePalettesPageController());

    act(() => {
      result.current.handleCreatePalette({
        title: "Paleta institucional",
        colorsText: "#ffffff",
        groupIds: [],
        tagIds: [],
      });
    });

    act(() => {
      result.current.handleOpenComments(result.current.palettes[0]);
    });

    expect(result.current.selectedPalette?.title).toBe("Paleta institucional");

    act(() => {
      result.current.handleSubmitComment({ content: "Comentário inicial" });
    });

    const comment = result.current.selectedPalette?.comments[0];

    expect(comment?.content).toBe("Comentário inicial");

    act(() => {
      if (comment) {
        result.current.handleEditComment(comment);
      }
    });

    expect(result.current.editingComment?.content).toBe("Comentário inicial");

    act(() => {
      result.current.handleSubmitComment({ content: "Comentário editado" });
    });

    expect(result.current.selectedPalette?.comments[0].content).toBe("Comentário editado");
    expect(result.current.editingComment).toBeUndefined();

    act(() => {
      result.current.handleCloseComments();
    });

    expect(result.current.selectedPalette).toBeUndefined();
  });

  it("sets and cancels the palette selected for deletion", () => {
    const { result } = renderHook(() => usePalettesPageController());

    act(() => {
      result.current.handleCreatePalette({
        title: "Paleta institucional",
        colorsText: "#ffffff",
        groupIds: [],
        tagIds: [],
      });
    });

    const paletteId = result.current.palettes[0].id;

    act(() => {
      result.current.handleRequestDeletePalette(paletteId);
    });

    expect(result.current.deletingPalette?.id).toBe(paletteId);

    act(() => {
      result.current.handleCancelDeletePalette();
    });

    expect(result.current.palettes).toHaveLength(1);
    expect(result.current.deletingPalette).toBeUndefined();
  });

  it("deletes when deletion is confirmed", () => {
    const { result } = renderHook(() => usePalettesPageController());

    act(() => {
      result.current.handleCreatePalette({
        title: "Paleta institucional",
        colorsText: "#ffffff",
        groupIds: [],
        tagIds: [],
      });
    });

    const paletteId = result.current.palettes[0].id;

    act(() => {
      result.current.handleRequestDeletePalette(paletteId);
    });

    act(() => {
      result.current.handleConfirmDeletePalette();
    });

    expect(result.current.palettes).toEqual([]);
    expect(result.current.deletingPalette).toBeUndefined();
  });

  it("edits a palette including colors", () => {
    const { result } = renderHook(() => usePalettesPageController());

    act(() => {
      result.current.handleCreatePalette({
        title: "Paleta original",
        colorsText: "#ffffff",
        groupIds: [],
        tagIds: [],
      });
    });

    const palette = result.current.palettes[0];

    act(() => {
      result.current.handleOpenEditPalette(palette);
    });

    expect(result.current.editingPalette?.title).toBe("Paleta original");

    act(() => {
      result.current.handleUpdatePalette({
        title: "Paleta atualizada",
        colorsText: "#ffffff, #123abc, #ff0000",
        groupIds: [],
        tagIds: [],
      });
    });

    const updatedPalette = result.current.palettes[0];
    expect(updatedPalette.title).toBe("Paleta atualizada");
    expect(updatedPalette.colors.map((c) => c.hex)).toEqual(["#FFFFFF", "#123ABC", "#FF0000"]);
    expect(result.current.editingPalette).toBeUndefined();
  });
});
