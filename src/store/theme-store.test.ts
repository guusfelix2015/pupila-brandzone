import { act, renderHook } from "@testing-library/react";
import { applyThemeToDocument, getInitialThemeFromStorage, useThemeStore } from "@/store/theme-store";

describe("theme-store", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    useThemeStore.setState({ theme: "light" });
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should default to light theme", () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should toggle theme", () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should set theme directly", () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should persist theme to localStorage", () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setTheme("dark");
    });

    const stored = JSON.parse(localStorage.getItem("theme-storage") ?? "{}");
    expect(stored.state.theme).toBe("dark");
  });
});

describe("applyThemeToDocument", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("should add dark class for dark theme", () => {
    applyThemeToDocument("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should remove dark class for light theme", () => {
    document.documentElement.classList.add("dark");
    applyThemeToDocument("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("getInitialThemeFromStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return light when localStorage is empty", () => {
    expect(getInitialThemeFromStorage()).toBe("light");
  });

  it("should return dark when stored theme is dark", () => {
    localStorage.setItem("theme-storage", JSON.stringify({ state: { theme: "dark" } }));
    expect(getInitialThemeFromStorage()).toBe("dark");
  });

  it("should return light when stored theme is light", () => {
    localStorage.setItem("theme-storage", JSON.stringify({ state: { theme: "light" } }));
    expect(getInitialThemeFromStorage()).toBe("light");
  });

  it("should return light when localStorage contains invalid JSON", () => {
    localStorage.setItem("theme-storage", "not-json");
    expect(getInitialThemeFromStorage()).toBe("light");
  });

  it("should return light when stored state has no theme field", () => {
    localStorage.setItem("theme-storage", JSON.stringify({ state: {} }));
    expect(getInitialThemeFromStorage()).toBe("light");
  });
});
