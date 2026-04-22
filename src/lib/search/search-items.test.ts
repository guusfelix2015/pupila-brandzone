import type { ImageItem, Tag } from "@/core/types/domain";
import { searchItemsByQuery } from "@/lib/search/search-items";

const tags: Tag[] = [
  { id: "tag-1", name: "Minimalista" },
  { id: "tag-2", name: "Campanha" },
];

const items: ImageItem[] = [
  {
    id: "image-1",
    title: "Referencia institucional",
    imageUrl: "https://example.com/image-1.png",
    groupIds: ["group-1"],
    tagIds: ["tag-1"],
    comments: [{ id: "comment-1", content: "Usar no moodboard principal", createdAt: "2026-01-01T00:00:00.000Z" }],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "image-2",
    title: "Banner de evento",
    imageUrl: "https://example.com/image-2.png",
    groupIds: ["group-2"],
    tagIds: ["tag-2"],
    comments: [{ id: "comment-2", content: "Referencia para posts pagos", createdAt: "2026-01-02T00:00:00.000Z" }],
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("searchItemsByQuery", () => {
  it("returns all items when query is empty", () => {
    expect(searchItemsByQuery(items, tags, "   ")).toEqual(items);
  });

  it("searches by title", () => {
    expect(searchItemsByQuery(items, tags, "evento")).toEqual([items[1]]);
  });

  it("searches by comment", () => {
    expect(searchItemsByQuery(items, tags, "moodboard")).toEqual([items[0]]);
  });

  it("searches by tag name ignoring accents and case", () => {
    expect(searchItemsByQuery(items, tags, "MINIMALISTA")).toEqual([items[0]]);
  });
});
