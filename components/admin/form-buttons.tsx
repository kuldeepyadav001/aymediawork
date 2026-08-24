"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function FormSubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "default",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "default" | "secondary" | "destructive";
}) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" variant={variant}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

export function ConfirmSubmitButton({
  children,
  message = "This action cannot be undone. Continue?",
}: {
  children: React.ReactNode;
  message?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      size="sm"
      type="submit"
      variant="destructive"
    >
      {pending ? "Working…" : children}
    </Button>
  );
}
