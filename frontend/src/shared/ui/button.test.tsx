import { render, screen } from "@testing-library/react";
import { Button } from "@/shared/ui/button";

describe("Button", () => {
  it("renders as a native button by default", () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("renders as child slot when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/teste">Ir</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Ir" })).toBeInTheDocument();
  });
});
