import type { FormEvent, ReactNode } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export type AuthCardProps = {
  title: string;
  description: string;
  submitLabel: string;
  switchText: string;
  switchLabel: string;
  switchRoute: string;
  showNameField?: boolean;
  footer?: ReactNode;
};

export function AuthCard({
  title,
  description,
  submitLabel,
  switchText,
  switchLabel,
  switchRoute,
  showNameField = false,
}: AuthCardProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  return (
    <div className="rounded-[15px] bg-[#101010] p-8 text-white shadow-2xl shadow-black/35">
      <div className="mb-7 grid justify-items-center gap-5 text-center">
        <p className="font-display text-2xl uppercase leading-none">Pupila Brand Zone</p>
        <div className="grid gap-2">
          <h1 className="text-base font-bold leading-none">{title}</h1>
          <p className="text-xs leading-5 text-white/48">{description}</p>
        </div>
      </div>

      <form className="grid gap-2.5" onSubmit={handleSubmit}>
        {showNameField ? (
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="sr-only">
              Nome
            </Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Nome*"
              className="border-white/5 bg-white/7 text-white placeholder:text-white/34"
              required
            />
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email*"
            className="border-white/5 bg-white/7 text-white placeholder:text-white/34"
            required
          />
        </div>

        <div className="relative grid gap-1.5">
          <Label htmlFor="password" className="sr-only">
            Senha
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={showNameField ? "new-password" : "current-password"}
            placeholder="Senha*"
            className="border-white/5 bg-white pr-10 text-black placeholder:text-black/40"
            required
          />
          <Eye className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/22" />
        </div>

        <Button type="submit" size="lg" className="mt-3 w-full text-black">
          {submitLabel}
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-xs text-white/48">
        <span>{switchText}</span>
        <a className="font-semibold text-primary hover:text-primary/85" href={`#/${switchRoute}`}>
          {switchLabel}
        </a>
      </div>
    </div>
  );
}
