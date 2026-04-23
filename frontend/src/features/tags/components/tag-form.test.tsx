import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TagForm } from "@/features/tags/components/tag-form";

describe("TagForm", () => {
  it("submits trimmed tag values", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockReturnValue(true);

    render(<TagForm submitLabel="Criar tag" onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Nome da tag"), "  Minimalista  ");
    await user.click(screen.getByRole("button", { name: "Criar tag" }));

    expect(handleSubmit).toHaveBeenCalledWith({ name: "Minimalista" });
  });

  it("shows a required field error", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockReturnValue(true);

    render(<TagForm submitLabel="Criar tag" onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: "Criar tag" }));

    expect(await screen.findByText("Campo obrigatório.")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows a duplicated tag error when submit returns false", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockReturnValue(false);

    render(<TagForm submitLabel="Criar tag" onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Nome da tag"), "Minimalista");
    await user.click(screen.getByRole("button", { name: "Criar tag" }));

    expect(await screen.findByText("Já existe uma tag com esse nome.")).toBeInTheDocument();
  });

  it("calls cancel when cancel button is available", async () => {
    const user = userEvent.setup();
    const handleCancel = jest.fn();

    render(<TagForm submitLabel="Salvar tag" onSubmit={() => true} onCancel={handleCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
