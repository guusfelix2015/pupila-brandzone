import type { PersistedAuthState } from "@/core/types/domain";
import { AUTH_STORAGE_KEY } from "@/core/constants/storage";

export const emptyPersistedAuthState: PersistedAuthState = {};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPersistedAuthState(storageKey = AUTH_STORAGE_KEY): PersistedAuthState {
  if (!canUseLocalStorage()) {
    return emptyPersistedAuthState;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return emptyPersistedAuthState;
    }

    const parsedValue = JSON.parse(rawValue) as PersistedAuthState;

    return {
      registeredUser: parsedValue.registeredUser,
      currentUser: parsedValue.currentUser,
    };
  } catch {
    return emptyPersistedAuthState;
  }
}

export function savePersistedAuthState(state: PersistedAuthState, storageKey = AUTH_STORAGE_KEY): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(state));
}
