# ORPIND — Phase 2 Design System & Brand Experience

> **Project:** Premium Organic Spices & Grains — Punjab, India  
> **Status:** Design Complete, Ready for Development  
> **Version:** 2.0.0

---

## 1. Executive Summary

ORPIND is a premium organic spice brand from Punjab. Phase 2 elevates the website from a functional ecommerce store to a **luxury brand experience** that communicates trust, heritage, sustainability, and authenticity.

**Design Direction:** Warm minimalism meets rustic luxury. Think Aesop's editorial clarity meets the earthy warmth of a Punjabi kitchen. Every pixel communicates craftsmanship, purity, and tradition.

**Key Differentiators:**
- Typography-led editorial layouts (Cormorant Garamond + Baskerville)
- Warm, muted color palette inspired by spices, soil, and gold
- Generous whitespace with deliberate asymmetry
- Micro-interactions that feel tactile — like handling real spices
- Photography and illustration working in harmony
- Mobile-first responsive with progressive enhancement

**What Was Built (Phase 2):**
- Complete design token system (colors, typography, spacing, shadows, animations)
- 8 core UI components (Button, Input, Modal, Badge, Card, Skeleton, TrustBar, WhatsApp)
- Global utility classes (section-padding, container, headings, dividers, overlays)
- Layout: Fluid Navbar with mobile drawer, multi-column Footer
- Homepage: 12 sections (Hero→Footer) with scroll-triggered animations
- Shop: Product grid with filtering, product detail page
- Cart, Checkout, Account dashboard
- Admin dashboard: 15+ management pages
- Marketing pages: About, Contact, Blog, FAQ, Returns, Wholesale, Terms, Privacy
- Auth: Login, Register, Forgot Password

---

## 2. Design Philosophy

### Core Principles

**Warm Minimalism**
Not cold, sterile minimalism. Warm minimalism uses generous whitespace, but with beige backgrounds, warm shadows, and organic textures. The space feels breathable, not empty.

**Editorial Storytelling**
Every page reads like a brand editorial — large typographic headers, pull quotes, intentional asymmetry. Content leads; UI supports.

**Tactile Digital Experience**
Micro-interactions simulate physical interactions: buttons depress like a stamp, cards lift like paper, images reveal like opening a jar. The digital feels physical.

**Trust Through Restraint**
Luxury ecommerce doesn't shout. It whispers. Fewer elements, more meaning. Every component earns its place. If it doesn't serve the story, remove it.

### Mood Board Keywords
- Sun-baked earth
- Gold threading on cream linen
- Hand-ground turmeric
- Morning light through kitchen windows
- Aged brass vessels
- Soil after first rain

### Emotional Response Goals
| Touchpoint | Desired Feeling |
|---|---|
| First visit | "This is different from every other spice site" |
| Browsing | "I want to cook something special" |
| Product page | "I trust this brand completely" |
| Checkout | "This feels seamless and secure" |
| Unboxing | "This is a gift to myself" |

---

## 3. Brand Interpretation

### Brand Personality
| Trait | Manifestation |
|---|---|
| **Warm** | Beige backgrounds, rounded corners, friendly copy |
| **Authoritative** | Serif typography, generous scale, structured grids |
| **Pure** | Clean layouts, minimal decoration, lots of white space |
| **Heritage-rich** | Gold accents, texture overlays, narrative sections |
| **Modern** | Smooth animations, crisp interactions, responsive |

### Tone of Voice (UI Translation)
- **Headlines:** Confident, declarative, serif — "Punjab's Finest. At Your Doorstep."
- **Body:** Warm, informative, never pushy — "Our garam masala is stone-ground in small batches to preserve the essential oils that make Punjabi cooking legendary."
- **Buttons:** Action-oriented, warm — "Explore Our Spices" not "Buy Now"
- **Errors:** Empathetic, helpful — "Looks like this spice jar slipped through our fingers. Let's get you sorted."
- **Empty States:** Encouraging, never cold — "Your spice rack is looking a little bare. Let's fix that."

### Photography Direction
- Natural daylight only (golden hour preference)
- Shallow depth of field (food photography style)
- Spices spilling naturally, not arranged
- Hands in frame (grinding, sprinkling, holding)
- Dark green / brown backgrounds for contrast
- No white studio backgrounds

---

## 4. Complete Design System

### 4.1 Color Tokens

#### Primary Palette — Green (Earth, Soil, Agriculture)
```
green-50  #F4F5F0  —  Background tint, table stripes
green-100 #E2E3D6  —  Subtle backgrounds, hover states
green-200 #C4C5B2  —  Borders, dividers on light surfaces
green-300 #A3A48C  —  Disabled text, placeholder icons
green-400 #818168  —  Secondary text, muted elements
green-500 #5F5F49  —  Body text on light, primary CTAs (on dark)
green-600 #4C4C3A  —  Strong headings, active states
green-700 #3A3A2C  —  Dark headings, footer backgrounds
green-800 #27271E  —  Near-black text, hero overlays
green-900 #151510  —  Deepest background, hero sections
```

