import type { PersistedAppState } from "@/core/types/domain";
import { emptyPersistedAppState, loadPersistedAppState, savePersistedAppState } from "@/lib/storage/local-storage";

const storageKey = "test-pupila-state";

describe("local-storage persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty state when there is no saved value", () => {
    expect(loadPersistedAppState(storageKey)).toEqual(emptyPersistedAppState);
  });

  it("returns an empty state when saved JSON is invalid", () => {
    window.localStorage.setItem(storageKey, "{invalid-json");

    expect(loadPersistedAppState(storageKey)).toEqual(emptyPersistedAppState);
  });

  it("normalizes missing collections to empty arrays", () => {
    window.localStorage.setItem(storageKey, JSON.stringify({ groups: [{ id: "group-1", name: "Branding" }] }));

    expect(loadPersistedAppState(storageKey)).toEqual({
      images: [],
      palettes: [],
      groups: [{ id: "group-1", name: "Branding" }],
      tags: [],
    });
  });

  it("saves and loads persisted state", () => {
    const state: PersistedAppState = {
      images: [],
      palettes: [],
      groups: [{ id: "group-1", name: "Branding" }],
      tags: [{ id: "tag-1", name: "Minimalista" }],
    };

    savePersistedAppState(state, storageKey);

    expect(loadPersistedAppState(storageKey)).toEqual(state);
  });
});
