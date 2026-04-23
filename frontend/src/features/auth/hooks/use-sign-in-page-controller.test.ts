import { act, renderHook } from "@testing-library/react";
import { useSignInPageController } from "@/features/auth/hooks/use-sign-in-page-controller";
import { useAuthStore } from "@/store/auth-store";

describe("useSignInPageController", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.getState().resetState();
  });

  it("sets submit error for invalid credentials", () => {
    const { result } = renderHook(() => useSignInPageController());

    act(() => {
      result.current.handleSubmit({ email: "teste@example.com", password: "123456" });
    });

    expect(result.current.submitError).toBe("Email ou senha inválidos.");
  });

  it("clears submit error on successful login", () => {
    useAuthStore.getState().signUp({
      name: "Gustavo",
      email: "teste@example.com",
      password: "123456",
    });

    const { result } = renderHook(() => useSignInPageController());

    act(() => {
      result.current.handleSubmit({ email: "teste@example.com", password: "123456" });
    });

    expect(result.current.submitError).toBeUndefined();
    expect(useAuthStore.getState().currentUser?.name).toBe("Gustavo");
  });
});