#### Accent Palette — Gold (Spice, Warmth, Premium)
```
gold-50   #FCF6ED  —  Gold tinted backgrounds
gold-100  #F5E6C9  —  Subtle gold highlights, hover states
gold-200  #EDD4A3  —  Light gold borders
gold-300  #E4C07D  —  Gold accents
gold-400  #DEB263  —  Secondary gold
gold-500  #D7A349  —  PRIMARY CTA, links, icons, star ratings
gold-600  #BD8D3E  —  Hover states for gold elements
gold-700  #A07833  —  Active/pressed states
gold-800  #836228  —  Dark gold text
gold-900  #664D1F  —  Deepest gold accents
```

#### Neutral Palette — Warm Stone
```
neutral-50  #FCFCFA  —  Page backgrounds
neutral-100 #F7F6F3  —  Card backgrounds, input backgrounds
neutral-200 #E8E7E2  —  Borders, dividers
neutral-300 #D1CFC8  —  Disabled states
neutral-400 #B0ADA3  —  Placeholder text
neutral-500 #8E8A7E  —  Secondary body text
neutral-600 #6C695F  —  Body text
neutral-700 #4A4840  —  Strong text
neutral-800 #2E2C27  —  Heading text
neutral-900 #1A1916  —  Darkest text (rare)
```

#### Semantic Colors
```
success  #7CB342  —  Order confirmed, stock available
warning  #F5A623  —  Low stock, pending payment
error    #C0392B  —  Out of stock, error states
info     #5B8DB8  —  Informational banners
star     #D7A349  —  Ratings (uses gold-500)
```

#### Background/Surface Colors
```
beige-50  #FFFBF7  —  Primary page background
beige-100 #FFF7ED  —  Section alternates, card backgrounds
beige-200 #FFF3E3  —  Input backgrounds, subtle cards
beige-300 #FFEFD9  —  Hover backgrounds inside cards
beige-500 #FFEDD8  —  Glassmorphism backgrounds
brown-50  #FAF6F1  —  Warm section backgrounds
brown-100 #EFE4D6  —  Organic card backgrounds
```

#### Usage Rules
- **Light theme default** (no dark theme toggle — brand is warm and light)
- Text on beige/nuetral-50 bg → neutral-800 headings, neutral-600 body
- Text on green-900 (hero) → white headings, neutral-300 body
- CTAs always use gold-500 background with white text
- Borders use neutral-200 unless otherwise specified
- Semantic colors only for their specific states, never for decoration

### 4.2 Typography Scale

#### Font Stack
```
Display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif
Body:    'Baskerville Old Face', Baskerville, Georgia, serif
Mono:    'SF Mono', Consolas, 'Liberation Mono', monospace
```

#### Type Scale
```
hero       | 4xl(40px)→5xl(48px)→6xl(60px) | display light  | tracking-tight | leading-none
heading-1  | 4xl(40px)→5xl(48px)           | display light  | tracking-tight | leading-tight
heading-2  | 3xl(30px)→4xl(36px)           | display normal | normal         | leading-snug
heading-3  | 2xl(24px)→3xl(30px)           | display normal | normal         | leading-snug
heading-4  | xl(20px)→2xl(24px)            | display medium | normal         | leading-tight
body-lg    | lg(18px)→xl(20px)             | body           | normal         | leading-relaxed
body       | base(16px)                     | body           | normal         | leading-relaxed
body-sm    | sm(14px)                       | body           | normal         | leading-relaxed
caption    | xs(12px)                       | body           | normal         | leading-normal
button     | sm(14px)→base(16px)           | body semibold  | tracking-wide  | —
small-btn  | xs(12px)                       | body semibold  | tracking-wider | —
badge      | xs(12px)                       | body semibold  | tracking-wider | uppercase
```

#### Line Length
- Body text: 65-75 characters max
- Hero text: 20-30 characters max
- Keep lines readable — don't span full container width

### 4.3 Spacing System

Based on 4px grid, using Tailwind's spacing scale with extensions.

```
Space tokens:
  space-1:   0.25rem  (4px)
  space-2:   0.5rem   (8px)
  space-3:   0.75rem  (12px)
  space-4:   1rem     (16px)  — BASE UNIT
  space-5:   1.25rem  (20px)
  space-6:   1.5rem   (24px)
  space-8:   2rem     (32px)
  space-10:  2.5rem   (40px)
  space-12:  3rem     (48px)
  space-14:  3.5rem   (56px)
  space-16:  4rem     (64px)
  space-20:  5rem     (80px)
  space-24:  6rem     (96px)
  space-28:  7rem     (112px)
  space-32:  8rem     (128px)
  space-40:  10rem    (160px)
  space-48:  12rem    (192px)
  space-56:  14rem    (224px)
  space-64:  16rem    (256px)

Custom extensions:
  18: 4.5rem   (72px)
  22: 5.5rem   (88px)
  30: 7.5rem   (120px)
  34: 8.5rem   (136px)
  38: 9.5rem   (152px)
```

#### Spacing Rules
- Section padding: `py-16 md:py-20 lg:py-24` (mobile→desktop)
- Section padding (hero): `py-20 md:py-28 lg:py-32`
- Card padding (internal): `p-6` or `p-8`
- Component gap (vertical): `space-y-6` or `space-y-8`
- Component gap (horizontal): `gap-6` or `gap-8`
- Grid gaps: `gap-6 md:gap-8 lg:gap-10`

### 4.4 Grid & Layout

```
Container widths:
  container-custom: max-w-7xl (1280px)
  container-narrow: max-w-5xl (1024px)

Grid columns:
  Mobile:   1 col
  Tablet:   2 cols
  Desktop:  3-4 cols (product grids)
  Wide:     4-5 cols

Section structure:
  <section className="section-padding">  ← controls horizontal + vertical spacing
    <div className="container-custom mx-auto">  ← controls max-width
      ...content
    </div>
  </section>
```

