import type { ImageItem } from "@/core/types/domain";
import { filterItemsByGroupAndTag } from "@/lib/filters/filter-items";

const items: ImageItem[] = [
  {
    id: "image-1",
    title: "Imagem 1",
    imageUrl: "https://example.com/image-1.png",
    groupIds: ["group-1"],
    tagIds: ["tag-1", "tag-2"],
    comments: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "image-2",
    title: "Imagem 2",
    imageUrl: "https://example.com/image-2.png",
    groupIds: ["group-2"],
    tagIds: ["tag-2"],
    comments: [],
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("filterItemsByGroupAndTag", () => {
  it("returns all items without active group or tag filters", () => {
    expect(filterItemsByGroupAndTag(items, { query: "" })).toEqual(items);
  });

  it("filters by group", () => {
    expect(filterItemsByGroupAndTag(items, { query: "", groupId: "group-1" })).toEqual([items[0]]);
  });

  it("filters by tag", () => {
    expect(filterItemsByGroupAndTag(items, { query: "", tagId: "tag-1" })).toEqual([items[0]]);
  });

  it("combines group and tag filters", () => {
    expect(filterItemsByGroupAndTag(items, { query: "", groupId: "group-2", tagId: "tag-1" })).toEqual([]);
  });
});
