# Impulse design system

Source: Figma file "Impulse (Copy)", Page 4, frames Cheat sheet, Colour and Typography. Brand style guide and design system, Draft 1, October 2026. Impulse is a creative agency for content, marketing strategy and brand development.

The tokens below are also available as CSS custom properties in `impulse-tokens.css`. Use those variables rather than hard-coding values.

Not covered here: the long full-guide frame on the same page (components, layouts, worked examples). Line heights and letter-spacing values are not stated numerically in the frames read, so none are given.

## Personality and voice

Brand traits: Direct, Editorial, Energetic, Precise, Warm (not soft).

- Say the true thing plainly.
- Point first, then the proof.
- Numbers beat adjectives.
- Warm but not soft. Sure but not smug.

## Rules of thumb

- One Pulse moment per page.
- Lime is never text.
- Headlines are written like sentences. Capitals only in the small mono labels.
- Borders before shadows. Thin grey lines, ink lines for emphasis, shadows only on things that float.
- Placeholders stay labelled until the real thing exists.

## Colour

Rough proportions: mostly white and greys (backgrounds, cards, space), then ink (text, main buttons, dark bands), then a little Pulse, then a touch of Lime.

### Brand colours

| Name | Hex | Use |
|---|---|---|
| Ink | `#161616` | Main colour. Text, main buttons, headlines, footer |
| Ink dark | `#0B0B0B` | Pressed buttons, true black backgrounds |
| Ink light | `#3A3733` | Button hover, softer dark panels |
| Pulse | `#F04E2E` | The signal. Accent button (with ink text), highlights, big numbers |
| Pulse for text | `#C9341E` | Links and small text on white. The only Pulse used at body size |
| Pulse hover | `#D63A22` | Accent button on hover |
| Pulse tint | `#FDE9E4` | Soft backgrounds, badges, selected cards |
| Lime | `#D4F24B` | Highlighter blocks and social graphics only. Never text |
| Lime for text | `#5C7A00` | Only if lime ever has to be read as text on white |
| Lime tint | `#F3FBD2` | Soft background |
| White | `#FFFFFF` | The page |
| Paper | `#F7F4EE` | Marketing pages only |

### Greys

Slightly warm, so they sit well next to Pulse and the paper tone.

| Name | Hex |
|---|---|
| White | `#FFFFFF` |
| Neutral 50 | `#FAF9F7` |
| Neutral 100 | `#F2F0EC` |
| Neutral 200 | `#E6E3DD` |
| Neutral 300 | `#D2CEC6` |
| Neutral 400 | `#A9A49B` |
| Neutral 500 | `#7B766E` |
| Neutral 600 | `#58544E` |
| Neutral 700 | `#3A3733` |
| Neutral 800 | `#232120` |
| Neutral 900 | `#161616` |
| Black | `#0B0B0B` |

### Status colours

Error is a cooler, deeper red so nobody mistakes it for Pulse. Status colours always come with an icon and a word, never colour alone.

| Name | Hex | Tint |
|---|---|---|
| Success | `#1F7A4D` | `#E3F3EA` |
| Warning | `#9A5C00` | `#FFF3DC` |
| Error | `#B3261E` | `#FBE7E5` |
| Info | `#1D5FBF` | `#E4EDFB` |

### Backgrounds and text

| Role | Value |
|---|---|
| Page background | White `#FFFFFF` |
| Card | White with a 1px grey border |
| Floating panel | White with a soft shadow |
| Quiet background | Neutral 100 `#F2F0EC` |
| Input | White `#FFFFFF` |
| Paper (marketing pages only) | `#F7F4EE` |
| Main text | Ink `#161616` |
| Secondary text | Neutral 600 `#58544E` |
| Quiet text, placeholders | Neutral 500 `#7B766E` |
| Disabled text | Neutral 400 `#A9A49B` |
| Text on dark | White `#FFFFFF` |
| Links | Pulse for text `#C9341E` |

### Pairs that work

| Pair | Use |
|---|---|
| Ink on white | Body text, headings, most of the interface |
| White on ink | Dark bands, main buttons, footer |
| Ink on Pulse | Accent button, social posts |
| Pulse text on white | Links, small accents |
| Ink on Lime | Highlighter blocks |
| White on Pulse | Big text only, 24px and up |
| Neutral 600 on white | Secondary text |
| Neutral 500 on white | Quiet text, placeholders |
| Pulse on ink | Big numbers and headlines |
| Ink on paper | Marketing pages |
| Neutral 400 on white | Disabled things only |
| Lime on ink | Big display type only |

