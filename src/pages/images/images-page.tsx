import { useImagesPageController } from "@/features/images/hooks/use-images-page-controller";
import { ImagesPageView } from "@/features/images/views/images-page-view";

export function ImagesPage() {
  const imagesPageController = useImagesPageController();

  return <ImagesPageView imagesPageController={imagesPageController} />;
}
