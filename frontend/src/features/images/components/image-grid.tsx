import type { Group, ImageItem, Tag } from "@/core/types/domain";
import { ImageCard } from "@/features/images/components/image-card";
import { EmptyState } from "@/shared/components/feedback/empty-state";

export type ImageGridProps = {
  images: ImageItem[];
  hasFilters: boolean;
  groups: Group[];
  tags: Tag[];
  onOpenComments: (image: ImageItem) => void;
  onEditImage: (image: ImageItem) => void;
  onDeleteImage: (imageId: string) => void;
};

export function ImageGrid({
  images,
  hasFilters,
  groups,
  tags,
  onOpenComments,
  onEditImage,
  onDeleteImage,
}: ImageGridProps) {
  if (images.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? "Nenhuma imagem encontrada" : "Nenhuma imagem cadastrada"}
        description={
          hasFilters
            ? "Ajuste a busca ou os filtros para ampliar os resultados."
            : "Cadastre imagens por URL para iniciar a biblioteca."
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          groups={groups}
          tags={tags}
          onOpenComments={onOpenComments}
          onEditImage={onEditImage}
          onDeleteImage={onDeleteImage}
        />
      ))}
    </div>
  );
}
