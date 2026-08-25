import Link from "next/link";

import { saveTestimonialAction } from "@/app/admin/actions";
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

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
type ProjectOption = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  "id" | "title"
>;

export function TestimonialForm({
  canPublish,
  projects,
  testimonial,
}: {
  canPublish: boolean;
  projects: ProjectOption[];
  testimonial: Testimonial | null;
}) {
  return (
    <form action={saveTestimonialAction} className="space-y-6">
      {testimonial ? (
        <input name="id" type="hidden" value={testimonial.id} />
      ) : null}
      <AdminFormSection
        description="Do not publish provisional or reconstructed quotes. Record permission before publication."
        title="Client quotation"
      >
        <div className="sm:col-span-2">
          <AdminField htmlFor="quote" label="Quote">
            <Textarea
              className="min-h-48"
              defaultValue={testimonial?.quote}
              id="quote"
              maxLength={2000}
              name="quote"
              required
            />
          </AdminField>
        </div>
        <AdminField htmlFor="attributionName" label="Attribution name">
          <Input
            defaultValue={testimonial?.attribution_name}
            id="attributionName"
            maxLength={100}
            name="attributionName"
            required
          />
        </AdminField>
        <AdminField htmlFor="attributionRole" label="Role (optional)">
          <Input
            defaultValue={testimonial?.attribution_role ?? ""}
            id="attributionRole"
            maxLength={160}
            name="attributionRole"
          />
        </AdminField>
        <AdminField
          htmlFor="attributionOrganisation"
          label="Organisation (optional)"
        >
          <Input
            defaultValue={testimonial?.attribution_organisation ?? ""}
            id="attributionOrganisation"
            maxLength={160}
            name="attributionOrganisation"
          />
        </AdminField>
        <AdminField htmlFor="projectId" label="Related project (optional)">
          <select
            className={adminSelectClassName}
            defaultValue={testimonial?.project_id ?? ""}
            id="projectId"
            name="projectId"
          >
            <option value="">No related project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </AdminField>
        <div className="sm:col-span-2">
          <AdminField
            htmlFor="projectContext"
            label="Project context (optional)"
          >
            <Textarea
              defaultValue={testimonial?.project_context ?? ""}
              id="projectContext"
              maxLength={1000}
              name="projectContext"
            />
          </AdminField>
        </div>
      </AdminFormSection>
      <AdminFormSection title="Publication controls">
        <AdminField htmlFor="sortOrder" label="Sort order">
          <Input
            defaultValue={testimonial?.sort_order ?? 1}
            id="sortOrder"
            max={999}
            min={1}
            name="sortOrder"
            required
            type="number"
          />
        </AdminField>
        <AdminField htmlFor="status" label="Status">
          <select
            className={adminSelectClassName}
            defaultValue={testimonial?.status ?? "draft"}
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
            defaultChecked={Boolean(testimonial?.permission_confirmed_at)}
            description="Check only when the named person or organisation has explicitly approved public use."
            label="Publication permission confirmed"
            name="permissionConfirmed"
          />
        </div>
      </AdminFormSection>
      <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-6">
        <Button asChild variant="ghost">
          <Link href="/admin/testimonials">Cancel</Link>
        </Button>
        <FormSubmitButton>
          {testimonial ? "Save testimonial" : "Create testimonial"}
        </FormSubmitButton>
      </div>
    </form>
  );
}
