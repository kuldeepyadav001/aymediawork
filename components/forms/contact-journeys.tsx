"use client";

import { Handshake, Sparkles } from "lucide-react";

import {
  ClientInquiryForm,
  PartnerInquiryForm,
} from "@/components/forms/inquiry-forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InquiryType } from "@/lib/constants/inquiries";

export function ContactJourneys({
  initialServiceId,
  initialType,
  turnstileSiteKey,
}: {
  initialServiceId?: string;
  initialType: InquiryType;
  turnstileSiteKey?: string;
}) {
  return (
    <Tabs defaultValue={initialType}>
      <div className="mb-7 flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="editorial-kicker mb-3">Choose your path</p>
          <h2 className="font-display text-2xl tracking-[-0.035em] text-foreground sm:text-3xl">
            What brings you here?
          </h2>
        </div>
        <TabsList aria-label="Inquiry type" className="w-full sm:w-auto">
          <TabsTrigger className="flex-1 gap-2 sm:flex-none" value="client">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Start a project
          </TabsTrigger>
          <TabsTrigger className="flex-1 gap-2 sm:flex-none" value="partner">
            <Handshake aria-hidden="true" className="size-3.5" />
            Collaborate
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent className="mt-0" value="client">
        <div className="mb-8 max-w-2xl">
          <h3 className="font-display text-xl tracking-[-0.025em] text-foreground">
            Tell us what you want to make.
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Select every relevant service and share the project context you
            already have. There are no pricing or payment fields here.
          </p>
        </div>
        <ClientInquiryForm
          initialServiceId={initialServiceId}
          turnstileSiteKey={turnstileSiteKey}
        />
      </TabsContent>

      <TabsContent className="mt-0" value="partner">
        <div className="mb-8 max-w-2xl">
          <h3 className="font-display text-xl tracking-[-0.025em] text-foreground">
            Introduce your craft and availability.
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This route is for independent specialists, creative partners, and
            collaborators interested in contributing to future work.
          </p>
        </div>
        <PartnerInquiryForm turnstileSiteKey={turnstileSiteKey} />
      </TabsContent>
    </Tabs>
  );
}
