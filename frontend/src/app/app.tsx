import { AppRoutes, isAppRoute, useHashRoute } from "@/app/routes/routes";
import { AppProviders } from "@/app/providers/app-providers";
import { AppShell } from "@/shared/components/layout/app-shell";

export function App() {
  const [route, navigate] = useHashRoute();

  return (
    <AppProviders>
      {isAppRoute(route) ? (
        <AppShell currentRoute={route} onNavigate={navigate}>
          <AppRoutes route={route} />
        </AppShell>
      ) : (
        <AppRoutes route={route} />
      )}
    </AppProviders>
  );
}
