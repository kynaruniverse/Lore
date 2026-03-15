# Lore — Design Brainstorm

<response>
<text>
## Idea 1: "Illuminated Manuscript" — Dark Antiquarian

**Design Movement:** Neo-Gothic editorial meets modern dark UI. Think ancient codex brought into the digital age — parchment textures, ink-like typography, candlelit warmth.

**Core Principles:**
- Deep darkness as canvas — near-black backgrounds with warm amber/burnt-orange glow
- Typography as architecture — serif display fonts for headings, clean sans for body
- Knowledge feels sacred — pages feel like artefacts worth preserving
- Warmth through restraint — colour used sparingly but powerfully

**Color Philosophy:**
- Background: near-black charcoal `#0F0D0B`
- Surface: deep warm dark `#1A1612`
- Primary accent: burnt amber `#C4622D` (deep, rich, not garish)
- Secondary: aged gold `#B8922A`
- Text: warm off-white `#EDE8DF`
- Muted: warm grey `#7A6F63`
- Emotional intent: gravitas, depth, the feeling of holding something ancient and valuable

**Layout Paradigm:**
- Asymmetric editorial grid — content columns offset, not centred
- Left-rail navigation on desktop, bottom-tab on mobile
- Pages use a "codex" layout: wide left margin for metadata/relationships, main column for content
- Card components have subtle inner shadow and parchment-like texture

**Signature Elements:**
1. Thin amber horizontal rule dividers with a small diamond or glyph at centre
2. Page relationship nodes shown as glowing amber dots connected by faint lines
3. Section headers use a small decorative drop-cap or left-border accent

**Interaction Philosophy:**
- Hover reveals — metadata, relationship previews appear on hover/long-press
- Tap targets are generous (min 48px) for mobile-first
- Transitions feel like turning a page — subtle fade + slight upward drift

**Animation:**
- Page enter: fade-in + 8px upward translate over 300ms ease-out
- Hover cards: scale 1.02 + shadow deepen over 150ms
- Knowledge graph nodes: gentle pulse glow on idle
- Skeleton loaders: warm shimmer left-to-right

**Typography System:**
- Display/headings: `Playfair Display` — serif, authoritative, editorial
- Body: `Source Serif 4` — highly readable, warm, scholarly
- UI labels/tags: `DM Sans` — clean, modern contrast
- Hierarchy: 48px display → 32px h1 → 24px h2 → 18px h3 → 16px body → 13px caption
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idea 2: "Field Notes" — Raw Editorial Zine

**Design Movement:** Brutalist editorial zine — think a researcher's field notebook crossed with a modern magazine. Rough edges, bold type, exposed structure.

**Core Principles:**
- Exposed grid — layout structure is visible, intentional, almost architectural
- Bold typographic hierarchy — type does the heavy lifting, not decoration
- Colour as signal — burnt orange used exclusively for interactive/active states
- Mobile-first rawness — no unnecessary chrome, just content

**Color Philosophy:**
- Background: warm white `#FAF8F4`
- Surface: cream `#F2EDE4`
- Primary: deep burnt sienna `#B85C2A`
- Accent: near-black `#1C1A17`
- Text: dark warm ink `#2A2520`
- Emotional intent: urgency, authenticity, the energy of someone actively building knowledge

**Layout Paradigm:**
- Newspaper-style multi-column grid on desktop
- Single-column full-bleed on mobile
- Navigation is a horizontal ticker/tab bar at bottom on mobile
- Cards use stark borders (1px solid) instead of shadows

**Signature Elements:**
1. Bold oversized section numbers (01, 02, 03) as background watermarks
2. Tag chips with sharp corners and solid burnt-orange fill
3. Horizontal rules as thick 3px lines, not thin dividers

**Interaction Philosophy:**
- Instant, no-nonsense — no decorative transitions, just fast snappy responses
- Active states use full burnt-orange fill
- Long-press on mobile reveals quick actions

