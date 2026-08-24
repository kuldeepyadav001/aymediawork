# Admin dashboard and CMS operations

Stage 10 adds Supabase Auth, role-aware content management, inquiries, newsletter subscriber operations, public media storage, settings, and audit activity. Privileged keys stay server-only.

## Production activation order

1. In Supabase **SQL Editor**, apply `supabase/migrations/20260825110000_admin_cms.sql` once, after all earlier timestamped migrations.
2. In Vercel, add the Stage 10 environment value described below to **Production**, **Preview**, and the intended local Development environment, then redeploy.
3. Configure Supabase Auth URLs.
4. Create and activate the first owner.
5. Use that owner account to invite every later admin or editor from `/admin/users`.

Do not paste API keys into source files, SQL settings, CMS settings, issue comments, or chat. `SUPABASE_SECRET_KEY` must remain a Vercel/server secret.

## Required environment

The existing Supabase variables remain required:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL. Public by design.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: current publishable key. Public by design and constrained by RLS.
- `SUPABASE_SECRET_KEY`: current secret key. Server-only; bypasses RLS only for controlled owner bootstrap and invitation operations.
- `NEXT_PUBLIC_SITE_URL`: canonical origin with no path, for example `https://www.aymediawork.site`.
- `ADMIN_BOOTSTRAP_EMAIL`: server-only exact email address permitted to activate the first owner. Use lowercase to make operations easy to audit; comparison is case-insensitive.

After the first owner is activated, keep `ADMIN_BOOTSTRAP_EMAIL` secret and stable. The database RPC also refuses bootstrap after an owner exists, so the environment allowlist is not the only protection.

## Supabase Auth URLs

In **Supabase Dashboard → Authentication → URL Configuration**:

- Set **Site URL** to `https://www.aymediawork.site`.
- Add `https://www.aymediawork.site/admin/auth/callback` to **Redirect URLs**.
- Add the equivalent callback for any deliberately supported preview or local environment, such as `http://localhost:3000/admin/auth/callback`. Avoid broad preview wildcards unless the Supabase project is intentionally available to every preview deployment.

In the Supabase Email Auth provider settings, keep public self-registration disabled. The first owner is created deliberately in the Dashboard; every later account must come from the owner-only invitation screen.

Password resets and owner-issued invitations return through `/admin/auth/callback` and then open `/admin/reset-password`. Redirect destinations are restricted to internal `/admin/...` paths.

## First-owner activation

This is the only account created outside the in-app invitation workflow.

1. Choose the owner email and set the exact same address as `ADMIN_BOOTSTRAP_EMAIL` in Vercel. Redeploy.
2. In **Supabase Dashboard → Authentication → Users**, create that user with the chosen email and a temporary strong password of at least 12 characters. Do not expose the password to anyone else.
3. Open `https://www.aymediawork.site/admin/login` and sign in.
4. The app redirects an authenticated user without a profile to `/admin/setup`.
5. Enter the owner's display name and select **Activate owner account**.
6. Confirm `/admin/dashboard` loads and `/admin/users` shows exactly one active owner.
7. Change the temporary password through a password-reset email if it was generated or handled outside the owner's password manager.

If activation says setup is unavailable, do not alter the database manually. Check that the authenticated email equals `ADMIN_BOOTSTRAP_EMAIL`, the migration was applied, and no owner already exists.

## Inviting later users

Only the owner can invite or manage team accounts.

1. Open `/admin/users`.
2. Enter the person's exact email, display name, and intended role.
3. Send the invitation.
4. The recipient opens the secure Supabase email link, lands on `/admin/reset-password`, and creates a password of at least 12 characters.

The app registers each invited profile and its audit entry in one database transaction. If that registration fails, it removes the incomplete Auth user before reporting the failure. Disable access from `/admin/users`; do not delete Auth users or edit `admin_profiles` manually during normal operations.

## Role boundaries

