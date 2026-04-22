import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Group, Tag } from "@/core/types/domain";
import { PaletteForm } from "@/features/palettes/components/palette-form";

const groups: Group[] = [{ id: "group-1", name: "Branding" }];
const tags: Tag[] = [{ id: "tag-1", name: "Minimalista" }];

describe("PaletteForm", () => {
  it("submits palette values with selected groups and tags", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<PaletteForm groups={groups} tags={tags} onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Titulo"), "Paleta institucional");
    await user.type(screen.getByLabelText("Cores HEX"), "#ffffff, #123abc");
    await user.click(screen.getByLabelText("Branding"));
    await user.click(screen.getByLabelText("Minimalista"));
    await user.click(screen.getByRole("button", { name: "Salvar paleta" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "Paleta institucional",
      colorsText: "#ffffff, #123abc",
      groupIds: ["group-1"],
      tagIds: ["tag-1"],
    });
  });

  it("shows validation errors for required title and invalid colors", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<PaletteForm groups={groups} tags={tags} onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Cores HEX"), "azul");
    await user.click(screen.getByRole("button", { name: "Salvar paleta" }));

    expect(await screen.findByText("Campo obrigatorio.")).toBeInTheDocument();
    expect(await screen.findByText("Use cores HEX validas.")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("renders empty association messages", () => {
    render(<PaletteForm groups={[]} tags={[]} onSubmit={jest.fn()} />);

    expect(screen.getByText("Crie grupos antes de associar.")).toBeInTheDocument();
    expect(screen.getByText("Crie tags antes de associar.")).toBeInTheDocument();
  });
});
