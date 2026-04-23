import type { Filters, VisualItem } from "@/core/types/domain";

export function filterItemsByGroupAndTag<TItem extends VisualItem>(items: TItem[], filters: Filters): TItem[] {
  return items.filter((item) => {
    const matchesGroup = filters.groupId ? item.groupIds.includes(filters.groupId) : true;
    const matchesTag = filters.tagId ? item.tagIds.includes(filters.tagId) : true;

    return matchesGroup && matchesTag;
  });
}
