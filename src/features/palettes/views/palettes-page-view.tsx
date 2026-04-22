import { PaletteForm } from "@/features/palettes/components/palette-form";
import { PaletteGrid } from "@/features/palettes/components/palette-grid";
import type { PalettesPageController } from "@/features/palettes/hooks/use-palettes-page-controller";
import { CommentsList } from "@/shared/components/data-display/comments-list";
import { DeleteConfirmationDialog } from "@/shared/components/feedback/delete-confirmation-dialog";
import { CommentForm } from "@/shared/components/form/comment-form";
import { FiltersToolbar } from "@/shared/components/form/filters-toolbar";
import { PageShell } from "@/shared/components/layout/page-shell";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Palette } from "lucide-react";

export type PalettesPageViewProps = {
  palettesPageController: PalettesPageController;
};

export function PalettesPageView({ palettesPageController }: PalettesPageViewProps) {
  return (
    <PageShell
      title="Paletas"
      description="Crie conjuntos de cores e organize cada paleta com grupos, tags e comentários."
      action={<Button onClick={() => palettesPageController.setCreateDialogOpen(true)}>Nova paleta</Button>}
      stats={
        <Badge className="inline-flex items-center gap-1.5 border-secondary/60 bg-secondary/30 text-secondary-foreground">
          <Palette className="h-3 w-3" />
          {palettesPageController.palettes.length} {palettesPageController.palettes.length === 1 ? "paleta" : "paletas"}
        </Badge>
      }
    >
      <FiltersToolbar
        filters={palettesPageController.filters}
        groups={palettesPageController.groups}
        tags={palettesPageController.tags}
        onQueryChange={palettesPageController.handleQueryChange}
        onGroupChange={palettesPageController.handleGroupFilterChange}
        onTagChange={palettesPageController.handleTagFilterChange}
        onClearFilters={palettesPageController.handleClearFilters}
      />
      <PaletteGrid
        palettes={palettesPageController.palettes}
        hasFilters={palettesPageController.hasFilters}
        groups={palettesPageController.groups}
        tags={palettesPageController.tags}
        onOpenComments={palettesPageController.handleOpenComments}
        onEditPalette={palettesPageController.handleOpenEditPalette}
        onDeletePalette={palettesPageController.handleRequestDeletePalette}
      />

      <Dialog
        open={palettesPageController.isCreateDialogOpen}
        onOpenChange={palettesPageController.setCreateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova paleta</DialogTitle>
            <DialogDescription>Informe as cores HEX e seus dados de organização.</DialogDescription>
          </DialogHeader>
          <PaletteForm
            groups={palettesPageController.groups}
            tags={palettesPageController.tags}
            onSubmit={palettesPageController.handleCreatePalette}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(palettesPageController.editingPalette)}
        onOpenChange={palettesPageController.handleCloseEditPalette}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar paleta</DialogTitle>
            <DialogDescription>Altere os dados de organização desta paleta.</DialogDescription>
          </DialogHeader>
          {palettesPageController.editingPalette ? (
            <PaletteForm
              groups={palettesPageController.groups}
              tags={palettesPageController.tags}
              defaultValues={{
                title: palettesPageController.editingPalette.title,
                colorsText: palettesPageController.editingPalette.colors.map((c) => c.hex).join(", "),
                groupIds: palettesPageController.editingPalette.groupIds,
                tagIds: palettesPageController.editingPalette.tagIds,
              }}
              submitLabel="Salvar alterações"
              onSubmit={palettesPageController.handleUpdatePalette}
              onCancel={palettesPageController.handleCloseEditPalette}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(palettesPageController.selectedPalette)}
        onOpenChange={palettesPageController.handleCloseComments}
      >
        <DialogContent className="flex flex-col overflow-hidden p-0">
          <DialogHeader className="shrink-0 px-6 pt-6">
            <div className="flex items-center gap-2">
              <DialogTitle>{palettesPageController.selectedPalette?.title ?? "Comentários"}</DialogTitle>
              {palettesPageController.selectedPalette ? (
                <Badge className="inline-flex items-center gap-1 border-muted bg-muted text-muted-foreground">
                  {palettesPageController.selectedPalette.comments.length}{" "}
                  {palettesPageController.selectedPalette.comments.length === 1 ? "comentário" : "comentários"}
                </Badge>
              ) : null}
            </div>
            <DialogDescription>
              {palettesPageController.selectedPalette
                ? "Registre observações relevantes para esta paleta."
                : "Registre observações relevantes para esta paleta."}
            </DialogDescription>
          </DialogHeader>
          {palettesPageController.selectedPalette ? (
            <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 pb-6">
              <div className="shrink-0">
                <CommentForm
                  key={palettesPageController.editingComment?.id ?? "new-comment"}
                  defaultContent={palettesPageController.editingComment?.content}
                  submitLabel={palettesPageController.editingComment ? "Salvar comentário" : "Adicionar comentário"}
                  onSubmit={palettesPageController.handleSubmitComment}
                  onCancel={
                    palettesPageController.editingComment ? palettesPageController.handleCancelEditComment : undefined
                  }
                />
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <CommentsList
                  comments={palettesPageController.selectedPalette.comments}
                  onEditComment={palettesPageController.handleEditComment}
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={Boolean(palettesPageController.deletingPalette)}
        title="Excluir paleta"
        description={`Excluir "${palettesPageController.deletingPalette?.title ?? "esta paleta"}"? Esta ação não pode ser desfeita.`}
        onOpenChange={(open) => {
          if (!open) {
            palettesPageController.handleCancelDeletePalette();
          }
        }}
        onConfirm={palettesPageController.handleConfirmDeletePalette}
      />
    </PageShell>
  );
}