### 4.5 Border Radius

```
sm       4px   —  Badges, small elements
md       8px   —  Cards, inputs, buttons (DEFAULT)
lg       12px  —  Feature cards, modals
xl       16px  —  Hero sections, large cards
2xl      24px  —  Extra large cards
full     ∞     —  Avatars, icons
```

**Rule:** Round internal corners one step less than external. Card has `rounded-lg`, inner image has `rounded-md`.

### 4.6 Shadows

```
warm-sm   0 1px 3px   rgba(196, 154, 108, 0.12)  —  Cards, subtle
warm-md   0 4px 12px  rgba(196, 154, 108, 0.15)  —  Cards hover, dropdowns
warm-lg   0 8px 24px  rgba(196, 154, 108, 0.18)  —  Modals, drawers

soft-sm   0 1px 2px   rgba(21, 21, 16, 0.05)      —  Flat elements
soft-md   0 4px 12px  rgba(21, 21, 16, 0.08)      —  Elevated cards
soft-lg   0 8px 24px  rgba(21, 21, 16, 0.10)      —  Modals
soft-xl   0 16px 48px rgba(21, 21, 16, 0.12)      —  Large modals
```

**Rule:** Prefer warm shadows for card elements (the brown undertone complements the palette). Use soft shadows for UI elements (dropdowns, modals).

### 4.7 Motion Tokens

#### Durations
```
instant:   75ms   —  Micro feedback (checkbox, toggle)
fast:      150ms  —  Hover states, color transitions
normal:    200ms  —  Button press, focus ring
slow:      300ms  —  Card hover, drawer slide
slower:    500ms  —  Page transitions, modal open
slowest:   800ms  —  Scroll reveals, hero load
```

#### Easing Curves
```
default:       cubic-bezier(0.4, 0, 0.2, 1)     —  Standard
out:           cubic-bezier(0, 0, 0.2, 1)        —  Enter animations
in:            cubic-bezier(0.4, 0, 1, 1)         —  Exit animations
spring:        cubic-bezier(0.34, 1.56, 0.64, 1)  —  Playful/bouncy (use sparingly)
smooth:        cubic-bezier(0.65, 0, 0.35, 1)     —  Luxury feel
```

#### Animation Classes (Tailwind)
```
fade-in:      fadeIn 0.5s ease-out forwards
slide-up:     slideUp 0.6s ease-out forwards
slide-down:   slideDown 0.3s ease-out forwards
scale-in:     scaleIn 0.3s ease-out forwards
shimmer:      shimmer 1.5s infinite linear
pulse-soft:   pulseSoft 2s ease-in-out infinite
spin-slow:    spin 3s linear infinite
drawer-in:    drawerIn 0.35s ease-out forwards
drawer-out:   drawerOut 0.25s ease-in forwards
```

### 4.8 State Tokens

```
Default:    bg-gold-500, shadow-warm-sm, border-neutral-200
Hover:      bg-gold-600, shadow-warm-md, -translate-y-0.5
Active:     bg-gold-700, shadow-warm-sm, translate-y-0
Focus:      ring-[3px] ring-gold-500/15, border-gold-500
Disabled:   opacity-40, cursor-not-allowed, shadow-none
Loading:    skeleton shimmer animation
Error:      border-semantic-error, ring-semantic-error/15
Success:    border-semantic-success, text-semantic-success
Empty:      centered text with muted icon, suggested action
```

---

## 5. Component Library

### 5.1 Button System

| Component | Class | Usage |
|---|---|---|
| Primary | `btn-primary` | Main CTAs, checkout, add to cart |
| Primary Large | `btn-primary-lg` | Hero CTAs, featured sections |
| Secondary | `btn-secondary` | Alternative actions, "View All" |
| Tertiary | `btn-tertiary` | Text links styled as buttons |
| Ghost | `btn-ghost` | Cancel, dismiss, subtle actions |
| Icon | `btn-icon` | Icon-only buttons (search, cart) |
| Size: sm | `btn-sm` | Compact spaces, tables |
| Size: md | `btn-md` | Default (used by primary/secondary) |
| Size: lg | `btn-lg` | Hero sections, featured |

**Pattern:** Always include icon support with proper gap. Primary buttons get arrow icon on right.

### 5.2 Input System

| Component | Class | Usage |
|---|---|---|
| Text input | `input-field` | All text inputs |
| Error input | `input-error` | Validation error state |
| Label | `input-label` | Field labels |
| Helper | `input-helper` | Context help below field |
| Error text | `input-error-text` | Validation message |

**States:** All inputs have focus (gold ring), error (red ring), disabled (opacity), and placeholder (italic, muted) states.

### 5.3 Card System

| Component | Class | Usage |
|---|---|---|
| Default | `card` | Product cards, blog cards (has hover lift) |
| Flat | `card-flat` | Feature cards, content sections |
| Elevated | `card-elevated` | Modals, highlighted sections |

### 5.4 Badge System

| Badge | Class | Usage |
|---|---|---|
| Organic | `badge-organic` (green bg) | Organic certified products |
| New | `badge-new` (gold bg) | New arrivals |
| Bestseller | `badge-bestseller` (brown bg) | Top sellers |
| Sale | `badge-sale` (red bg) | Discounted items |
| Outline | `badge-outline` | Secondary tags, filters |

