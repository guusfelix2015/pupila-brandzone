import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";

export function SignInPage() {
  return (
    <AuthPageShell
      eyebrow="Biblioteca visual"
      title="Entre no Brand Zone"
      description="Acesse sua biblioteca de referências visuais para organizar imagens, paletas, grupos, tags e comentários em um só lugar."
    >
      <AuthCard
        title="Acesse seu acervo"
        description="Entre para consultar e organizar referências visuais, paletas e classificações do seu workspace."
        submitLabel="Entrar"
        switchText="Ainda não tem conta?"
        switchLabel="Criar conta"
        switchRoute="signup"
      />
    </AuthPageShell>
  );
}
