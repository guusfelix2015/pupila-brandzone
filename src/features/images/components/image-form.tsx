import { zodResolver } from "@hookform/resolvers/zod";
import { Controller as FormController, useForm } from "react-hook-form";
import type { Group, Tag } from "@/core/types/domain";
import { imageFormSchema, type ImageFormValues } from "@/lib/validation/schemas";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/components/form/form-field";
import { MultiSelectCheckboxGroup } from "@/shared/components/form/multi-select-checkbox-group";

export type ImageFormProps = {
  groups: Group[];
  tags: Tag[];
  defaultValues?: ImageFormValues;
  submitLabel?: string;
  onSubmit: (values: ImageFormValues) => void;
  onCancel?: () => void;
};

export function ImageForm({ groups, tags, defaultValues, submitLabel, onSubmit, onCancel }: ImageFormProps) {
  const isEditing = Boolean(defaultValues);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: defaultValues ?? {
      title: "",
      imageUrl: "",
      groupIds: [],
      tagIds: [],
    },
  });

  function handleValidSubmit(values: ImageFormValues): void {
    onSubmit(values);
    if (!isEditing) {
      reset();
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      <FormField label="Título" htmlFor="image-title" error={errors.title?.message}>
        <Input id="image-title" placeholder="Ex: Referencia de campanha" {...register("title")} />
      </FormField>
      <FormField label="URL da imagem" htmlFor="image-url" error={errors.imageUrl?.message}>
        <Input id="image-url" placeholder="https://..." {...register("imageUrl")} />
      </FormField>
      <FormController
        control={control}
        name="groupIds"
        render={({ field }) => (
          <MultiSelectCheckboxGroup
            label="Grupos"
            name="image-groups"
            options={groups}
            selectedIds={field.value}
            onChange={field.onChange}
            emptyMessage="Crie grupos antes de associar."
          />
        )}
      />
      <FormController
        control={control}
        name="tagIds"
        render={({ field }) => (
          <MultiSelectCheckboxGroup
            label="Tags"
            name="image-tags"
            options={tags}
            selectedIds={field.value}
            onChange={field.onChange}
            emptyMessage="Crie tags antes de associar."
          />
        )}
      />
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit">{submitLabel ?? "Salvar imagem"}</Button>
      </div>
    </form>
  );
}
