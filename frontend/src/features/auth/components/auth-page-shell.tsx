import type { ReactNode } from "react";

export type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/auth-background.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 lg:justify-end lg:px-[19vw]">
        <div className="w-full max-w-[340px]">
          {children}
        </div>
      </section>
    </main>
  );
}
