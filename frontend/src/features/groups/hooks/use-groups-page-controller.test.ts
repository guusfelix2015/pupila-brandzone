import { act, renderHook } from "@testing-library/react";
import { useGroupsPageController } from "@/features/groups/hooks/use-groups-page-controller";
import { useAppStore } from "@/store/app-store";

describe("useGroupsPageController", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAppStore.getState().resetState();
  });

  it("creates a group through the controller", () => {
    const { result } = renderHook(() => useGroupsPageController());

    act(() => {
      result.current.handleOpenCreateGroup();
    });

    expect(result.current.isFormDialogOpen).toBe(true);

    act(() => {
      expect(result.current.handleSubmitGroup({ name: "Branding" })).toBe(true);
    });

    expect(result.current.groups).toHaveLength(1);
    expect(result.current.groups[0].name).toBe("Branding");
    expect(result.current.isFormDialogOpen).toBe(false);
  });

  it("edits a selected group and exits edit mode after save", () => {
    const { result } = renderHook(() => useGroupsPageController());

    act(() => {
      result.current.handleSubmitGroup({ name: "Branding" });
    });

    act(() => {
      result.current.handleEditGroup(result.current.groups[0]);
    });

    expect(result.current.editingGroup?.name).toBe("Branding");
    expect(result.current.isFormDialogOpen).toBe(true);
    expect(result.current.submitLabel).toBe("Salvar grupo");

    act(() => {
      expect(result.current.handleSubmitGroup({ name: "Campanha" })).toBe(true);
    });

    expect(result.current.editingGroup).toBeUndefined();
    expect(result.current.isFormDialogOpen).toBe(false);
    expect(result.current.groups[0].name).toBe("Campanha");
  });

  it("closes the form dialog and clears edit state", () => {
    const { result } = renderHook(() => useGroupsPageController());

    act(() => {
      result.current.handleSubmitGroup({ name: "Branding" });
    });

    act(() => {
      result.current.handleEditGroup(result.current.groups[0]);
    });

    act(() => {
      result.current.handleCloseFormDialog();
    });

    expect(result.current.isFormDialogOpen).toBe(false);
    expect(result.current.editingGroup).toBeUndefined();
  });

  it("sets and cancels the group selected for deletion", () => {
    const { result } = renderHook(() => useGroupsPageController());

    act(() => {
      result.current.handleSubmitGroup({ name: "Branding" });
    });

    const groupId = result.current.groups[0].id;

    act(() => {
      result.current.handleRequestDeleteGroup(groupId);
    });

    expect(result.current.deletingGroup?.id).toBe(groupId);

    act(() => {
      result.current.handleCancelDeleteGroup();
    });

    expect(result.current.groups).toHaveLength(1);
    expect(result.current.deletingGroup).toBeUndefined();
  });

  it("deletes when deletion is confirmed", () => {
    const { result } = renderHook(() => useGroupsPageController());

    act(() => {
      result.current.handleSubmitGroup({ name: "Branding" });
    });

    const groupId = result.current.groups[0].id;

    act(() => {
      result.current.handleRequestDeleteGroup(groupId);
    });

    act(() => {
      result.current.handleConfirmDeleteGroup();
    });

    expect(result.current.groups).toEqual([]);
    expect(result.current.deletingGroup).toBeUndefined();
  });
});
