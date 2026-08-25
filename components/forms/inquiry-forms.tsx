"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { TurnstileField } from "@/components/forms/turnstile-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PARTNER_AVAILABILITY_OPTIONS,
  PROJECT_TIMELINE_OPTIONS,
} from "@/lib/constants/inquiries";
import { SERVICE_CATALOG } from "@/lib/constants/services";
import { cn } from "@/lib/utils/cn";
import {
  clientInquirySchema,
  partnerInquirySchema,
  type ClientInquiry,
  type ClientInquiryInput,
  type PartnerInquiry,
  type PartnerInquiryInput,
} from "@/lib/validations/inquiries";

type SubmitStatus = { kind: "error" | "success"; message: string } | undefined;

type ApiResponse = {
  message?: string;
  ok?: boolean;
};

const DEFAULT_SERVICE_OPTIONS = SERVICE_CATALOG.map(({ id, title }) => ({
  id,
  title,
}));

const selectClassName =
  "flex h-12 w-full rounded-lg border border-input bg-surface/70 px-4 py-2 text-sm text-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.025)] transition-[border-color,background-color,box-shadow] duration-300 hover:border-foreground/20 focus-visible:border-primary/60 focus-visible:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-45 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20";

async function postSubmission(path: string, body: unknown) {
  const response = await fetch(path, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  const result = (await response.json().catch(() => ({}))) as ApiResponse;

  if (!response.ok || result.ok !== true) {
    throw new Error(
      result.message || "The form could not be sent. Please try again later.",
    );
  }

  return result.message || "Your details have been received.";
}

function Field({
  children,
  error,
  hint,
  htmlFor,
  label,
  optional,
}: {
  children: ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  label: string;
  optional?: boolean;
}) {
  const descriptionId = `${htmlFor}-description`;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          className="text-sm font-semibold text-foreground"
          htmlFor={htmlFor}
        >
          {label}
        </label>
        {optional ? (
          <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            Optional
          </span>
        ) : null}
      </div>
      {children}
      {error || hint ? (
        <p
          className={cn(
            "text-xs leading-5",
            error ? "text-destructive" : "text-muted-foreground",
          )}
          id={descriptionId}
        >
          {error || hint}
        </p>
      ) : null}
    </div>
  );
}

function ServiceChecklist({
  error,
  registerService,
  services,
}: {
  error?: string;
  services: readonly { id: string; title: string }[];
  registerService: (serviceId: string) => {
    name: "serviceIds";
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    ref: React.RefCallback<HTMLInputElement>;
  };
}) {
  return (
    <fieldset aria-describedby={error ? "services-error" : undefined}>
      <legend className="text-sm font-semibold text-foreground">
        Which services fit this conversation?
      </legend>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Select every relevant area. You can refine the details later.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <label className="group relative cursor-pointer" key={service.id}>
            <input
              className="peer sr-only"
              type="checkbox"
              value={service.id}
              {...registerService(service.id)}
            />
            <span className="flex min-h-14 items-center gap-3 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3.5 py-3 text-sm text-muted-foreground transition-[border-color,background-color,color,box-shadow] group-hover:border-white/20 group-hover:text-foreground peer-checked:border-primary/55 peer-checked:bg-primary/[0.12] peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:[&_.service-check-box]:border-primary peer-checked:[&_.service-check]:opacity-100">
              <span className="service-check-box flex size-5 shrink-0 items-center justify-center rounded-md border border-white/15 bg-background/40">
                <Check
                  aria-hidden="true"
                  className="service-check size-3.5 opacity-0 transition-opacity"
                />
              </span>
              {service.title}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-xs text-destructive" id="services-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function ConsentFields({
  idPrefix,
  newsletterRegistration,
  privacyError,
  privacyRegistration,
}: {
  idPrefix: "client" | "partner";
  newsletterRegistration: React.InputHTMLAttributes<HTMLInputElement>;
  privacyError?: string;
  privacyRegistration: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const privacyErrorId = `${idPrefix}-privacy-consent-error`;

  return (
    <div className="space-y-3 border-t border-white/[0.08] pt-5">
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          aria-describedby={privacyError ? privacyErrorId : undefined}
          aria-invalid={Boolean(privacyError)}
          className="mt-1 size-4 shrink-0 accent-primary"
          type="checkbox"
          {...privacyRegistration}
        />
        <span>
          I consent to AY Media Work using these details to review and respond
          to this inquiry. <span className="text-destructive">*</span>
        </span>
      </label>
      {privacyError ? (
        <p className="pl-7 text-xs text-destructive" id={privacyErrorId}>
          {privacyError}
        </p>
      ) : null}
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          className="mt-1 size-4 shrink-0 accent-primary"
          type="checkbox"
          {...newsletterRegistration}
        />
        <span>
          Also send me occasional AY Media Work studio notes. This is optional
          and can be withdrawn later.
        </span>
      </label>
    </div>
  );
}

function FormStatus({ status }: { status: SubmitStatus }) {
  if (!status) return null;

  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm leading-6",
        status.kind === "success"
          ? "border-primary/35 bg-primary/10 text-foreground"
          : "border-destructive/35 bg-destructive/10 text-foreground",
      )}
      role={status.kind === "error" ? "alert" : "status"}
    >
      {status.message}
    </div>
  );
}

