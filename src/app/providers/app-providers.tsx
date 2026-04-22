import { useEffect } from "react";
import type { ReactNode } from "react";
import { applyThemeToDocument, useThemeStore } from "@/store/theme-store";

export type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return <>{children}</>;
}
