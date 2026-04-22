import type { Tag, VisualItem } from "@/core/types/domain";
import { normalizeText } from "@/lib/utils/text";

export function searchItemsByQuery<TItem extends VisualItem>(items: TItem[], tags: Tag[], query: string): TItem[] {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const tagNames = item.tagIds.map((tagId) => tags.find((tag) => tag.id === tagId)?.name ?? "").join(" ");
    const comments = item.comments.map((comment) => comment.content).join(" ");
    const searchableText = normalizeText(`${item.title} ${comments} ${tagNames}`);

    return searchableText.includes(normalizedQuery);
  });
}
