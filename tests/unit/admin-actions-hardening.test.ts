import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getAdminClient: vi.fn(),
  getAdminContext: vi.fn(),
  getAuthenticatedUser: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdmin: mocks.getAdminClient,
}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mocks.createServerClient,
}));
vi.mock("@/lib/supabase/session", () => ({
  canManageUsers: (role: string) => role === "owner",
  canPublish: (role: string) => role === "owner" || role === "admin",
  getAdminContext: mocks.getAdminContext,
  getAuthenticatedUser: mocks.getAuthenticatedUser,
}));

import {
  deleteContentAction,
  deleteMediaAction,
  saveBlogPostAction,
  saveClientLogoAction,
  saveProjectAction,
  saveTestimonialAction,
  updateSubscriberAction,
  uploadMediaAction,
} from "@/app/admin/actions";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getAdminContext.mockResolvedValue({
    displayName: "Owner",
    email: "owner@example.com",
    role: "owner",
    userId: "92ee43aa-0875-4be2-91e2-bc11fc7999bf",
  });
  mocks.redirect.mockImplementation((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  });
});

describe("admin action hardening", () => {
  it("rejects an administrative resubscribe before calling Supabase", async () => {
    const formData = new FormData();
    formData.set("id", "74c418c5-4f56-4c74-9535-ce4ca2597866");
    formData.set("status", "subscribed");

    await expect(updateSubscriberAction(formData)).rejects.toThrow(
      "A%20subscriber%20can%20be%20reactivated%20only%20through%20fresh%20explicit%20consent",
    );
    expect(mocks.createServerClient).not.toHaveBeenCalled();
  });

  it("preserves the original testimonial permission-confirmation time on later edits", async () => {
    const confirmedAt = "2026-08-20T10:15:00.000Z";
    const existingQuery = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { permission_confirmed_at: confirmedAt },
        error: null,
      }),
      select: vi.fn(),
    };
    existingQuery.select.mockReturnValue(existingQuery);
    existingQuery.eq.mockReturnValue(existingQuery);

    const savedQuery = {
      select: vi.fn(),
      single: vi.fn().mockResolvedValue({
        data: { id: "c4457552-e2a6-4fb8-97ba-1d3d9f1d2a75" },
        error: null,
      }),
      upsert: vi.fn(),
    };
    savedQuery.upsert.mockReturnValue(savedQuery);
    savedQuery.select.mockReturnValue(savedQuery);

    const from = vi
      .fn()
      .mockReturnValueOnce(existingQuery)
      .mockReturnValueOnce(savedQuery);
    mocks.createServerClient.mockResolvedValue({ from });

    const formData = new FormData();
    formData.set("id", "c4457552-e2a6-4fb8-97ba-1d3d9f1d2a75");
    formData.set("attributionName", "Approved client");
    formData.set("attributionOrganisation", "Client studio");
    formData.set("attributionRole", "Director");
    formData.set("permissionConfirmed", "on");
    formData.set("projectContext", "Campaign film");
    formData.set("projectId", "");
    formData.set("quote", "This approved quotation remains unchanged.");
    formData.set("sortOrder", "1");
    formData.set("status", "published");

    await expect(saveTestimonialAction(formData)).rejects.toThrow(
      "REDIRECT:/admin/testimonials/c4457552-e2a6-4fb8-97ba-1d3d9f1d2a75?success=Testimonial%20saved.",
    );
    expect(savedQuery.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ permission_confirmed_at: confirmedAt }),
    );
  });

  it("preserves the original client-logo permission-confirmation time on later edits", async () => {
    const confirmedAt = "2026-08-21T11:30:00.000Z";
    const existingQuery = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { permission_confirmed_at: confirmedAt },
        error: null,
      }),
      select: vi.fn(),
    };
    existingQuery.select.mockReturnValue(existingQuery);
    existingQuery.eq.mockReturnValue(existingQuery);

    const savedQuery = {
      select: vi.fn(),
      single: vi.fn().mockResolvedValue({
        data: { id: "db8a0217-e99a-4d7f-bec8-eb3d62eb2714" },
        error: null,
      }),
      upsert: vi.fn(),
    };
    savedQuery.upsert.mockReturnValue(savedQuery);
    savedQuery.select.mockReturnValue(savedQuery);

    const from = vi
      .fn()
      .mockReturnValueOnce(existingQuery)
      .mockReturnValueOnce(savedQuery);
    mocks.createServerClient.mockResolvedValue({ from });

    const formData = new FormData();
    formData.set("id", "db8a0217-e99a-4d7f-bec8-eb3d62eb2714");
    formData.set("destinationUrl", "https://client.example.com/work");
    formData.set("imageAlt", "Approved client mark");
    formData.set("imagePath", "/images/clients/approved-client.png");
    formData.set("name", "Approved Client");
    formData.set("permissionConfirmed", "on");
    formData.set("sortOrder", "1");
    formData.set("status", "published");

    await expect(saveClientLogoAction(formData)).rejects.toThrow(
      "REDIRECT:/admin/client-logos/db8a0217-e99a-4d7f-bec8-eb3d62eb2714?success=Client%20logo%20saved.",
    );
    expect(savedQuery.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ permission_confirmed_at: confirmedAt }),
    );
  });

  it("rejects an edit when the client-logo record is no longer accessible", async () => {
    const existingQuery = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn(),
    };
    existingQuery.select.mockReturnValue(existingQuery);
    existingQuery.eq.mockReturnValue(existingQuery);
    const from = vi.fn().mockReturnValue(existingQuery);
    mocks.createServerClient.mockResolvedValue({ from });

    const formData = new FormData();
    formData.set("id", "db8a0217-e99a-4d7f-bec8-eb3d62eb2714");
    formData.set("destinationUrl", "");
    formData.set("imageAlt", "Approved client mark");
    formData.set("imagePath", "/images/clients/approved-client.png");
    formData.set("name", "Approved Client");
    formData.set("sortOrder", "1");
    formData.set("status", "draft");

    await expect(saveClientLogoAction(formData)).rejects.toThrow(
      "The%20current%20client%20logo%20could%20not%20be%20loaded.",
    );
    expect(from).toHaveBeenCalledOnce();
  });

  it("rejects an edit when the project record is no longer accessible", async () => {
    const existingQuery = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn(),
    };
    existingQuery.select.mockReturnValue(existingQuery);
    existingQuery.eq.mockReturnValue(existingQuery);
    const rpc = vi.fn();
    mocks.createServerClient.mockResolvedValue({
      from: vi.fn().mockReturnValue(existingQuery),
      rpc,
    });

    const formData = new FormData();
    formData.set("id", "bb223549-b166-5655-b0e1-e552f251b29e");
    formData.set("category", "Campaign film");
    formData.set("description", "A complete project description.");
    formData.set("direction", "Clear visual direction.");
    formData.set("experience", "A coherent viewer experience.");
    formData.set("explores", "Editorial rhythm");
    formData.set("formatLabel", "Film");
    formData.set("imageAlt", "Abstract project frame");
    formData.set("imagePath", "/images/work/project.jpg");
    formData.set("metaDescription", "A useful project meta description.");
    formData.set("palette", '[{"hex":"#010203","name":"Ink"}]');
    formData.set("premiseContext", "The project context.");
    formData.set("premiseQuestion", "How should the story move?");
    formData.set("principle", "Clarity before decoration.");
    formData.set("slug", "missing-project");
    formData.set("sortOrder", "1");
    formData.set("status", "draft");
    formData.set("system", "A modular visual system.");
    formData.set("title", "Missing project");
    formData.set("tone", "Cinematic");

    await expect(saveProjectAction(formData)).rejects.toThrow(
      "The%20current%20project%20could%20not%20be%20loaded.",
    );
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects an edit when the blog-post record is no longer accessible", async () => {
    const existingQuery = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn(),
    };
    existingQuery.select.mockReturnValue(existingQuery);
    existingQuery.eq.mockReturnValue(existingQuery);
    const rpc = vi.fn();
    mocks.createServerClient.mockResolvedValue({
      from: vi.fn().mockReturnValue(existingQuery),
      rpc,
    });

    const formData = new FormData();
    formData.set("id", "d430a5b5-15ae-5ec3-aae1-0770c9ad9d07");
    formData.set("author", "AY Media Work");
    formData.set("body", "A complete and useful article body.");
    formData.set("category", "Creative systems");
    formData.set("excerpt", "A concise article summary.");
    formData.set("imageAlt", "Abstract editorial frame");
    formData.set("imagePath", "/images/blog/article.jpg");
    formData.set("metaDescription", "A useful article meta description.");
    formData.set("readingMinutes", "4");
    formData.set("slug", "missing-article");
    formData.set("status", "draft");
    formData.set("tags", "Design systems");
    formData.set("takeaways", "Design for real operating states.");
    formData.set("title", "Missing article");

    await expect(saveBlogPostAction(formData)).rejects.toThrow(
      "The%20current%20post%20could%20not%20be%20loaded.",
    );
    expect(rpc).not.toHaveBeenCalled();
  });

  it("invalidates a deleted project's former detail route and public layout", async () => {
    const existingQuery = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { slug: "former-project" },
        error: null,
      }),
      select: vi.fn(),
    };
    existingQuery.select.mockReturnValue(existingQuery);
    existingQuery.eq.mockReturnValue(existingQuery);

    const deleteQuery = {
      delete: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: "bb223549-b166-5655-b0e1-e552f251b29e" },
        error: null,
      }),
      select: vi.fn(),
    };
    deleteQuery.delete.mockReturnValue(deleteQuery);
    deleteQuery.eq.mockReturnValue(deleteQuery);
    deleteQuery.select.mockReturnValue(deleteQuery);

    const from = vi
      .fn()
      .mockReturnValueOnce(existingQuery)
      .mockReturnValueOnce(deleteQuery);
    mocks.createServerClient.mockResolvedValue({ from });

    const formData = new FormData();
    formData.set("entity", "project");
    formData.set("id", "bb223549-b166-5655-b0e1-e552f251b29e");

    await expect(deleteContentAction(formData)).rejects.toThrow(
      "REDIRECT:/admin/projects?success=Record%20deleted.",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/work/former-project");
  });

  it("reports when both media metadata registration and orphan cleanup fail", async () => {
    const upload = vi.fn().mockResolvedValue({ error: null });
    const remove = vi
      .fn()
      .mockResolvedValue({ error: { message: "cleanup failed" } });
    const bucket = { remove, upload };
    const insert = vi
      .fn()
      .mockResolvedValue({ error: { message: "metadata failed" } });
    mocks.createServerClient.mockResolvedValue({
      from: vi.fn(() => ({ insert })),
      storage: { from: vi.fn(() => bucket) },
    });

    const formData = new FormData();
    formData.set(
      "file",
      new File([new Uint8Array([137, 80, 78, 71])], "image.png", {
        type: "image/png",
      }),
    );
    formData.set("altText", "Abstract image");

    await expect(uploadMediaAction(formData)).rejects.toThrow(
      "Media%20metadata%20and%20temporary-object%20cleanup%20both%20failed",
    );
    expect(upload).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
  });

  it("does not report media deletion success when metadata removal affects no row", async () => {
    const assetQuery = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { path: "92ee43aa-0875-4be2-91e2-bc11fc7999bf/image.jpg" },
        error: null,
      }),
      select: vi.fn(),
    };
    assetQuery.select.mockReturnValue(assetQuery);
    assetQuery.eq.mockReturnValue(assetQuery);

    const deleteQuery = {
      delete: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn(),
    };
    deleteQuery.delete.mockReturnValue(deleteQuery);
    deleteQuery.eq.mockReturnValue(deleteQuery);
    deleteQuery.select.mockReturnValue(deleteQuery);

    const from = vi
      .fn()
      .mockReturnValueOnce(assetQuery)
      .mockReturnValueOnce(deleteQuery);
    const remove = vi.fn().mockResolvedValue({ error: null });
    mocks.createServerClient.mockResolvedValue({
      from,
      storage: { from: vi.fn(() => ({ remove })) },
    });

    const formData = new FormData();
    formData.set("id", "30315da3-8a19-4355-8a08-4de796914683");

    await expect(deleteMediaAction(formData)).rejects.toThrow(
      "The%20Storage%20object%20was%20removed%2C%20but%20its%20media%20record%20was%20not%20found.",
    );
    expect(remove).toHaveBeenCalledOnce();
  });
});
