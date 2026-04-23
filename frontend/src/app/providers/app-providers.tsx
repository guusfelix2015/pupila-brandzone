import type { ReactNode } from "react";
import { AppToaster } from "@/shared/components/feedback/app-toaster";
import { applyDarkThemeToDocument } from "@/store/theme-store";

export type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  applyDarkThemeToDocument();

  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}
