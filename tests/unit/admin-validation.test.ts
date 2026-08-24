import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clientLogoAdminSchema,
  serviceAdminSchema,
} from "@/lib/validations/admin";

const imagePathSchema = serviceAdminSchema.shape.imagePath;
const destinationUrlSchema = clientLogoAdminSchema.shape.destinationUrl;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("admin CMS validation", () => {
  it("accepts only local image assets or the configured admin-media origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");

    expect(imagePathSchema.safeParse("/images/work/example.jpg").success).toBe(
      true,
    );
    expect(
      imagePathSchema.safeParse(
        "https://project.supabase.co/storage/v1/object/public/admin-media/user-id/image.webp",
      ).success,
    ).toBe(true);

    for (const path of [
      "https://images.example/image.jpg",
      "https://other.supabase.co/storage/v1/object/public/admin-media/image.jpg",
      "https://user:secret@project.supabase.co/storage/v1/object/public/admin-media/image.jpg",
      "/images/../secret.jpg",
      "/images/example.jpg?redirect=1",
      "javascript:alert(1)",
    ]) {
      expect(imagePathSchema.safeParse(path).success).toBe(false);
    }
  });

  it("allows only HTTP(S) logo destinations and normalizes the URL", () => {
    expect(destinationUrlSchema.parse("HTTP://example.com/portfolio")).toBe(
      "http://example.com/portfolio",
    );
    expect(destinationUrlSchema.parse("")).toBe("");
    expect(destinationUrlSchema.safeParse("javascript:alert(1)").success).toBe(
      false,
    );
    expect(
      destinationUrlSchema.safeParse("mailto:hello@example.com").success,
    ).toBe(false);
    expect(
      destinationUrlSchema.safeParse("https://user:secret@example.com").success,
    ).toBe(false);
  });
});
