import { AppRoutes } from "@/app/routes/routes";
import { AppProviders } from "@/app/providers/app-providers";

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
