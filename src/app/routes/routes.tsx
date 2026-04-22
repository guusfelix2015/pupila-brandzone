import { useEffect, useState } from "react";
import { ImagesPage } from "@/pages/images/images-page";
import { PalettesPage } from "@/pages/palettes/palettes-page";
import { GroupsPage } from "@/pages/groups/groups-page";
import { TagsPage } from "@/pages/tags/tags-page";

export type AppRoute = "images" | "palettes" | "groups" | "tags";

const validRoutes: AppRoute[] = ["images", "palettes", "groups", "tags"];

export type RouteDefinition = {
  id: AppRoute;
  label: string;
};

export const routeDefinitions: RouteDefinition[] = [
  { id: "images", label: "Imagens" },
  { id: "palettes", label: "Paletas" },
  { id: "groups", label: "Grupos" },
  { id: "tags", label: "Tags" },
];

function parseRouteFromHash(): AppRoute {
  const hashRoute = window.location.hash.replace("#/", "");
  return validRoutes.includes(hashRoute as AppRoute) ? (hashRoute as AppRoute) : "images";
}

export function useHashRoute(): [AppRoute, (route: AppRoute) => void] {
  const [route, setRoute] = useState<AppRoute>(() => parseRouteFromHash());

  useEffect(() => {
    function handleHashChange(): void {
      setRoute(parseRouteFromHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function navigate(nextRoute: AppRoute): void {
    window.location.hash = `/${nextRoute}`;
    setRoute(nextRoute);
  }

  return [route, navigate];
}

export function AppRoutes({ route }: { route: AppRoute }) {
  if (route === "palettes") {
    return <PalettesPage />;
  }

  if (route === "groups") {
    return <GroupsPage />;
  }

  if (route === "tags") {
    return <TagsPage />;
  }

  return <ImagesPage />;
}
