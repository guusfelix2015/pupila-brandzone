import { useMemo, useState } from "react";
import type { Tag } from "@/core/types/domain";
import type { TagFormValues } from "@/lib/validation/schemas";
import { getTagCounts, type EntityCounts } from "@/lib/utils/entity-counts";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";

export type TagsPageController = {
  tags: Tag[];
  tagCounts: Map<string, EntityCounts>;
  editingTag?: Tag;
  deletingTag?: Tag;
  isFormDialogOpen: boolean;
  formDefaultValues: TagFormValues;
  submitLabel: string;
  handleSubmitTag: (values: TagFormValues) => boolean;
  handleOpenCreateTag: () => void;
  handleEditTag: (tag: Tag) => void;
  handleCloseFormDialog: () => void;
  handleRequestDeleteTag: (tagId: string) => void;
  handleCancelDeleteTag: () => void;
  handleConfirmDeleteTag: () => void;
};

export function useTagsPageController(): TagsPageController {
  const tags = useAppStore((state) => state.tags);
  const images = useAppStore((state) => state.images);
  const palettes = useAppStore((state) => state.palettes);
  const addTag = useAppStore((state) => state.addTag);
  const updateTag = useAppStore((state) => state.updateTag);
  const deleteTag = useAppStore((state) => state.deleteTag);
  const [editingTag, setEditingTag] = useState<Tag | undefined>();
  const [isFormDialogOpen, setFormDialogOpen] = useState(false);
  const [deletingTagId, setDeletingTagId] = useState<string | undefined>();

  const tagCounts = useMemo(() => {
    const counts = new Map<string, EntityCounts>();
    for (const tag of tags) {
      counts.set(tag.id, getTagCounts(images, palettes, tag.id));
    }
    return counts;
  }, [tags, images, palettes]);

  const formDefaultValues: TagFormValues = {
    name: editingTag?.name ?? "",
  };

  function handleSubmitTag(values: TagFormValues): boolean {
    const wasSaved = editingTag ? updateTag(editingTag.id, values.name) : addTag(values.name);

    if (wasSaved) {
      toast.success(editingTag ? "Tag atualizada." : "Tag criada.", {
        description: editingTag ? "As alterações foram salvas." : "A tag já pode ser usada nos itens.",
      });
      setEditingTag(undefined);
      setFormDialogOpen(false);
    } else {
      toast.error("Não foi possível salvar a tag.", {
        description: "Já existe uma tag com este nome.",
      });
    }

    return wasSaved;
  }

  const deletingTag = tags.find((tag) => tag.id === deletingTagId);

  function handleOpenCreateTag(): void {
    setEditingTag(undefined);
    setFormDialogOpen(true);
  }

  function handleEditTag(tag: Tag): void {
    setEditingTag(tag);
    setFormDialogOpen(true);
  }

  function handleCloseFormDialog(): void {
    setEditingTag(undefined);
    setFormDialogOpen(false);
  }

  function handleConfirmDeleteTag(): void {
    if (deletingTagId) {
      deleteTag(deletingTagId);
      toast.success("Tag removida.", {
        description: "Os itens foram mantidos e desassociados da tag.",
      });
      setDeletingTagId(undefined);
    }
  }

  return {
    tags,
    tagCounts,
    editingTag,
    deletingTag,
    isFormDialogOpen,
    formDefaultValues,
    submitLabel: editingTag ? "Salvar tag" : "Criar tag",
    handleSubmitTag,
    handleOpenCreateTag,
    handleEditTag,
    handleCloseFormDialog,
    handleRequestDeleteTag: setDeletingTagId,
    handleCancelDeleteTag: () => setDeletingTagId(undefined),
    handleConfirmDeleteTag,
  };
}
