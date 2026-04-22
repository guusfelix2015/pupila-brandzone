import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { groupFormSchema, type GroupFormValues } from "@/lib/validation/schemas";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/components/form/form-field";

export type GroupFormProps = {
  defaultValues?: GroupFormValues;
  submitLabel: string;
  onSubmit: (values: GroupFormValues) => boolean;
  onCancel?: () => void;
};

export function GroupForm({ defaultValues, submitLabel, onSubmit, onCancel }: GroupFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    values: defaultValues ?? { name: "" },
  });

  function handleValidSubmit(values: GroupFormValues): void {
    const wasSaved = onSubmit(values);

    if (!wasSaved) {
      setError("name", { message: "Já existe um grupo com esse nome." });
      return;
    }

    reset({ name: "" });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      <FormField label="Nome do grupo" htmlFor="group-name" error={errors.name?.message}>
        <Input id="group-name" placeholder="Ex: Identidade visual" {...register("name")} />
      </FormField>
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
