import { APP_STORAGE_KEY } from "@/core/constants/storage";
import type { PersistedAppState } from "@/core/types/domain";

type AppStoreModule = typeof import("@/store/app-store");

async function loadFreshAppStore(): Promise<AppStoreModule["useAppStore"]> {
  jest.resetModules();
  const module = await import("@/store/app-store");

  return module.useAppStore;
}

describe("useAppStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("hydrates persisted collections from localStorage", async () => {
    const persistedState: PersistedAppState = {
      images: [],
      palettes: [],
      groups: [{ id: "group-1", name: "Branding" }],
      tags: [{ id: "tag-1", name: "Minimalista" }],
    };

    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(persistedState));

    const useAppStore = await loadFreshAppStore();

    expect(useAppStore.getState().groups).toEqual(persistedState.groups);
    expect(useAppStore.getState().tags).toEqual(persistedState.tags);
  });

  it("falls back to empty collections when persisted state is invalid", async () => {
    window.localStorage.setItem(APP_STORAGE_KEY, "{invalid-json");

    const useAppStore = await loadFreshAppStore();

    expect(useAppStore.getState().images).toEqual([]);
    expect(useAppStore.getState().palettes).toEqual([]);
    expect(useAppStore.getState().groups).toEqual([]);
    expect(useAppStore.getState().tags).toEqual([]);
  });

  it("creates and updates groups without allowing normalized duplicates", async () => {
    const useAppStore = await loadFreshAppStore();

    expect(useAppStore.getState().addGroup("Branding")).toBe(true);
    expect(useAppStore.getState().addGroup(" branding ")).toBe(false);

    const groupId = useAppStore.getState().groups[0].id;

    expect(useAppStore.getState().updateGroup(groupId, "Campanha")).toBe(true);
    expect(useAppStore.getState().groups[0].name).toBe("Campanha");
  });

  it("creates and updates tags without allowing normalized duplicates", async () => {
    const useAppStore = await loadFreshAppStore();

    expect(useAppStore.getState().addTag("Minimalista")).toBe(true);
    expect(useAppStore.getState().addTag(" minimalista ")).toBe(false);

    const tagId = useAppStore.getState().tags[0].id;

    expect(useAppStore.getState().updateTag(tagId, "Editorial")).toBe(true);
    expect(useAppStore.getState().tags[0].name).toBe("Editorial");
  });

  it("creates images, manages image comments and deletes images", async () => {
    const useAppStore = await loadFreshAppStore();

    useAppStore.getState().addImage({
      title: "Referência",
      imageUrl: "https://example.com/image.png",
      groupIds: [],
      tagIds: [],
    });

    const imageId = useAppStore.getState().images[0].id;
    useAppStore.getState().addImageComment(imageId, "Comentário inicial");

    const commentId = useAppStore.getState().images[0].comments[0].id;
    useAppStore.getState().updateImageComment(imageId, commentId, "Comentário editado");

    expect(useAppStore.getState().images[0].comments[0].content).toBe("Comentário editado");

    useAppStore.getState().deleteImage(imageId);

    expect(useAppStore.getState().images).toEqual([]);
  });

  it("creates palettes, manages palette comments and deletes palettes", async () => {
    const useAppStore = await loadFreshAppStore();

    useAppStore.getState().addPalette({
      title: "Paleta",
      colors: ["#FFFFFF", "#123456"],
      groupIds: [],
      tagIds: [],
    });

    const paletteId = useAppStore.getState().palettes[0].id;
    useAppStore.getState().addPaletteComment(paletteId, "Comentário inicial");

    const commentId = useAppStore.getState().palettes[0].comments[0].id;
    useAppStore.getState().updatePaletteComment(paletteId, commentId, "Comentário editado");

    expect(useAppStore.getState().palettes[0].comments[0].content).toBe("Comentário editado");

    useAppStore.getState().deletePalette(paletteId);

    expect(useAppStore.getState().palettes).toEqual([]);
  });

  it("removes deleted group and tag associations without deleting visual items", async () => {
    const useAppStore = await loadFreshAppStore();

    useAppStore.getState().addGroup("Branding");
    useAppStore.getState().addTag("Minimalista");

    const groupId = useAppStore.getState().groups[0].id;
    const tagId = useAppStore.getState().tags[0].id;

    useAppStore.getState().addImage({
      title: "Imagem",
      imageUrl: "https://example.com/image.png",
      groupIds: [groupId],
      tagIds: [tagId],
    });
    useAppStore.getState().addPalette({
      title: "Paleta",
      colors: ["#FFFFFF"],
      groupIds: [groupId],
      tagIds: [tagId],
    });

    useAppStore.getState().deleteGroup(groupId);
    useAppStore.getState().deleteTag(tagId);

    expect(useAppStore.getState().images).toHaveLength(1);
    expect(useAppStore.getState().palettes).toHaveLength(1);
    expect(useAppStore.getState().images[0].groupIds).toEqual([]);
    expect(useAppStore.getState().images[0].tagIds).toEqual([]);
    expect(useAppStore.getState().palettes[0].groupIds).toEqual([]);
    expect(useAppStore.getState().palettes[0].tagIds).toEqual([]);
  });

  it("updates and clears filters", async () => {
    const useAppStore = await loadFreshAppStore();

    useAppStore.getState().setQuery("brand");
    useAppStore.getState().setGroupFilter("group-1");
    useAppStore.getState().setTagFilter("tag-1");

    expect(useAppStore.getState().filters).toEqual({
      query: "brand",
      groupId: "group-1",
      tagId: "tag-1",
    });

    useAppStore.getState().clearFilters();

    expect(useAppStore.getState().filters).toEqual({ query: "" });
  });

  it("persists collection changes to localStorage", async () => {
    const useAppStore = await loadFreshAppStore();

    useAppStore.getState().addGroup("Branding");

    const persistedValue = window.localStorage.getItem(APP_STORAGE_KEY);

    expect(persistedValue).not.toBeNull();
    expect(JSON.parse(persistedValue ?? "{}")).toMatchObject({
      groups: [{ name: "Branding" }],
    });
  });

  it("updates an image without changing fields when omitted", async () => {
    const useAppStore = await loadFreshAppStore();

    useAppStore.getState().addImage({
      title: "Original",
      imageUrl: "https://example.com/image.png",
      groupIds: [],
      tagIds: [],
    });

    const imageId = useAppStore.getState().images[0].id;
    useAppStore.getState().updateImage(imageId, { title: "Atualizado" });

    expect(useAppStore.getState().images[0].title).toBe("Atualizado");
    expect(useAppStore.getState().images[0].imageUrl).toBe("https://example.com/image.png");
  });

  it("updates a palette with new colors", async () => {
    const useAppStore = await loadFreshAppStore();

    useAppStore.getState().addPalette({
      title: "Original",
      colors: ["#FFFFFF"],
      groupIds: [],
      tagIds: [],
    });

    const paletteId = useAppStore.getState().palettes[0].id;
    useAppStore.getState().updatePalette(paletteId, { title: "Atualizado", colors: ["#123ABC", "#FF0000"] });

    expect(useAppStore.getState().palettes[0].title).toBe("Atualizado");
    expect(useAppStore.getState().palettes[0].colors.map((c) => c.hex)).toEqual(["#123ABC", "#FF0000"]);
  });

  it("updates a palette without changing colors when omitted", async () => {
    const useAppStore = await loadFreshAppStore();

    useAppStore.getState().addPalette({
      title: "Original",
      colors: ["#FFFFFF"],
      groupIds: [],
      tagIds: [],
    });

    const paletteId = useAppStore.getState().palettes[0].id;
    useAppStore.getState().updatePalette(paletteId, { title: "Atualizado" });

    expect(useAppStore.getState().palettes[0].title).toBe("Atualizado");
    expect(useAppStore.getState().palettes[0].colors.map((c) => c.hex)).toEqual(["#FFFFFF"]);
  });
});
