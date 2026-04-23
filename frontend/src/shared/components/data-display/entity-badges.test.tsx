import { render, screen } from "@testing-library/react";
import type { Group, Tag } from "@/core/types/domain";
import { EntityBadges } from "@/shared/components/data-display/entity-badges";

const groups: Group[] = [
  { id: "group-1", name: "Branding" },
  { id: "group-2", name: "Editorial" },
];
const tags: Tag[] = [
  { id: "tag-1", name: "Minimalista" },
  { id: "tag-2", name: "Colorido" },
];

describe("EntityBadges", () => {
  it("renders empty fallback", () => {
    render(<EntityBadges groupIds={[]} tagIds={[]} groups={groups} tags={tags} />);

    expect(screen.getByText("Sem grupos ou tags.")).toBeInTheDocument();
  });

  it("renders visible groups and tags", () => {
    render(<EntityBadges groupIds={["group-1"]} tagIds={["tag-1"]} groups={groups} tags={tags} />);

    expect(screen.getByText("Grupo: Branding")).toBeInTheDocument();
    expect(screen.getByText("Tag: Minimalista")).toBeInTheDocument();
  });

  it("renders overflow badge when items exceed limit", () => {
    render(
      <EntityBadges
        groupIds={["group-1", "group-2"]}
        tagIds={["tag-1", "tag-2"]}
        groups={groups}
        tags={tags}
        limit={2}
      />,
    );

    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByText("Grupos e tags")).toBeInTheDocument();
    expect(screen.getByText("Grupo: Editorial")).toBeInTheDocument();
    expect(screen.getByText("T: Minimalista")).toBeInTheDocument();
    expect(screen.getByText("T: Colorido")).toBeInTheDocument();
  });
});
