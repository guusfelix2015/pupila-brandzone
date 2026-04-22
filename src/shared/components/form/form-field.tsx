import type { ReactNode } from "react";
import { Label } from "@/shared/ui/label";
import { FieldError } from "@/shared/components/form/field-error";

export type FormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}
