import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { StudioProof } from "@/components/sections/shared/studio-proof";
import {
  STUDIO_STATS,
  STUDIO_STORY,
  STUDIO_TOOLKIT,
  YTJOBS_PROFILE_URL,
} from "@/lib/constants/studio-proof";
import { extractYouTubeVideoId, isYouTubeUrl } from "@/lib/utils/youtube";

afterEach(cleanup);

describe("studio proof", () => {
  it("renders every verified stat with its label and the public verification link", () => {
    render(<StudioProof />);

    for (const stat of STUDIO_STATS) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("link", { name: /Verify on our public profile/i }),
    ).toHaveAttribute("href", YTJOBS_PROFILE_URL);
    expect(screen.getByText(/publicly verifiable/i)).toBeInTheDocument();
  });

  it("keeps the approved story and toolkit content intact", () => {
    expect(STUDIO_STORY[0]).toMatch(/Established in 2025/);
    expect(STUDIO_TOOLKIT.map((group) => group.title)).toEqual([
      "Craft tools",
      "AI-assisted workflow",
    ]);
    expect(STUDIO_TOOLKIT[0]?.items).toContain("Adobe Premiere Pro");
    expect(STUDIO_TOOLKIT[1]?.items).toContain("Sora");
  });
});

describe("youtube utilities", () => {
  it("accepts standard YouTube links and extracts the video id", () => {
    expect(extractYouTubeVideoId("https://youtu.be/W9b4nDyel_Q")).toBe(
      "W9b4nDyel_Q",
    );
    expect(
      extractYouTubeVideoId("https://www.youtube.com/watch?v=xkqc2a7vhj8"),
    ).toBe("xkqc2a7vhj8");
    expect(isYouTubeUrl("https://youtube.com/watch?v=dyrr4eAdnhg")).toBe(true);
  });

  it("rejects non-YouTube or unsafe values", () => {
    expect(extractYouTubeVideoId("")).toBeNull();
    expect(extractYouTubeVideoId(null)).toBeNull();
    expect(isYouTubeUrl("https://example.com/watch?v=abc123")).toBe(false);
    expect(isYouTubeUrl("javascript:alert(1)")).toBe(false);
    expect(isYouTubeUrl("http://youtu.be/W9b4nDyel_Q")).toBe(false);
  });
});
