import { TagForm } from "@/features/tags/components/tag-form";
import { TagList } from "@/features/tags/components/tag-list";
import type { TagsPageController } from "@/features/tags/hooks/use-tags-page-controller";
import { DeleteConfirmationDialog } from "@/shared/components/feedback/delete-confirmation-dialog";
import { PageShell } from "@/shared/components/layout/page-shell";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { TagIcon } from "lucide-react";

export type TagsPageViewProps = {
  tagsPageController: TagsPageController;
};

export function TagsPageView({ tagsPageController }: TagsPageViewProps) {
  return (
    <PageShell
      title="Tags"
      description="Gerencie tags reutilizáveis para classificar imagens e paletas por tema, estilo ou uso."
      action={<Button onClick={tagsPageController.handleOpenCreateTag}>Nova tag</Button>}
      stats={
        <Badge className="inline-flex items-center gap-1.5 border-secondary/60 bg-secondary/30 text-secondary-foreground">
          <TagIcon className="h-3 w-3" />
          {tagsPageController.tags.length} {tagsPageController.tags.length === 1 ? "tag" : "tags"}
        </Badge>
      }
    >
      <TagList
        tags={tagsPageController.tags}
        tagCounts={tagsPageController.tagCounts}
        onEditTag={tagsPageController.handleEditTag}
        onDeleteTag={tagsPageController.handleRequestDeleteTag}
      />
      <Dialog open={tagsPageController.isFormDialogOpen} onOpenChange={tagsPageController.handleCloseFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tagsPageController.editingTag ? "Editar tag" : "Nova tag"}</DialogTitle>
            <DialogDescription>
              {tagsPageController.editingTag
                ? "Atualize o nome da tag selecionada."
                : "Crie uma tag para classificar imagens e paletas."}
            </DialogDescription>
          </DialogHeader>
          <TagForm
            defaultValues={tagsPageController.formDefaultValues}
            submitLabel={tagsPageController.submitLabel}
            onSubmit={tagsPageController.handleSubmitTag}
            onCancel={tagsPageController.handleCloseFormDialog}
          />
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        open={Boolean(tagsPageController.deletingTag)}
        title="Excluir tag"
        description={`Excluir "${tagsPageController.deletingTag?.name ?? "esta tag"}"? Imagens e paletas serao mantidas.`}
        onOpenChange={(open) => {
          if (!open) {
            tagsPageController.handleCancelDeleteTag();
          }
        }}
        onConfirm={tagsPageController.handleConfirmDeleteTag}
      />
    </PageShell>
  );
}
