import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignInFormValues } from "@/lib/validation/schemas";
import { ROUTE } from "@/app/routes/routes";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export type SignInPageController = {
  submitError?: string;
  handleSubmit: (values: SignInFormValues) => void;
  switchRoute: typeof ROUTE.SIGNUP;
};

export function useSignInPageController(): SignInPageController {
  const signIn = useAuthStore((state) => state.signIn);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const navigate = useNavigate();

  function handleSubmit(values: SignInFormValues): void {
    const result = signIn(values);

    if (!result.ok) {
      setSubmitError("Email ou senha inválidos.");
      toast.error("Falha no login.", {
        description: "Verifique o email e a senha informados.",
      });
      return;
    }

    setSubmitError(undefined);
    toast.success("Login realizado.", {
      description: "Bem-vindo ao seu acervo visual.",
    });
    navigate(`/${ROUTE.IMAGES}`);
  }

  return {
    submitError,
    handleSubmit,
    switchRoute: ROUTE.SIGNUP,
  };
}