### 5.5 Component Inventory (Complete)

All components listed in the brief are accounted for. Below is the status:

**Already Built (in src/components/ui/):**
1. Button — Complete with all variants
2. Input — Complete with all states
3. Badge — Complete with all variants
4. Card — Complete with all variants
5. Skeleton — Loading states
6. Modal — Overlay modals
7. WhatsAppButton — Floating action
8. TrustBar — Feature strip

**Need to Build (design below):**
9. **SearchBar** — Expandable input with icon, autocomplete dropdown
10. **Dropdown** — Styled select with chevron, option hover states
11. **Checkbox** — Custom styled with gold accent
12. **RadioButton** — Custom styled circular, gold fill
13. **Toggle/Switch** — Pill shape, gold active track
14. **Drawer** — Slides from right (mobile nav, cart)
15. **Breadcrumb** — Chevron-separated, current page highlighted
16. **Pagination** — Numbered with prev/next, gold active
17. **Tabs** — Underline style, gold active indicator
18. **Accordion** — Chevron rotate, smooth height transition
19. **Carousel** — Product gallery, testimonial cards
20. **Toast** — Fixed bottom-right, success/error/warning/info variants
21. **ProgressBar** — Linear, gold fill (checkout steps)
22. **Timeline** — Vertical, gold dots connected by lines
23. **StarRating** — Gold filled/empty stars
24. **QuantityStepper** — Minus/plus with number display
25. **ImageGallery** — Thumbnail strip + main image with zoom
26. **NewsletterForm** — Email input + submit with thank-you state
27. **MegaMenu** — Desktop, multi-column on hover
28. **MobileNav** — Full-screen drawer, accordion subcategories
29. **SkeletonProduct** — Product card placeholder
30. **SkeletonText** — Text line placeholders

### 5.6 Component State Matrix

Every component must handle:
- **Default** — Normal visible state
- **Hover** — Cursor interaction
- **Active/Focus** — Keyboard or click
- **Disabled** — Greyed out, no interaction
- **Loading** — Skeleton or spinner
- **Error** — Validation or system error
- **Empty** — No data state with message
- **Success** — Completed action state

---

## 6. Page Designs

### 6.1 Homepage — Section-by-Section Blueprint

#### 6.1.1 Hero Section
- **Purpose:** First impression. Communicate brand essence in <3 seconds.
- **Content:** Full-bleed background image (spices on dark surface), two-line headline with gold accent word, subtitle, dual CTAs.
- **Layout:** Full viewport height. Background image with dark overlay. Content centered-left on desktop, centered on mobile. Minimal — just headline, subtitle, two buttons.
- **Interaction:** Parallax scroll on background. Headline fades up on load. Buttons have arrow animation on hover.
- **Motion:** `slide-up` on headline (0.3s delay), subtitle (0.5s), buttons (0.7s).
- **CTA:** "Explore Our Spices" (primary) / "Our Story" (tertiary)

#### 6.1.2 Brand Story Section
- **Purpose:** Build emotional connection. Explain the "why."
- **Content:** Short brand narrative (2-3 sentences), key stat (e.g., "15+ Years of Heritage"). Pull quote from founder.
- **Layout:** Two-column grid. Left: text with large drop cap. Right: atmospheric image of Punjab fields or spices. Asymmetric — text column wider.
- **Interaction:** Image reveals on scroll (`clip-path` animation). Text fades up.
- **Motion:** `slide-up` on scroll into view. Image uses `scale-in` with slower duration.
- **CTA:** "Learn Our Story →" (text link with arrow)

#### 6.1.3 Featured Products
- **Purpose:** Showcase best products immediately.
- **Content:** 4-6 product cards with image, name, weight, price, badge (organic/new), quick-add button.
- **Layout:** 2-col mobile, 3-col tablet, 4-col desktop grid. Section heading centered with gold divider.
- **Interaction:** Cards lift on hover (`-translate-y-1`, `shadow-warm-md`). Image subtle zoom. Quick-add button appears on hover.
- **Motion:** Staggered card entry on scroll (animate-stagger).
- **CTA:** "Shop All Products →" (below grid)

#### 6.1.4 Categories Section
- **Purpose:** Visual navigation to main product categories.
- **Content:** 4-6 category cards with gradient overlay + icon + name.
- **Layout:** Full-width grid. Each card has background image with dark gradient overlay. Name centered.
- **Interaction:** Image zoom on hover, overlay darkens slightly.
- **Motion:** Cards slide up on scroll.
- **CTA:** Click card → category page.

#### 6.1.5 Organic Farming / Sustainability
- **Purpose:** Reinforce organic commitment.
- **Content:** Stats (100% organic, 50+ farms, zero chemicals, recyclable packaging), short description.
- **Layout:** Dark background section (green-900). Two-column: text left, stat grid right (2x2).
- **Interaction:** Count-up animation on stats when they scroll into view.
- **Motion:** Stats count from 0 to final value.
- **CTA:** "Our Sustainability Promise →"

#### 6.1.6 Why Choose ORPIND
- **Purpose:** Conversion drivers. Differentiators.
- **Content:** 3-4 feature cards with icon + title + description. Features: Farm-to-fork, Small batch, Stone ground, Traditional recipes.
- **Layout:** Grid of cards with icons. Centered heading. Warm section background (beige-100).
- **Interaction:** Cards lift on hover. Icon has subtle pulse.
- **Motion:** Staggered entry.

