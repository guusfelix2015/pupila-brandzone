import { ImageForm } from "@/features/images/components/image-form";
import { ImageGrid } from "@/features/images/components/image-grid";
import type { ImagesPageController } from "@/features/images/hooks/use-images-page-controller";
import { CommentsList } from "@/shared/components/data-display/comments-list";
import { DeleteConfirmationDialog } from "@/shared/components/feedback/delete-confirmation-dialog";
import { CommentForm } from "@/shared/components/form/comment-form";
import { FiltersToolbar } from "@/shared/components/form/filters-toolbar";
import { PageShell } from "@/shared/components/layout/page-shell";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Image } from "lucide-react";

export type ImagesPageViewProps = {
  imagesPageController: ImagesPageController;
};

export function ImagesPageView({ imagesPageController }: ImagesPageViewProps) {
  return (
    <PageShell
      title="Imagens"
      description="Cadastre referências visuais por URL e organize cada item com grupos, tags e comentários."
      action={<Button onClick={() => imagesPageController.setCreateDialogOpen(true)}>Nova imagem</Button>}
      stats={
        <Badge className="inline-flex items-center gap-1.5 border-accent bg-accent/50 text-accent-foreground">
          <Image className="h-3 w-3" />
          {imagesPageController.images.length} {imagesPageController.images.length === 1 ? "imagem" : "imagens"}
        </Badge>
      }
    >
      <FiltersToolbar
        filters={imagesPageController.filters}
        groups={imagesPageController.groups}
        tags={imagesPageController.tags}
        onQueryChange={imagesPageController.handleQueryChange}
        onGroupChange={imagesPageController.handleGroupFilterChange}
        onTagChange={imagesPageController.handleTagFilterChange}
        onClearFilters={imagesPageController.handleClearFilters}
      />
      <ImageGrid
        images={imagesPageController.images}
        hasFilters={imagesPageController.hasFilters}
        groups={imagesPageController.groups}
        tags={imagesPageController.tags}
        onOpenComments={imagesPageController.handleOpenComments}
        onEditImage={imagesPageController.handleOpenEditImage}
        onDeleteImage={imagesPageController.handleRequestDeleteImage}
      />

      <Dialog open={imagesPageController.isCreateDialogOpen} onOpenChange={imagesPageController.setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova imagem</DialogTitle>
            <DialogDescription>Informe a URL da imagem e seus dados de organização.</DialogDescription>
          </DialogHeader>
          <ImageForm
            groups={imagesPageController.groups}
            tags={imagesPageController.tags}
            onSubmit={imagesPageController.handleCreateImage}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(imagesPageController.editingImage)}
        onOpenChange={imagesPageController.handleCloseEditImage}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar imagem</DialogTitle>
            <DialogDescription>Altere os dados de organização desta imagem.</DialogDescription>
          </DialogHeader>
          {imagesPageController.editingImage ? (
            <ImageForm
              groups={imagesPageController.groups}
              tags={imagesPageController.tags}
              defaultValues={{
                title: imagesPageController.editingImage.title,
                imageUrl: imagesPageController.editingImage.imageUrl,
                groupIds: imagesPageController.editingImage.groupIds,
                tagIds: imagesPageController.editingImage.tagIds,
              }}
              submitLabel="Salvar alterações"
              onSubmit={imagesPageController.handleUpdateImage}
              onCancel={imagesPageController.handleCloseEditImage}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(imagesPageController.selectedImage)}
        onOpenChange={imagesPageController.handleCloseComments}
      >
        <DialogContent className="flex flex-col overflow-hidden p-0">
          <DialogHeader className="shrink-0 px-6 pt-6">
            <div className="flex items-center gap-2">
              <DialogTitle>{imagesPageController.selectedImage?.title ?? "Comentários"}</DialogTitle>
              {imagesPageController.selectedImage ? (
                <Badge className="inline-flex items-center gap-1 border-muted bg-muted text-muted-foreground">
                  {imagesPageController.selectedImage.comments.length}{" "}
                  {imagesPageController.selectedImage.comments.length === 1 ? "comentário" : "comentários"}
                </Badge>
              ) : null}
            </div>
            <DialogDescription>
              {imagesPageController.selectedImage
                ? "Registre observações relevantes para esta referência."
                : "Registre observações relevantes para esta referência."}
            </DialogDescription>
          </DialogHeader>
          {imagesPageController.selectedImage ? (
            <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 pb-6">
              <div className="shrink-0">
                <CommentForm
                  key={imagesPageController.editingComment?.id ?? "new-comment"}
                  defaultContent={imagesPageController.editingComment?.content}
                  submitLabel={imagesPageController.editingComment ? "Salvar comentário" : "Adicionar comentário"}
                  onSubmit={imagesPageController.handleSubmitComment}
                  onCancel={
                    imagesPageController.editingComment ? imagesPageController.handleCancelEditComment : undefined
                  }
                />
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <CommentsList
                  comments={imagesPageController.selectedImage.comments}
                  onEditComment={imagesPageController.handleEditComment}
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={Boolean(imagesPageController.deletingImage)}
        title="Excluir imagem"
        description={`Excluir "${imagesPageController.deletingImage?.title ?? "esta imagem"}"? Esta ação não pode ser desfeita.`}
        onOpenChange={(open) => {
          if (!open) {
            imagesPageController.handleCancelDeleteImage();
          }
        }}
        onConfirm={imagesPageController.handleConfirmDeleteImage}
      />
    </PageShell>
  );
}
