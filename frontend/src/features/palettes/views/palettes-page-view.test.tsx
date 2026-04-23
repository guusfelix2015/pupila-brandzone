import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Group, PaletteItem, Tag } from "@/core/types/domain";
import type { PalettesPageController } from "@/features/palettes/hooks/use-palettes-page-controller";
import { PALETTE_VIEW_MODE, type PaletteViewMode } from "@/features/palettes/types/palette-view-mode";
import { PalettesPageView } from "@/features/palettes/views/palettes-page-view";

const groups: Group[] = [{ id: "group-1", name: "Branding" }];
const tags: Tag[] = [{ id: "tag-1", name: "Minimalista" }];
const palette: PaletteItem = {
  id: "palette-1",
  title: "Paleta institucional",
  colors: [
    { id: "color-1", hex: "#FFFFFF" },
    { id: "color-2", hex: "#123ABC" },
  ],
  groupIds: ["group-1"],
  tagIds: ["tag-1"],
  comments: [{ id: "comment-1", content: "Comentário", createdAt: "2026-01-01T00:00:00.000Z" }],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function createController(
  viewMode: PaletteViewMode,
  handleViewModeChange: (viewMode: PaletteViewMode) => void,
): PalettesPageController {
  return {
    palettes: [palette],
    groups,
    tags,
    filters: { query: "" },
    isCreateDialogOpen: false,
    editingPalette: undefined,
    selectedPalette: undefined,
    deletingPalette: undefined,
    editingComment: undefined,
    hasFilters: false,
    viewMode,
    setCreateDialogOpen: jest.fn(),
    handleViewModeChange,
    handleCreatePalette: jest.fn(),
    handleOpenEditPalette: jest.fn(),
    handleCloseEditPalette: jest.fn(),
    handleUpdatePalette: jest.fn(),
    handleRequestDeletePalette: jest.fn(),
    handleCancelDeletePalette: jest.fn(),
    handleConfirmDeletePalette: jest.fn(),
    handleOpenComments: jest.fn(),
    handleCloseComments: jest.fn(),
    handleEditComment: jest.fn(),
    handleCancelEditComment: jest.fn(),
    handleSubmitComment: jest.fn(),
    handleQueryChange: jest.fn(),
    handleGroupFilterChange: jest.fn(),
    handleTagFilterChange: jest.fn(),
    handleClearFilters: jest.fn(),
  };
}

function PalettesViewTestHarness() {
  const [viewMode, setViewMode] = useState<PaletteViewMode>(PALETTE_VIEW_MODE.GRID);
  return <PalettesPageView palettesPageController={createController(viewMode, setViewMode)} />;
}

describe("PalettesPageView", () => {
  it("renders view mode controls and starts in grid mode", () => {
    render(<PalettesViewTestHarness />);

    expect(screen.getByRole("button", { name: /Grade/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Lista/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /Detalhes/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Comentários" })).toBeInTheDocument();
  });

  it("renders list mode when selected", async () => {
    const user = userEvent.setup();
    render(<PalettesViewTestHarness />);

    await user.click(screen.getByRole("button", { name: /Lista/i }));

    expect(screen.getByRole("button", { name: /Lista/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("2 cores")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Comentários de Paleta institucional" })).toBeInTheDocument();
  });

  it("renders details mode when selected", async () => {
    const user = userEvent.setup();
    render(<PalettesViewTestHarness />);

    await user.click(screen.getByRole("button", { name: /Detalhes/i }));

    expect(screen.getByRole("button", { name: /Detalhes/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("2 cores cadastradas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Comentários" })).toBeInTheDocument();
  });
});
