import { render, screen } from "@testing-library/react";
import type { Group, PaletteItem, Tag } from "@/core/types/domain";
import { PaletteList } from "@/features/palettes/components/palette-list";

const groups: Group[] = [{ id: "group-1", name: "Branding" }];
const tags: Tag[] = [{ id: "tag-1", name: "Minimalista" }];

const palette: PaletteItem = {
  id: "palette-1",
  title: "Paleta única",
  colors: [{ id: "color-1", hex: "#FFFFFF" }],
  groupIds: ["group-1"],
  tagIds: ["tag-1"],
  comments: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("PaletteList", () => {
  it("renders empty state", () => {
    render(
      <PaletteList
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

  it("renders singular color label and hex", () => {
    render(
      <PaletteList
        palettes={[palette]}
        hasFilters={false}
        groups={groups}
        tags={tags}
        onOpenComments={jest.fn()}
        onEditPalette={jest.fn()}
        onDeletePalette={jest.fn()}
      />,
    );

    expect(screen.getByText("1 cor")).toBeInTheDocument();
    expect(screen.getByText("#FFFFFF")).toBeInTheDocument();
  });
});
