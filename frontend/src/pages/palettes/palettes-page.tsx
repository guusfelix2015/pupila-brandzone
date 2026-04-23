import { usePalettesPageController } from "@/features/palettes/hooks/use-palettes-page-controller";
import { PalettesPageView } from "@/features/palettes/views/palettes-page-view";

export function PalettesPage() {
  const palettesPageController = usePalettesPageController();

  return <PalettesPageView palettesPageController={palettesPageController} />;
}
