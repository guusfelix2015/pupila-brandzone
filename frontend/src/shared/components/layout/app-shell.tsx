import type { ReactNode } from "react";
import type { AppRoute, Route } from "@/app/routes/routes";
import { routeDefinitions, ROUTE } from "@/app/routes/routes";
import { cn } from "@/lib/utils/cn";
import { getInitialsFromContent } from "@/lib/utils/text";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export type AppShellProps = {
  currentRoute: AppRoute;
  onNavigate: (route: Route) => void;
  children: ReactNode;
};

export function AppShell({ currentRoute, onNavigate, children }: AppShellProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-40 px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[15px] border border-foreground/10 bg-black/20 px-5 py-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <p className="font-display text-xl uppercase leading-none text-foreground sm:text-2xl">
              Pupila Brand Zone
            </p>
            <p className="text-xs uppercase tracking-[0.12em] text-foreground/70">
              Arquivo visual local para imagens, paletas e contexto
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex flex-wrap gap-2" aria-label="Navegação principal">
              {routeDefinitions.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  className={cn(
                    "rounded-[10px] border px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors",
                    currentRoute === route.id
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-transparent text-foreground/72 hover:border-foreground/10 hover:bg-foreground/10 hover:text-foreground",
                  )}
                  onClick={() => onNavigate(route.id)}
                >
                  {route.label}
                </button>
              ))}
            </nav>
            {currentUser ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Abrir menu do usuário"
                  >
                    <Avatar className="h-10 w-10 ring-1 ring-white/10">
                      <AvatarFallback>
                        {currentUser.name ? getInitialsFromContent(currentUser.name) : currentUser.email[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="grid gap-4">
                  <div className="grid gap-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/58">Sessão ativa</p>
                    <p className="text-sm font-medium text-foreground">{currentUser.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut();
                      toast.success("Sessão encerrada.", {
                        description: "Você saiu do Brand Zone.",
                      });
                      onNavigate(ROUTE.SIGNIN);
                    }}
                  >
                    Sair
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={() => onNavigate(ROUTE.SIGNIN)}>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">{children}</main>
    </div>
  );
}
