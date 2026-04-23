import type { Group, ImageItem, Tag } from "@/core/types/domain";
import { EntityBadges } from "@/shared/components/data-display/entity-badges";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";

export type ImageCardProps = {
  image: ImageItem;
  groups: Group[];
  tags: Tag[];
  onOpenComments: (image: ImageItem) => void;
  onEditImage: (image: ImageItem) => void;
  onDeleteImage: (imageId: string) => void;
};

export function ImageCard({ image, groups, tags, onOpenComments, onEditImage, onDeleteImage }: ImageCardProps) {
  return (
    <Card className="overflow-hidden transition-transform hover:-translate-y-0.5">
      <div className="aspect-[4/3] bg-muted">
        <img src={image.imageUrl} alt={image.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="line-clamp-2">{image.title}</CardTitle>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 px-0 text-muted-foreground hover:text-foreground"
            onClick={() => onEditImage(image)}
            aria-label="Editar imagem"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 px-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDeleteImage(image.id)}
            aria-label="Excluir imagem"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <EntityBadges groupIds={image.groupIds} tagIds={image.tagIds} groups={groups} tags={tags} />
        <Badge className="w-fit inline-flex items-center gap-1 border-muted bg-muted text-muted-foreground">
          <MessageSquare className="h-3 w-3" />
          {image.comments.length} {image.comments.length === 1 ? "comentário" : "comentários"}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => onOpenComments(image)}>
          Comentários
        </Button>
      </CardFooter>
    </Card>
  );
}
