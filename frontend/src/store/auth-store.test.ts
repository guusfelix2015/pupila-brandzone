import { useAuthStore } from "@/store/auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.getState().resetState();
  });

  it("registers a user and persists the name", () => {
    const result = useAuthStore.getState().signUp({
      name: "Gustavo",
      email: "gustavo@example.com",
      password: "123456",
    });

    expect(result).toEqual({ ok: true });
    expect(useAuthStore.getState().registeredUser?.name).toBe("Gustavo");
  });

  it("rejects duplicated email on sign up", () => {
    useAuthStore.getState().signUp({
      name: "Gustavo",
      email: "gustavo@example.com",
      password: "123456",
    });

    const result = useAuthStore.getState().signUp({
      name: "Outro",
      email: "gustavo@example.com",
      password: "abcdef",
    });

    expect(result).toEqual({ ok: false, error: "EMAIL_IN_USE" });
  });

  it("signs in with valid credentials and creates a current session", () => {
    useAuthStore.getState().signUp({
      name: "Gustavo",
      email: "gustavo@example.com",
      password: "123456",
    });

    const result = useAuthStore.getState().signIn({
      email: "gustavo@example.com",
      password: "123456",
    });

    expect(result).toEqual({ ok: true });
    expect(useAuthStore.getState().currentUser).toEqual({
      name: "Gustavo",
      email: "gustavo@example.com",
    });
  });

  it("rejects invalid credentials", () => {
    useAuthStore.getState().signUp({
      name: "Gustavo",
      email: "gustavo@example.com",
      password: "123456",
    });

    const result = useAuthStore.getState().signIn({
      email: "gustavo@example.com",
      password: "senha-errada",
    });

    expect(result).toEqual({ ok: false, error: "INVALID_CREDENTIALS" });
  });

  it("signs out the current user", () => {
    useAuthStore.getState().signUp({
      name: "Gustavo",
      email: "gustavo@example.com",
      password: "123456",
    });
    useAuthStore.getState().signIn({
      email: "gustavo@example.com",
      password: "123456",
    });

    useAuthStore.getState().signOut();

    expect(useAuthStore.getState().currentUser).toBeUndefined();
  });
});
