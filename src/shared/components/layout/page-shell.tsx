import type { ReactNode } from "react";

export type PageShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  stats?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, description, action, stats, children }: PageShellProps) {
  return (
    <section className="grid gap-7">
      <div className="flex flex-col gap-5 border-b border-foreground/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Acervo do MVP</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-foreground">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
          {stats ? <div className="mt-1 flex flex-wrap items-center gap-2">{stats}</div> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
