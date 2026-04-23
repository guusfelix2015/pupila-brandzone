import { create } from "zustand";
import type { AuthAccount, PersistedAuthState } from "@/core/types/domain";
import { emptyPersistedAuthState, loadPersistedAuthState, savePersistedAuthState } from "@/lib/storage/auth-storage";

type SignInInput = {
  email: string;
  password: string;
};

type SignUpInput = AuthAccount;

type AuthStoreState = PersistedAuthState;

type AuthStoreActions = {
  signUp: (input: SignUpInput) => { ok: true } | { ok: false; error: "EMAIL_IN_USE" };
  signIn: (input: SignInInput) => { ok: true } | { ok: false; error: "INVALID_CREDENTIALS" };
  signOut: () => void;
  resetState: () => void;
};

export type AuthStore = AuthStoreState & AuthStoreActions;

const persistedState = loadPersistedAuthState();

function persistState(state: PersistedAuthState): void {
  savePersistedAuthState(state);
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  registeredUser: persistedState.registeredUser,
  currentUser: persistedState.currentUser,

  signUp: (input) => {
    const existingUser = get().registeredUser;

    if (existingUser && existingUser.email.toLowerCase() === input.email.toLowerCase()) {
      return { ok: false, error: "EMAIL_IN_USE" };
    }

    set({
      registeredUser: {
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
      },
    });
    persistState(get());

    return { ok: true };
  },

  signIn: (input) => {
    const registeredUser = get().registeredUser;

    if (
      !registeredUser ||
      registeredUser.email.toLowerCase() !== input.email.toLowerCase() ||
      registeredUser.password !== input.password
    ) {
      return { ok: false, error: "INVALID_CREDENTIALS" };
    }

    set({
      currentUser: {
        name: registeredUser.name,
        email: registeredUser.email,
      },
    });
    persistState(get());

    return { ok: true };
  },

  signOut: () => {
    set({ currentUser: undefined });
    persistState(get());
  },

  resetState: () => {
    set(emptyPersistedAuthState);
    persistState(emptyPersistedAuthState);
  },
}));
