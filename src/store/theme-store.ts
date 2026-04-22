import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

export type ThemeStore = {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
};

const STORAGE_KEY = "theme-storage";

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        applyThemeToDocument(next);
      },
      setTheme: (theme) => {
        set({ theme });
        applyThemeToDocument(theme);
      },
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDocument(state.theme);
        }
      },
    },
  ),
);

export function applyThemeToDocument(theme: ThemeMode): void {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function getInitialThemeFromStorage(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { theme?: ThemeMode } };
      return parsed.state?.theme === "dark" ? "dark" : "light";
    }
  } catch {
    // ignore parse errors
  }
  return "light";
}
