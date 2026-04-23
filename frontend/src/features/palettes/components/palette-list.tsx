import type { Group, PaletteItem, Tag } from "@/core/types/domain";
import { EntityBadges } from "@/shared/components/data-display/entity-badges";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { Button } from "@/shared/ui/button";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";

export type PaletteListProps = {
  palettes: PaletteItem[];
  hasFilters: boolean;
  groups: Group[];
  tags: Tag[];
  onOpenComments: (palette: PaletteItem) => void;
  onEditPalette: (palette: PaletteItem) => void;
  onDeletePalette: (paletteId: string) => void;
};

export function PaletteList({
  palettes,
  hasFilters,
  groups,
  tags,
  onOpenComments,
  onEditPalette,
  onDeletePalette,
}: PaletteListProps) {
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
    <div className="grid gap-3">
      {palettes.map((palette) => (
        <div
          key={palette.id}
          className="grid gap-4 rounded-[15px] bg-card/90 p-4 shadow-sm shadow-black/20 ring-1 ring-black/40 lg:grid-cols-[minmax(180px,240px)_minmax(240px,1fr)_auto] lg:items-center"
        >
          <div className="min-w-0">
            <h3 className="truncate text-xl leading-none text-foreground">{palette.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-foreground/58">
              {palette.colors.length} {palette.colors.length === 1 ? "cor" : "cores"}
            </p>
          </div>

          <div className="grid min-h-12 overflow-hidden rounded-[10px] bg-black/25 p-1 ring-1 ring-black/50" style={{ gridTemplateColumns: `repeat(${Math.max(palette.colors.length, 1)}, minmax(0, 1fr))` }}>
            {palette.colors.map((color) => (
              <div
                key={color.id}
                className="relative min-h-10 first:rounded-l-[7px] last:rounded-r-[7px]"
                style={{ backgroundColor: color.hex }}
              >
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[7px] bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-white shadow-sm backdrop-blur">
                  {color.hex}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-start gap-1 lg:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground"
              onClick={() => onOpenComments(palette)}
              aria-label={`Comentários de ${palette.title}`}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground"
              onClick={() => onEditPalette(palette)}
              aria-label={`Editar ${palette.title}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0 text-muted-foreground hover:text-destructive"
              onClick={() => onDeletePalette(palette.id)}
              aria-label={`Excluir ${palette.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="lg:col-span-3">
            <EntityBadges groupIds={palette.groupIds} tagIds={palette.tagIds} groups={groups} tags={tags} limit={4} />
          </div>
        </div>
      ))}
    </div>
  );
}
