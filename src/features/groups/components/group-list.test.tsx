import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Group } from "@/core/types/domain";
import type { EntityCounts } from "@/lib/utils/entity-counts";
import { GroupList } from "@/features/groups/components/group-list";

const groups: Group[] = [
  { id: "group-1", name: "Branding" },
  { id: "group-2", name: "Campanha" },
];

const groupCounts = new Map<string, EntityCounts>([
  ["group-1", { images: 3, palettes: 1, total: 4 }],
  ["group-2", { images: 0, palettes: 0, total: 0 }],
]);

describe("GroupList", () => {
  it("renders an empty state", () => {
    render(<GroupList groups={[]} groupCounts={new Map()} onEditGroup={jest.fn()} onDeleteGroup={jest.fn()} />);

    expect(screen.getByText("Nenhum grupo cadastrado")).toBeInTheDocument();
  });

  it("renders groups and calls edit/delete callbacks", async () => {
    const user = userEvent.setup();
    const handleEditGroup = jest.fn();
    const handleDeleteGroup = jest.fn();

    render(
      <GroupList
        groups={groups}
        groupCounts={groupCounts}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
      />,
    );

    expect(screen.getByText("Branding")).toBeInTheDocument();
    expect(screen.getByText("Campanha")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Editar Branding" }));
    await user.click(screen.getByRole("button", { name: "Excluir Campanha" }));

    expect(handleEditGroup).toHaveBeenCalledWith(groups[0]);
    expect(handleDeleteGroup).toHaveBeenCalledWith("group-2");
  });
});
