import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ROUTE } from "@/app/routes/routes";
import { AuthCard } from "@/features/auth/components/auth-card";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("AuthCard", () => {
  it("validates sign in fields", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    renderWithRouter(
      <AuthCard
        title="Entrar"
        description="Descricao"
        submitLabel="Entrar"
        switchText="Ainda não tem conta?"
        switchLabel="Criar conta"
        switchRoute={ROUTE.SIGNUP}
        onSubmit={handleSubmit}
      />,
    );

    await user.type(screen.getByLabelText("Email"), "invalido");
    await user.type(screen.getByLabelText("Senha"), "123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Informe um email válido.")).toBeInTheDocument();
    expect(await screen.findByText("A senha deve ter pelo menos 6 caracteres.")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("renders name field and calls submit in sign up mode", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    renderWithRouter(
      <AuthCard
        title="Criar conta"
        description="Descricao"
        submitLabel="Criar conta"
        switchText="Já tem conta?"
        switchLabel="Entrar"
        switchRoute={ROUTE.SIGNIN}
        showNameField
        onSubmit={handleSubmit}
      />,
    );

    await user.type(screen.getByLabelText("Nome"), "Gustavo");
    await user.type(screen.getByLabelText("Email"), "gustavo@example.com");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Gustavo",
      email: "gustavo@example.com",
      password: "123456",
    });
  });

  it("renders submit error when provided", () => {
    renderWithRouter(
      <AuthCard
        title="Entrar"
        description="Descricao"
        submitLabel="Entrar"
        switchText="Ainda não tem conta?"
        switchLabel="Criar conta"
        switchRoute={ROUTE.SIGNUP}
        submitError="Email ou senha inválidos."
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByText("Email ou senha inválidos.")).toBeInTheDocument();
  });
});