export function ClientInquiryForm({
  initialServiceId,
  services = DEFAULT_SERVICE_OPTIONS,
  turnstileSiteKey,
}: {
  initialServiceId?: string;
  services?: readonly { id: string; title: string }[];
  turnstileSiteKey?: string;
}) {
  const defaultValues = useMemo<ClientInquiryInput>(
    () => ({
      brief: "",
      companyBrand: "",
      contactNumber: "",
      email: "",
      name: "",
      newsletterConsent: false,
      preferredTimeline: "flexible",
      privacyConsent: false,
      serviceIds: initialServiceId ? [initialServiceId] : [],
      turnstileToken: "",
      type: "client",
      website: "",
    }),
    [initialServiceId],
  );
  const [status, setStatus] = useState<SubmitStatus>();
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<ClientInquiryInput, undefined, ClientInquiry>({
    defaultValues,
    resolver: zodResolver(clientInquirySchema),
  });
  const updateTurnstileToken = useCallback(
    (token: string) => setValue("turnstileToken", token),
    [setValue],
  );

  const onSubmit = handleSubmit(async (values) => {
    setStatus(undefined);
    try {
      const message = await postSubmission("/api/inquiries", values);
      setStatus({ kind: "success", message });
      reset({ ...defaultValues, serviceIds: [] });
      setTurnstileResetKey((current) => current + 1);
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "The form could not be sent. Please try again later.",
      });
      setValue("turnstileToken", "");
      setTurnstileResetKey((current) => current + 1);
    }
  });

  return (
    <form className="space-y-6" noValidate onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field error={errors.name?.message} htmlFor="client-name" label="Name">
          <Input
            aria-describedby={
              errors.name ? "client-name-description" : undefined
            }
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            id="client-name"
            placeholder="Your name"
            {...register("name")}
          />
        </Field>
        <Field
          error={errors.email?.message}
          htmlFor="client-email"
          label="Email"
        >
          <Input
            aria-describedby={
              errors.email ? "client-email-description" : undefined
            }
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id="client-email"
            inputMode="email"
            placeholder="you@example.com"
            type="email"
            {...register("email")}
          />
        </Field>
        <Field
          error={errors.contactNumber?.message}
          htmlFor="client-phone"
          label="Contact number"
          optional
        >
          <Input
            aria-describedby={
              errors.contactNumber ? "client-phone-description" : undefined
            }
            aria-invalid={Boolean(errors.contactNumber)}
            autoComplete="tel"
            id="client-phone"
            inputMode="tel"
            placeholder="Include your country code"
            type="tel"
            {...register("contactNumber")}
          />
        </Field>
        <Field
          error={errors.companyBrand?.message}
          htmlFor="client-company"
          label="Company / brand"
          optional
        >
          <Input
            aria-describedby={
              errors.companyBrand ? "client-company-description" : undefined
            }
            aria-invalid={Boolean(errors.companyBrand)}
            autoComplete="organization"
            id="client-company"
            placeholder="Company or brand name"
            {...register("companyBrand")}
          />
        </Field>
      </div>

      <ServiceChecklist
        error={errors.serviceIds?.message}
        registerService={() => register("serviceIds")}
        services={services}
      />

      <Field
        error={errors.preferredTimeline?.message}
        htmlFor="client-timeline"
        label="Preferred timeline"
      >
        <select
          aria-describedby={
            errors.preferredTimeline ? "client-timeline-description" : undefined
          }
          aria-invalid={Boolean(errors.preferredTimeline)}
          className={selectClassName}
          id="client-timeline"
          {...register("preferredTimeline")}
        >
          {PROJECT_TIMELINE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        error={errors.brief?.message}
        hint="Useful context can include the goal, audience, deliverables, references, and anything already available."
        htmlFor="client-brief"
        label="Project details"
      >
        <Textarea
          aria-describedby="client-brief-description"
          aria-invalid={Boolean(errors.brief)}
          className="min-h-44"
          id="client-brief"
          placeholder="Tell us what you want to create and what the work needs to do."
          {...register("brief")}
        />
      </Field>

      <div aria-hidden="true" className="absolute left-[-10000px] top-auto">
        <label htmlFor="client-website">Website</label>
        <input
          autoComplete="off"
          id="client-website"
          tabIndex={-1}
          {...register("website")}
        />
      </div>

      <ConsentFields
        idPrefix="client"
        newsletterRegistration={register("newsletterConsent")}
        privacyError={errors.privacyConsent?.message}
        privacyRegistration={register("privacyConsent")}
      />

      <TurnstileField
        action="client-inquiry"
        onTokenChange={updateTurnstileToken}
        resetKey={turnstileResetKey}
        siteKey={turnstileSiteKey}
      />
      <FormStatus status={status} />

      <Button disabled={isSubmitting} size="lg" type="submit" variant="brand">
        {isSubmitting ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <ArrowUpRight aria-hidden="true" />
        )}
        {isSubmitting ? "Sending details…" : "Send project details"}
      </Button>
    </form>
  );
}

