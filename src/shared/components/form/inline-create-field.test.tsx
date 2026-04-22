import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InlineCreateField } from "@/shared/components/form/inline-create-field";

describe("InlineCreateField", () => {
  it("renders a create button initially", () => {
    render(<InlineCreateField label="Novo item" placeholder="Digite..." onCreate={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Novo item" })).toBeInTheDocument();
  });

  it("expands to input mode when clicked", async () => {
    const user = userEvent.setup();
    render(<InlineCreateField label="Novo item" placeholder="Digite..." onCreate={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: "Novo item" }));

    expect(screen.getByPlaceholderText("Digite...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument();
  });

  it("calls onCreate with the typed value and collapses on success", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn(() => true);

    render(<InlineCreateField label="Novo item" placeholder="Digite..." onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Novo item" }));
    await user.type(screen.getByPlaceholderText("Digite..."), "Novo grupo");
    await user.click(screen.getByRole("button", { name: "Criar" }));

    expect(onCreate).toHaveBeenCalledWith("Novo grupo");
    expect(screen.getByRole("button", { name: "Novo item" })).toBeInTheDocument();
  });

  it("shows an error when onCreate returns false", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn(() => false);

    render(<InlineCreateField label="Novo item" placeholder="Digite..." onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Novo item" }));
    await user.type(screen.getByPlaceholderText("Digite..."), "Duplicado");
    await user.click(screen.getByRole("button", { name: "Criar" }));

    expect(screen.getByText("Ja existe um item com esse nome.")).toBeInTheDocument();
  });

  it("shows an error when trying to create with empty value", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn();

    render(<InlineCreateField label="Novo item" placeholder="Digite..." onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Novo item" }));
    await user.click(screen.getByRole("button", { name: "Criar" }));

    expect(screen.getByText("Nome obrigatorio.")).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("cancels and collapses when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(<InlineCreateField label="Novo item" placeholder="Digite..." onCreate={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: "Novo item" }));
    await user.type(screen.getByPlaceholderText("Digite..."), "Algum texto");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByRole("button", { name: "Novo item" })).toBeInTheDocument();
  });

  it("submits on Enter key", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn(() => true);

    render(<InlineCreateField label="Novo item" placeholder="Digite..." onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Novo item" }));
    await user.type(screen.getByPlaceholderText("Digite..."), "Item novo");
    await user.keyboard("{Enter}");

    expect(onCreate).toHaveBeenCalledWith("Item novo");
  });

  it("cancels on Escape key", async () => {
    const user = userEvent.setup();

    render(<InlineCreateField label="Novo item" placeholder="Digite..." onCreate={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: "Novo item" }));
    await user.type(screen.getByPlaceholderText("Digite..."), "Texto");
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Novo item" })).toBeInTheDocument();
  });
});
