import type { ID } from "@/core/types/domain";
import { InlineCreateField } from "@/shared/components/form/inline-create-field";

export type MultiSelectOption = {
  id: ID;
  name: string;
};

export type MultiSelectCheckboxGroupProps = {
  label: string;
  name: string;
  options: MultiSelectOption[];
  selectedIds: ID[];
  onChange: (selectedIds: ID[]) => void;
  emptyMessage: string;
  createLabel?: string;
  createPlaceholder?: string;
  onCreateItem?: (name: string) => boolean;
};

export function MultiSelectCheckboxGroup({
  label,
  name,
  options,
  selectedIds,
  onChange,
  emptyMessage,
  createLabel,
  createPlaceholder,
  onCreateItem,
}: MultiSelectCheckboxGroupProps) {
  function toggleOption(optionId: ID): void {
    const nextSelectedIds = selectedIds.includes(optionId)
      ? selectedIds.filter((selectedId) => selectedId !== optionId)
      : [...selectedIds, optionId];

    onChange(nextSelectedIds);
  }

  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium">{label}</legend>
      {options.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <label key={option.id} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <input
                name={name}
                type="checkbox"
                checked={selectedIds.includes(option.id)}
                onChange={() => toggleOption(option.id)}
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
      {onCreateItem && createLabel && createPlaceholder ? (
        <InlineCreateField label={createLabel} placeholder={createPlaceholder} onCreate={onCreateItem} />
      ) : null}
    </fieldset>
  );
}
