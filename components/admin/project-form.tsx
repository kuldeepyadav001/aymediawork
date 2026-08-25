import Link from "next/link";

import { saveProjectAction } from "@/app/admin/actions";
import {
  AdminCheckbox,
  AdminField,
  AdminFormSection,
  adminSelectClassName,
} from "@/components/admin/admin-form";
import { FormSubmitButton } from "@/components/admin/form-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ServiceOption = Pick<
  Database["public"]["Tables"]["services"]["Row"],
  "id" | "slug" | "title"
>;

function lines(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .join("\n")
    : "";
}

export function ProjectForm({
  canPublish,
  project,
  selectedServiceIds,
  services,
}: {
  canPublish: boolean;
  project: Project | null;
  selectedServiceIds: string[];
  services: ServiceOption[];
}) {
  return (
    <form action={saveProjectAction} className="space-y-6">
      {project ? <input name="id" type="hidden" value={project.id} /> : null}

      <AdminFormSection
        description="Core labels and routing for this case study."
        title="Identity"
      >
        <AdminField htmlFor="title" label="Title">
          <Input
            defaultValue={project?.title}
            id="title"
            maxLength={160}
            name="title"
            required
          />
        </AdminField>
        <AdminField htmlFor="slug" label="URL slug">
          <Input
            defaultValue={project?.slug}
            id="slug"
            maxLength={100}
            name="slug"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />
        </AdminField>
        <AdminField htmlFor="category" label="Category">
          <Input
            defaultValue={project?.category}
            id="category"
            maxLength={100}
            name="category"
            required
          />
        </AdminField>
        <AdminField htmlFor="formatLabel" label="Format label">
          <Input
            defaultValue={project?.format_label}
            id="formatLabel"
            maxLength={160}
            name="formatLabel"
            required
          />
        </AdminField>
        <AdminField htmlFor="sortOrder" label="Sort order">
          <Input
            defaultValue={project?.sort_order ?? 1}
            id="sortOrder"
            max={999}
            min={1}
            name="sortOrder"
            required
            type="number"
          />
        </AdminField>
        <AdminField htmlFor="status" label="Publication status">
          <select
            className={adminSelectClassName}
            defaultValue={project?.status ?? "draft"}
            id="status"
            name="status"
          >
            <option value="draft">Draft</option>
            {canPublish ? <option value="published">Published</option> : null}
            {canPublish ? <option value="archived">Archived</option> : null}
          </select>
        </AdminField>
        <div className="sm:col-span-2">
          <AdminCheckbox
            defaultChecked={project?.featured}
            description="Featured projects receive priority in eligible public layouts."
            label="Feature this project"
            name="featured"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection
        description="Public card copy, metadata, and artwork reference."
        title="Presentation"
      >
        <div className="sm:col-span-2">
          <AdminField htmlFor="description" label="Description">
            <Textarea
              defaultValue={project?.description}
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
              defaultValue={project?.meta_description}
              id="metaDescription"
              maxLength={320}
              name="metaDescription"
              required
            />
          </AdminField>
        </div>
        <AdminField
          description="Use a /images/... path or a copied Supabase Storage URL."
          htmlFor="imagePath"
          label="Image path"
        >
          <Input
            defaultValue={project?.image_path}
            id="imagePath"
            maxLength={1000}
            name="imagePath"
            required
          />
        </AdminField>
        <AdminField htmlFor="imageAlt" label="Image alt text">
          <Input
            defaultValue={project?.image_alt}
            id="imageAlt"
            maxLength={300}
            name="imageAlt"
            required
          />
        </AdminField>
      </AdminFormSection>

      <AdminFormSection title="Case study narrative">
        <div className="sm:col-span-2">
          <AdminField htmlFor="premiseQuestion" label="Premise question">
            <Textarea
              defaultValue={project?.premise_question}
              id="premiseQuestion"
              name="premiseQuestion"
              required
            />
          </AdminField>
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="premiseContext" label="Premise context">
            <Textarea
              defaultValue={project?.premise_context}
              id="premiseContext"
              name="premiseContext"
              required
            />
          </AdminField>
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="direction" label="Direction">
            <Textarea
              defaultValue={project?.direction}
              id="direction"
              name="direction"
              required
            />
          </AdminField>
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="system" label="System">
            <Textarea
              defaultValue={project?.system}
              id="system"
              name="system"
              required
            />
          </AdminField>
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="experience" label="Experience">
            <Textarea
              defaultValue={project?.experience}
              id="experience"
              name="experience"
              required
            />
          </AdminField>
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="principle" label="Principle">
            <Textarea
              defaultValue={project?.principle}
              id="principle"
              name="principle"
              required
            />
          </AdminField>
        </div>
      </AdminFormSection>

      <AdminFormSection
        description="Enter one exploration or tone per line. Palette must be a JSON array of name/hex objects."
        title="Structured details"
      >
        <AdminField htmlFor="explores" label="Explores">
          <Textarea
            defaultValue={lines(project?.explores)}
            id="explores"
            name="explores"
            required
          />
        </AdminField>
        <AdminField htmlFor="tone" label="Tone">
          <Textarea
            defaultValue={lines(project?.tone)}
            id="tone"
            name="tone"
            required
          />
        </AdminField>
        <div className="sm:col-span-2">
          <AdminField htmlFor="palette" label="Palette JSON">
            <Textarea
              className="font-mono text-xs"
              defaultValue={
                project ? JSON.stringify(project.palette, null, 2) : "[]"
              }
              id="palette"
              name="palette"
              required
            />
          </AdminField>
        </div>
      </AdminFormSection>

      <AdminFormSection
        description="Select services that should appear as related capabilities."
        title="Related services"
      >
        {services.map((service) => (
          <label
            className="flex items-center gap-3 rounded-lg border border-white/[0.08] p-3 text-sm"
            key={service.id}
          >
            <input
              className="size-4 accent-primary"
              defaultChecked={selectedServiceIds.includes(service.id)}
              name="serviceIds"
              type="checkbox"
              value={service.id}
            />
            <span>
              <span className="font-semibold">{service.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {service.slug}
              </span>
            </span>
          </label>
        ))}
      </AdminFormSection>

      <div className="flex flex-wrap justify-end gap-3 border-t border-white/[0.08] pt-6">
        <Button asChild variant="ghost">
          <Link href="/admin/projects">Cancel</Link>
        </Button>
        <FormSubmitButton>
          {project ? "Save project" : "Create project"}
        </FormSubmitButton>
      </div>
    </form>
  );
}
