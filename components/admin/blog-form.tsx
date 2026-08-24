import Link from "next/link";

import { saveBlogPostAction } from "@/app/admin/actions";
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

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
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

export function BlogForm({
  canPublish,
  post,
  selectedServiceIds,
  services,
}: {
  canPublish: boolean;
  post: BlogPost | null;
  selectedServiceIds: string[];
  services: ServiceOption[];
}) {
  return (
    <form action={saveBlogPostAction} className="space-y-6">
      {post ? <input name="id" type="hidden" value={post.id} /> : null}
      <AdminFormSection title="Article identity">
        <AdminField htmlFor="title" label="Title">
          <Input
            defaultValue={post?.title}
            id="title"
            maxLength={200}
            name="title"
            required
          />
        </AdminField>
        <AdminField htmlFor="slug" label="URL slug">
          <Input
            defaultValue={post?.slug}
            id="slug"
            maxLength={100}
            name="slug"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />
        </AdminField>
        <AdminField htmlFor="category" label="Category">
          <Input
            defaultValue={post?.category}
            id="category"
            maxLength={100}
            name="category"
            required
          />
        </AdminField>
        <AdminField htmlFor="author" label="Author">
          <Input
            defaultValue={post?.author ?? "AY Media Work"}
            id="author"
            maxLength={100}
            name="author"
            required
          />
        </AdminField>
        <AdminField htmlFor="readingMinutes" label="Reading minutes">
          <Input
            defaultValue={post?.reading_minutes ?? 5}
            id="readingMinutes"
            max={120}
            min={1}
            name="readingMinutes"
            required
            type="number"
          />
        </AdminField>
        <AdminField htmlFor="status" label="Publication status">
          <select
            className={adminSelectClassName}
            defaultValue={post?.status ?? "draft"}
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
            defaultChecked={post?.featured}
            description="A featured post can receive priority on the journal landing page."
            label="Feature this article"
            name="featured"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Summary and artwork">
        <div className="sm:col-span-2">
          <AdminField htmlFor="excerpt" label="Excerpt">
            <Textarea
              defaultValue={post?.excerpt}
              id="excerpt"
              maxLength={1000}
              name="excerpt"
              required
            />
          </AdminField>
        </div>
        <div className="sm:col-span-2">
          <AdminField htmlFor="metaDescription" label="Meta description">
            <Textarea
              className="min-h-24"
              defaultValue={post?.meta_description}
              id="metaDescription"
              maxLength={320}
              name="metaDescription"
              required
            />
          </AdminField>
        </div>
        <AdminField
          description="Use a /images/... path or copied Supabase Storage URL."
          htmlFor="imagePath"
          label="Image path"
        >
          <Input
            defaultValue={post?.image_path}
            id="imagePath"
            maxLength={1000}
            name="imagePath"
            required
          />
        </AdminField>
        <AdminField htmlFor="imageAlt" label="Image alt text">
          <Input
            defaultValue={post?.image_alt}
            id="imageAlt"
            maxLength={300}
            name="imageAlt"
            required
          />
        </AdminField>
      </AdminFormSection>

      <AdminFormSection
        description="Markdown is rendered through the site's safe article renderer. Raw HTML is not required."
        title="Article body"
      >
        <div className="sm:col-span-2">
          <AdminField htmlFor="body" label="Markdown content">
            <Textarea
              className="min-h-[32rem] font-mono text-sm"
              defaultValue={post?.body}
              id="body"
              name="body"
              required
            />
          </AdminField>
        </div>
      </AdminFormSection>

      <AdminFormSection
        description="Enter one item per line."
        title="Discovery and takeaways"
      >
        <AdminField htmlFor="tags" label="Tags">
          <Textarea
            defaultValue={lines(post?.tags)}
            id="tags"
            name="tags"
            required
          />
        </AdminField>
        <AdminField htmlFor="takeaways" label="Takeaways">
          <Textarea
            defaultValue={lines(post?.takeaways)}
            id="takeaways"
            name="takeaways"
            required
          />
        </AdminField>
      </AdminFormSection>

      <AdminFormSection title="Related services">
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
          <Link href="/admin/blog">Cancel</Link>
        </Button>
        <FormSubmitButton>
          {post ? "Save article" : "Create article"}
        </FormSubmitButton>
      </div>
    </form>
  );
}
