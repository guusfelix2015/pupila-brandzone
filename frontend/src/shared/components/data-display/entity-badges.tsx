import type { Group, ID, Tag } from "@/core/types/domain";
import { Badge } from "@/shared/ui/badge";

export const ENTITY_BADGE_TYPE = {
  GROUP: "group",
  TAG: "tag",
} as const;

const entityBadgeClasses = {
  [ENTITY_BADGE_TYPE.GROUP]: "border-accent/70 bg-accent/95 text-black shadow-sm shadow-accent/10",
  [ENTITY_BADGE_TYPE.TAG]: "border-secondary/70 bg-secondary/90 text-black shadow-sm shadow-secondary/10",
};

export type EntityBadgesProps = {
  groupIds: ID[];
  tagIds: ID[];
  groups: Group[];
  tags: Tag[];
  limit?: number;
};

type BadgeItem = {
  id: string;
  label: string;
  type: (typeof ENTITY_BADGE_TYPE)[keyof typeof ENTITY_BADGE_TYPE];
};

export function EntityBadges({ groupIds, tagIds, groups, tags, limit = 6 }: EntityBadgesProps) {
  const selectedGroups = groupIds
    .map((groupId) => groups.find((group) => group.id === groupId))
    .filter(Boolean) as Group[];
  const selectedTags = tagIds.map((tagId) => tags.find((tag) => tag.id === tagId)).filter(Boolean) as Tag[];

  const allItems: BadgeItem[] = [
    ...selectedGroups.map((g) => ({ id: g.id, label: g.name, type: ENTITY_BADGE_TYPE.GROUP })),
    ...selectedTags.map((t) => ({ id: t.id, label: t.name, type: ENTITY_BADGE_TYPE.TAG })),
  ];

  if (allItems.length === 0) {
    return <p className="text-sm text-muted-foreground">Sem grupos ou tags.</p>;
  }

  const visibleItems = allItems.slice(0, limit);
  const hiddenItems = allItems.slice(limit);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleItems.map((item) => (
        <Badge
          key={item.id}
          className={entityBadgeClasses[item.type]}
        >
          {item.type === ENTITY_BADGE_TYPE.GROUP ? "Grupo:" : "Tag:"} {item.label}
        </Badge>
      ))}

      {hiddenItems.length > 0 && (
        <div className="group relative inline-flex">
          <Badge className="cursor-help border-white/20 bg-white/90 text-black">+{hiddenItems.length}</Badge>

          <div className="invisible absolute bottom-full left-1/2 z-50 mb-2 min-w-[180px] max-w-[260px] -translate-x-1/2 rounded-lg border bg-card p-3 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Grupos e tags</div>
            <div className="flex flex-wrap gap-1.5">
              {hiddenItems.map((item) => (
                <Badge
                  key={item.id}
                  className={entityBadgeClasses[item.type]}
                >
                  {item.type === ENTITY_BADGE_TYPE.GROUP ? "G:" : "T:"} {item.label}
                </Badge>
              ))}
            </div>
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r bg-card" />
          </div>
        </div>
      )}
    </div>
  );
}