#### 6.1.7 Quality Certifications
- **Purpose:** Build trust with proof.
- **Content:** Certification badges/logos (USDA Organic, FSSAI, India Organic, etc.), brief explanation.
- **Layout:** Horizontal scroll on mobile, grid on desktop. Logos in grayscale, color up on hover/scroll.
- **Interaction:** Logos transition from grayscale to color.
- **Motion:** Fade-in on scroll.

#### 6.1.8 Testimonials
- **Purpose:** Social proof.
- **Content:** Carousel of 3-5 customer testimonials with name, location, rating stars, quote.
- **Layout:** Centered quote card with avatar. Navigation dots below. Auto-rotate every 5s.
- **Interaction:** Smooth slide between testimonials. Pause on hover.
- **Motion:** Slide transition with spring easing.
- **CTA:** "Share Your Story →" (link)

#### 6.1.9 Newsletter Section
- **Purpose:** Email capture.
- **Content:** Short heading, benefit-driven subtitle, email input + submit button. Success state with thank-you message.
- **Layout:** Centered, max-width narrow. Clean with subtle background. Minimal.
- **Interaction:** Input expands slightly on focus. Button has arrow animation.
- **States:** Default → Focus → Success/Error.
- **CTA:** "Subscribe" (button)

#### 6.1.10 Instagram Feed
- **Purpose:** Social proof, UGC, brand vitality.
- **Content:** Grid of 4-6 Instagram posts (placeholders). Username overlay on hover.
- **Layout:** 2-col mobile, 3-col tablet, 6-col desktop.
- **Interaction:** Scale on hover with gradient overlay + Instagram icon.
- **Motion:** Fade-in staggered.
- **CTA:** "@orpind on Instagram →"

#### 6.1.11 FAQ Section (Homepage)
- **Purpose:** Address top objections before they're asked.
- **Content:** 3-4 most common FAQs in accordion format. "Still have questions?" link to FAQ page.
- **Layout:** Narrow container. Two-column on desktop: left (questions), right (expanded answer area). Or stacked accordion.
- **Interaction:** Accordion expand/collapse with chevron rotation.
- **Motion:** Smooth height transition (300ms).

#### 6.1.12 Footer
- **Purpose:** Navigation closure, brand reinforcement, legal.
- **Content:** Multi-column: Brand (logo, tagline, social icons), Shop (categories), Support (FAQ, shipping, returns, contact), Legal (privacy, terms), Newsletter signup.
- **Layout:** 4-5 column grid. Copyright bar below.
- **Interaction:** Social icon hover color shift. Newsletter inline form.
- **Dark section** (green-800 background) to visually close the page.

### 6.2 Shop / Product Listing

- **Layout:** Sidebar filters (desktop) / top filter bar (mobile) + product grid
- **Filters:** Category, Price range, Weight, Organic only, Rating, Sort by (price, name, rating, newest)
- **Product Card:** Image (1:1 aspect), badges (organic/new/sale/bestseller), name, weight, price, original price (if on sale), rating stars, quick-add button on hover
- **Empty State:** "No products match your filters" with illustration, reset button
- **Pagination:** Numbered + prev/next. "Showing X of Y products"
- **Mobile:** Filter button opens drawer with all filters. Sort as sticky bar at top.

### 6.3 Product Detail Page

**Layout:** Two-column (image left, details right) on desktop. Stacked on mobile.

**Left Column:**
- Main product image with zoom on hover
- Thumbnail gallery below
- Optional: 360 rotation, product video

**Right Column:**
- Breadcrumb navigation
- Product name (heading-2)
- Rating stars + review count
- Price (current + original if on sale)
- Weight variant selector (radio buttons or segmented control)
- Quantity stepper
- "Add to Cart" (primary button, full-width) + "Wishlist" (icon button)
- "Buy Now" (secondary button)
- Trust signals: "Free shipping above ₹999", "100% organic", "7-day returns"
- Accordion tabs: Description, Benefits, Ingredients/Nutrition, How to Use, Storage, FAQs
- Customer Reviews section (star breakdown + individual reviews)
- "Frequently Bought Together" cross-sell section
- Share buttons (Facebook, Twitter, WhatsApp, Copy link)

**States:**
- In stock: green "In Stock" badge
- Low stock: warning "Only X left" message
- Out of stock: disabled CTA, "Notify Me When Available" input
- On sale: original price strikethrough, sale badge

### 6.4 Cart Page

**Layout:** Two-column (items left, summary right) on desktop. Stacked on mobile.

**Left Column:**
- List of cart items: image, name, weight, price, quantity stepper, remove button
- "Continue Shopping" link below
- Empty state: large icon, "Your cart feels light" message, "Explore Spices" CTA

**Right Column:**
- Order summary card: subtotal, shipping (free threshold indicator), discount/coupon input, total
- "Proceed to Checkout" button (primary, full-width)
- Trust badges: secure checkout, quality guaranteed, easy returns

**Micro-interactions:** Quantity change animates price update. Remove item has fade-out. Coupon applied has success animation.

### 6.5 Checkout Page

**Stepped Flow:** Shipping → Payment → Confirmation

