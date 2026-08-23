import { ArrowDown, ArrowUpRight, Check, Play, Sparkles } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const colorTokens = [
  {
    className: "bg-brand-blue",
    hex: "#3D70FF",
    label: "Electric blue",
  },
  {
    className: "bg-brand-violet",
    hex: "#9B5CF3",
    label: "Signal violet",
  },
  { className: "bg-brand-red", hex: "#F0443E", label: "Editorial red" },
  { className: "bg-foreground", hex: "#F3F4F8", label: "Studio white" },
  {
    className: "bg-surface-elevated",
    hex: "#12141C",
    label: "Elevated surface",
  },
  { className: "bg-background", hex: "#08090D", label: "Deep canvas" },
] as const;

const principles = [
  {
    index: "01",
    title: "Atmosphere with restraint",
    description:
      "Depth comes from controlled light, contrast, and layering—not decorative noise.",
  },
  {
    index: "02",
    title: "Editorial hierarchy",
    description:
      "Fluid type and disciplined spacing make every message easy to scan at any size.",
  },
  {
    index: "03",
    title: "Motion with purpose",
    description:
      "Short, transform-based transitions support context and respect reduced-motion settings.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="ambient-grid pointer-events-none absolute inset-x-0 top-0 -z-20 h-[52rem] opacity-35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-20rem] -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-[140px] sm:size-[58rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-14rem] top-[26rem] -z-10 size-[30rem] rounded-full bg-brand-violet/10 blur-[120px]"
      />

      <Container className="flex min-h-[calc(100svh-6rem)] flex-col py-6 sm:py-8">
        <section className="grid flex-1 items-center gap-14 py-20 lg:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)] lg:py-24">
          <Reveal className="max-w-5xl">
            <p className="editorial-kicker">Stage 02 · Visual language</p>
            <h1 className="mt-7 text-balance text-display-xl">
              Cinematic clarity.
              <span className="text-gradient-brand block">
                Editorial control.
              </span>
            </h1>
            <p className="mt-8 max-w-copy text-pretty text-lead text-muted-foreground">
              A responsive design foundation built for premium creative work:
              expressive when it matters, quiet when the story needs space.
            </p>
            <div className="mt-9 flex flex-col gap-3 xs:flex-row">
              <Button asChild size="lg" variant="brand">
                <a href="#components">
                  Explore the system
                  <ArrowDown aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#principles">
                  Design principles
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.12} direction="left">
            <div className="glass-panel relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl p-5 sm:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_24%,hsl(var(--brand-blue)/0.34),transparent_34%),radial-gradient(circle_at_25%_78%,hsl(var(--brand-violet)/0.2),transparent_36%)]" />
              <div className="absolute inset-[12%] rounded-full border border-white/10" />
              <div className="absolute inset-[25%] animate-pulse-glow rounded-full border border-brand-blue/40 shadow-glow motion-reduce:animate-none" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/65">
                  <span>AY Media Work</span>
                  <span>System 02</span>
                </div>
                <div>
                  <div className="flex size-14 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl">
                    <Play
                      aria-hidden="true"
                      className="ml-0.5 size-5 fill-white"
                    />
                  </div>
                  <p className="mt-6 font-display text-heading-lg leading-none">
                    Create.
                    <br /> Refine.
                    <br /> Move.
                  </p>
                </div>
                <div className="flex items-end justify-between border-t border-white/10 pt-5">
                  <p className="max-w-[12rem] text-xs leading-5 text-white/65">
                    A performance-aware canvas for motion, film, design, and
                    digital stories.
                  </p>
                  <Sparkles
                    aria-hidden="true"
                    className="size-5 text-primary"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </Container>

      <section className="border-y border-border/70 bg-surface/55 py-section">
        <Container>
          <SectionHeading
            eyebrow="Typography"
            title="Scale that feels composed, not crowded."
            description="Space Grotesk leads the editorial moments. Manrope keeps navigation, body copy, and interfaces precise and readable. Both are variable, open-source, and self-hosted by Next.js at build time."
          />

          <div className="mt-16 divide-y divide-border/70 border-y border-border/70">
            <div className="grid gap-5 py-10 md:grid-cols-[10rem_1fr] md:items-end">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Display / XL
              </p>
              <p className="text-display-lg">Frame the impossible.</p>
            </div>
            <div className="grid gap-5 py-10 md:grid-cols-[10rem_1fr] md:items-end">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Heading / LG
              </p>
              <p className="text-heading-lg">Stories designed to move.</p>
            </div>
            <div className="grid gap-5 py-10 md:grid-cols-[10rem_1fr] md:items-start">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Body / Lead
              </p>
              <p className="max-w-copy text-lead text-muted-foreground">
                Generous line height and a measured reading width preserve
                clarity across phones, tablets, and cinematic displays.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <SectionHeading
            eyebrow="Colour"
            title="Dark by design. Electric by intent."
            description="Blue and violet establish the core atmosphere. Red appears selectively for editorial emphasis and high-signal moments."
          />

          <Stagger className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {colorTokens.map((token) => (
              <StaggerItem key={token.label}>
                <div className="overflow-hidden rounded-lg border border-border/80 bg-card">
                  <div className={`aspect-[4/3] ${token.className}`} />
                  <div className="p-4">
                    <p className="text-xs font-semibold">{token.label}</p>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
                      {token.hex}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section
        className="border-y border-border/70 bg-surface/55 py-section"
        id="components"
      >
        <Container>
          <SectionHeading
            eyebrow="Interface kit"
            title="One language, from first click to final handover."
            description="Accessible primitives share the same focus treatment, spacing rhythm, state feedback, and restrained depth."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <Card className="overflow-hidden" variant="glass">
              <CardHeader className="border-b border-border/70">
                <CardTitle>Actions & status</CardTitle>
                <CardDescription>
                  Clear hierarchy for primary, secondary, and contextual
                  actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6 sm:pt-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="brand">
                    Start a project
                    <ArrowUpRight aria-hidden="true" />
                  </Button>
                  <Button variant="outline">View work</Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    aria-label="Play preview"
                  >
                    <Play aria-hidden="true" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>New</Badge>
                  <Badge variant="violet">Featured</Badge>
                  <Badge variant="red">Editorial</Badge>
                  <Badge variant="success">
                    <Check aria-hidden="true" /> Ready
                  </Badge>
                </div>
                <Tabs defaultValue="client">
                  <TabsList aria-label="Inquiry type">
                    <TabsTrigger value="client">Client</TabsTrigger>
                    <TabsTrigger value="partner">Partner</TabsTrigger>
                  </TabsList>
                  <TabsContent value="client">
                    <p className="text-sm leading-6 text-muted-foreground">
                      Focused controls preserve context without competing with
                      the content.
                    </p>
                  </TabsContent>
                  <TabsContent value="partner">
                    <p className="text-sm leading-6 text-muted-foreground">
                      The same primitives support alternate inquiry journeys.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Input language</CardTitle>
                <CardDescription>
                  Comfortable touch targets, visible labels, and consistent
                  keyboard focus.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label
                    className="text-xs font-semibold"
                    htmlFor="preview-name"
                  >
                    Name
                  </label>
                  <Input id="preview-name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs font-semibold"
                    htmlFor="preview-brief"
                  >
                    Project brief
                  </label>
                  <Textarea
                    id="preview-brief"
                    placeholder="Tell us what you want to create"
                  />
                </div>
                <Button className="w-full" type="button" variant="inverse">
                  Continue
                  <ArrowUpRight aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-section" id="principles">
        <Container>
          <SectionHeading
            eyebrow="System principles"
            title="Built to amplify the work—not compete with it."
          />
          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 lg:grid-cols-3">
            {principles.map((principle) => (
              <StaggerItem
                className="bg-background p-7 sm:p-9"
                key={principle.index}
              >
                <p className="font-mono text-xs text-primary">
                  {principle.index}
                </p>
                <h3 className="mt-14 text-heading-md">{principle.title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {principle.description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </div>
  );
}
