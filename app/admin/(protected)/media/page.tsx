import type { Metadata } from "next";
import Image from "next/image";

import { deleteMediaAction, uploadMediaAction } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import {
  AdminEmptyState,
  AdminPageHeader,
  formatAdminDate,
} from "@/components/admin/admin-ui";
import {
  ConfirmSubmitButton,
  FormSubmitButton,
} from "@/components/admin/form-buttons";
import { Input } from "@/components/ui/input";
import { listRows } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Media" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function mediaUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base}/storage/v1/object/public/admin-media/${path}` : "";
}

function formatBytes(size: number) {
  return size >= 1024 * 1024
    ? `${(size / 1024 / 1024).toFixed(1)} MB`
    : `${Math.ceil(size / 1024)} KB`;
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [assets, context, query] = await Promise.all([
    listRows("media_assets", "created_at", false),
    getAdminContext(),
    searchParams,
  ]);

  return (
    <>
      <AdminPageHeader
        description="Upload approved web imagery. JPEG, PNG, WebP, and AVIF are accepted up to 10 MB."
        eyebrow="Asset library"
        title="Media"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />

      <form
        action={uploadMediaAction}
        className="mt-7 grid gap-4 rounded-xl border border-white/[0.08] bg-surface/40 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="file">
            Image file
          </label>
          <Input
            accept="image/jpeg,image/png,image/webp,image/avif"
            id="file"
            name="file"
            required
            type="file"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="altText">
            Reusable alt text
          </label>
          <Input
            id="altText"
            maxLength={300}
            name="altText"
            placeholder="Describe meaningful visual content"
          />
        </div>
        <FormSubmitButton pendingLabel="Uploading…">
          Upload image
        </FormSubmitButton>
      </form>

      <section className="mt-8">
        {assets.length === 0 ? (
          <AdminEmptyState>No uploaded media yet.</AdminEmptyState>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => {
              const url = mediaUrl(asset.path);
              return (
                <article
                  className="overflow-hidden rounded-xl border border-white/[0.08] bg-surface/40"
                  key={asset.id}
                >
                  <div className="relative aspect-[16/10] bg-white/[0.03]">
                    {url ? (
                      <Image
                        alt={asset.alt_text ?? "Uploaded media preview"}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                        src={url}
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <p
                      className="truncate text-sm font-semibold"
                      title={asset.path}
                    >
                      {asset.path.split("/").pop()}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {asset.mime_type} · {formatBytes(asset.size_bytes)} ·{" "}
                      {formatAdminDate(asset.created_at)}
                    </p>
                    {asset.alt_text ? (
                      <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {asset.alt_text}
                      </p>
                    ) : null}
                    <label
                      className="mt-4 block text-xs font-semibold"
                      htmlFor={`url-${asset.id}`}
                    >
                      Public URL
                    </label>
                    <Input
                      className="mt-2 text-xs"
                      id={`url-${asset.id}`}
                      readOnly
                      value={url}
                    />
                    {context && canPublish(context.role) ? (
                      <form action={deleteMediaAction} className="mt-4">
                        <input name="id" type="hidden" value={asset.id} />
                        <input name="path" type="hidden" value={asset.path} />
                        <ConfirmSubmitButton message="Delete this image from Storage? Existing pages using its URL will break.">
                          Delete media
                        </ConfirmSubmitButton>
                      </form>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