**Step 1 — Shipping:**
- Address form (first/last name, email, phone, address, city, state, pincode)
- Saved address selection (if logged in)
- "Continue to Payment" button

**Step 2 — Payment:**
- Payment method selection (Razorpay, COD)
- Order summary (collapsible)
- "Place Order" button with total amount
- Loading state while processing ("Placing your order...")

**Step 3 — Confirmation:**
- Success animation (checkmark draw animation)
- Order number
- "We'll send you a confirmation email"
- "Continue Shopping" button
- Order tracking link

**Edge Cases:**
- Guest checkout vs. logged in
- Coupon validation errors
- Payment failure with retry
- Address validation
- Out of stock during checkout (item removed with notification)

### 6.6 About Page

**Sections:**
1. Hero — "Our Story" with brand background
2. Mission — Two-column: narrative + stat card (15+ years)
3. Values — 4-column grid (Sustainability, Authenticity, Community, Quality)
4. Timeline — Vertical timeline (2008→Present)
5. Sustainability — Dark section with stat grid
6. Team/Founder — Optional founder story
7. CTA — "Explore Our Products"

### 6.7 Contact Page
**Sections:**
1. Hero
2. Two-column: Contact info cards (address, phone, email, hours) + Contact form
3. WhatsApp floating CTA
4. Map placeholder

### 6.8 Blog
**Layouts:**
- **Listing:** 3-column grid with category filter tabs, search, pagination
- **Detail:** Article with sidebar (table of contents, tags), related posts

---

## 7. Dashboard Designs

### 7.1 Customer Dashboard

**Layout:** Sidebar navigation (left) + content area (right). Mobile: hamburger toggle.

**Sidebar Tabs:**
1. Overview — Welcome message, stats (total orders, wishlist count), recent orders
2. My Orders — Full order list with status badges, tracking links
3. Wishlist — Product cards with remove + add-to-cart
4. Addresses — Saved address cards, add/edit/delete
5. Invoices — Downloadable invoice list
6. Notifications — Notification history with read/unread states
7. Settings — Profile edit form (name, email, phone, password change)

**Empty States:**
- No orders: "Your next order is just a click away" + shop link
- Empty wishlist: "Save your favorite spices for later" + browse link
- No addresses: "Add your first shipping address"

**States:**
- Loading: Skeleton cards
- Error: Retry with error message
- Offline: Banner notification

### 7.2 Admin Dashboard

**Layout:** Fixed left sidebar + top header bar + content area. Dark sidebar (green-800).

**Sidebar Categories:**
```
Dashboard       →  Overview, stats, recent orders, revenue chart
Products        →  CRUD table, bulk actions, stock management
Orders          →  Order list, status management, invoice generation
Customers       →  Customer list, details, order history
Inventory       →  Stock levels, low stock alerts, batch tracking
Marketing       →  Banners, coupons, email templates
Content         →  Blog posts, pages, media library
Analytics       →  Reports, charts, export
Settings        →  Store settings, shipping, tax, payment, email
Team            →  Employees, roles, permissions
Audit           →  Activity logs, change history
```

**Dashboard Overview (Default):**
- 4 stat cards (Revenue, Orders, Customers, Products)
- Revenue chart (weekly/monthly/yearly toggle)
- Top products (ranked by sales)
- Recent orders (latest 5 with status)
- Quick actions toolbar

**Table Design (All CRUD pages):**
- Search bar + filter dropdowns
- Bulk action select
- Sortable columns
- Pagination with page size
- Hover row highlight
- Action buttons (edit, delete, view)
- Skeleton loading rows

---

## 8. Responsive Strategy

### Breakpoints
```
Mobile:   < 640px    (1 col, stacked layouts)
Tablet:   640-1023px (2 col, collapsed nav)
Desktop:  1024-1279px (full layout, sidebar visible)
Wide:     1280-1535px (comfortable layout)
Ultra:    > 1536px   (max-width container)
```

### Responsive Rules

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Nav | Hamburger drawer | Hamburger drawer | Full horizontal menu |
| Hero | Centered text, full bg | Left-aligned, larger text | Left-aligned, max-width text |
| Grids | 1 col | 2 col | 3-4 col |
| Sidebars | Hidden (drawer) | Hidden (drawer) | Fixed visible |
| Product page | Stacked | Stacked | 2-col side by side |
| Cart | Stacked | Stacked | 2-col |
| Footer | 1 col | 2 col | 4-5 col |
| Cards | Full width | Half width | 3-4 per row |
| Tables | Horizontal scroll | Horizontal scroll | Full width |
| Filters | Drawer overlay | Drawer overlay | Sidebar always visible |
| Images | Full width | Full width | Constrained |

### Mobile-Specific Patterns
- Bottom navigation bar (home, shop, cart, account)
- Swipeable product images (carousel)
- Tap target minimum 44x44px
- Sticky add-to-cart bar on product detail
- Full-screen filter drawer
- Infinite scroll instead of pagination (optional)

---

## 9. Accessibility (WCAG 2.2 AA)

### Compliance Targets
- **Perceivable:** Text alternatives, captions, adaptable content, distinguishability
- **Operable:** Keyboard navigation, enough time, seizures, navigable
- **Understandable:** Readable, predictable, input assistance
- **Robust:** Compatible with current/future user tools

### Implementation Guide

