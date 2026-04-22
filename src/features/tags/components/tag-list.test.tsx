import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Tag } from "@/core/types/domain";
import type { EntityCounts } from "@/lib/utils/entity-counts";
import { TagList } from "@/features/tags/components/tag-list";

const tags: Tag[] = [
  { id: "tag-1", name: "Minimalista" },
  { id: "tag-2", name: "Editorial" },
];

const tagCounts = new Map<string, EntityCounts>([
  ["tag-1", { images: 2, palettes: 1, total: 3 }],
  ["tag-2", { images: 0, palettes: 0, total: 0 }],
]);

describe("TagList", () => {
  it("renders an empty state", () => {
    render(<TagList tags={[]} tagCounts={new Map()} onEditTag={jest.fn()} onDeleteTag={jest.fn()} />);

    expect(screen.getByText("Nenhuma tag cadastrada")).toBeInTheDocument();
  });

  it("renders tags and calls edit/delete callbacks", async () => {
    const user = userEvent.setup();
    const handleEditTag = jest.fn();
    const handleDeleteTag = jest.fn();

    render(<TagList tags={tags} tagCounts={tagCounts} onEditTag={handleEditTag} onDeleteTag={handleDeleteTag} />);

    expect(screen.getByText("Minimalista")).toBeInTheDocument();
    expect(screen.getByText("Editorial")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Editar Minimalista" }));
    await user.click(screen.getByRole("button", { name: "Excluir Editorial" }));

    expect(handleEditTag).toHaveBeenCalledWith(tags[0]);
    expect(handleDeleteTag).toHaveBeenCalledWith("tag-2");
  });
});
