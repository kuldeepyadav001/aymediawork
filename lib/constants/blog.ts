import type { BlogSlug } from "@/lib/constants/blog-slugs";
import type { ServiceSlug } from "@/lib/constants/service-slugs";

export const BLOG_CATEGORIES = [
  "Creative Direction",
  "Motion & Design",
  "AI & Automation",
  "Digital Experience",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogArticle = {
  author: "AY Media Work";
  body: string;
  category: BlogCategory;
  excerpt: string;
  featured: boolean;
  id: string;
  image: {
    alt: string;
    src: string;
  };
  metaDescription: string;
  publishedAt: string;
  readingMinutes: number;
  relatedServices: readonly ServiceSlug[];
  slug: BlogSlug;
  tags: readonly string[];
  takeaways: readonly string[];
  title: string;
};

export type BlogArticleSummary = Omit<BlogArticle, "body" | "takeaways">;

export const BLOG_ARTICLES: readonly BlogArticle[] = [
  {
    id: "journal-001",
    slug: "one-idea-many-outputs",
    title: "One Idea, Many Outputs",
    category: "Creative Direction",
    excerpt:
      "A practical way to make film, design, motion, and digital touchpoints feel like parts of one story—not separate requests sharing a deadline.",
    metaDescription:
      "Explore a connected creative-direction method for carrying one central idea across film, design, motion, campaigns, and digital experiences.",
    author: "AY Media Work",
    publishedAt: "2026-08-24",
    readingMinutes: 4,
    featured: true,
    image: {
      src: "/images/blog/one-idea-many-outputs.jpg",
      alt: "A radiant cobalt glass core connecting film, graphic, dimensional, and interface-inspired forms",
    },
    tags: ["Creative direction", "Content systems", "Multidisciplinary craft"],
    relatedServices: ["video-editing", "graphic-design", "web-development"],
    takeaways: [
      "Define the central idea before choosing its formats.",
      "Give every output a role instead of asking every output to say everything.",
      "Build shared rules for voice, rhythm, hierarchy, and visual behaviour.",
      "Review the complete journey as well as each individual asset.",
    ],
    body: `A project can begin as a film and quickly become a landing page, a set of social cutdowns, campaign graphics, motion loops, and a product explanation. The number of outputs grows, but the audience should still feel one clear thought moving through all of them.

That coherence does not come from placing the same colour and logo everywhere. It comes from deciding what must remain recognisable when the format, pace, and level of detail change.

## Start with the idea that must survive

Before discussing deliverables, write the central idea in language that can guide a creative decision. It should be more useful than a slogan and more focused than a list of objectives.

A working idea might describe a tension to resolve, a change the audience should understand, or a feeling the experience should leave behind. The purpose is not to produce finished copy. It is to create a reference point for the many choices that follow.

When the central idea is clear, each discipline can interpret it rather than decorate around it.

> A connected system repeats the logic of the idea, not the surface of one execution.

## Give every output a distinct job

A launch film and a mobile landing page do not hold attention in the same way. A short campaign edit cannot carry the same context as a product walkthrough. Trying to make every asset communicate the full story usually creates crowded work.

Instead, assign a role to each part of the system:

- **Introduce** the tension or possibility.
- **Explain** the change, process, or product.
- **Demonstrate** the experience in a concrete way.
- **Remind** the audience through a recognisable visual or verbal cue.
- **Convert** interest into one clear next action.

These roles can overlap, but naming them prevents duplication and helps the team decide what each format can leave out.

## Build rules that travel

A useful creative system contains a small number of rules that can move between disciplines. Those rules may include:

- A hierarchy for what the audience sees first, second, and last.
- A rhythm that alternates dense information with space to absorb it.
- A recurring visual behaviour, such as convergence, reveal, interruption, or transformation.
- A material or lighting language that can inform graphics, animation, CGI, and interface details.
- A voice that defines how direct, technical, playful, or restrained the words should feel.

The goal is not to make a rigid template. It is to give different makers enough shared logic to create related work without producing identical layouts.

## Let the disciplines influence one another

Connected direction becomes stronger when the flow is not one-way. Editorial rhythm can influence interaction design. Interface hierarchy can clarify a product film. A sound motif can suggest a motion principle. A three-dimensional material can become a graphic texture.

This exchange is easiest when the disciplines meet early. If every team receives a finished answer from another department, the project becomes a chain of adaptations. If the central idea is shared before the answers are fixed, each craft can improve the system.

## Review the journey, not only the assets

Individual outputs are often reviewed in isolation because that is how files arrive. The audience, however, may move from a short video to a landing page, then to a deeper explanation or inquiry.

A connected review asks:

1. What does the audience already know at this point?
2. What new information or feeling does this output add?
3. Which cue confirms that they are still inside the same story?
4. What should they understand or do next?

This sequence can reveal repetition, missing context, and abrupt changes in tone that remain invisible when every asset is judged alone.

## Coherence leaves room for change

The strongest systems do not depend on one fixed composition. They preserve a recognisable centre while allowing format, emphasis, and energy to adapt.

That is the practical value of beginning with one idea: the project can grow without becoming a collection of unrelated requests. Film, design, motion, and technology become different expressions of the same direction—and each expression can focus on the job it does best.`,
  },
  {
    id: "journal-002",
    slug: "motion-that-carries-meaning",
    title: "Motion That Carries Meaning",
    category: "Motion & Design",
    excerpt:
      "Movement becomes useful when pace, direction, and transition help the audience understand what changed—and why it matters.",
    metaDescription:
      "Learn how timing, hierarchy, continuity, and restraint can make animation and motion design clarify a story instead of merely adding activity.",
    author: "AY Media Work",
    publishedAt: "2026-08-24",
    readingMinutes: 4,
    featured: false,
    image: {
      src: "/images/blog/motion-that-carries-meaning.jpg",
      alt: "A cobalt ribbon moving through suspended chrome frames with alternating tension, space, and rhythm",
    },
    tags: ["Motion design", "Animation", "Visual storytelling"],
    relatedServices: ["2d-and-3d-animation", "video-editing", "saas-video"],
    takeaways: [
      "Connect every movement to a change in meaning or attention.",
      "Use contrast in timing instead of keeping everything in motion.",
      "Carry visual properties across transitions to preserve continuity.",
      "Review motion at the size and context where it will be experienced.",
    ],
    body: `Motion can attract attention almost instantly. That does not mean it automatically creates understanding.

When every element moves because movement is available, the audience has to work harder to decide what matters. Useful motion does the opposite: it directs attention, explains relationships, and makes change easier to follow.

## Begin with the change

Before choosing an easing curve or transition style, identify what is changing for the audience.

Is a new idea entering? Is one state becoming another? Are several parts being grouped? Is the viewer moving from overview to detail? The movement should make that change more legible.

A simple test is to finish this sentence: **this moves because…** If the answer is only “to make it dynamic,” the motion may not yet have a clear responsibility.

## Treat timing as hierarchy

Visual hierarchy is often discussed through size, colour, and position. In motion, timing becomes another layer of hierarchy.

The first movement receives attention. A pause creates emphasis. A faster passage can compress repeated actions. A slower transition can signal that the audience is entering a new chapter.

This makes contrast essential. Constant speed feels flat even when it is fast. Constant activity can make important moments disappear inside the same level of energy.

Useful timing often includes:

- A clear lead action.
- Supporting movement that follows rather than competes.
- Holds long enough for the result to be understood.
- Acceleration where repetition no longer needs full explanation.
- A deliberate finish rather than an arbitrary stop.

## Preserve a thread through transitions

A transition feels coherent when something survives the change. It could be direction, shape, colour, scale, position, or a continuing sound.

For example, a circular product detail might expand into a wider system map while keeping its centre and colour role. A camera movement may continue through two different environments. A graphic line can become the path that reveals the next scene.

The scenes do not need to look identical. They need a relationship the audience can follow.

> Continuity is not the absence of change. It is the presence of a readable connection.

## Use restraint to give movement weight

Stillness is part of motion design. Without it, the audience loses the reference needed to feel acceleration, interruption, or impact.

A quiet frame can prepare a reveal. A short hold can let a product state register. A stable element can anchor the eye while supporting information changes around it.

Restraint also protects accessibility and performance. Not every interaction needs a large transition, and not every background needs continuous movement. The most visible motion should belong to the most useful change.

## Design sound and picture as one rhythm

Sound should not be added only after the visual timing is locked. Even a restrained sound direction can influence where a movement begins, how long it holds, and whether a transition feels soft, mechanical, physical, or weightless.

This does not require filling every action with an effect. Silence, room tone, texture, and emphasis can create a clearer rhythm than constant audio punctuation.

A shared timing map for picture and sound helps both disciplines support the same hierarchy.

## Review motion in its real context

A sequence that feels elegant on a large editing monitor may become unclear inside a small mobile card. Fine movement can disappear. Fast type can become unreadable. A subtle transition may be lost when the viewer is also scrolling.

Review should include the intended dimensions, surrounding interface, playback behaviour, and reduced-motion alternative. The question is not only whether the animation looks polished. It is whether the audience can understand it where it actually lives.

Motion earns its place when it carries the story forward. Pace, transition, sound, and stillness become tools for meaning—not decoration added after the direction is already complete.`,
  },
  {
    id: "journal-003",
    slug: "automation-with-a-human-thread",
    title: "Automation With a Human Thread",
    category: "AI & Automation",
    excerpt:
      "A responsible workflow does more than move information quickly. It makes ownership, review, exceptions, and recovery visible to the people using it.",
    metaDescription:
      "A practical framework for designing AI-assisted automation with clear ownership, human review points, understandable states, and graceful recovery.",
    author: "AY Media Work",
    publishedAt: "2026-08-24",
    readingMinutes: 4,
    featured: false,
    image: {
      src: "/images/blog/automation-with-human-thread.jpg",
      alt: "A warm organic light thread passing through a calm network of cobalt glass workflow nodes",
    },
    tags: ["AI automation", "Workflow design", "Human review"],
    relatedServices: ["ai-automation", "web-development", "ai-animation"],
    takeaways: [
      "Map responsibility before mapping automated steps.",
      "Keep consequential decisions visible and reviewable.",
      "Design exception and recovery paths alongside the ideal flow.",
      "Measure usefulness through the experience, not the number of automated steps.",
    ],
    body: `Automation is often drawn as a clean line: a trigger enters, a series of steps runs, and an outcome appears. Real work contains more texture. Information can be incomplete. Priorities can change. A result may need judgement before it is useful.

A responsible automated workflow accounts for that texture rather than hiding it.

## Map responsibility before speed

Begin with the people and decisions already inside the process. Who supplies the source material? Who can approve a result? Who needs to understand what happened? Who is responsible when the expected path fails?

These questions reveal where automation can remove repetition and where it must preserve human ownership.

A workflow map should distinguish between:

- **Triggers** that begin a process.
- **Transformations** that organise, generate, or move information.
- **Decisions** that affect meaning, quality, permission, or risk.
- **Review points** where a person needs useful context.
- **Outcomes** that are visible to a customer, collaborator, or internal team.

The distinction prevents an automated step from quietly becoming an unreviewed decision.

## Make the system legible

People trust a workflow more easily when they can understand its current state. They do not need every technical detail, but they should be able to answer practical questions:

- Did the process start?
- What information is it using?
- Is anything waiting for review?
- What changed since the last step?
- What happens next?
- Can this action be corrected or reversed?

Clear status language and useful notifications are part of the experience, not secondary interface polish.

## Put review where it can change the result

A human checkpoint is most useful before an outcome becomes expensive or difficult to reverse. Review placed only at the end can turn a fast workflow into a fast way to produce rework.

The reviewer also needs the right context. Showing an output without the source, objective, or highlighted uncertainty forces a person to reconstruct the process before making a decision.

A good review state presents what changed, why attention is required, and which actions are available.

> Human review should be designed as a meaningful step, not an emergency brake.

## Plan for exceptions from the beginning

The ideal path is only one part of the system. Inputs may be missing. A connected service may be unavailable. Generated material may not meet the brief. A duplicate request may arrive.

For each important step, define:

1. What can fail or remain uncertain?
2. How will the system recognise that state?
3. What will the person see?
4. Can the process retry safely?
5. Who receives the unresolved item?

This turns failure from a hidden technical event into a manageable experience.

## Keep generated work inside a creative process

AI-assisted output still needs a brief, references, boundaries, selection, refinement, and approval. Generation can expand exploration or reduce repetitive setup, but it does not remove the need for direction.

For creative workflows, retain the source context and decision trail. Record which material is approved, which output is provisional, and where a person changed or rejected a suggestion. This makes collaboration clearer and future revision more reliable.

## Evaluate the whole experience

The number of automated steps is not a useful measure by itself. A longer workflow may be better if it creates clearer review, safer recovery, and a more understandable outcome.

Evaluate whether the system:

- Reduces repeated manual transfer.
- Preserves important context.
- Makes responsibility visible.
- Helps people notice exceptions sooner.
- Gives users a practical path to correct mistakes.
- Leaves consequential choices with the right person.

Automation becomes valuable when it supports the people inside the process. The human thread is not a limitation to remove. It is the source of context, judgement, and responsibility that gives the workflow a reason to exist.`,
  },
  {
    id: "journal-004",
    slug: "website-as-a-living-system",
    title: "Designing a Website as a Living System",
    category: "Digital Experience",
    excerpt:
      "A strong website is not a stack of isolated pages. It is a connected system of content, components, behaviour, performance, and future change.",
    metaDescription:
      "Explore a systems-based approach to web design that connects content structure, reusable components, responsive behaviour, motion, performance, and maintainability.",
    author: "AY Media Work",
    publishedAt: "2026-08-24",
    readingMinutes: 4,
    featured: false,
    image: {
      src: "/images/blog/website-as-living-system.jpg",
      alt: "Translucent responsive page frames arranged as a connected architectural design system",
    },
    tags: ["Web development", "Design systems", "Performance"],
    relatedServices: ["web-development", "graphic-design", "ai-automation"],
    takeaways: [
      "Model the content and user journey before arranging pages.",
      "Build reusable rules around meaning, not visual similarity alone.",
      "Treat responsive behaviour and reduced motion as design decisions.",
      "Plan for editing, failure, and future growth before launch.",
    ],
    body: `A website may be presented as a set of screens, but people experience it as a changing system. Content grows. Navigation shifts. Images arrive in unexpected proportions. A visitor uses a smaller device, slower connection, keyboard, or reduced-motion preference.

Designing for that reality changes the work from arranging pages to defining relationships and rules.

## Begin with content and journeys

A page list is useful, but it does not explain how information connects. Start by identifying the main questions a visitor brings and the actions the experience should support.

For a creative studio, someone may want to understand the capability, judge the thinking behind the work, learn how collaboration feels, or begin an inquiry. Each journey crosses several content types rather than staying inside one page.

Map the journey through decisions:

- What does the visitor need to understand first?
- Which evidence or explanation supports that understanding?
- What uncertainty might prevent the next step?
- Which action is useful at this moment?

This gives navigation, page structure, and calls to action a shared purpose.

## Model content before styling components

A card is not a content model. It is one way to present information.

Define the stable fields behind the interface: title, summary, category, image, relationship, status, publication date, or destination. Once the content has structure, it can appear in a featured panel, filtered archive, related-content block, or compact navigation result without being copied into each layout.

This separation also prepares the website for a content management system. Editors change the information while presentation rules remain controlled by the application.

## Reuse meaning, not only appearance

A design system becomes more useful when components represent repeated responsibilities. A service card helps someone understand and open a capability. A status message explains what happened and what to do next. A testimonial card preserves quotation and attribution.

Two blocks may look similar but require different semantics, content rules, and accessibility behaviour. Forcing them into one universal component can make the code reusable while making the experience less clear.

> A living system needs shared rules and clear boundaries in equal measure.

## Design responsive behaviour intentionally

Responsive design is not the desktop layout folded into a narrow column. The order, density, interaction, and crop may need to change when space and input method change.

Decide what should happen when:

- A split layout becomes a single reading flow.
- A hover interaction reaches a touch device.
- A wide artwork is viewed inside a portrait screen.
- Navigation contains more items than one line can hold.
- A data table or filter set exceeds the available width.

These decisions belong in design and content review, not only in final implementation.

## Give motion a performance budget

Motion can explain hierarchy and make transitions feel connected, but it also consumes attention and resources. Prioritise movement that helps the user understand an entrance, state change, or relationship.

Use transforms and opacity where possible, avoid continuous effects without a clear role, and provide a reduced-motion path. Load media according to its importance rather than treating every visual as a hero asset.

Performance is part of the creative experience. A beautiful transition that delays the useful content has changed the meaning of the interaction.

## Plan for real states

Polished screens often show the ideal case. A maintainable site also needs rules for:

- Empty archives before content is approved.
- Long titles and summaries.
- Missing optional media.
- Form validation and submission failure.
- Unknown routes.
- Loading, stale data, and unavailable services.
- Restricted admin actions.

Designing these states early keeps them consistent with the rest of the experience and prevents technical messages from becoming the final interface.

## Build for the next edit

Launch is one state of the website, not its finish. Clear content models, typed data boundaries, reusable components, accessible defaults, and documented media requirements make future change safer.

The aim is not to predict every future page. It is to create a system where new content can enter without breaking the hierarchy, performance, or trust established by the current experience.

A living website stays coherent because its rules remain visible—across the interface, the code, the content workflow, and the people responsible for what changes next.`,
  },
];

export const BLOG_ARTICLE_SUMMARIES: readonly BlogArticleSummary[] =
  BLOG_ARTICLES.map((article) => ({
    author: article.author,
    category: article.category,
    excerpt: article.excerpt,
    featured: article.featured,
    id: article.id,
    image: article.image,
    metaDescription: article.metaDescription,
    publishedAt: article.publishedAt,
    readingMinutes: article.readingMinutes,
    relatedServices: article.relatedServices,
    slug: article.slug,
    tags: article.tags,
    title: article.title,
  }));

export function getBlogArticleBySlug(slug: string) {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function getNextBlogArticle(slug: BlogSlug): BlogArticle {
  const currentIndex = BLOG_ARTICLES.findIndex(
    (article) => article.slug === slug,
  );
  const nextIndex = (currentIndex + 1) % BLOG_ARTICLES.length;
  const nextArticle = BLOG_ARTICLES[nextIndex];

  if (!nextArticle) {
    throw new Error("The Blog must contain at least one article.");
  }

  return nextArticle;
}
