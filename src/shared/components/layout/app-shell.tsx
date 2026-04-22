import type { ReactNode } from "react";
import type { AppRoute } from "@/app/routes/routes";
import { routeDefinitions } from "@/app/routes/routes";
import { cn } from "@/lib/utils/cn";
import { useThemeStore } from "@/store/theme-store";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";

export type AppShellProps = {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  children: ReactNode;
};

export function AppShell({ currentRoute, onNavigate, children }: AppShellProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen text-foreground">
      <header className="border-b bg-card/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <p className="w-fit rounded-md bg-secondary px-2.5 py-1 text-xs font-black uppercase tracking-[0.16em] text-secondary-foreground">
              Pupila Brand Zone
            </p>
            <p className="text-sm text-muted-foreground">Arquivo visual local para imagens, paletas e contexto.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex flex-wrap gap-2" aria-label="Navegação principal">
              {routeDefinitions.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
                    currentRoute === route.id
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-transparent text-muted-foreground hover:border-primary/30 hover:bg-muted hover:text-primary",
                  )}
                  onClick={() => onNavigate(route.id)}
                >
                  {route.label}
                </button>
              ))}
            </nav>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              title={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">{children}</main>
    </div>
  );
}