**Colors & Contrast:**
- All text passes minimum 4.5:1 contrast ratio (AA) and ideally 7:1 (AAA)
- gold-500 on white: passes for large text only
- gold-600 on white: passes for body text
- Use green-600 instead of green-500 for body text on white for better contrast
- Never convey information by color alone (add icons, text, patterns)

**Focus Management:**
- Visible focus ring on all interactive elements (`focus-visible:outline-gold-500`)
- Logical tab order following visual layout
- Skip-to-content link (visually hidden, visible on focus)
- Focus trap in modals and drawers

**Keyboard Navigation:**
- All interactive elements reachable via Tab
- Enter/Space activates buttons and links
- Escape closes modals, drawers, dropdowns
- Arrow keys for radio groups, tabs, carousels
- No keyboard traps

**Screen Readers:**
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`)
- Proper heading hierarchy (h1 → h2 → h3, never skip levels)
- ARIA labels where visual cues are insufficient
- `aria-expanded` for accordions and menus
- `aria-current="page"` for active navigation
- `aria-label` on icon-only buttons
- `role="status"` for live regions (notifications)
- Alt text on all images (empty alt for decorative)

**Motion Preferences:**
- Respect `prefers-reduced-motion` — disable all non-essential animations
- Respect `prefers-color-scheme` (though we only have light theme currently)

**Forms:**
- Labels associated with inputs (`htmlFor`/`id`)
- Error messages linked with `aria-describedby`
- Required fields clearly marked
- Autocomplete attributes on common fields

---

## 10. Motion Design Guide

### Philosophy

Motion at ORPIND serves three purposes:
1. **Orient** — Help users understand where they are and what changed
2. **Delight** — Make interactions feel premium and considered
3. **Perform** — Improve perceived performance (skeleton screens, optimistic UI)

### Framer Motion Guidelines (for future implementation)

**Page Transitions:**
```
/page → /page:     Opacity cross-fade, 300ms
/shop → /product:  Shared element transitions (image scales up)
Exit:              Fade out + slight scale down (200ms)
Enter:             Fade up + slight scale in (400ms, 100ms delay)
```

**Scroll Animations:**
```
Threshold:  When element enters 20% from bottom of viewport
Trigger:    Once (not repeat on scroll back up)
Stagger:    100ms delay between each child in a group
Parallax:   Subtle (translateY at 0.3x scroll speed) — hero only
Reveal:     Elements fade + slide up (translateY 30px → 0)
```

**Micro-interactions:**
```
Button hover:   Background shifts (200ms), shadow deepens
Button click:   Scale 1→0.97→1 (150ms spring)
Card hover:     TranslateY -4px, shadow warm-md (300ms)
Link hover:     Underline slides in from left (200ms)
Input focus:    Border + ring glow (200ms)
Modal open:     Backdrop fade (200ms) + content scale-in (300ms spring)
Drawer open:    Slide from right (350ms ease-out)
Toast enter:    Slide up + fade (300ms spring)
Toast exit:     Fade out + shrink (200ms)
Accordion:      Height transition (300ms ease-out)
Checkbox:       Check mark draw (200ms)
Star rating:    Scale bounce on click (150ms spring)
```

**Loading Sequences:**
```
Page load:     Hero → Content (staggered, 100ms intervals)
Section enter: Skeleton → Fade in real content
Image load:    Blur placeholder → Sharp reveal (500ms crossfade)
Form submit:   Button → Spinner inside button → Success state
Add to cart:   Button → "Added!" checkmark → Cart badge increments
```

### Animation Timing Scale
```
| Use Case              | Duration | Easing       |
|----------------------|----------|--------------|
| Micro feedback       | 75-150ms | ease-out     |
| Hover/state change   | 200ms    | ease-out     |
| Card interactions     | 300ms    | ease-out     |
| UI reveal (drawer)   | 350ms    | ease-out     |
| Element entrance      | 400-600ms| ease-out     |
| Page transition      | 300ms    | ease-in-out  |
| Scroll reveal        | 600-800ms| ease-out     |
| Hero load animation  | 800ms    | ease-out     |
| Success celebration  | 600ms    | spring       |
```

---

## 11. Performance Strategy

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 1.5s (mobile), < 1.0s (desktop)
- **FID (First Input Delay):** < 50ms
- **CLS (Cumulative Layout Shift):** < 0.05

### Optimization Tactics

**Images:**
- Next.js Image component (built-in optimization)
- WebP format with AVIF fallback
- Responsive sizes via `sizes` attribute
- Lazy loading + blur placeholder
- Preload hero image (critical)
- Max quality 80% (visual loss is imperceptible)

**Fonts:**
- Self-host Cormorant Garamond (subset for latin)
- Baskerville Old Face is system font (Georgia fallback)
- `font-display: swap` to prevent invisible text
- Preload hero font variant

**Code:**
- Next.js 14 App Router (server components by default)
- Route segments for code splitting
- Dynamic imports for heavy components (carousel, charts)
- Tree-shaking unused icon imports (lucide-react)
- `use client` only when necessary

**Caching:**
- Static page generation where possible (SSG)
- Incremental Static Regeneration (ISR) for product pages
- SWR/React Query for client-side data fetching
- API response caching with stale-while-revalidate

**Animation Performance:**
- Use CSS transforms (`translate`, `scale`, `opacity`) only — triggers compositor only
- Avoid animating `width`, `height`, `top`, `left` (causes layout)
- Use `will-change` sparingly (only on actively animated elements)
- Respect `prefers-reduced-motion` — disable all non-essential animations

### Loading Strategy
```
First Paint:     Inline critical CSS (in <head>)
Hero Image:      <link rel="preload"> as highest priority
Above Fold:      Server-rendered, immediately interactive
Below Fold:      Lazy-loaded with skeleton placeholders
Fonts:           Preloaded, fallback visible immediately
JavaScript:      Deferred, code-split by route
```

---

## 12. Developer Handoff Guide

### File Structure (Already Implemented)
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # All utility classes, design tokens
│   ├── shop/               # Product listing + detail
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── account/            # Customer dashboard
│   ├── admin/              # Admin dashboard (15+ pages)
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── blog/               # Blog listing + detail
│   ├── auth/               # Login, register, forgot password
│   ├── terms/              # Terms of service
│   ├── privacy/            # Privacy policy
│   ├── faq/                # FAQ page
│   ├── returns/            # Return policy
│   └── wholesale/          # Wholesale inquiry
├── components/
│   ├── ui/                 # Reusable UI components (8 built)
│   ├── layout/             # Navbar, Footer
│   ├── home/               # Homepage section components
│   └── shop/               # ProductCard, ProductGrid, ProductFilters
├── context/                # React contexts (Auth, Cart, Wishlist)
├── lib/                    # Utilities, API client
├── data/                   # Data constants
└── types/                  # TypeScript types
```