| Capability                                                    | Owner   | Admin   | Editor  |
| ------------------------------------------------------------- | ------- | ------- | ------- |
| Dashboard, CMS lists, inquiries, subscribers, media, activity | Yes     | Yes     | Yes     |
| Create and edit draft content or inactive services            | Yes     | Yes     | Yes     |
| Publish/archive content or activate services                  | Yes     | Yes     | No      |
| Edit already published/archived content or active services    | Yes     | Yes     | No      |
| Update inquiry operational state                              | Yes     | Yes     | Yes     |
| Upload media                                                  | Yes     | Yes     | Yes     |
| Delete media                                                  | Yes     | Yes     | No      |
| Manage public/private settings                                | Yes     | No      | No      |
| Invite, change, or disable admin accounts                     | Yes     | No      | No      |
| Remove or demote the final active owner                       | Blocked | Blocked | Blocked |

These boundaries are enforced in both server actions and Row Level Security. Hidden buttons are usability controls, not the security boundary.

## Content publication behavior

- Services become public only when active.
- Projects and blog posts become public only when published.
- Testimonials and client logos require both published status and a recorded permission-confirmation timestamp.
- Public project/blog relationships are visible only for published parent records.
- A successful but empty public CMS query remains empty. Provisional compiled content is used only when public Supabase is unavailable or a query errors.
- Project and blog saves replace their service relationships in the same database transaction as the parent save.
- CMS mutations invalidate the public route tree and affected content paths. A slug change or deletion also invalidates the former public detail path.

The homepage reads active services and the first three published projects, prioritizing featured projects and then CMS sort order. The footer reads public `brand.line` and social settings. Never mark secrets as public settings.

Subscriber records can be unsubscribed from the admin screen. An unsubscribed address cannot be reactivated by an admin: the person must submit fresh explicit newsletter consent through the public form, which records a new consent time and source.

## Media library

The migration creates the public `admin-media` Storage bucket with image-only policies and a 10 MB object limit. The UI accepts JPEG, PNG, WebP, and AVIF.

- Uploads require an authenticated active admin profile.
- Owners, admins, and editors can upload. Each upload is restricted to that user's UUID folder.
- Only owners and admins can delete registered library assets. The Storage policy also permits the uploader to clean up an unregistered object if metadata creation fails.
- Authenticated active admins can read bucket metadata required by Storage update/delete operations; public visitors receive files only through the bucket's public delivery endpoint.
- Public delivery uses `/storage/v1/object/public/admin-media/...`.
- `next.config.ts` permits optimized images only from the configured Supabase host and this bucket path.
- Deleting an object breaks every page still using its URL. Replace references before deletion.

Use descriptive alt text when an image conveys meaning. Decorative images may use intentionally empty alt text only where the consuming component supports it.

## Static post-migration checks

Run these in Supabase SQL Editor after applying the migration. They do not reveal secrets.

```sql
select count(*) as services from public.services;
select count(*) as projects from public.projects;
select count(*) as blog_posts from public.blog_posts;
select key, is_public from public.site_settings order by key;
select id, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'admin-media';
```

Expected initial content: 10 services, 6 projects, 4 blog posts, five public settings, and one public `admin-media` bucket with a 10 MB limit and the four approved image MIME types.

After owner activation, verify:

```sql
select role, is_active, count(*)
from public.admin_profiles
group by role, is_active
order by role, is_active;
```

Expected immediately after bootstrap: one active owner. Use the in-app `/admin/users` screen for all later role changes.

## Operational checks

Before announcing activation:

1. Anonymous visitor can read only active/published/permission-approved public content.
2. Anonymous visitor cannot read inquiries, subscribers, profiles, private settings, media metadata, or audit rows.
3. Editor can edit drafts/inactive services but cannot open or mutate published/active records.
4. Admin can publish content but cannot access owner-only user/settings controls.
5. Owner can invite and disable users, but cannot remove or demote the last owner.
6. Inquiry read/state changes persist and are recorded in activity.
7. An uploaded image previews, its public URL works, and it renders through `next/image`.
8. Password reset and invitation links return to the canonical callback URL.

## Recovery

- Lost password: use **Forgot your password?** on `/admin/login`.
- Lost owner mailbox access: restore mailbox access through the email provider first; do not bypass role controls with SQL.
- Leaked secret key: rotate it in Supabase, replace `SUPABASE_SECRET_KEY` in every Vercel scope, and redeploy immediately.
- Broken media reference: restore the object at the same path or update every CMS record to a valid approved URL.
- Migration error: preserve the exact Supabase error and statement location. Do not rerun partial ad-hoc edits; determine whether the transaction rolled back before retrying the unchanged versioned migration.
