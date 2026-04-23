import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes, ROUTE, isAppRoute } from "@/app/routes/routes";
import { useAuthStore } from "@/store/auth-store";

jest.mock("@/pages/images/images-page", () => ({ ImagesPage: () => <div>images-page</div> }));
jest.mock("@/pages/palettes/palettes-page", () => ({ PalettesPage: () => <div>palettes-page</div> }));
jest.mock("@/pages/groups/groups-page", () => ({ GroupsPage: () => <div>groups-page</div> }));
jest.mock("@/pages/tags/tags-page", () => ({ TagsPage: () => <div>tags-page</div> }));
jest.mock("@/pages/auth/sign-in-page", () => ({ SignInPage: () => <div>signin-page</div> }));
jest.mock("@/pages/auth/sign-up-page", () => ({ SignUpPage: () => <div>signup-page</div> }));

describe("routes", () => {
  beforeEach(() => {
    useAuthStore.getState().resetState();
  });

  it("identifies app routes correctly", () => {
    expect(isAppRoute(ROUTE.IMAGES)).toBe(true);
    expect(isAppRoute(ROUTE.SIGNIN)).toBe(false);
  });

  it.each([
    ["/images", "images-page"],
    ["/palettes", "palettes-page"],
    ["/groups", "groups-page"],
    ["/tags", "tags-page"],
  ])("renders the expected page for protected route %s", (route, text) => {
    useAuthStore.setState({ currentUser: { name: "Test", email: "test@example.com" } });

    render(
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it.each([
    ["/signin", "signin-page"],
    ["/signup", "signup-page"],
  ])("renders the expected page for public route %s", (route, text) => {
    useAuthStore.setState({ currentUser: undefined });

    render(
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
