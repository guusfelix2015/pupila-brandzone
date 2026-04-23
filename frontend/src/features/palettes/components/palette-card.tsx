import type { Group, PaletteItem, Tag } from "@/core/types/domain";
import { cn } from "@/lib/utils/cn";
import { EntityBadges } from "@/shared/components/data-display/entity-badges";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";

export type PaletteCardProps = {
  palette: PaletteItem;
  groups: Group[];
  tags: Tag[];
  onOpenComments: (palette: PaletteItem) => void;
  onEditPalette: (palette: PaletteItem) => void;
  onDeletePalette: (paletteId: string) => void;
};

export function PaletteCard({
  palette,
  groups,
  tags,
  onOpenComments,
  onEditPalette,
  onDeletePalette,
}: PaletteCardProps) {
  return (
    <Card className="transition-transform hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="line-clamp-2">{palette.title}</CardTitle>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 px-0 text-muted-foreground hover:text-foreground"
            onClick={() => onEditPalette(palette)}
            aria-label="Editar paleta"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 px-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDeletePalette(palette.id)}
            aria-label="Excluir paleta"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div
          className={cn(
            "grid overflow-hidden rounded-md border",
            palette.colors.length === 1 && "grid-cols-1",
            palette.colors.length === 2 && "grid-cols-2",
            palette.colors.length === 3 && "grid-cols-3",
            palette.colors.length === 4 && "grid-cols-4",
            palette.colors.length >= 5 && "grid-cols-5",
          )}
        >
          {palette.colors.map((color) => (
            <div key={color.id} className="grid min-h-20 place-items-center" style={{ backgroundColor: color.hex }}>
              <span className="rounded-md bg-background/85 px-2 py-1 text-xs font-medium">{color.hex}</span>
            </div>
          ))}
        </div>
        <EntityBadges groupIds={palette.groupIds} tagIds={palette.tagIds} groups={groups} tags={tags} />
        <Badge className="w-fit inline-flex items-center gap-1 border-white/15 bg-white/12 text-white/82">
          <MessageSquare className="h-3 w-3" />
          {palette.comments.length} {palette.comments.length === 1 ? "comentário" : "comentários"}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => onOpenComments(palette)}>
          Comentários
        </Button>
      </CardFooter>
    </Card>
  );
}
