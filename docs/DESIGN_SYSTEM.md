# AY Media Work Design System

The Stage 2 visual system establishes a cinematic dark canvas, editorial typography, reusable interface primitives, and a restrained motion language. It is the shared foundation for the public shell, page-specific compositions, and the admin experience.

## Source of truth

| Area                               | Path                               |
| ---------------------------------- | ---------------------------------- |
| Tailwind tokens                    | `tailwind.config.ts`               |
| CSS variables and global utilities | `app/globals.css`                  |
| Font loading and theme metadata    | `app/layout.tsx`                   |
| UI primitives                      | `components/ui/`                   |
| Layout helpers                     | `components/shared/`               |
| Motion primitives                  | `components/animations/reveal.tsx` |
| Motion timing                      | `lib/constants/motion.ts`          |
| Production homepage composition    | `app/(public)/page.tsx`            |
| Service page compositions          | `components/sections/services/`    |

Use semantic tokens and existing variants before adding one-off values. Add a new token only when a value is repeated, purposeful, and belongs to the visual language.

## Colour

The application uses HSL channel variables so opacity modifiers continue to work with Tailwind.

- `background`, `foreground`: base canvas and primary text.
- `surface`, `surface-elevated`, `card`, `popover`: progressive dark surface levels.
- `primary` / `brand-blue`: primary interaction and electric-blue atmosphere.
- `brand-violet`: secondary atmospheric accent.
- `brand-red`: selective editorial emphasis, not a general decorative colour.
- `success`, `warning`, `destructive`: semantic feedback only.
- `muted`, `secondary`, `border`, `input`, `ring`: interface structure and states.

Always preserve text contrast. Do not place body text directly on brand gradients unless the foreground has been verified. High-contrast preferences receive stronger borders and surface separation in `app/globals.css`.

## Typography

- **Space Grotesk** (`font-display`) is used for display and editorial headings.
- **Manrope** (`font-sans`) is used for body copy, navigation, forms, and controls.
- Fluid display classes (`text-display-xl`, `text-display-lg`) and heading classes (`text-heading-xl` through `text-heading-sm`) scale through `clamp()`.
- Keep prose to `max-w-copy` and use `text-balance` or `text-pretty` where appropriate.
- `.editorial-kicker` provides the standard uppercase section label.

Fonts are loaded with `next/font/google`, emitted as local build assets, and configured with `display: swap`.

## Spacing and layout

Use `Container` from `components/shared/container.tsx` rather than repeating gutters and widths.

```tsx
<Container size="default">...</Container>
```

Available sizes are `default`, `wide`, `copy`, and `full`. The `px-gutter` and `py-section` tokens provide fluid page gutters and section rhythm.

Use `SectionHeading` for repeated section introductions. It accepts an eyebrow, title, description, alignment, and semantic heading level.

## Surfaces and controls

Core primitives use Radix where interaction semantics are needed and plain React for presentational structure.

- `Button`: `default`, `brand`, `outline`, `secondary`, `inverse`, `ghost`, `link`, and `destructive` variants.
- `Badge`: brand, neutral, and semantic status variants.
- `Card`: `default`, `glass`, `outline`, and `gradient` surfaces.
- `Input` and `Textarea`: consistent dark fields with visible focus, disabled, and invalid states.
- `Tabs`, `Dialog`, `Select`, and `DropdownMenu`: keyboard-accessible Radix interactions styled with the shared tokens.
- `Table`: responsive overflow wrapper with readable header and row states.
- `Sonner`: tokenized application feedback.

All controls must retain visible labels or accessible names. Do not remove focus rings. Icon-only buttons require an `aria-label`.

## Motion

Use `Reveal`, `Stagger`, and `StaggerItem` for lightweight entrance choreography. Durations, easing curves, distances, and stagger intervals live in `lib/constants/motion.ts`.

```tsx
<Reveal direction="up">...</Reveal>

<Stagger>
  <StaggerItem>...</StaggerItem>
</Stagger>
```

Motion rules:

1. Prefer `transform` and `opacity`; avoid layout-triggering animation.
2. Use animation to explain hierarchy or state, never as ambient distraction.
3. Keep interactions short and entrance motion restrained.
4. Respect `prefers-reduced-motion`; the shared primitives and global stylesheet disable or simplify motion automatically.
5. Do not animate large blur filters or persistent full-screen backgrounds.
6. The homepage hero's slow artwork drift and capability-card lift are transform-only, remain inside the established motion language, and stop under reduced-motion preferences.

## Accessibility baseline

- A skip-link style is available through `.skip-link` for the global layout stage.
- `:focus-visible` has a consistent high-contrast outline.
- Selection, disabled, invalid, and high-contrast states are defined globally.
- Touch controls target at least 44px except intentionally compact controls with equivalent spacing.
- Decorative graphics must use `aria-hidden="true"`.
- Heading levels remain semantic even when their visual class differs.

## Review and validation

The Stage 2 review surface was intentionally replaced by the production homepage in Stage 4. Shared primitives retain focused unit coverage, while the homepage exercises the public typography, colour, layout, imagery, links, and motion language in a real composition. Run the complete gate before merging changes:

```bash
npm run validate
npm run build
```

Any new primitive should receive a focused unit test and be checked at mobile, tablet, desktop, keyboard-only, reduced-motion, and high-contrast settings where relevant.
