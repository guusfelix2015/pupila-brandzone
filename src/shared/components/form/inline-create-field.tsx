import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Plus, X } from "lucide-react";

export type InlineCreateFieldProps = {
  label: string;
  placeholder: string;
  onCreate: (name: string) => boolean;
};

export function InlineCreateField({ label, placeholder, onCreate }: InlineCreateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleOpen(): void {
    setIsOpen(true);
    setValue("");
    setError(null);
  }

  function handleClose(): void {
    setIsOpen(false);
    setValue("");
    setError(null);
  }

  function handleSubmit(): void {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Nome obrigatorio.");
      return;
    }
    const success = onCreate(trimmed);
    if (success) {
      setIsOpen(false);
      setValue("");
      setError(null);
    } else {
      setError("Ja existe um item com esse nome.");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
    if (event.key === "Escape") {
      handleClose();
    }
  }

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1 text-xs text-muted-foreground"
        onClick={handleOpen}
      >
        <Plus className="h-3 w-3" />
        {label}
      </Button>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-8 text-sm"
        />
        {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
      </div>
      <Button type="button" size="sm" className="h-8" onClick={handleSubmit}>
        Criar
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 px-0"
        onClick={handleClose}
        aria-label="Cancelar"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
