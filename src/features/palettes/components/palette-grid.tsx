import type { Group, PaletteItem, Tag } from "@/core/types/domain";
import { PaletteCard } from "@/features/palettes/components/palette-card";
import { EmptyState } from "@/shared/components/feedback/empty-state";

export type PaletteGridProps = {
  palettes: PaletteItem[];
  hasFilters: boolean;
  groups: Group[];
  tags: Tag[];
  onOpenComments: (palette: PaletteItem) => void;
  onEditPalette: (palette: PaletteItem) => void;
  onDeletePalette: (paletteId: string) => void;
};

export function PaletteGrid({
  palettes,
  hasFilters,
  groups,
  tags,
  onOpenComments,
  onEditPalette,
  onDeletePalette,
}: PaletteGridProps) {
  if (palettes.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? "Nenhuma paleta encontrada" : "Nenhuma paleta cadastrada"}
        description={
          hasFilters
            ? "Ajuste a busca ou os filtros para ampliar os resultados."
            : "Crie paletas com cores HEX para iniciar a biblioteca."
        }
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {palettes.map((palette) => (
        <PaletteCard
          key={palette.id}
          palette={palette}
          groups={groups}
          tags={tags}
          onOpenComments={onOpenComments}
          onEditPalette={onEditPalette}
          onDeletePalette={onDeletePalette}
        />
      ))}
    </div>
  );
}
