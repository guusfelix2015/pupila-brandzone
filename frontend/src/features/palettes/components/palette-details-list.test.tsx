import { render, screen } from "@testing-library/react";
import type { Group, PaletteItem, Tag } from "@/core/types/domain";
import { PaletteDetailsList } from "@/features/palettes/components/palette-details-list";

const groups: Group[] = [{ id: "group-1", name: "Branding" }];
const tags: Tag[] = [{ id: "tag-1", name: "Minimalista" }];

const palette: PaletteItem = {
  id: "palette-1",
  title: "Paleta detalhada",
  colors: [{ id: "color-1", hex: "#FFFFFF" }],
  groupIds: ["group-1"],
  tagIds: ["tag-1"],
  comments: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("PaletteDetailsList", () => {
  it("renders empty state", () => {
    render(
      <PaletteDetailsList
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

  it("renders singular details labels", () => {
    render(
      <PaletteDetailsList
        palettes={[palette]}
        hasFilters={false}
        groups={groups}
        tags={tags}
        onOpenComments={jest.fn()}
        onEditPalette={jest.fn()}
        onDeletePalette={jest.fn()}
      />,
    );

    expect(screen.getByText("1 cor cadastrada")).toBeInTheDocument();
    expect(screen.getByText("0 comentários")).toBeInTheDocument();
  });
});
