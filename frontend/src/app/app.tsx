import { useEffect } from "react";
import { AppRoutes, isAppRoute, ROUTE, useHashRoute } from "@/app/routes/routes";
import { AppProviders } from "@/app/providers/app-providers";
import { AppShell } from "@/shared/components/layout/app-shell";
import { useAuthStore } from "@/store/auth-store";

export function App() {
  const [route, navigate] = useHashRoute();
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    if (isAppRoute(route) && !currentUser) {
      navigate(ROUTE.SIGNIN);
      return;
    }

    if (!isAppRoute(route) && currentUser) {
      navigate(ROUTE.IMAGES);
    }
  }, [currentUser, navigate, route]);

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
