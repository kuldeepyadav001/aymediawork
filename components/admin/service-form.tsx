import Link from "next/link";

import { saveServiceAction } from "@/app/admin/actions";
import {
  AdminCheckbox,
  AdminField,
  AdminFormSection,
} from "@/components/admin/admin-form";
import { FormSubmitButton } from "@/components/admin/form-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];

function lines(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .join("\n")
    : "";
}

export function ServiceForm({
  canPublish,
  service,
}: {
  canPublish: boolean;
  service: Service | null;
}) {
  return (
    <form action={saveServiceAction} className="space-y-6">
      {service ? <input name="id" type="hidden" value={service.id} /> : null}
      <AdminFormSection title="Service identity">
        <AdminField htmlFor="title" label="Title">
          <Input
            defaultValue={service?.title}
            id="title"
            maxLength={120}
            name="title"
            required
          />
        </AdminField>
        <AdminField htmlFor="slug" label="URL slug">
          <Input
            defaultValue={service?.slug}
            id="slug"
            maxLength={100}
            name="slug"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />
        </AdminField>
        <AdminField htmlFor="sortOrder" label="Sort order">
          <Input
            defaultValue={service?.sort_order ?? 1}
            id="sortOrder"
            max={999}
            min={1}
            name="sortOrder"
            required
            type="number"
          />
        </AdminField>
        <div className="self-end">
          {canPublish ? (
            <AdminCheckbox
              defaultChecked={service?.is_active}
              description="Only owners and admins can activate a public service."
              label="Active and public"
              name="isActive"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Editors save services as inactive drafts.
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="heroTitle" label="Hero title">
            <Textarea
              className="min-h-24"
              defaultValue={service?.hero_title ?? ""}
              id="heroTitle"
              maxLength={300}
              name="heroTitle"
              required
            />
          </AdminField>
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="description" label="Description">
            <Textarea
              defaultValue={service?.description ?? ""}
              id="description"
              maxLength={1000}
              name="description"
              required
            />
          </AdminField>
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="metaDescription" label="Meta description">
            <Textarea
              className="min-h-24"
              defaultValue={service?.meta_description ?? ""}
              id="metaDescription"
              maxLength={320}
              name="metaDescription"
              required
            />
          </AdminField>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Artwork">
        <AdminField
          description="Use a /images/... path or copied Supabase Storage URL."
          htmlFor="imagePath"
          label="Image path"
        >
          <Input
            defaultValue={service?.image_path ?? ""}
            id="imagePath"
            maxLength={1000}
            name="imagePath"
            required
          />
        </AdminField>
        <AdminField htmlFor="imageAlt" label="Image alt text">
          <Input
            defaultValue={service?.image_alt ?? ""}
            id="imageAlt"
            maxLength={300}
            name="imageAlt"
            required
          />
        </AdminField>
      </AdminFormSection>

      <AdminFormSection
        description="Use one item or slug per line."
        title="Structured details"
      >
        <AdminField htmlFor="disciplines" label="Disciplines">
          <Textarea
            defaultValue={lines(service?.disciplines)}
            id="disciplines"
            name="disciplines"
            required
          />
        </AdminField>
        <AdminField htmlFor="usefulFor" label="Useful for">
          <Textarea
            defaultValue={lines(service?.useful_for)}
            id="usefulFor"
            name="usefulFor"
            required
          />
        </AdminField>
        <div className="sm:col-span-2">
          <AdminField
            description="Lowercase service slugs, one per line."
            htmlFor="relatedSlugs"
            label="Related service slugs"
          >
            <Textarea
              defaultValue={(service?.related_slugs ?? []).join("\n")}
              id="relatedSlugs"
              name="relatedSlugs"
            />
          </AdminField>
        </div>
      </AdminFormSection>

      <AdminFormSection
        description="Valid JSON array. Each item requires a title and description."
        title="Approach steps"
      >
        <div className="sm:col-span-2">
          <AdminField htmlFor="approach" label="Approach JSON">
            <Textarea
              className="min-h-72 font-mono text-xs"
              defaultValue={
                service ? JSON.stringify(service.approach, null, 2) : "[]"
              }
              id="approach"
              name="approach"
              required
            />
          </AdminField>
        </div>
      </AdminFormSection>

      <div className="flex flex-wrap justify-end gap-3 border-t border-white/[0.08] pt-6">
        <Button asChild variant="ghost">
          <Link href="/admin/services">Cancel</Link>
        </Button>
        <FormSubmitButton>
          {service ? "Save service" : "Create service"}
        </FormSubmitButton>
      </div>
    </form>
  );
}
