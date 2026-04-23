import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { commentFormSchema, type CommentFormValues } from "@/lib/validation/schemas";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { FieldError } from "@/shared/components/form/field-error";
import { Pencil } from "lucide-react";

export type CommentFormProps = {
  defaultContent?: string;
  submitLabel: string;
  onSubmit: (values: CommentFormValues) => void;
  onCancel?: () => void;
};

export function CommentForm({ defaultContent = "", submitLabel, onSubmit, onCancel }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    values: { content: defaultContent },
  });

  function handleValidSubmit(values: CommentFormValues): void {
    onSubmit(values);
    reset({ content: "" });
  }

  const isEditing = Boolean(defaultContent);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      {isEditing ? (
        <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
          <Pencil className="h-3 w-3" />
          Editando comentário
        </div>
      ) : null}
      <Textarea
        id="content"
        placeholder={isEditing ? "Edite sua observação..." : "Adicione uma observação sobre este item..."}
        rows={2}
        className="resize-none"
        {...register("content")}
      />
      <FieldError message={errors.content?.message} />
      <div className="flex flex-wrap justify-end gap-2 pt-1">
        {onCancel ? (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" size="sm">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