export function PartnerInquiryForm({
  services = DEFAULT_SERVICE_OPTIONS,
  turnstileSiteKey,
}: {
  services?: readonly { id: string; title: string }[];
  turnstileSiteKey?: string;
}) {
  const defaultValues = useMemo<PartnerInquiryInput>(
    () => ({
      availability: "project-dependent",
      collaborationMessage: "",
      contactNumber: "",
      email: "",
      name: "",
      newsletterConsent: false,
      portfolioUrl: "",
      privacyConsent: false,
      serviceIds: [],
      specialty: "",
      turnstileToken: "",
      type: "partner",
      website: "",
    }),
    [],
  );
  const [status, setStatus] = useState<SubmitStatus>();
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<PartnerInquiryInput, undefined, PartnerInquiry>({
    defaultValues,
    resolver: zodResolver(partnerInquirySchema),
  });
  const updateTurnstileToken = useCallback(
    (token: string) => setValue("turnstileToken", token),
    [setValue],
  );

  const onSubmit = handleSubmit(async (values) => {
    setStatus(undefined);
    try {
      const message = await postSubmission("/api/inquiries", values);
      setStatus({ kind: "success", message });
      reset(defaultValues);
      setTurnstileResetKey((current) => current + 1);
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "The form could not be sent. Please try again later.",
      });
      setValue("turnstileToken", "");
      setTurnstileResetKey((current) => current + 1);
    }
  });

  return (
    <form className="space-y-6" noValidate onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field error={errors.name?.message} htmlFor="partner-name" label="Name">
          <Input
            aria-describedby={
              errors.name ? "partner-name-description" : undefined
            }
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            id="partner-name"
            placeholder="Your name"
            {...register("name")}
          />
        </Field>
        <Field
          error={errors.email?.message}
          htmlFor="partner-email"
          label="Email"
        >
          <Input
            aria-describedby={
              errors.email ? "partner-email-description" : undefined
            }
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id="partner-email"
            inputMode="email"
            placeholder="you@example.com"
            type="email"
            {...register("email")}
          />
        </Field>
        <Field
          error={errors.contactNumber?.message}
          htmlFor="partner-phone"
          label="Contact number"
          optional
        >
          <Input
            aria-describedby={
              errors.contactNumber ? "partner-phone-description" : undefined
            }
            aria-invalid={Boolean(errors.contactNumber)}
            autoComplete="tel"
            id="partner-phone"
            inputMode="tel"
            placeholder="Include your country code"
            type="tel"
            {...register("contactNumber")}
          />
        </Field>
        <Field
          error={errors.specialty?.message}
          htmlFor="partner-specialty"
          label="Primary specialty"
        >
          <Input
            aria-describedby={
              errors.specialty ? "partner-specialty-description" : undefined
            }
            aria-invalid={Boolean(errors.specialty)}
            id="partner-specialty"
            placeholder="e.g. 3D artist, editor, developer"
            {...register("specialty")}
          />
        </Field>
        <Field
          error={errors.portfolioUrl?.message}
          htmlFor="partner-portfolio"
          label="Portfolio URL"
        >
          <Input
            aria-describedby={
              errors.portfolioUrl ? "partner-portfolio-description" : undefined
            }
            aria-invalid={Boolean(errors.portfolioUrl)}
            autoComplete="url"
            id="partner-portfolio"
            inputMode="url"
            placeholder="https://yourportfolio.com"
            type="url"
            {...register("portfolioUrl")}
          />
        </Field>
        <Field
          error={errors.availability?.message}
          htmlFor="partner-availability"
          label="Availability"
        >
          <select
            aria-describedby={
              errors.availability
                ? "partner-availability-description"
                : undefined
            }
            aria-invalid={Boolean(errors.availability)}
            className={selectClassName}
            id="partner-availability"
            {...register("availability")}
          >
            {PARTNER_AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <ServiceChecklist
        error={errors.serviceIds?.message}
        registerService={() => register("serviceIds")}
        services={services}
      />

      <Field
        error={errors.collaborationMessage?.message}
        hint="Share the kind of work you enjoy, how you like to contribute, and any useful context about your practice."
        htmlFor="partner-message"
        label="Collaboration details"
      >
        <Textarea
          aria-describedby="partner-message-description"
          aria-invalid={Boolean(errors.collaborationMessage)}
          className="min-h-44"
          id="partner-message"
          placeholder="Tell us how you would like to work together."
          {...register("collaborationMessage")}
        />
      </Field>

      <div aria-hidden="true" className="absolute left-[-10000px] top-auto">
        <label htmlFor="partner-website">Website</label>
        <input
          autoComplete="off"
          id="partner-website"
          tabIndex={-1}
          {...register("website")}
        />
      </div>

      <ConsentFields
        idPrefix="partner"
        newsletterRegistration={register("newsletterConsent")}
        privacyError={errors.privacyConsent?.message}
        privacyRegistration={register("privacyConsent")}
      />

      <TurnstileField
        action="partner-inquiry"
        onTokenChange={updateTurnstileToken}
        resetKey={turnstileResetKey}
        siteKey={turnstileSiteKey}
      />
      <FormStatus status={status} />

      <Button disabled={isSubmitting} size="lg" type="submit" variant="brand">
        {isSubmitting ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <ArrowUpRight aria-hidden="true" />
        )}
        {isSubmitting ? "Sending details…" : "Send collaboration details"}
      </Button>
    </form>
  );
}
