"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { TurnstileField } from "@/components/forms/turnstile-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import {
  newsletterSchema,
  type NewsletterInput,
  type NewsletterSubscription,
} from "@/lib/validations/inquiries";

const defaultValues: NewsletterInput = {
  email: "",
  privacyConsent: false,
  turnstileToken: "",
  website: "",
};

export function NewsletterForm({ siteKey }: { siteKey?: string }) {
  const [status, setStatus] = useState<
    { kind: "error" | "success"; message: string } | undefined
  >();
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<NewsletterInput, undefined, NewsletterSubscription>({
    defaultValues,
    resolver: zodResolver(newsletterSchema),
  });
  const updateTurnstileToken = useCallback(
    (token: string) => setValue("turnstileToken", token),
    [setValue],
  );

  const onSubmit = handleSubmit(async (values) => {
    setStatus(undefined);

    try {
      const response = await fetch("/api/newsletter", {
        body: JSON.stringify(values),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        ok?: boolean;
      };

      if (!response.ok || result.ok !== true) {
        throw new Error(
          result.message || "The signup could not be saved. Try again later.",
        );
      }

      setStatus({
        kind: "success",
        message: result.message || "Your subscription is saved.",
      });
      reset(defaultValues);
      setTurnstileResetKey((current) => current + 1);
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "The signup could not be saved. Try again later.",
      });
      setValue("turnstileToken", "");
      setTurnstileResetKey((current) => current + 1);
    }
  });

  return (
    <form className="space-y-3" noValidate onSubmit={onSubmit}>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <Input
            aria-describedby={
              errors.email ? "newsletter-email-error" : undefined
            }
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="h-11"
            id="newsletter-email"
            inputMode="email"
            placeholder="Email address"
            type="email"
            {...register("email")}
          />
        </div>
        <Button
          aria-label="Subscribe to studio notes"
          disabled={isSubmitting}
          size="icon"
          type="submit"
          variant="brand"
        >
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" />
          )}
        </Button>
      </div>
      {errors.email ? (
        <p className="text-xs text-destructive" id="newsletter-email-error">
          {errors.email.message}
        </p>
      ) : null}

      <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-muted-foreground">
        <input
          aria-describedby={
            errors.privacyConsent ? "newsletter-consent-error" : undefined
          }
          aria-invalid={Boolean(errors.privacyConsent)}
          className="mt-0.5 size-3.5 shrink-0 accent-primary"
          type="checkbox"
          {...register("privacyConsent")}
        />
        <span>
          I want occasional studio notes and consent to the use of my email for
          this purpose.
        </span>
      </label>
      {errors.privacyConsent ? (
        <p className="text-xs text-destructive" id="newsletter-consent-error">
          {errors.privacyConsent.message}
        </p>
      ) : null}

      <div aria-hidden="true" className="absolute left-[-10000px] top-auto">
        <label htmlFor="newsletter-website">Website</label>
        <input
          autoComplete="off"
          id="newsletter-website"
          tabIndex={-1}
          {...register("website")}
        />
      </div>

      <TurnstileField
        action="newsletter"
        onTokenChange={updateTurnstileToken}
        resetKey={turnstileResetKey}
        siteKey={siteKey}
      />

      {status ? (
        <p
          className={cn(
            "text-xs leading-5",
            status.kind === "success" ? "text-primary" : "text-destructive",
          )}
          role={status.kind === "error" ? "alert" : "status"}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
