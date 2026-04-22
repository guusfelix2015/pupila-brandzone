import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteConfirmationDialog } from "@/shared/components/feedback/delete-confirmation-dialog";

describe("DeleteConfirmationDialog", () => {
  it("renders title and description when open", () => {
    render(
      <DeleteConfirmationDialog
        open
        title="Excluir grupo"
        description="Excluir este grupo?"
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(screen.getByText("Excluir grupo")).toBeInTheDocument();
    expect(screen.getByText("Excluir este grupo?")).toBeInTheDocument();
  });

  it("confirms deletion and closes the dialog", async () => {
    const user = userEvent.setup();
    const handleConfirm = jest.fn();
    const handleOpenChange = jest.fn();

    render(
      <DeleteConfirmationDialog
        open
        title="Excluir grupo"
        description="Excluir este grupo?"
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Excluir" }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("cancels deletion", async () => {
    const user = userEvent.setup();
    const handleConfirm = jest.fn();
    const handleOpenChange = jest.fn();

    render(
      <DeleteConfirmationDialog
        open
        title="Excluir grupo"
        description="Excluir este grupo?"
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(handleConfirm).not.toHaveBeenCalled();
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
