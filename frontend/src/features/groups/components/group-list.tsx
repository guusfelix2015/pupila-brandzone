import type { Group } from "@/core/types/domain";
import { stringToHslColor } from "@/lib/utils/colors";
import type { EntityCounts } from "@/lib/utils/entity-counts";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Pencil, Trash2, FolderOpen, Image, Palette } from "lucide-react";

export type GroupListProps = {
  groups: Group[];
  groupCounts: Map<string, EntityCounts>;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (groupId: string) => void;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function GroupList({ groups, groupCounts, onEditGroup, onDeleteGroup }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <EmptyState
        title="Nenhum grupo cadastrado"
        description="Crie grupos para organizar imagens e paletas por contexto."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {groups.map((group, index) => {
        const counts = groupCounts.get(group.id) ?? { images: 0, palettes: 0, total: 0 };
        const avatarColor = stringToHslColor(group.name, 65, 40);

        return (
          <div
            key={group.id}
            className="group relative flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={
              {
                animationDelay: `${index * 40}ms`,
              } as React.CSSProperties
            }
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: avatarColor }}
              aria-hidden="true"
            >
              {getInitials(group.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold text-foreground">{group.name}</h3>
                {counts.total === 0 && (
                  <Badge className="shrink-0 bg-muted text-muted-foreground border-0">Vazio</Badge>
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {counts.images > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-accent-foreground">
                    <Image className="h-3 w-3" />
                    {counts.images} {counts.images === 1 ? "imagem" : "imagens"}
                  </span>
                )}
                {counts.palettes > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-secondary/40 px-2 py-0.5 text-secondary-foreground">
                    <Palette className="h-3 w-3" />
                    {counts.palettes} {counts.palettes === 1 ? "paleta" : "paletas"}
                  </span>
                )}
                {counts.total === 0 && (
                  <span className="inline-flex items-center gap-1">
                    <FolderOpen className="h-3 w-3" />
                    Sem itens
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground"
                onClick={() => onEditGroup(group)}
                aria-label={`Editar ${group.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 px-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteGroup(group.id)}
                aria-label={`Excluir ${group.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
