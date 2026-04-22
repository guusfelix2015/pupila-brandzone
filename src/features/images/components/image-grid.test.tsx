import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Group, ImageItem, Tag } from "@/core/types/domain";
import { ImageGrid } from "@/features/images/components/image-grid";

const groups: Group[] = [{ id: "group-1", name: "Branding" }];
const tags: Tag[] = [{ id: "tag-1", name: "Minimalista" }];
const image: ImageItem = {
  id: "image-1",
  title: "Referencia institucional",
  imageUrl: "https://example.com/image.png",
  groupIds: ["group-1"],
  tagIds: ["tag-1"],
  comments: [{ id: "comment-1", content: "Comentario", createdAt: "2026-01-01T00:00:00.000Z" }],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("ImageGrid", () => {
  it("renders an empty state without filters", () => {
    render(
      <ImageGrid
        images={[]}
        hasFilters={false}
        groups={groups}
        tags={tags}
        onOpenComments={jest.fn()}
        onEditImage={jest.fn()}
        onDeleteImage={jest.fn()}
      />,
    );

    expect(screen.getByText("Nenhuma imagem cadastrada")).toBeInTheDocument();
  });

  it("renders an empty state for filtered results", () => {
    render(
      <ImageGrid
        images={[]}
        hasFilters
        groups={groups}
        tags={tags}
        onOpenComments={jest.fn()}
        onEditImage={jest.fn()}
        onDeleteImage={jest.fn()}
      />,
    );

    expect(screen.getByText("Nenhuma imagem encontrada")).toBeInTheDocument();
  });

  it("renders image cards and calls callbacks", async () => {
    const user = userEvent.setup();
    const handleOpenComments = jest.fn();
    const handleEditImage = jest.fn();
    const handleDeleteImage = jest.fn();

    render(
      <ImageGrid
        images={[image]}
        hasFilters={false}
        groups={groups}
        tags={tags}
        onOpenComments={handleOpenComments}
        onEditImage={handleEditImage}
        onDeleteImage={handleDeleteImage}
      />,
    );

    expect(screen.getByRole("img", { name: "Referencia institucional" })).toHaveAttribute(
      "src",
      "https://example.com/image.png",
    );
    expect(screen.getByText("Grupo: Branding")).toBeInTheDocument();
    expect(screen.getByText("Tag: Minimalista")).toBeInTheDocument();
    expect(screen.getByText("1 comentario")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Comentarios" }));
    await user.click(screen.getByRole("button", { name: "Editar imagem" }));
    await user.click(screen.getByRole("button", { name: "Excluir imagem" }));

    expect(handleOpenComments).toHaveBeenCalledWith(image);
    expect(handleEditImage).toHaveBeenCalledWith(image);
    expect(handleDeleteImage).toHaveBeenCalledWith("image-1");
  });
});
