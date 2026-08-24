import type { ServiceSlug } from "@/lib/constants/service-slugs";

export type ServiceApproachStep = {
  description: string;
  title: string;
};

export type Service = {
  id: string;
  approach: readonly ServiceApproachStep[];
  description: string;
  disciplines: readonly string[];
  heroTitle: string;
  image: {
    alt: string;
    src: string;
  };
  index: string;
  metaDescription: string;
  relatedSlugs: readonly ServiceSlug[];
  slug: ServiceSlug;
  title: string;
  usefulFor: readonly string[];
};

export const SERVICE_CATALOG: readonly Service[] = [
  {
    index: "01",
    id: "8f40a393-06f3-49c6-9d98-350a278f6c03",
    slug: "video-editing",
    title: "Video Editing",
    description:
      "Story-led cuts, intentional pacing, colour, and sound shaped into one clear viewing experience.",
    heroTitle: "Find the story hiding in the footage.",
    metaDescription:
      "Story-led video editing for branded films, interviews, campaigns, YouTube, and digital content from AY Media Work.",
    image: {
      src: "/images/services/video-editing.jpg",
      alt: "Abstract cobalt film layers flowing through a dark cinematic space",
    },
    disciplines: [
      "Narrative assembly and story structure",
      "Pacing, selects, and editorial rhythm",
      "Multi-camera and interview editing",
      "Colour finishing and visual consistency",
      "Sound design and mix preparation",
      "Cutdowns and format-specific versions",
    ],
    usefulFor: [
      "Branded stories and campaign films",
      "Interviews, profiles, and documentaries",
      "YouTube and creator-led episodes",
      "Explainers and internal communications",
    ],
    approach: [
      {
        title: "Read the material",
        description:
          "Review the footage, brief, references, and audience context before deciding what the edit needs to say.",
      },
      {
        title: "Build the spine",
        description:
          "Find the strongest moments and arrange them into a clear narrative structure with purposeful momentum.",
      },
      {
        title: "Shape the experience",
        description:
          "Develop pacing, music, sound, graphics, and visual transitions around the central idea.",
      },
      {
        title: "Refine the finish",
        description:
          "Polish picture and sound, review with context, and prepare the agreed formats for delivery.",
      },
    ],
    relatedSlugs: ["2d-and-3d-animation", "saas-video", "cgi-and-vfx"],
  },
  {
    index: "02",
    id: "42e81676-4c0e-421b-abce-fcc8304fb249",
    slug: "2d-and-3d-animation",
    title: "2D & 3D Animation",
    description:
      "Illustrated motion and dimensional worlds combined around the visual language each story needs.",
    heroTitle: "Move between graphic clarity and dimensional depth.",
    metaDescription:
      "2D and 3D animation spanning storyboards, styleframes, motion design, look development, lighting, and compositing.",
    image: {
      src: "/images/services/2d-and-3d-animation.jpg",
      alt: "Flat cobalt graphic planes transforming into dimensional glass forms",
    },
    disciplines: [
      "Concepts, storyboards, and animatics",
      "2D illustration and motion design",
      "3D modelling and scene development",
      "Materials, lighting, and look development",
      "Character, object, and camera animation",
      "Rendering, compositing, and delivery",
    ],
    usefulFor: [
      "Brand stories and campaign worlds",
      "Product and service explainers",
      "Launch films and title sequences",
      "Ideas that move beyond live-action production",
    ],
    approach: [
      {
        title: "Choose the visual language",
        description:
          "Translate the brief into references, storyboards, and a clear balance of illustrated and dimensional craft.",
      },
      {
        title: "Design the frames",
        description:
          "Develop composition, form, colour, materials, lighting, and movement principles before full production.",
      },
      {
        title: "Build the motion",
        description:
          "Animate each scene with timing, continuity, and transitions guided by the central story.",
      },
      {
        title: "Combine and finish",
        description:
          "Render, composite, review in context, and prepare the agreed outputs as one coherent visual experience.",
      },
    ],
    relatedSlugs: ["ai-animation", "cgi-and-vfx", "graphic-design"],
  },
  {
    index: "03",
    id: "4c29dc24-07cf-4812-92b3-a80317b34da1",
    slug: "saas-video",
    title: "SaaS Video",
    description:
      "Product stories that turn software journeys, features, and workflows into clear visual narratives.",
    heroTitle: "Make the product easier to see, follow, and understand.",
    metaDescription:
      "SaaS product videos, explainers, demos, launch stories, interface motion, and visual systems from AY Media Work.",
    image: {
      src: "/images/services/saas-video.jpg",
      alt: "Luminous product-story panels connected across a dark digital system",
    },
    disciplines: [
      "Product story and message structure",
      "Explainer scripts and storyboards",
      "Interface-led motion and visual walkthroughs",
      "Launch, feature, and overview videos",
      "Voiceover, sound, and editorial finishing",
      "Cutdowns for product and campaign channels",
    ],
    usefulFor: [
      "Product launches and feature releases",
      "Software overviews and guided demos",
      "Sales, onboarding, and education content",
      "Campaigns around complex digital products",
    ],
    approach: [
      {
        title: "Understand the product",
        description:
          "Map the audience, product context, approved source material, and the journey the video needs to explain.",
      },
      {
        title: "Simplify the story",
        description:
          "Turn features and workflows into a focused narrative with a clear sequence and visual hierarchy.",
      },
      {
        title: "Design the experience",
        description:
          "Connect interface moments, motion, type, voice, and sound around the chosen creative direction.",
      },
      {
        title: "Review in context",
        description:
          "Check clarity with the product team, refine the finish, and prepare the agreed formats for delivery.",
      },
    ],
    relatedSlugs: ["video-editing", "2d-and-3d-animation", "graphic-design"],
  },
  {
    index: "04",
    id: "08016a2d-beff-4d52-8423-8fcbca37aecb",
    slug: "graphic-design",
    title: "Graphic Design",
    description:
      "Clear, distinctive visual systems crafted across campaigns, content, and everyday brand communication.",
    heroTitle: "Give every visual a clear job and one connected voice.",
    metaDescription:
      "Graphic design for campaigns, social content, digital assets, presentations, and connected brand communication.",
    image: {
      src: "/images/services/graphic-design.jpg",
      alt: "Cobalt editorial shapes composed across a precise dark graphic grid",
    },
    disciplines: [
      "Campaign and key-visual development",
      "Social and digital content systems",
      "Layout, hierarchy, and typography",
      "Presentation and document design",
      "Marketing assets and format adaptation",
      "Reusable templates and visual guidelines",
    ],
    usefulFor: [
      "Campaigns with multiple visual outputs",
      "Brand and social content programmes",
      "Launch assets and digital communication",
      "Teams needing a more consistent visual system",
    ],
    approach: [
      {
        title: "Clarify the message",
        description:
          "Understand the audience, context, formats, source material, and action each design should support.",
      },
      {
        title: "Set the direction",
        description:
          "Explore composition, colour, type, image treatment, and a visual idea that can hold the work together.",
      },
      {
        title: "Build the system",
        description:
          "Develop the selected direction across the agreed assets while protecting hierarchy and consistency.",
      },
      {
        title: "Prepare the handoff",
        description:
          "Review every format in context and organise the final files, templates, or guidance required for use.",
      },
    ],
    relatedSlugs: ["saas-video", "web-development", "facebook-and-meta-ads"],
  },
  {
    index: "05",
    id: "16459520-5f00-4673-8f8d-60559a9fdb25",
    slug: "ai-animation",
    title: "AI Animation",
    description:
      "AI-assisted visual exploration shaped by human direction, continuity, editing, and finishing.",
    heroTitle: "Use new tools without losing creative direction.",
    metaDescription:
      "Creatively directed AI animation spanning visual exploration, shot development, continuity, editing, and finishing.",
    image: {
      src: "/images/services/ai-animation.jpg",
      alt: "A luminous cobalt form evolving through cinematic motion states",
    },
    disciplines: [
      "Concept and visual-language exploration",
      "Prompt direction and reference development",
      "AI-assisted shot and sequence creation",
      "Character and scene continuity planning",
      "Editorial structure and motion refinement",
      "Compositing, sound, and final finishing",
    ],
    usefulFor: [
      "Concept films and visual experiments",
      "Stylised campaign and social sequences",
      "Music, mood, and narrative-led content",
      "Ideas requiring unusual visual transitions",
    ],
    approach: [
      {
        title: "Define the creative rules",
        description:
          "Set the story, visual territory, references, boundaries, and production context before generating imagery.",
      },
      {
        title: "Explore with intent",
        description:
          "Develop selected visual routes and test how characters, scenes, and movement can remain connected.",
      },
      {
        title: "Direct the sequence",
        description:
          "Shape the strongest material into purposeful shots, transitions, rhythm, and a coherent viewing experience.",
      },
      {
        title: "Finish beyond the generation",
        description:
          "Refine through edit, compositing, cleanup, sound, and review before preparing the final formats.",
      },
    ],
    relatedSlugs: ["2d-and-3d-animation", "video-editing", "cgi-and-vfx"],
  },
  {
    index: "06",
    id: "4531277e-0d26-4994-b632-13f3245ee328",
    slug: "web-development",
    title: "Web Development",
    description:
      "Responsive digital experiences where structure, interaction, content, and visual craft work together.",
    heroTitle: "Turn the brand into a digital experience people can use.",
    metaDescription:
      "Responsive web development for business websites, landing pages, campaigns, and content-led digital experiences.",
    image: {
      src: "/images/services/web-development.jpg",
      alt: "Responsive cobalt frames assembling into a structured digital architecture",
    },
    disciplines: [
      "Website structure and technical planning",
      "Responsive front-end development",
      "Component and design-system implementation",
      "Content and CMS integration",
      "Interaction, accessibility, and performance care",
      "Quality assurance and launch preparation",
    ],
    usefulFor: [
      "Business and studio websites",
      "Campaign and product landing pages",
      "Content-led marketing experiences",
      "Digital refreshes with a clearer structure",
    ],
    approach: [
      {
        title: "Map the experience",
        description:
          "Align the audience, content, required functionality, constraints, and path through the website.",
      },
      {
        title: "Design the system",
        description:
          "Define responsive layouts, reusable components, interaction rules, and the content model behind them.",
      },
      {
        title: "Build with context",
        description:
          "Develop the agreed pages and features while testing behaviour across relevant screens and input methods.",
      },
      {
        title: "Verify and hand over",
        description:
          "Review content, accessibility, performance, and launch requirements before documenting the final setup.",
      },
    ],
    relatedSlugs: ["graphic-design", "ai-automation", "saas-video"],
  },
  {
    index: "07",
    id: "e1738033-c5ab-4fa2-8da4-71e6a6e8bfac",
    slug: "ai-automation",
    title: "AI Automation",
    description:
      "Connected workflows that organise repetitive steps while keeping people in control of key decisions.",
    heroTitle: "Connect the routine work around the decisions that matter.",
    metaDescription:
      "AI automation for connected business workflows, content operations, handoffs, review steps, and practical integrations.",
    image: {
      src: "/images/services/ai-automation.jpg",
      alt: "Cobalt signals moving through connected glass nodes into an ordered system",
    },
    disciplines: [
      "Workflow discovery and process mapping",
      "AI-assisted content and operations flows",
      "Tool, API, and data-source connections",
      "Triggers, routing, and handoff logic",
      "Human review and exception checkpoints",
      "Testing, documentation, and team handover",
    ],
    usefulFor: [
      "Repeated content and marketing operations",
      "Lead, inquiry, and information routing",
      "Internal handoffs across connected tools",
      "Processes with clear rules and review points",
    ],
    approach: [
      {
        title: "Find the right workflow",
        description:
          "Map the current process, systems, permissions, repeated steps, exceptions, and people responsible for decisions.",
      },
      {
        title: "Design the safeguards",
        description:
          "Define the data flow, triggers, approvals, fallbacks, and boundaries before connecting the tools.",
      },
      {
        title: "Build and test",
        description:
          "Implement the agreed workflow in controlled steps and test expected paths, failures, and human handoffs.",
      },
      {
        title: "Document the operation",
        description:
          "Prepare practical guidance for monitoring, updating, pausing, and reviewing the workflow after handover.",
      },
    ],
    relatedSlugs: ["web-development", "saas-video", "facebook-and-meta-ads"],
  },
  {
    index: "08",
    id: "bef5495e-b88a-4c97-b2a6-3bb370e6a962",
    slug: "facebook-and-meta-ads",
    title: "Facebook & Meta Ads",
    description:
      "Campaign strategy, creative, setup, and iteration connected around a clear audience and objective.",
    heroTitle: "Connect the campaign idea to the people it needs to reach.",
    metaDescription:
      "Facebook and Meta advertising support across campaign planning, creative, setup, audience structure, and reporting.",
    image: {
      src: "/images/services/facebook-and-meta-ads.jpg",
      alt: "A focused cobalt campaign signal branching through abstract audience pathways",
    },
    disciplines: [
      "Campaign objectives and account planning",
      "Audience, placement, and journey structure",
      "Ad concepts, copy, and creative formats",
      "Campaign setup and tracking coordination",
      "Creative variations and controlled testing",
      "Reporting context and iteration planning",
    ],
    usefulFor: [
      "Brand, product, and service campaigns",
      "Launches and focused promotional periods",
      "Lead and inquiry journeys",
      "Teams needing connected creative and delivery",
    ],
    approach: [
      {
        title: "Set the campaign context",
        description:
          "Align the audience, objective, offer, destination, available material, and practical account requirements.",
      },
      {
        title: "Build the creative system",
        description:
          "Develop messages, visual routes, formats, and variations suited to the agreed campaign structure.",
      },
      {
        title: "Prepare the delivery",
        description:
          "Coordinate campaign setup, placements, tracking inputs, review checks, and launch readiness.",
      },
      {
        title: "Learn and refine",
        description:
          "Review relevant campaign signals in context and plan deliberate adjustments to creative or delivery.",
      },
    ],
    relatedSlugs: ["graphic-design", "video-editing", "ai-automation"],
  },
  {
    index: "09",
    id: "e3e68584-f56c-4225-9077-863b798f67be",
    slug: "cgi-and-vfx",
    title: "CGI & VFX",
    description:
      "Crafted digital elements, simulations, and compositing for visuals that need to move beyond the captured frame.",
    heroTitle: "Build what the camera cannot—and make it belong in the frame.",
    metaDescription:
      "CGI and VFX spanning concept development, 3D integration, tracking, simulations, compositing, cleanup, and finishing.",
    image: {
      src: "/images/services/cgi-and-vfx.jpg",
      alt: "A luminous cobalt energy ribbon composited through sculptural chrome forms",
    },
    disciplines: [
      "Concept frames and visual-effects planning",
      "CGI objects and environment elements",
      "Camera tracking and 3D integration",
      "Particles, simulations, and atmospheric effects",
      "Cleanup, compositing, and screen treatments",
      "Colour integration and final finishing",
    ],
    usefulFor: [
      "Product and campaign films",
      "Cinematic brand and launch moments",
      "Footage requiring cleanup or extension",
      "Visual ideas beyond practical production",
    ],
    approach: [
      {
        title: "Plan the illusion",
        description:
          "Study the brief, plates, references, camera context, and final use before choosing the effects path.",
      },
      {
        title: "Build the elements",
        description:
          "Develop the required forms, materials, simulations, tracking, and look with the final frame in mind.",
      },
      {
        title: "Integrate the shot",
        description:
          "Composite light, colour, atmosphere, movement, and perspective so the added elements support the scene.",
      },
      {
        title: "Refine the finish",
        description:
          "Review each shot in sequence, resolve distracting details, and prepare the agreed outputs for delivery.",
      },
    ],
    relatedSlugs: ["2d-and-3d-animation", "ai-animation", "video-editing"],
  },
] as const;

export function getServiceBySlug(slug: string) {
  return SERVICE_CATALOG.find((service) => service.slug === slug);
}
