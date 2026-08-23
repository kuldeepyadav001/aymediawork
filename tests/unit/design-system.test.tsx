import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { MOTION_DURATION, MOTION_EASE } from "@/lib/constants/motion";

describe("design system", () => {
  it("applies semantic component variants", () => {
    render(
      <>
        <Button variant="brand">Primary action</Button>
        <Badge variant="success">Ready</Badge>
        <Card data-testid="glass-card" variant="glass" />
      </>,
    );

    expect(screen.getByRole("button", { name: "Primary action" })).toHaveClass(
      "bg-brand-linear",
    );
    expect(screen.getByText("Ready")).toHaveClass("text-success");
    expect(screen.getByTestId("glass-card")).toHaveClass("glass-panel");
  });

  it("renders reusable layout and heading primitives", () => {
    render(
      <Container data-testid="container" size="wide">
        <SectionHeading
          description="Supporting copy"
          eyebrow="Foundation"
          level="h3"
          title="Reusable hierarchy"
        />
      </Container>,
    );

    expect(screen.getByTestId("container")).toHaveClass("max-w-wide");
    expect(
      screen.getByRole("heading", { level: 3, name: "Reusable hierarchy" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Foundation")).toHaveClass("editorial-kicker");
  });

  it("preserves native accessible field attributes", () => {
    render(<Input aria-label="Email" aria-invalid="true" disabled />);

    expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("keeps complex controls aligned to the shared field and surface system", () => {
    render(
      <>
        <Select>
          <SelectTrigger aria-label="Service">
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
        </Select>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Project</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>,
    );

    expect(screen.getByRole("combobox", { name: "Service" })).toHaveClass(
      "h-11",
      "bg-surface/65",
    );
    expect(screen.getByRole("table").parentElement).toHaveClass(
      "rounded-lg",
      "border-border/70",
    );
    expect(screen.getByRole("cell", { name: "Project" })).toHaveClass("p-4");
  });

  it("keeps motion timing centralized and restrained", () => {
    expect(MOTION_DURATION.fast).toBeLessThan(MOTION_DURATION.slow);
    expect(MOTION_EASE.enter).toHaveLength(4);
  });
});
