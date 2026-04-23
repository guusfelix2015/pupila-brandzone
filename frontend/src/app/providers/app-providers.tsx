import type { ReactNode } from "react";
import { applyDarkThemeToDocument } from "@/store/theme-store";

export type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  applyDarkThemeToDocument();

  return <>{children}</>;
}
