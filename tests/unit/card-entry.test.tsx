import { cleanup, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { WorkDetail } from "@/components/sections/work/work-detail";
import { WORK_STUDIES, type WorkStudy } from "@/lib/constants/work";

afterEach(cleanup);

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260826140000_optional_case_study_narrative.sql",
  ),
  "utf8",
)
  .replace(/\s+/g, " ")
  .toLowerCase();

const base = WORK_STUDIES[0];
if (!base) throw new Error("Expected at least one work study fixture");

const cardEntry: WorkStudy = {
  ...base,
  slug: "card-entry-fixture",
  title: "Card Entry Fixture",
  direction: null,
  experience: null,
  explores: [],
  palette: [],
  premise: { context: null, question: null },
  principle: null,
  system: null,
  tone: [],
  externalUrl: "https://www.instagram.com/reel/TESTREEL/",
  videoUrl: null,
};

describe("card-only work entries", () => {
  it("renders without any narrative section and marks the entry as client work", () => {
    render(<WorkDetail study={cardEntry} />);

    expect(
      screen.getByRole("heading", { level: 1, name: cardEntry.title }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Creative premise")).not.toBeInTheDocument();
    expect(
      screen.queryByText("From question to direction"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Frame study")).not.toBeInTheDocument();
    expect(
      screen.queryByText("What this concept explores"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Design principle")).not.toBeInTheDocument();
    expect(screen.getAllByText("Client project").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /View on Instagram/i }),
    ).toBeInTheDocument();
  });

  it("keeps the full narrative for showcase entries", () => {
    render(<WorkDetail study={base} />);
    expect(screen.getByText("Creative premise")).toBeInTheDocument();
    expect(screen.getByText("From question to direction")).toBeInTheDocument();
    expect(screen.getByText("Design principle")).toBeInTheDocument();
  });
});

describe("optional narrative migration", () => {
  it("runs inside a single transaction", () => {
    expect(migration).toContain(" begin; ");
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("drops NOT NULL from exactly the six narrative columns", () => {
    for (const column of [
      "premise_question",
      "premise_context",
      "direction",
      "system",
      "experience",
      "principle",
    ]) {
      expect(migration).toContain(
        `alter table public.projects alter column ${column} drop not null`,
      );
    }
    expect(migration).not.toContain("drop column");
    expect(migration).not.toContain("alter column title");
    expect(migration).not.toContain("alter column description");
  });

  it("stores empty narrative submissions as NULL through save_admin_project", () => {
    expect(migration).toContain("nullif(p_project ->> 'premise_question', '')");
    expect(migration).toContain("nullif(p_project ->> 'principle', '')");
    expect(migration).toContain("security invoker");
    expect(migration).not.toContain("security definer");
  });
});
