import type { ReactNode } from "react";

export const adminSelectClassName =
  "flex h-11 w-full rounded-lg border border-input bg-surface/70 px-4 text-sm text-foreground focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-45";

export function AdminField({
  children,
  description,
  htmlFor,
  label,
}: {
  children: ReactNode;
  description?: string;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {description ? (
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function AdminFormSection({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <fieldset className="rounded-xl border border-white/[0.08] bg-surface/35 p-5 sm:p-6">
      <legend className="px-2 font-display text-xl font-semibold">
        {title}
      </legend>
      {description ? (
        <p className="mb-5 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function AdminCheckbox({
  defaultChecked,
  description,
  label,
  name,
}: {
  defaultChecked?: boolean;
  description?: string;
  label: string;
  name: string;
}) {
  return (
    <label className="flex gap-3 rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
      <input
        className="mt-1 size-4 accent-primary"
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
      />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
