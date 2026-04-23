import type { Group, PaletteItem, Tag } from "@/core/types/domain";
import { EntityBadges } from "@/shared/components/data-display/entity-badges";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";

export type PaletteDetailsListProps = {
  palettes: PaletteItem[];
  hasFilters: boolean;
  groups: Group[];
  tags: Tag[];
  onOpenComments: (palette: PaletteItem) => void;
  onEditPalette: (palette: PaletteItem) => void;
  onDeletePalette: (paletteId: string) => void;
};

export function PaletteDetailsList({
  palettes,
  hasFilters,
  groups,
  tags,
  onOpenComments,
  onEditPalette,
  onDeletePalette,
}: PaletteDetailsListProps) {
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
    <div className="grid gap-4">
      {palettes.map((palette) => (
        <article
          key={palette.id}
          className="grid gap-5 rounded-[15px] bg-card/90 p-4 shadow-sm shadow-black/20 ring-1 ring-black/40 lg:grid-cols-[minmax(320px,1fr)_320px]"
        >
          <div className="grid min-h-44 overflow-hidden rounded-[13px] bg-black/25 p-1 ring-1 ring-black/50">
            <div
              className="grid overflow-hidden rounded-[9px]"
              style={{ gridTemplateColumns: `repeat(${Math.max(palette.colors.length, 1)}, minmax(0, 1fr))` }}
            >
              {palette.colors.map((color) => (
                <div key={color.id} className="relative min-h-40" style={{ backgroundColor: color.hex }}>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-black/70 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white shadow-sm backdrop-blur">
                    {color.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-3xl leading-none text-foreground">{palette.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.1em] text-foreground/58">
                  {palette.colors.length} {palette.colors.length === 1 ? "cor cadastrada" : "cores cadastradas"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
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
            </div>

            <EntityBadges groupIds={palette.groupIds} tagIds={palette.tagIds} groups={groups} tags={tags} />

            <div className="mt-auto flex flex-wrap items-center gap-2">
              <Badge className="inline-flex items-center gap-1 border-transparent bg-white/12 text-white/82 ring-1 ring-black/40">
                <MessageSquare className="h-3 w-3" />
                {palette.comments.length} {palette.comments.length === 1 ? "comentário" : "comentários"}
              </Badge>
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenComments(palette)}>
                Comentários
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
