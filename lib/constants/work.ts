export const WORK_CATEGORIES = [
  "Film & Motion",
  "Product Stories",
  "Brand & Campaign",
  "Digital Systems",
  "Emerging Visuals",
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type WorkStudy = {
  category: string;
  description: string;
  direction: string | null;
  experience: string | null;
  explores: readonly string[];
  format: string;
  id: string;
  image: {
    alt: string;
    src: string;
  };
  index: string;
  metaDescription: string;
  palette: readonly {
    hex: string;
    name: string;
  }[];
  premise: {
    context: string | null;
    question: string | null;
  };
  principle: string | null;
  services: readonly string[];
  slug: string;
  system: string | null;
  title: string;
  tone: readonly string[];
  videoUrl?: string | null;
  externalUrl?: string | null;
  gallery?: readonly string[];
};

export const WORK_STUDIES: readonly WorkStudy[] = [
  {
    id: "concept-001",
    index: "01",
    slug: "signal-in-the-noise",
    title: "Signal in the Noise",
    category: "Film & Motion",
    format: "Editorial film system",
    description:
      "A story-led editing study about turning visual overload into one deliberate line of attention.",
    metaDescription:
      "Signal in the Noise is an original AY Media Work concept exploring editorial rhythm, narrative hierarchy, sound direction, and cinematic finishing.",
    image: {
      src: "/images/work/signal-in-the-noise.jpg",
      alt: "Layered film strips converging around a precise cobalt beam in a dark cinematic space",
    },
    services: ["video-editing", "graphic-design", "cgi-and-vfx"],
    premise: {
      question:
        "How can an edit make a dense stream of information feel focused rather than frantic?",
      context:
        "The concept begins with fragments: competing frames, interrupted pathways, and visual noise. The central idea is not to remove complexity, but to direct it toward a single readable signal.",
    },
    direction:
      "The visual language uses fractured film layers and strong negative space to create tension between distraction and control. One cobalt line becomes the recurring point of orientation.",
    system:
      "Frame density, scale, and contrast are treated as editorial tools. Quiet holds create room around compressed passages, while graphic markers help the eye understand where the story is moving.",
    experience:
      "The imagined sequence would move from scattered sound and rapid fragments toward a calmer, resolved rhythm—allowing the finish to feel earned rather than simply decorative.",
    explores: [
      "Narrative hierarchy inside information-rich edits",
      "Pacing built through contrast rather than constant speed",
      "A graphic motif that can connect picture and sound",
      "Cinematic finishing that preserves clarity on small screens",
    ],
    principle:
      "Complexity becomes useful when attention has somewhere to land.",
    tone: ["Focused", "Cinematic", "Precise"],
    palette: [
      { name: "Deep space", hex: "#06080E" },
      { name: "Signal blue", hex: "#377DFF" },
      { name: "Cold steel", hex: "#9AA8C0" },
      { name: "Marker red", hex: "#E34A50" },
    ],
  },
  {
    id: "concept-002",
    index: "02",
    slug: "interface-in-motion",
    title: "Interface in Motion",
    category: "Product Stories",
    format: "SaaS product narrative",
    description:
      "A product-film direction that turns connected features into a guided visual journey instead of a screen recording.",
    metaDescription:
      "Interface in Motion is an original AY Media Work concept for SaaS product storytelling through clear journeys, interface-led motion, and dimensional design.",
    image: {
      src: "/images/work/interface-in-motion.jpg",
      alt: "Translucent blue and violet interface panels flowing through a dark product-story environment",
    },
    services: ["saas-video", "2d-and-3d-animation", "graphic-design"],
    premise: {
      question:
        "How can a product story explain connected actions without becoming a tour of every feature?",
      context:
        "This study treats the interface as a narrative space. Each panel exists only when it advances the viewer through a clear before, action, and after sequence.",
    },
    direction:
      "Floating glass planes create a product world without copying any real software. Depth separates stages in the journey, while cobalt and violet light identify progress and active moments.",
    system:
      "A modular camera path connects overview, focus, and confirmation states. The same spatial rules could support a main film, feature chapters, or shorter campaign cutdowns.",
    experience:
      "Motion remains measured and legible: elements enter with purpose, related actions stay visually grouped, and the camera pauses whenever the audience needs to understand a change.",
    explores: [
      "Product stories organised around user intent",
      "Interface-inspired motion without imitating real software",
      "Reusable scene rules for multiple feature narratives",
      "A balance of dimensional atmosphere and graphic clarity",
    ],
    principle:
      "Show the journey the product enables—not every control it contains.",
    tone: ["Clear", "Dimensional", "Guided"],
    palette: [
      { name: "Night navy", hex: "#070A16" },
      { name: "Product blue", hex: "#4B7DFF" },
      { name: "Glass violet", hex: "#8E6BFF" },
      { name: "Interface mist", hex: "#C7D4FF" },
    ],
  },
  {
    id: "concept-003",
    index: "03",
    slug: "worlds-between-frames",
    title: "Worlds Between Frames",
    category: "Emerging Visuals",
    format: "AI-assisted visual sequence",
    description:
      "A surreal motion-world study shaped around continuity, human direction, and a finish beyond image generation.",
    metaDescription:
      "Worlds Between Frames is an original AY Media Work concept exploring directed AI animation, CGI continuity, editorial structure, and compositing.",
    image: {
      src: "/images/work/worlds-between-frames.jpg",
      alt: "Surreal cobalt glass landscape with chrome portals and violet cinematic atmosphere",
    },
    services: ["ai-animation", "cgi-and-vfx", "video-editing"],
    premise: {
      question:
        "What makes an unfamiliar generated world feel like one directed sequence rather than a collection of striking images?",
      context:
        "The study starts with a simple rule: every transformation must inherit something from the frame before it. Shape, light, movement, or camera direction becomes the thread between worlds.",
    },
    direction:
      "Cobalt glass, chrome arcs, and violet haze create a controlled material vocabulary. Surreal forms can change, but lighting logic and visual weight remain recognisable from scene to scene.",
    system:
      "Reference frames define the recurring geometry, lens language, palette, and transition anchors. Generated exploration would sit inside those rules before edit, cleanup, and compositing.",
    experience:
      "The sequence is imagined as a slow escalation from intimate reflections to open impossible spaces, using editorial rhythm and sound to make each visual shift feel intentional.",
    explores: [
      "Continuity rules for AI-assisted sequences",
      "Human art direction before and after generation",
      "Transitions built from shared material and movement",
      "Edit, cleanup, sound, and compositing as core craft",
    ],
    principle:
      "New visual tools still need old creative discipline: rules, rhythm, and review.",
    tone: ["Surreal", "Coherent", "Atmospheric"],
    palette: [
      { name: "Void", hex: "#080714" },
      { name: "Cobalt glass", hex: "#303DD9" },
      { name: "Violet haze", hex: "#7657BB" },
      { name: "Reflective pearl", hex: "#D9D6DF" },
    ],
  },
  {
    id: "concept-004",
    index: "04",
    slug: "identity-in-rhythm",
    title: "Identity in Rhythm",
    category: "Brand & Campaign",
    format: "Modular campaign language",
    description:
      "A graphic system built to remain recognisable while composition, pace, and format continue to change.",
    metaDescription:
      "Identity in Rhythm is an original AY Media Work concept exploring modular campaign design, hierarchy, motion principles, and format adaptation.",
    image: {
      src: "/images/work/identity-in-rhythm.jpg",
      alt: "Rhythmic cobalt paper planes, chrome discs, and violet layers arranged on a dark modular grid",
    },
    services: ["graphic-design", "facebook-and-meta-ads", "video-editing"],
    premise: {
      question:
        "How can a campaign feel alive across formats without losing the visual cues that make it recognisable?",
      context:
        "The concept uses a small kit of parts—angled planes, circular anchors, translucent fields, and one red marker—to create variety inside a repeatable identity.",
    },
    direction:
      "Tactile paper and chrome add contrast to a precise digital grid. Compositions feel energetic, but recurring scale relationships and colour roles keep the system controlled.",
    system:
      "Each format starts from the same anchor-and-flow rule. The anchor holds recognition; the directional planes adapt to horizontal, vertical, static, and motion-led placements.",
    experience:
      "In motion, shapes would arrive in short rhythmic phrases rather than continuous activity. The result is designed to create distinct moments for message, image, and action.",
    explores: [
      "A compact visual kit with room for variation",
      "Hierarchy that survives horizontal and vertical formats",
      "Motion principles derived from the graphic identity",
      "Campaign consistency without template repetition",
    ],
    principle: "Consistency comes from shared rules, not identical layouts.",
    tone: ["Graphic", "Rhythmic", "Adaptable"],
    palette: [
      { name: "Ink", hex: "#080A10" },
      { name: "Electric cobalt", hex: "#2F5BEA" },
      { name: "Soft violet", hex: "#9284C9" },
      { name: "Accent red", hex: "#F04452" },
    ],
  },
  {
    id: "concept-005",
    index: "05",
    slug: "connected-by-design",
    title: "Connected by Design",
    category: "Digital Systems",
    format: "Web and workflow concept",
    description:
      "A digital-experience study where the visible interface and the workflow behind it follow the same clear logic.",
    metaDescription:
      "Connected by Design is an original AY Media Work concept exploring responsive web structure, connected workflows, human checkpoints, and visual feedback.",
    image: {
      src: "/images/work/connected-by-design.jpg",
      alt: "Glass digital frames and luminous blue pathways forming a connected workflow in a dark space",
    },
    services: ["web-development", "ai-automation", "saas-video"],
    premise: {
      question:
        "What changes when the interface and the automated workflow are designed as one experience?",
      context:
        "This concept maps every visible action to a clear system response. Connections are shown only when they help a person understand progress, responsibility, or the next decision.",
    },
    direction:
      "Responsive glass frames represent user-facing moments while luminous pathways reveal the supporting flow. A brighter node marks places where human judgement remains essential.",
    system:
      "The proposed structure separates triggers, automated steps, review points, and outcomes. Components reuse the same status language so the experience stays coherent from small screen to wide workspace.",
    experience:
      "Feedback is immediate but restrained. The system communicates what happened, what needs attention, and how to recover—without exposing technical complexity that does not help the user.",
    explores: [
      "One information model across interface and workflow",
      "Visible human checkpoints inside connected processes",
      "Responsive components with consistent status language",
      "Graceful feedback for progress, exceptions, and recovery",
    ],
    principle:
      "Automation feels trustworthy when people can see where they remain in control.",
    tone: ["Connected", "Calm", "Legible"],
    palette: [
      { name: "System black", hex: "#060A11" },
      { name: "Flow blue", hex: "#2580FF" },
      { name: "Node cyan", hex: "#56D5FF" },
      { name: "Review violet", hex: "#786CFF" },
    ],
  },
  {
    id: "concept-006",
    index: "06",
    slug: "impossible-made-visible",
    title: "Impossible, Made Visible",
    category: "Emerging Visuals",
    format: "CGI and VFX key sequence",
    description:
      "A visual-effects study about making one impossible event feel physically present inside a cinematic frame.",
    metaDescription:
      "Impossible, Made Visible is an original AY Media Work concept exploring CGI form, energy simulation, lighting integration, compositing, and cinematic finishing.",
    image: {
      src: "/images/work/impossible-made-visible.jpg",
      alt: "Sculptural chrome form split by a controlled ribbon of cobalt energy in a cinematic set",
    },
    services: ["cgi-and-vfx", "2d-and-3d-animation", "video-editing"],
    premise: {
      question:
        "How can a physically impossible effect still feel as though it belongs to the photographed world?",
      context:
        "The concept centres on one event: a controlled energy ribbon passes through a reflective object and changes its structure. Every creative choice supports the weight, light, and consequence of that moment.",
    },
    direction:
      "A grounded industrial set gives the effect something real to interact with. Chrome surfaces expose every lighting decision, while smoke and fine debris make movement visible through the atmosphere.",
    system:
      "The effect is separated into form, energy, particles, reflected light, contact light, and environmental response. Building these layers independently allows the final composite to be tuned as one believable shot.",
    experience:
      "The imagined sequence holds before the event, accelerates through the split, then allows the environment to settle. That contrast gives scale to the effect without relying on constant spectacle.",
    explores: [
      "CGI designed around the photographed environment",
      "Simulation layers with distinct visual responsibilities",
      "Reflected and contact light as integration tools",
      "Editorial restraint before and after a hero effect",
    ],
    principle:
      "An impossible image feels present when the environment appears to remember it.",
    tone: ["Physical", "Controlled", "Cinematic"],
    palette: [
      { name: "Set black", hex: "#07090D" },
      { name: "Energy blue", hex: "#168BFF" },
      { name: "Chrome", hex: "#A9B2BD" },
      { name: "Heat red", hex: "#BC343E" },
    ],
  },
] as const;

export function getWorkStudyBySlug(slug: string) {
  return WORK_STUDIES.find((study) => study.slug === slug);
}

export function getNextWorkStudy(slug: string): WorkStudy {
  const currentIndex = WORK_STUDIES.findIndex((study) => study.slug === slug);
  const nextIndex = (currentIndex + 1) % WORK_STUDIES.length;
  const nextStudy = WORK_STUDIES[nextIndex];

  if (!nextStudy) {
    throw new Error("The work archive must contain at least one study.");
  }

  return nextStudy;
}
