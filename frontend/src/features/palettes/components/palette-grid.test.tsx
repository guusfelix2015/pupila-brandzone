import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Group, PaletteItem, Tag } from "@/core/types/domain";
import { PaletteGrid } from "@/features/palettes/components/palette-grid";

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

describe("PaletteGrid", () => {
  it("renders an empty state without filters", () => {
    render(
      <PaletteGrid
        palettes={[]}
        hasFilters={false}
        groups={groups}
        tags={tags}
        onOpenComments={jest.fn()}
        onEditPalette={jest.fn()}
        onDeletePalette={jest.fn()}
      />,
    );

    expect(screen.getByText("Nenhuma paleta cadastrada")).toBeInTheDocument();
  });

  it("renders an empty state for filtered results", () => {
    render(
      <PaletteGrid
        palettes={[]}
        hasFilters
        groups={groups}
        tags={tags}
        onOpenComments={jest.fn()}
        onEditPalette={jest.fn()}
        onDeletePalette={jest.fn()}
      />,
    );

    expect(screen.getByText("Nenhuma paleta encontrada")).toBeInTheDocument();
  });

  it("renders palette cards and calls callbacks", async () => {
    const user = userEvent.setup();
    const handleOpenComments = jest.fn();
    const handleEditPalette = jest.fn();
    const handleDeletePalette = jest.fn();

    render(
      <PaletteGrid
        palettes={[palette]}
        hasFilters={false}
        groups={groups}
        tags={tags}
        onOpenComments={handleOpenComments}
        onEditPalette={handleEditPalette}
        onDeletePalette={handleDeletePalette}
      />,
    );

    expect(screen.getByText("Paleta institucional")).toBeInTheDocument();
    expect(screen.getByText("#FFFFFF")).toBeInTheDocument();
    expect(screen.getByText("#123ABC")).toBeInTheDocument();
    expect(screen.getByText("Grupo: Branding")).toBeInTheDocument();
    expect(screen.getByText("Tag: Minimalista")).toBeInTheDocument();
    expect(screen.getByText("1 comentário")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Comentários" }));
    await user.click(screen.getByRole("button", { name: "Editar paleta" }));
    await user.click(screen.getByRole("button", { name: "Excluir paleta" }));

    expect(handleOpenComments).toHaveBeenCalledWith(palette);
    expect(handleEditPalette).toHaveBeenCalledWith(palette);
    expect(handleDeletePalette).toHaveBeenCalledWith("palette-1");
  });
});
