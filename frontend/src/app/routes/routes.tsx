import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ImagesPage } from "@/pages/images/images-page";
import { PalettesPage } from "@/pages/palettes/palettes-page";
import { GroupsPage } from "@/pages/groups/groups-page";
import { TagsPage } from "@/pages/tags/tags-page";
import { SignInPage } from "@/pages/auth/sign-in-page";
import { SignUpPage } from "@/pages/auth/sign-up-page";
import { AppShell } from "@/shared/components/layout/app-shell";
import { useAuthStore } from "@/store/auth-store";

export const ROUTE = {
  IMAGES: "images",
  PALETTES: "palettes",
  GROUPS: "groups",
  TAGS: "tags",
  SIGNIN: "signin",
  SIGNUP: "signup",
} as const;

export type AppRoute =
  | (typeof ROUTE.IMAGES)
  | (typeof ROUTE.PALETTES)
  | (typeof ROUTE.GROUPS)
  | (typeof ROUTE.TAGS);
export type AuthRoute = (typeof ROUTE.SIGNIN) | (typeof ROUTE.SIGNUP);
export type Route = AppRoute | AuthRoute;

const validRoutes: AppRoute[] = [ROUTE.IMAGES, ROUTE.PALETTES, ROUTE.GROUPS, ROUTE.TAGS];
const validAuthRoutes: AuthRoute[] = [ROUTE.SIGNIN, ROUTE.SIGNUP];

export type RouteDefinition = {
  id: AppRoute;
  label: string;
};

export const routeDefinitions: RouteDefinition[] = [
  { id: ROUTE.IMAGES, label: "Imagens" },
  { id: ROUTE.PALETTES, label: "Paletas" },
  { id: ROUTE.GROUPS, label: "Grupos" },
  { id: ROUTE.TAGS, label: "Tags" },
];

export function isAppRoute(route: Route): route is AppRoute {
  return validRoutes.includes(route as AppRoute);
}

export function isAuthRoute(route: Route): route is AuthRoute {
  return validAuthRoutes.includes(route as AuthRoute);
}

export function ProtectedRoute() {
  const currentUser = useAuthStore((state) => state.currentUser);
  return currentUser ? <Outlet /> : <Navigate to={`/${ROUTE.SIGNIN}`} replace />;
}

export function PublicOnlyRoute() {
  const currentUser = useAuthStore((state) => state.currentUser);
  return !currentUser ? <Outlet /> : <Navigate to={`/${ROUTE.IMAGES}`} replace />;
}

export function AppShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path={`/${ROUTE.SIGNIN}`} element={<SignInPage />} />
        <Route path={`/${ROUTE.SIGNUP}`} element={<SignUpPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShellLayout />}>
          <Route path={`/${ROUTE.IMAGES}`} element={<ImagesPage />} />
          <Route path={`/${ROUTE.PALETTES}`} element={<PalettesPage />} />
          <Route path={`/${ROUTE.GROUPS}`} element={<GroupsPage />} />
          <Route path={`/${ROUTE.TAGS}`} element={<TagsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to={`/${ROUTE.IMAGES}`} replace />} />
      <Route path="*" element={<Navigate to={`/${ROUTE.IMAGES}`} replace />} />
    </Routes>
  );
}
