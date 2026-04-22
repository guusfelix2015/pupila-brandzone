import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Group, Tag } from "@/core/types/domain";
import { ImageForm } from "@/features/images/components/image-form";

const groups: Group[] = [{ id: "group-1", name: "Branding" }];
const tags: Tag[] = [{ id: "tag-1", name: "Minimalista" }];

describe("ImageForm", () => {
  it("submits image values with selected groups and tags", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<ImageForm groups={groups} tags={tags} onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Titulo"), "Referencia institucional");
    await user.type(screen.getByLabelText("URL da imagem"), "https://example.com/image.png");
    await user.click(screen.getByLabelText("Branding"));
    await user.click(screen.getByLabelText("Minimalista"));
    await user.click(screen.getByRole("button", { name: "Salvar imagem" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "Referencia institucional",
      imageUrl: "https://example.com/image.png",
      groupIds: ["group-1"],
      tagIds: ["tag-1"],
    });
  });

  it("shows validation errors for required title and invalid URL", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<ImageForm groups={groups} tags={tags} onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("URL da imagem"), "not-a-url");
    await user.click(screen.getByRole("button", { name: "Salvar imagem" }));

    expect(await screen.findByText("Campo obrigatorio.")).toBeInTheDocument();
    expect(await screen.findByText("Informe uma URL valida.")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("renders empty association messages", () => {
    render(<ImageForm groups={[]} tags={[]} onSubmit={jest.fn()} />);

    expect(screen.getByText("Crie grupos antes de associar.")).toBeInTheDocument();
    expect(screen.getByText("Crie tags antes de associar.")).toBeInTheDocument();
  });
});
