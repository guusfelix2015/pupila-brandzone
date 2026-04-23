import type { Tag } from "@/core/types/domain";
import { stringToHslColor } from "@/lib/utils/colors";
import type { EntityCounts } from "@/lib/utils/entity-counts";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Pencil, Trash2, TagIcon, Image, Palette } from "lucide-react";

export type TagListProps = {
  tags: Tag[];
  tagCounts: Map<string, EntityCounts>;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
};

export function TagList({ tags, tagCounts, onEditTag, onDeleteTag }: TagListProps) {
  if (tags.length === 0) {
    return (
      <EmptyState
        title="Nenhuma tag cadastrada"
        description="Crie tags para classificar referencias e melhorar a busca."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tags.map((tag, index) => {
        const counts = tagCounts.get(tag.id) ?? { images: 0, palettes: 0, total: 0 };
        const tagColor = stringToHslColor(tag.name, 65, 40);
        const tagBg = stringToHslColor(tag.name, 55, 94);

        return (
          <div
            key={tag.id}
            className="group relative flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={
              {
                animationDelay: `${index * 40}ms`,
              } as React.CSSProperties
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm"
                  style={{ backgroundColor: tagBg, color: tagColor }}
                  aria-hidden="true"
                >
                  <TagIcon className="h-4 w-4" />
                </div>
                <h3 className="truncate text-base font-semibold text-foreground">{tag.name}</h3>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 px-0 text-muted-foreground hover:text-foreground"
                  onClick={() => onEditTag(tag)}
                  aria-label={`Editar ${tag.name}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 px-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onDeleteTag(tag.id)}
                  aria-label={`Excluir ${tag.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {counts.images > 0 && (
                <Badge className="inline-flex items-center gap-1 border-accent/70 bg-accent/95 text-black">
                  <Image className="h-3 w-3" />
                  {counts.images}
                </Badge>
              )}
              {counts.palettes > 0 && (
                <Badge className="inline-flex items-center gap-1 border-secondary/70 bg-secondary/90 text-black">
                  <Palette className="h-3 w-3" />
                  {counts.palettes}
                </Badge>
              )}
              {counts.total === 0 && <span className="text-xs text-muted-foreground">Sem itens vinculados</span>}
              {counts.total > 0 && (
                <span className="ml-auto text-xs font-medium text-muted-foreground">
                  {counts.total} {counts.total === 1 ? "item" : "itens"}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
