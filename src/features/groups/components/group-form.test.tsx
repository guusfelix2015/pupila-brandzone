import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GroupForm } from "@/features/groups/components/group-form";

describe("GroupForm", () => {
  it("submits trimmed group values", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockReturnValue(true);

    render(<GroupForm submitLabel="Criar grupo" onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Nome do grupo"), "  Branding  ");
    await user.click(screen.getByRole("button", { name: "Criar grupo" }));

    expect(handleSubmit).toHaveBeenCalledWith({ name: "Branding" });
  });

  it("shows a required field error", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockReturnValue(true);

    render(<GroupForm submitLabel="Criar grupo" onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: "Criar grupo" }));

    expect(await screen.findByText("Campo obrigatório.")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows a duplicated group error when submit returns false", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockReturnValue(false);

    render(<GroupForm submitLabel="Criar grupo" onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Nome do grupo"), "Branding");
    await user.click(screen.getByRole("button", { name: "Criar grupo" }));

    expect(await screen.findByText("Já existe um grupo com esse nome.")).toBeInTheDocument();
  });

  it("calls cancel when cancel button is available", async () => {
    const user = userEvent.setup();
    const handleCancel = jest.fn();

    render(<GroupForm submitLabel="Salvar grupo" onSubmit={() => true} onCancel={handleCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
