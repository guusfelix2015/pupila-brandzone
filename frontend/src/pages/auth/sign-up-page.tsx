import { AuthCard } from "@/features/auth/components/auth-card";
import { useSignUpPageController } from "@/features/auth/hooks/use-sign-up-page-controller";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";

export function SignUpPage() {
  const signUpPageController = useSignUpPageController();

  return (
    <AuthPageShell
      eyebrow="Workspace visual"
      title="Crie seu acesso"
      description="Cadastre uma conta para começar a montar e organizar seu acervo visual com imagens, paletas e taxonomias."
    >
      <AuthCard
        title="Comece seu acervo"
        description="Crie sua conta para salvar referências visuais, montar paletas e estruturar grupos e tags."
        submitLabel="Criar conta"
        switchText="Já tem conta?"
        switchLabel="Entrar"
        switchRoute={signUpPageController.switchRoute}
        showNameField
        submitError={signUpPageController.submitError}
        onSubmit={signUpPageController.handleSubmit}
      />
    </AuthPageShell>
  );
}
