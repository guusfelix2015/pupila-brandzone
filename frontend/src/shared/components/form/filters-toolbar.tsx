import type { Filters, Group, Tag } from "@/core/types/domain";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

export type FiltersToolbarProps = {
  filters: Filters;
  groups: Group[];
  tags: Tag[];
  onQueryChange: (query: string) => void;
  onGroupChange: (groupId?: string) => void;
  onTagChange: (tagId?: string) => void;
  onClearFilters: () => void;
};

export function FiltersToolbar({
  filters,
  groups,
  tags,
  onQueryChange,
  onGroupChange,
  onTagChange,
  onClearFilters,
}: FiltersToolbarProps) {
  const hasActiveFilters = Boolean(filters.query || filters.groupId || filters.tagId);

  return (
    <div className="grid gap-3 rounded-[15px] border border-foreground/10 bg-foreground/10 p-4 shadow-sm backdrop-blur md:grid-cols-[1fr_220px_220px_auto]">
      <Input
        aria-label="Pesquisar"
        placeholder="Pesquisar por nome, comentário ou tag"
        value={filters.query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Select
        aria-label="Filtrar por grupo"
        value={filters.groupId ?? ""}
        onChange={(event) => onGroupChange(event.target.value || undefined)}
      >
        <option value="">Todos os grupos</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Filtrar por tag"
        value={filters.tagId ?? ""}
        onChange={(event) => onTagChange(event.target.value || undefined)}
      >
        <option value="">Todas as tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </Select>
      <Button type="button" variant="outline" disabled={!hasActiveFilters} onClick={onClearFilters}>
        Limpar
      </Button>
    </div>
  );
}
