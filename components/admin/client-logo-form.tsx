import Link from "next/link";

import { saveClientLogoAction } from "@/app/admin/actions";
import {
  AdminCheckbox,
  AdminField,
  AdminFormSection,
  adminSelectClassName,
} from "@/components/admin/admin-form";
import { FormSubmitButton } from "@/components/admin/form-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Database } from "@/types/database";

type ClientLogo = Database["public"]["Tables"]["client_logos"]["Row"];

export function ClientLogoForm({
  canPublish,
  logo,
}: {
  canPublish: boolean;
  logo: ClientLogo | null;
}) {
  return (
    <form action={saveClientLogoAction} className="space-y-6">
      {logo ? <input name="id" type="hidden" value={logo.id} /> : null}
      <AdminFormSection
        description="Only use marks supplied or approved by the client."
        title="Client mark"
      >
        <AdminField htmlFor="name" label="Client name">
          <Input
            defaultValue={logo?.name}
            id="name"
            maxLength={160}
            name="name"
            required
          />
        </AdminField>
        <AdminField htmlFor="destinationUrl" label="Destination URL (optional)">
          <Input
            defaultValue={logo?.destination_url ?? ""}
            id="destinationUrl"
            maxLength={1000}
            name="destinationUrl"
            type="url"
          />
        </AdminField>
        <AdminField
          description="Use a /images/... path or copied Supabase Storage URL."
          htmlFor="imagePath"
          label="Image path"
        >
          <Input
            defaultValue={logo?.image_path}
            id="imagePath"
            maxLength={1000}
            name="imagePath"
            required
          />
        </AdminField>
        <AdminField htmlFor="imageAlt" label="Image alt text">
          <Input
            defaultValue={logo?.image_alt}
            id="imageAlt"
            maxLength={300}
            name="imageAlt"
            required
          />
        </AdminField>
      </AdminFormSection>
      <AdminFormSection title="Publication controls">
        <AdminField htmlFor="sortOrder" label="Sort order">
          <Input
            defaultValue={logo?.sort_order ?? 1}
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
            defaultValue={logo?.status ?? "draft"}
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
            defaultChecked={Boolean(logo?.permission_confirmed_at)}
            description="Confirm that AY Media Work may display this mark publicly."
            label="Display permission confirmed"
            name="permissionConfirmed"
          />
        </div>
      </AdminFormSection>
      <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-6">
        <Button asChild variant="ghost">
          <Link href="/admin/client-logos">Cancel</Link>
        </Button>
        <FormSubmitButton>
          {logo ? "Save client logo" : "Create client logo"}
        </FormSubmitButton>
      </div>
    </form>
  );
}
