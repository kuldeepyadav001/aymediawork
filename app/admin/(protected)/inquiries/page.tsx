import type { Metadata } from "next";

import {
  deleteInquiryAction,
  updateInquiryAction,
  updateSubscriberAction,
} from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import {
  AdminEmptyState,
  AdminPageHeader,
  formatAdminDate,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { adminSelectClassName } from "@/components/admin/admin-form";
import {
  ConfirmSubmitButton,
  FormSubmitButton,
} from "@/components/admin/form-buttons";
import { getInquiryData } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Inquiries" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [data, query, context] = await Promise.all([
    getInquiryData(),
    searchParams,
    getAdminContext(),
  ]);
  const canDelete = context ? canPublish(context.role) : false;

  return (
    <>
      <AdminPageHeader
        description="Review project and collaboration submissions, preserve read state, and maintain standalone newsletter consent."
        eyebrow="Operations"
        title="Inquiries & subscribers"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />

      <section className="mt-7" id="inquiries">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">Inquiries</h2>
          <p className="text-sm text-muted-foreground">
            {data.inquiries.length} total
          </p>
        </div>
        {data.inquiries.length === 0 ? (
          <AdminEmptyState>No inquiries have arrived.</AdminEmptyState>
        ) : (
          <div className="space-y-4">
            {data.inquiries.map((inquiry) => {
              const message =
                inquiry.brief ??
                inquiry.collaboration_message ??
                "No message supplied.";
              return (
                <article
                  className={`rounded-xl border bg-surface/40 p-5 ${
                    inquiry.is_read
                      ? "border-white/[0.08]"
                      : "border-primary/35"
                  }`}
                  key={inquiry.id}
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl font-semibold">
                          {inquiry.name}
                        </h3>
                        <StatusBadge status={inquiry.status} />
                        {!inquiry.is_read ? <StatusBadge status="new" /> : null}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {inquiry.email}
                        {inquiry.contact_number
                          ? ` · ${inquiry.contact_number}`
                          : ""}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatAdminDate(inquiry.created_at)} ·{" "}
                        {inquiry.inquiry_type} · {inquiry.submitted_from}
                      </p>
                    </div>
                    <form
                      action={updateInquiryAction}
                      className="flex min-w-64 gap-2"
                    >
                      <input name="id" type="hidden" value={inquiry.id} />
                      <label
                        className="sr-only"
                        htmlFor={`status-${inquiry.id}`}
                      >
                        Status
                      </label>
                      <select
                        className={adminSelectClassName}
                        defaultValue={inquiry.status}
                        id={`status-${inquiry.id}`}
                        name="status"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In progress</option>
                        <option value="closed">Closed</option>
                        <option value="spam">Spam</option>
                      </select>
                      <FormSubmitButton
                        pendingLabel="Updating…"
                        variant="secondary"
                      >
                        {inquiry.is_read ? "Update" : "Mark read"}
                      </FormSubmitButton>
                    </form>
                  </div>

                  {canDelete ? (
                    <form
                      action={deleteInquiryAction}
                      className="mt-3 flex justify-end"
                    >
                      <input name="id" type="hidden" value={inquiry.id} />
                      <ConfirmSubmitButton message="Permanently delete this inquiry and its selected-service links? This cannot be undone.">
                        Delete inquiry
                      </ConfirmSubmitButton>
                    </form>
                  ) : null}

                  <p className="mt-5 whitespace-pre-wrap rounded-lg bg-white/[0.025] p-4 text-sm leading-6">
                    {message}
                  </p>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Company / brand
                      </dt>
                      <dd className="mt-1">{inquiry.company_brand ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Timeline
                      </dt>
                      <dd className="mt-1">
                        {inquiry.preferred_timeline ??
                          inquiry.availability ??
                          "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Specialty
                      </dt>
                      <dd className="mt-1">{inquiry.specialty ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Services
                      </dt>
                      <dd className="mt-1">
                        {inquiry.services.join(", ") || "—"}
                      </dd>
                    </div>
                    {inquiry.portfolio_url ? (
                      <div className="sm:col-span-2">
                        <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                          Portfolio
                        </dt>
                        <dd className="mt-1 break-all">
                          <a
                            className="text-primary underline"
                            href={inquiry.portfolio_url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {inquiry.portfolio_url}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Newsletter consent
                      </dt>
                      <dd className="mt-1">
                        {inquiry.newsletter_consent
                          ? "Explicitly granted"
                          : "Not granted"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Notification
                      </dt>
                      <dd className="mt-1">{inquiry.notification_status}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-12" id="subscribers">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">
            Newsletter subscribers
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.subscribers.length} records
          </p>
        </div>
        {data.subscribers.length === 0 ? (
          <AdminEmptyState>No subscriber records yet.</AdminEmptyState>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">Email</th>
                  <th className="px-5 py-4 font-medium">Consent</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.subscribers.map((subscriber) => (
                  <tr
                    className="border-t border-white/[0.07]"
                    key={subscriber.id}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium">{subscriber.email}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatAdminDate(subscriber.consent_at)} ·{" "}
                        {subscriber.last_source}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {subscriber.consent_granted
                        ? "Explicitly granted"
                        : "Not granted"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={subscriber.status} />
                    </td>
                    <td className="px-5 py-4">
                      {subscriber.status === "subscribed" ? (
                        <form action={updateSubscriberAction}>
                          <input
                            name="id"
                            type="hidden"
                            value={subscriber.id}
                          />
                          <input
                            name="status"
                            type="hidden"
                            value="unsubscribed"
                          />
                          <FormSubmitButton
                            pendingLabel="Unsubscribing…"
                            variant="secondary"
                          >
                            Unsubscribe
                          </FormSubmitButton>
                        </form>
                      ) : (
                        <span className="text-xs leading-5 text-muted-foreground">
                          Fresh explicit consent is required to resubscribe.
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
