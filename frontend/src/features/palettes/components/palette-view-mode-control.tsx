import { PALETTE_VIEW_MODE, type PaletteViewMode } from "@/features/palettes/types/palette-view-mode";
import { cn } from "@/lib/utils/cn";
import { LayoutGrid, List, PanelTop } from "lucide-react";

export type PaletteViewModeControlProps = {
  value: PaletteViewMode;
  onChange: (viewMode: PaletteViewMode) => void;
};

const options = [
  { value: PALETTE_VIEW_MODE.GRID, label: "Grade", icon: LayoutGrid },
  { value: PALETTE_VIEW_MODE.LIST, label: "Lista", icon: List },
  { value: PALETTE_VIEW_MODE.DETAILS, label: "Detalhes", icon: PanelTop },
] satisfies Array<{
  value: PaletteViewMode;
  label: string;
  icon: typeof LayoutGrid;
}>;

export function PaletteViewModeControl({ value, onChange }: PaletteViewModeControlProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70">Visualização</p>
      <div className="inline-flex rounded-[12px] bg-card/80 p-1 shadow-sm shadow-black/20 ring-1 ring-black/40">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-[10px] px-3 text-xs font-semibold uppercase tracking-[0.07em] transition-colors",
                isSelected ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/68 hover:bg-white/8 hover:text-foreground",
              )}
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
            >
              <Icon className="h-3.5 w-3.5" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
