import { useMemo, useState } from "react";
import type { Group } from "@/core/types/domain";
import type { GroupFormValues } from "@/lib/validation/schemas";
import { getGroupCounts, type EntityCounts } from "@/lib/utils/entity-counts";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";

export type GroupsPageController = {
  groups: Group[];
  groupCounts: Map<string, EntityCounts>;
  editingGroup?: Group;
  deletingGroup?: Group;
  isFormDialogOpen: boolean;
  formDefaultValues: GroupFormValues;
  submitLabel: string;
  handleSubmitGroup: (values: GroupFormValues) => boolean;
  handleOpenCreateGroup: () => void;
  handleEditGroup: (group: Group) => void;
  handleCloseFormDialog: () => void;
  handleRequestDeleteGroup: (groupId: string) => void;
  handleCancelDeleteGroup: () => void;
  handleConfirmDeleteGroup: () => void;
};

export function useGroupsPageController(): GroupsPageController {
  const groups = useAppStore((state) => state.groups);
  const images = useAppStore((state) => state.images);
  const palettes = useAppStore((state) => state.palettes);
  const addGroup = useAppStore((state) => state.addGroup);
  const updateGroup = useAppStore((state) => state.updateGroup);
  const deleteGroup = useAppStore((state) => state.deleteGroup);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>();
  const [isFormDialogOpen, setFormDialogOpen] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | undefined>();

  const groupCounts = useMemo(() => {
    const counts = new Map<string, EntityCounts>();
    for (const group of groups) {
      counts.set(group.id, getGroupCounts(images, palettes, group.id));
    }
    return counts;
  }, [groups, images, palettes]);

  const formDefaultValues: GroupFormValues = {
    name: editingGroup?.name ?? "",
  };

  function handleSubmitGroup(values: GroupFormValues): boolean {
    const wasSaved = editingGroup ? updateGroup(editingGroup.id, values.name) : addGroup(values.name);

    if (wasSaved) {
      toast.success(editingGroup ? "Grupo atualizado." : "Grupo criado.", {
        description: editingGroup ? "As alterações foram salvas." : "O grupo já está disponível para uso.",
      });
      setEditingGroup(undefined);
      setFormDialogOpen(false);
    } else {
      toast.error("Não foi possível salvar o grupo.", {
        description: "Já existe um grupo com este nome.",
      });
    }

    return wasSaved;
  }

  const deletingGroup = groups.find((group) => group.id === deletingGroupId);

  function handleOpenCreateGroup(): void {
    setEditingGroup(undefined);
    setFormDialogOpen(true);
  }

  function handleEditGroup(group: Group): void {
    setEditingGroup(group);
    setFormDialogOpen(true);
  }

  function handleCloseFormDialog(): void {
    setEditingGroup(undefined);
    setFormDialogOpen(false);
  }

  function handleConfirmDeleteGroup(): void {
    if (deletingGroupId) {
      deleteGroup(deletingGroupId);
      toast.success("Grupo removido.", {
        description: "Os itens foram mantidos e desassociados do grupo.",
      });
      setDeletingGroupId(undefined);
    }
  }

  return {
    groups,
    groupCounts,
    editingGroup,
    deletingGroup,
    isFormDialogOpen,
    formDefaultValues,
    submitLabel: editingGroup ? "Salvar grupo" : "Criar grupo",
    handleSubmitGroup,
    handleOpenCreateGroup,
    handleEditGroup,
    handleCloseFormDialog,
    handleRequestDeleteGroup: setDeletingGroupId,
    handleCancelDeleteGroup: () => setDeletingGroupId(undefined),
    handleConfirmDeleteGroup,
  };
}
