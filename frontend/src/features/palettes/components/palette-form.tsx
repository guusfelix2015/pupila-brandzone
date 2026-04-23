import { zodResolver } from "@hookform/resolvers/zod";
import { Controller as FormController, useForm } from "react-hook-form";
import type { Group, Tag } from "@/core/types/domain";
import { paletteFormSchema, type PaletteFormValues } from "@/lib/validation/schemas";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/components/form/form-field";
import { MultiSelectCheckboxGroup } from "@/shared/components/form/multi-select-checkbox-group";

export type PaletteFormProps = {
  groups: Group[];
  tags: Tag[];
  defaultValues?: PaletteFormValues;
  submitLabel?: string;
  onSubmit: (values: PaletteFormValues) => void;
  onCancel?: () => void;
};

export function PaletteForm({ groups, tags, defaultValues, submitLabel, onSubmit, onCancel }: PaletteFormProps) {
  const isEditing = Boolean(defaultValues);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PaletteFormValues>({
    resolver: zodResolver(paletteFormSchema),
    defaultValues: defaultValues ?? {
      title: "",
      colorsText: "",
      groupIds: [],
      tagIds: [],
    },
  });

  function handleValidSubmit(values: PaletteFormValues): void {
    onSubmit(values);
    if (!isEditing) {
      reset();
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      <FormField label="Título" htmlFor="palette-title" error={errors.title?.message}>
        <Input id="palette-title" placeholder="Ex: Paleta institucional" {...register("title")} />
      </FormField>
      <FormField label="Cores HEX" htmlFor="palette-colors" error={errors.colorsText?.message}>
        <Textarea id="palette-colors" placeholder="#1E293B, #F97316, #F8FAFC" {...register("colorsText")} />
      </FormField>
      <FormController
        control={control}
        name="groupIds"
        render={({ field }) => (
          <MultiSelectCheckboxGroup
            label="Grupos"
            name="palette-groups"
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
            name="palette-tags"
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
        <Button type="submit">{submitLabel ?? "Salvar paleta"}</Button>
      </div>
    </form>
  );
}