**Animation:**
- Minimal — 150ms snap transitions only
- Hover: underline slides in from left
- Page transitions: instant cut, no fade

**Typography System:**
- Display: `Bebas Neue` — condensed, bold, commanding
- Body: `IBM Plex Serif` — technical yet warm
- UI: `IBM Plex Sans` — matching family, clean
</text>
<probability>0.06</probability>
</response>

<response>
<text>
## Idea 3: "Ember Archive" — Warm Dark Knowledge UI ✅ CHOSEN

**Design Movement:** Premium dark knowledge platform — think Notion meets a beautifully designed encyclopedia, with the warmth of firelight. Sophisticated, modern, deeply readable.

**Core Principles:**
- Dark warmth — deep charcoal backgrounds with ember-orange accents create depth without coldness
- Structured exploration — clear visual hierarchy guides users through knowledge layers
- Mobile-native — every interaction designed for thumb reach and tap comfort
- Craft in the details — micro-interactions, subtle textures, and typographic precision

**Color Philosophy:**
- Background: `oklch(0.12 0.012 45)` — very dark warm charcoal
- Surface/card: `oklch(0.17 0.014 45)` — slightly lighter warm dark
- Elevated surface: `oklch(0.22 0.016 45)` — for modals, popovers
- Primary/accent: `oklch(0.62 0.18 42)` — rich burnt orange, the ember
- Primary hover: `oklch(0.68 0.20 42)` — brighter on interaction
- Secondary accent: `oklch(0.72 0.12 75)` — warm amber/gold for tags
- Text primary: `oklch(0.93 0.01 65)` — warm off-white
- Text secondary: `oklch(0.65 0.015 65)` — warm mid-grey
- Text muted: `oklch(0.45 0.01 65)` — subtle labels
- Border: `oklch(0.28 0.01 45)` — barely visible warm border
- Emotional intent: warmth, depth, the feeling of a well-curated private library at night

**Layout Paradigm:**
- Bottom navigation bar on mobile (thumb-friendly, 5 items max)
- Left sidebar on desktop (collapsible, 260px)
- Content area uses a "reading column" — max 680px centred for long-form pages
- Discovery homepage uses a masonry/staggered card grid
- Knowledge graph uses a full-screen canvas with floating card overlays

**Signature Elements:**
1. Ember glow effect — orange radial gradient halo behind key interactive elements
2. "Lore tag" chips — small pill badges with warm amber background, used for categories/relationships
3. Progress rings — thin circular indicators showing page completeness / knowledge gaps

**Interaction Philosophy:**
- Generous tap targets (min 48px height) throughout
- Bottom sheet drawers for mobile actions (not modals)
- Swipe gestures for navigation between related pages
- Long-press reveals relationship preview cards

**Animation:**
- Page enter: 200ms fade + 12px upward translate, ease-out
- Card hover: scale(1.015) + shadow elevation increase, 180ms ease
- Bottom nav active: ember glow pulse, 400ms
- Knowledge graph: nodes drift gently on idle (subtle float)
- Skeleton: warm shimmer, left-to-right, 1.5s loop

**Typography System:**
- Display/headings: `Lora` — elegant serif, warm, editorial authority
- Body text: `Lora` for long-form reading, `Inter` for UI elements
- UI labels/navigation: `Inter` — clean, legible at small sizes
- Monospace (for tags/IDs): `JetBrains Mono`
- Scale: 40px hero → 28px h1 → 22px h2 → 18px h3 → 16px body → 14px label → 12px caption
</text>
<probability>0.09</probability>
</response>

## Selected: Idea 3 — "Ember Archive"

Chosen for its balance of warmth, depth, and mobile-first practicality. The burnt orange ember accent creates a distinctive brand identity without being garish. The dark warm palette makes long-form reading comfortable and gives Lore a premium, library-like feel that distinguishes it from generic wikis.
