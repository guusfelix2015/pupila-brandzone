import type { PersistedAppState } from "@/core/types/domain";
import { APP_STORAGE_KEY } from "@/core/constants/storage";

export const emptyPersistedAppState: PersistedAppState = {
  images: [],
  palettes: [],
  groups: [],
  tags: [],
};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPersistedAppState(storageKey = APP_STORAGE_KEY): PersistedAppState {
  if (!canUseLocalStorage()) {
    return emptyPersistedAppState;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return emptyPersistedAppState;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<PersistedAppState>;

    return {
      images: Array.isArray(parsedValue.images) ? parsedValue.images : [],
      palettes: Array.isArray(parsedValue.palettes) ? parsedValue.palettes : [],
      groups: Array.isArray(parsedValue.groups) ? parsedValue.groups : [],
      tags: Array.isArray(parsedValue.tags) ? parsedValue.tags : [],
    };
  } catch {
    return emptyPersistedAppState;
  }
}

export function savePersistedAppState(state: PersistedAppState, storageKey = APP_STORAGE_KEY): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(state));
}
