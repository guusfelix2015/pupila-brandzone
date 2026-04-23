import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[10px] border px-2.5 py-1 text-xs font-medium uppercase tracking-[0.07em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