### Pairs to avoid

| Pair | Instead |
|---|---|
| Pulse as body text | Use Pulse for text (`#C9341E`) |
| Lime on white | Never as text. Shapes only |
| Neutral 400 as text | Disabled things only |
| Pulse on Lime | Put ink between them |

### Dark mode (if ever needed)

| Element | Value |
|---|---|
| Background | Ink dark for the page, Neutral 800 for cards |
| Text | Neutral 100 for main text, Neutral 400 for secondary |
| Pulse | Keep it for big type. For small text use the lighter `#FF7A5C` |
| Lime | Stays the same. Ink text on it, as always |
| Borders | Neutral 700 light, Neutral 600 normal |

## Typography

All three fonts are free on Google Fonts.

| Role | Font | Notes | Fallback |
|---|---|---|---|
| Headlines | Archivo | Bold to black weights, tight spacing | Helvetica, Arial |
| Body and UI | Inter | Regular to semibold, 14 to 18px | Helvetica, Arial |
| Small labels | IBM Plex Mono | Capitals with a little extra spacing, for labels above headings, tags and dates | Menlo |

### Scale

| Style | Font and weight | Size | Use |
|---|---|---|---|
| Display | Archivo black | 96px | Hero statements, social covers. One per page |
| Hero | Archivo black | 64px | Landing hero headline |
| H1 | Archivo bold | 48px | Page titles, case-study titles |
| H2 | Archivo bold | 36px | Section headings |
| H3 | Archivo bold | 28px | Card and module headings |
| H4 | Archivo semibold | 22px | Sub-headings, list titles |
| Body Large | Inter regular | 18px | Standfirsts, intros |
| Body | Inter regular | 16px | Default paragraph text |
| Body Small | Inter regular | 14px | Secondary copy, table cells |
| Caption | Inter regular | 12px | Image captions, small print |
| Label | Inter semibold | 13px | Form labels, UI labels |
| Button | Inter semibold | 15px | Medium buttons. Small 13px, large 16px |
| Navigation | Inter medium | 14px | Primary navigation |
| Overline | IBM Plex Mono medium, capitals | 11px | Small labels above headings |

### Type rules

- Headlines are written like sentences, with a capital at the start and a full stop if you want one. No capitals-only headlines.
- Big type gets tighter letter spacing. Body text never does. The small mono labels get a bit more.
- No more than three weights per font. Size and space do the work before weight does.
- Keep body text lines to about 60 to 75 characters, roughly 640px wide at 16px.
- Use lining, equal-width figures in Inter for tables and results. Big statistics are set in Archivo black.
- Smallest sizes: 12px for captions on the web, 14px for body text inside the product, 11px only for the mono labels in capitals.

## Spacing

Scale: 4, 8, 12, 16, 24, 32, 48, 64. Then 96 and 128 between page sections.

## Radius

Scale: 0, 4, 8, 12, pill. Buttons 4, cards 8, dialogs 12, tags fully round.

## Grid

| Screen | Columns | Side margin |
|---|---|---|
| Desktop | 12 | 96px |
| Tablet | 8 | 32px |
| Phone | 4 | 20px |

The guide does not state breakpoint widths. The media queries in `impulse-tokens.css` use 1024px and 640px as placeholders.

## Buttons

| Button | Style | Use |
|---|---|---|
| Main (Ink + white) | Ink `#161616` background, white text. Hover Ink light, pressed Ink dark | Default call to action, used everywhere |
| Accent (Pulse + ink) | Pulse `#F04E2E` background, ink text. Hover `#D63A22` | One per page at most. Used everywhere, it stops being a signal |
| Secondary | White background, ink outline, ink text | Supporting actions |
| Outlined on dark | Transparent, white outline, white text | Secondary action on dark backgrounds |

Keyboard focus shows an orange (Pulse) ring. Button text is Inter semibold 15px, radius 4px.

## Icons

Simple outline icons (examples shown: bolt, arrow right, search, check, play, menu, mail, target).
