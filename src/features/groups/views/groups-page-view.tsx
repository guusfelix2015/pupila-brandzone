import { GroupForm } from "@/features/groups/components/group-form";
import { GroupList } from "@/features/groups/components/group-list";
import type { GroupsPageController } from "@/features/groups/hooks/use-groups-page-controller";
import { DeleteConfirmationDialog } from "@/shared/components/feedback/delete-confirmation-dialog";
import { PageShell } from "@/shared/components/layout/page-shell";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { FolderOpen } from "lucide-react";

export type GroupsPageViewProps = {
  groupsPageController: GroupsPageController;
};

export function GroupsPageView({ groupsPageController }: GroupsPageViewProps) {
  return (
    <PageShell
      title="Grupos"
      description="Gerencie grupos usados para organizar referencias visuais por projeto, campanha ou contexto."
      action={<Button onClick={groupsPageController.handleOpenCreateGroup}>Novo grupo</Button>}
      stats={
        <Badge className="inline-flex items-center gap-1.5 border-accent bg-accent/50 text-accent-foreground">
          <FolderOpen className="h-3 w-3" />
          {groupsPageController.groups.length} {groupsPageController.groups.length === 1 ? "grupo" : "grupos"}
        </Badge>
      }
    >
      <GroupList
        groups={groupsPageController.groups}
        groupCounts={groupsPageController.groupCounts}
        onEditGroup={groupsPageController.handleEditGroup}
        onDeleteGroup={groupsPageController.handleRequestDeleteGroup}
      />
      <Dialog open={groupsPageController.isFormDialogOpen} onOpenChange={groupsPageController.handleCloseFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{groupsPageController.editingGroup ? "Editar grupo" : "Novo grupo"}</DialogTitle>
            <DialogDescription>
              {groupsPageController.editingGroup
                ? "Atualize o nome do grupo selecionado."
                : "Crie um grupo para organizar imagens e paletas por contexto."}
            </DialogDescription>
          </DialogHeader>
          <GroupForm
            defaultValues={groupsPageController.formDefaultValues}
            submitLabel={groupsPageController.submitLabel}
            onSubmit={groupsPageController.handleSubmitGroup}
            onCancel={groupsPageController.handleCloseFormDialog}
          />
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        open={Boolean(groupsPageController.deletingGroup)}
        title="Excluir grupo"
        description={`Excluir "${groupsPageController.deletingGroup?.name ?? "este grupo"}"? Imagens e paletas serao mantidas.`}
        onOpenChange={(open) => {
          if (!open) {
            groupsPageController.handleCancelDeleteGroup();
          }
        }}
        onConfirm={groupsPageController.handleConfirmDeleteGroup}
      />
    </PageShell>
  );
}
