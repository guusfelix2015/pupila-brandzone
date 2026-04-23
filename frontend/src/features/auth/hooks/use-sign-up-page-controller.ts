import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignUpFormValues } from "@/lib/validation/schemas";
import { ROUTE } from "@/app/routes/routes";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export type SignUpPageController = {
  submitError?: string;
  handleSubmit: (values: SignUpFormValues) => void;
  switchRoute: typeof ROUTE.SIGNIN;
};

export function useSignUpPageController(): SignUpPageController {
  const signUp = useAuthStore((state) => state.signUp);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const navigate = useNavigate();

  function handleSubmit(values: SignUpFormValues): void {
    const result = signUp(values);

    if (!result.ok) {
      setSubmitError("Já existe uma conta cadastrada com este email.");
      toast.error("Não foi possível criar a conta.", {
        description: "Já existe um cadastro com este email.",
      });
      return;
    }

    setSubmitError(undefined);
    toast.success("Conta criada.", {
      description: "Agora você já pode entrar no Brand Zone.",
    });
    navigate(`/${ROUTE.SIGNIN}`);
  }

  return {
    submitError,
    handleSubmit,
    switchRoute: ROUTE.SIGNIN,
  };
}
