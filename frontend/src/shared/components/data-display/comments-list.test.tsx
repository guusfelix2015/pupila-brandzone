import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Comment } from "@/core/types/domain";
import { CommentsList } from "@/shared/components/data-display/comments-list";

const comments: Comment[] = [
  {
    id: "comment-1",
    content: "Comentário inicial",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("CommentsList", () => {
  it("renders empty state when there are no comments", () => {
    render(<CommentsList comments={[]} onEditComment={jest.fn()} />);

    expect(screen.getByText("Nenhum comentário")).toBeInTheDocument();
  });

  it("renders comments and allows editing", async () => {
    const user = userEvent.setup();
    const handleEditComment = jest.fn();

    render(<CommentsList comments={comments} onEditComment={handleEditComment} />);

    expect(screen.getByText("Comentário inicial")).toBeInTheDocument();
    expect(screen.getByText(/editado/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Editar comentario" }));

    expect(handleEditComment).toHaveBeenCalledWith(comments[0]);
  });
});
