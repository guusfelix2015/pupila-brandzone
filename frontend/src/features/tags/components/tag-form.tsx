import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { tagFormSchema, type TagFormValues } from "@/lib/validation/schemas";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/components/form/form-field";

export type TagFormProps = {
  defaultValues?: TagFormValues;
  submitLabel: string;
  onSubmit: (values: TagFormValues) => boolean;
  onCancel?: () => void;
};

export function TagForm({ defaultValues, submitLabel, onSubmit, onCancel }: TagFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    values: defaultValues ?? { name: "" },
  });

  function handleValidSubmit(values: TagFormValues): void {
    const wasSaved = onSubmit(values);

    if (!wasSaved) {
      setError("name", { message: "Já existe uma tag com esse nome." });
      return;
    }

    reset({ name: "" });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      <FormField label="Nome da tag" htmlFor="tag-name" error={errors.name?.message}>
        <Input id="tag-name" placeholder="Ex: Minimalista" {...register("name")} />
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
