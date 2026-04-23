import { render, screen } from "@testing-library/react";
import { AppRoutes, ROUTE, isAppRoute } from "@/app/routes/routes";

jest.mock("@/pages/images/images-page", () => ({ ImagesPage: () => <div>images-page</div> }));
jest.mock("@/pages/palettes/palettes-page", () => ({ PalettesPage: () => <div>palettes-page</div> }));
jest.mock("@/pages/groups/groups-page", () => ({ GroupsPage: () => <div>groups-page</div> }));
jest.mock("@/pages/tags/tags-page", () => ({ TagsPage: () => <div>tags-page</div> }));
jest.mock("@/pages/auth/sign-in-page", () => ({ SignInPage: () => <div>signin-page</div> }));
jest.mock("@/pages/auth/sign-up-page", () => ({ SignUpPage: () => <div>signup-page</div> }));

describe("routes", () => {
  it("identifies app routes correctly", () => {
    expect(isAppRoute(ROUTE.IMAGES)).toBe(true);
    expect(isAppRoute(ROUTE.SIGNIN)).toBe(false);
  });

  it.each([
    [ROUTE.IMAGES, "images-page"],
    [ROUTE.PALETTES, "palettes-page"],
    [ROUTE.GROUPS, "groups-page"],
    [ROUTE.TAGS, "tags-page"],
    [ROUTE.SIGNIN, "signin-page"],
    [ROUTE.SIGNUP, "signup-page"],
  ])("renders the expected page for route %s", (route, text) => {
    render(<AppRoutes route={route} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
