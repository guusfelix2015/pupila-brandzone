import { applyDarkThemeToDocument } from "@/store/theme-store";

describe("theme-store", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("should force dark theme on the document", () => {
    applyDarkThemeToDocument();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
