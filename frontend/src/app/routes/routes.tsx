import { useEffect, useState } from "react";
import { ImagesPage } from "@/pages/images/images-page";
import { PalettesPage } from "@/pages/palettes/palettes-page";
import { GroupsPage } from "@/pages/groups/groups-page";
import { TagsPage } from "@/pages/tags/tags-page";
import { SignInPage } from "@/pages/auth/sign-in-page";
import { SignUpPage } from "@/pages/auth/sign-up-page";

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

function parseRouteFromHash(): Route {
  const hashRoute = window.location.hash.replace("#/", "");
  if (validRoutes.includes(hashRoute as AppRoute) || validAuthRoutes.includes(hashRoute as AuthRoute)) {
    return hashRoute as Route;
  }

  return ROUTE.IMAGES;
}

export function isAppRoute(route: Route): route is AppRoute {
  return validRoutes.includes(route as AppRoute);
}

export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseRouteFromHash());

  useEffect(() => {
    function handleHashChange(): void {
      setRoute(parseRouteFromHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function navigate(nextRoute: Route): void {
    window.location.hash = `/${nextRoute}`;
    setRoute(nextRoute);
  }

  return [route, navigate];
}

export function AppRoutes({ route }: { route: Route }) {
  if (route === ROUTE.SIGNIN) {
    return <SignInPage />;
  }

  if (route === ROUTE.SIGNUP) {
    return <SignUpPage />;
  }

  if (route === ROUTE.PALETTES) {
    return <PalettesPage />;
  }

  if (route === ROUTE.GROUPS) {
    return <GroupsPage />;
  }

  if (route === ROUTE.TAGS) {
    return <TagsPage />;
  }

  return <ImagesPage />;
}
