import { render, screen } from "@testing-library/react";
import { PageShell } from "@/shared/components/layout/page-shell";

describe("PageShell", () => {
  it("renders title, description and children without optional areas", () => {
    render(
      <PageShell title="Paletas" description="Descrição da tela">
        <div>Conteúdo</div>
      </PageShell>,
    );

    expect(screen.getByText("Paletas")).toBeInTheDocument();
    expect(screen.getByText("Descrição da tela")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("renders stats and action when provided", () => {
    render(
      <PageShell
        title="Imagens"
        description="Descrição"
        stats={<span>2 imagens</span>}
        action={<button type="button">Nova imagem</button>}
      >
        <div>Conteúdo</div>
      </PageShell>,
    );

    expect(screen.getByText("2 imagens")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova imagem" })).toBeInTheDocument();
  });
});
