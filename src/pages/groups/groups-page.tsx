import { useGroupsPageController } from "@/features/groups/hooks/use-groups-page-controller";
import { GroupsPageView } from "@/features/groups/views/groups-page-view";

export function GroupsPage() {
  const groupsPageController = useGroupsPageController();

  return <GroupsPageView groupsPageController={groupsPageController} />;
}
