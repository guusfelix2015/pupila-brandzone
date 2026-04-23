import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ROUTE } from "@/app/routes/routes";
import {
  signInFormSchema,
  signUpFormSchema,
  type SignInFormValues,
  type SignUpFormValues,
} from "@/lib/validation/schemas";
import { FieldError } from "@/shared/components/form/field-error";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

type AuthCardBaseProps = {
  title: string;
  description: string;
  submitLabel: string;
  switchText: string;
  switchLabel: string;
  switchRoute: typeof ROUTE.SIGNIN | typeof ROUTE.SIGNUP;
  submitError?: string;
};

export type AuthCardProps =
  | (AuthCardBaseProps & {
      showNameField?: false;
      onSubmit: (values: SignInFormValues) => void;
    })
  | (AuthCardBaseProps & {
      showNameField: true;
      onSubmit: (values: SignUpFormValues) => void;
    });

export function AuthCard({
  title,
  description,
  submitLabel,
  switchText,
  switchLabel,
  switchRoute,
  showNameField = false,
  submitError,
  onSubmit,
}: AuthCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues | SignUpFormValues>({
    resolver: zodResolver(showNameField ? signUpFormSchema : signInFormSchema),
    defaultValues: showNameField ? { name: "", email: "", password: "" } : { email: "", password: "" },
  });

  return (
    <div className="rounded-[15px] bg-[#101010] p-8 text-white shadow-2xl shadow-black/35">
      <div className="mb-7 grid justify-items-center gap-5 text-center">
        <p className="font-display text-2xl uppercase leading-none">Pupila Brand Zone</p>
        <div className="grid gap-2">
          <h1 className="text-base font-bold leading-none">{title}</h1>
          <p className="text-xs leading-5 text-white/48">{description}</p>
        </div>
      </div>

      <form
        className="grid gap-3"
        noValidate
        onSubmit={handleSubmit((values) => onSubmit(values as SignInFormValues & SignUpFormValues))}
      >
        {showNameField ? (
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="sr-only">
              Nome
            </Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Nome*"
              className="border-white/5 bg-white text-black placeholder:text-black/40"
              {...register("name" as const)}
            />
            <FieldError message={"name" in errors ? errors.name?.message : undefined} />
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Email*"
            className="border-white/5 bg-white text-black placeholder:text-black/40"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="password" className="sr-only">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete={showNameField ? "new-password" : "current-password"}
            placeholder="Senha*"
            className="border-white/5 bg-white pr-10 text-black placeholder:text-black/40"
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <FieldError message={submitError} />

        <Button type="submit" size="lg" className="mt-2 w-full text-black">
          {submitLabel}
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-xs text-white/48">
        <span>{switchText}</span>
        <Link className="font-semibold text-primary hover:text-primary/85" to={`/${switchRoute}`}>
          {switchLabel}
        </Link>
      </div>
    </div>
  );
}