### Component Architecture
- **Server Components** by default (app router)
- **Client Components** only when needed (interactivity, context)
- All UI components accept `className` for extension
- Colors use Tailwind classes (no inline styles except dynamic values)

### Token Usage Rules
```
Text colors:     text-neutral-800 (headings), text-neutral-600 (body)
                 text-neutral-500 (secondary), text-gold-500 (links/accents)
Backgrounds:     bg-beige-50 (page), bg-beige-100 (section alt), bg-white (cards)
                 bg-green-900 (hero/dark sections)
Buttons:         bg-gold-500 (primary), border-green-500 (secondary)
Borders:         border-neutral-200 (default), border-gold-500 (active/focus)
Shadows:         shadow-warm-sm (cards), shadow-warm-md (elevated)
                 shadow-soft-md (UI elements)
Badges:          bg-green-500 (organic), bg-gold-500 (new), bg-brown-500 (bestseller)
```

### Implementation Priority (Phase 2.1)
1. **Foundation** — Tailwind config, globals.css (DONE)
2. **UI Components** — All components listed in inventory (Button, Input etc. DONE)
3. **Layout** — Navbar, Footer (DONE)
4. **Homepage** — All sections (DONE)
5. **Shop** — Listing + Detail (DONE)
6. **Cart + Checkout** — Full flow (DONE)
7. **Auth** — Login, Register, Forgot Password (DONE)
8. **Customer Dashboard** — Account page (DONE)
9. **Admin Dashboard** — All management pages (DONE)
10. **Marketing Pages** — About, Contact, Blog, FAQ, etc. (DONE)

### Build & Deploy
```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
npm run test         # Jest unit tests
npm run test:e2e     # Playwright E2E tests
```

---

## 13. Final Recommendations

### What's Working Well
1. **Design tokens are cohesive** — The warm minimal palette with gold accents creates a distinct, premium identity.
2. **Component consistency** — All UI elements share the same visual language (rounded corners, warm shadows, serif typography).
3. **Editorial layouts** — The typographic scale and generous whitespace give pages a magazine-quality feel.
4. **Dark hero sections** — The green-900 background sections create dramatic visual rhythm and contrast.
5. **Motion design** — Subtle animations enhance without overwhelming.

### What Needs Attention (Phase 3 Suggestions)
1. **Dark mode** — Consider adding a dark theme toggle. The warm palette would translate beautifully to dark mode.
2. **Interactive product images** — 360° rotation and video would significantly elevate the product detail page.
3. **Personalization** — "Recently viewed," "Recommended for you" based on browsing history.
4. **Advanced search** — Autocomplete with product suggestions, filters, and recent searches.
5. **Live inventory** — Real-time stock checking, low-stock alerts, back-in-stock notifications.
6. **Customer reviews** — Photo/video reviews, verified purchase badges, helpful vote.
7. **Subscription model** — Monthly spice box subscription with recurring delivery.
8. **Recipe integration** — Link products to recipes, multi-product add-to-cart from recipe.
9. **Gift mode** — Gift wrapping option, gift message, scheduled delivery.
10. **International shipping** — Multi-currency, localized checkout.

### Design Review Checklist (Before Phase 3)
- [ ] All pages pass WCAG 2.2 AA audit
- [ ] All interactive elements have hover/focus/active states
- [ ] All empty/loading/error states are designed
- [ ] All forms have validation (success + error)
- [ ] Mobile tap targets are 44x44px minimum
- [ ] Images have proper alt text (meaningful vs. decorative)
- [ ] Typography hierarchy is consistent (no skipped heading levels)
- [ ] Color contrast meets AA standards
- [ ] Animations respect prefers-reduced-motion
- [ ] Keyboard navigation works end-to-end
- [ ] Screen reader testing passes (VoiceOver, NVDA)
- [ ] Performance budget meets Core Web Vitals targets

---

*This document serves as the single source of truth for ORPIND's Phase 2 design system. All development should reference this document for visual, interaction, and experience decisions.*
