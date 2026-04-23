import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSignUpPageController } from "@/features/auth/hooks/use-sign-up-page-controller";
import { useAuthStore } from "@/store/auth-store";

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe("useSignUpPageController", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.getState().resetState();
  });

  it("sets submit error for duplicated email", () => {
    useAuthStore.getState().signUp({
      name: "Gustavo",
      email: "teste@example.com",
      password: "123456",
    });
    const { result } = renderHook(() => useSignUpPageController(), { wrapper });

    act(() => {
      result.current.handleSubmit({ name: "Outro", email: "teste@example.com", password: "abcdef" });
    });

    expect(result.current.submitError).toBe("Já existe uma conta cadastrada com este email.");
  });

  it("persists user on successful sign up", () => {
    const { result } = renderHook(() => useSignUpPageController(), { wrapper });

    act(() => {
      result.current.handleSubmit({ name: "Gustavo", email: "novo@example.com", password: "123456" });
    });

    expect(useAuthStore.getState().registeredUser?.name).toBe("Gustavo");
    expect(result.current.submitError).toBeUndefined();
  });
});
