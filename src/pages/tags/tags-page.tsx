import { useTagsPageController } from "@/features/tags/hooks/use-tags-page-controller";
import { TagsPageView } from "@/features/tags/views/tags-page-view";

export function TagsPage() {
  const tagsPageController = useTagsPageController();

  return <TagsPageView tagsPageController={tagsPageController} />;
}
