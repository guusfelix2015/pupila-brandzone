import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Filters, Group, Tag } from "@/core/types/domain";
import { FiltersToolbar } from "@/shared/components/form/filters-toolbar";

const groups: Group[] = [{ id: "group-1", name: "Branding" }];
const tags: Tag[] = [{ id: "tag-1", name: "Minimalista" }];

function renderFiltersToolbar(filters: Filters = { query: "" }) {
  return {
    onQueryChange: jest.fn(),
    onGroupChange: jest.fn(),
    onTagChange: jest.fn(),
    onClearFilters: jest.fn(),
    ...render(
      <FiltersToolbar
        filters={filters}
        groups={groups}
        tags={tags}
        onQueryChange={jest.fn()}
        onGroupChange={jest.fn()}
        onTagChange={jest.fn()}
        onClearFilters={jest.fn()}
      />,
    ),
  };
}

describe("FiltersToolbar", () => {
  it("renders search and filter controls", () => {
    renderFiltersToolbar();

    expect(screen.getByLabelText("Pesquisar")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar por grupo")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar por tag")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpar" })).toBeDisabled();
  });

  it("calls query, group and tag callbacks", async () => {
    const user = userEvent.setup();
    const onQueryChange = jest.fn();
    const onGroupChange = jest.fn();
    const onTagChange = jest.fn();

    render(
      <FiltersToolbar
        filters={{ query: "" }}
        groups={groups}
        tags={tags}
        onQueryChange={onQueryChange}
        onGroupChange={onGroupChange}
        onTagChange={onTagChange}
        onClearFilters={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Pesquisar"), { target: { value: "brand" } });
    await user.selectOptions(screen.getByLabelText("Filtrar por grupo"), "group-1");
    await user.selectOptions(screen.getByLabelText("Filtrar por tag"), "tag-1");

    expect(onQueryChange).toHaveBeenLastCalledWith("brand");
    expect(onGroupChange).toHaveBeenCalledWith("group-1");
    expect(onTagChange).toHaveBeenCalledWith("tag-1");
  });

  it("clears active filters", async () => {
    const user = userEvent.setup();
    const onClearFilters = jest.fn();

    render(
      <FiltersToolbar
        filters={{ query: "brand", groupId: "group-1", tagId: "tag-1" }}
        groups={groups}
        tags={tags}
        onQueryChange={jest.fn()}
        onGroupChange={jest.fn()}
        onTagChange={jest.fn()}
        onClearFilters={onClearFilters}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Limpar" }));

    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("maps empty select values to undefined filters", async () => {
    const user = userEvent.setup();
    const onGroupChange = jest.fn();
    const onTagChange = jest.fn();

    render(
      <FiltersToolbar
        filters={{ query: "", groupId: "group-1", tagId: "tag-1" }}
        groups={groups}
        tags={tags}
        onQueryChange={jest.fn()}
        onGroupChange={onGroupChange}
        onTagChange={onTagChange}
        onClearFilters={jest.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Filtrar por grupo"), "");
    await user.selectOptions(screen.getByLabelText("Filtrar por tag"), "");

    expect(onGroupChange).toHaveBeenCalledWith(undefined);
    expect(onTagChange).toHaveBeenCalledWith(undefined);
  });
});
