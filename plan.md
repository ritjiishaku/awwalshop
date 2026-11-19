# AWWALSHOP — Master Development Plan

> **Tagline:** Elegance in Every Detail.  
> **Brand Positioning:** Modern African Luxury.  
> **Initial Focus:** Curated jewellery, fine timepieces, bespoke traditional attire (kaftans, agbadas), leather footwear, and lifestyle accessories.

> **Current build scope:** The public storefront is a catalogue-centred experience:
> a designed homepage, the `/shop` catalogue, product detail pages, plus legacy
> redirects from `/about`, `/contact` and `/collections` to `/shop`. The admin
> covers products, categories, collections, media and business settings.
> The `WebsiteContent`, `Testimonial`, `Faq`, `NavigationItem` and
> `PromotionalBanner` models exist in Prisma but have **no admin editors and no
> storefront read queries yet** — tracked as the highest-priority remaining work
> in Stage 9, not as completed Stage 7 items.

---

## 1. Executive Summary & Architecture Overview

Awwalshop is built as a flexible, CMS-driven product catalogue and WhatsApp-ordering platform. Rather than a hardcoded single-niche storefront, it provides:
1. **Public Storefront:** An editorial luxury discovery experience with instant search, category filtering, dedicated product detail pages, and direct WhatsApp order generation.
2. **Admin CMS:** A secure administrative portal allowing non-technical business owners to manage products, categories, collections, media and business parameters. Editors for homepage content, testimonials, navigation, FAQs and banners are planned in Stage 9 — the models exist but are not wired up yet.

### Core Technology Stack

| Layer | Technology | Details / Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server Components, Server Actions, Dynamic Metadata (`generateMetadata`), and `proxy.ts` routing convention. |
| **Language** | TypeScript (Strict) | End-to-end type safety across database schemas, APIs, and UI components. |
| **Styling** | Tailwind CSS v4 | Custom luxury design tokens (Deep Espresso `#241C19`, Warm Ivory `#F8F5EF`, Champagne Gold `#C5A46D`, Soft Sand `#E8DED0`). |
| **Database** | PostgreSQL (Neon) | Scalable, serverless relational database with ACID compliance. |
| **ORM** | Prisma 6 | Type-safe query building, migrations, and automated schema synchronization. |
| **Authentication** | NextAuth v5 (Auth.js) | JWT session management with HTTP-only secure cookies and bcrypt password hashing. |
| **Media Storage** | Cloudinary + oEmbed | Direct image/video uploads with auto-optimization, plus external YouTube & Vimeo video embedding. |
| **Ordering Channel** | WhatsApp Business API / wa.me | Conversational commerce: prefilled, URL-encoded order inquiries with variants, quantity, and product URLs. |
| **Validation** | Zod | Runtime validation for server actions, API routes, and client forms. |

---

## 2. Phased Implementation Roadmap

```mermaid
flowchart TD
    S1["Stage 1: Foundation & Brand Design System"] --> S2["Stage 2: Database Connectivity & Seeding"]
    S2 --> S3["Stage 3: Core Admin CMS & Inventory"]
    S3 --> S4["Stage 4: Storefront & Catalogue Refinement"]
    S4 --> S5["Stage 5: Product Media & Video Integration"]
    S5 --> S6["Stage 6: WhatsApp Ordering & Social Sharing"]
    S6 --> S7["Stage 7: CMS Dynamic Content & Business Settings"]
    S7 --> S8["Stage 8: QA, Security & Deployment"]
    S8 --> S9["Stage 9: Remaining Work & Gifts by VF Parity"]
```

---

### Stage 1: Foundation & Brand Design System (Completed & Verified)
- [x] Establish luxury design tokens (Deep Espresso, Warm Ivory, Champagne Gold, Soft Sand) in `globals.css`.
- [x] Configure typography: Cormorant Garamond (Headings) and DM Sans (Body).
- [x] Reusable SVG brand assets (horizontal logo, stacked logo, monogram symbol).
- [x] Layout architecture separating storefront `app/(storefront)` and administrative CMS `app/admin`.
- [x] Route protection proxy convention (`proxy.ts`).
- [x] NextAuth v5 session management & authentication setup (`lib/auth.ts`).
- [x] Stable Prisma 6 client generated (`prisma/schema.prisma`).
- [x] TypeScript verification (`tsc --noEmit`) passing with 0 errors.

---

### Stage 2: Database Connectivity & Seeding
**Objective:** Connect the application to a live PostgreSQL instance (Neon) and seed the initial dataset.

1. **Environment Configuration:**
   - Configure `DATABASE_URL` in `.env.local`.
   - Set up `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL`.
2. **Schema Migration:**
   - Run `npx prisma db push` or `npx prisma migrate dev` to generate tables, indexes, and relations.
3. **Database Seeding:**
   - Execute `npx prisma db seed` to insert:
     - 5 Core Categories (Fine Jewellery, Traditional Attire, Timepieces, Leather Footwear, Accessories).
     - 3 Featured Collections (New Arrivals, Signature Luxury, Best Sellers).
     - Initial luxury demonstration products with pricing and specifications.
     - Default Business Settings and WhatsApp message template.
4. **Initial Admin Account:**
   - Seed the initial admin user with bcrypt-hashed credentials.

---

### Stage 3: Core Admin CMS & Product Management
**Objective:** Provide full inventory and taxonomy control for the store administrator.

1. **Product CRUD Operations:**
   - Server Actions for product creation, editing, publishing/unpublishing, and deletion.
   - Dynamic product edit view at `/admin/products/[id]`.
   - Product duplication support.
2. **Category & Taxonomy Management:**
   - Support parent and child category relationships.
   - Category banners, descriptions, and sort orders at `/admin/categories`.
3. **Collection Management:**
   - Curated collections management at `/admin/collections`.
4. **Admin Activity Logging:**
   - Audit trail tracking modifications across products and settings.

---

### Stage 4: Storefront Experience & Catalogue Refinement (Completed & Verified)
**Objective:** Deliver an editorial customer journey on mobile and desktop.

1. **Catalogue Filtering & Search:**
   - [x] Multi-criteria filtering: Category, Subcategory, Collection, Price range, Availability.
   - [x] Instant search across product titles, descriptions, SKUs and materials.
   - [x] Sorting by Newest, Price (Low to High / High to Low), and Featured status.
2. **Pagination & Load-More:**
   - [x] Offset pagination with preserved query parameters.
3. **Dedicated Product Detail Pages (`/products/[slug]`):**
   - [x] Rich media gallery, specifications list, variant pickers, and availability indicator.
   - [x] Homepage, collections index/detail, about and contact pages built on live CMS/DB data.
   - [x] Responsive layouts for mobile, tablet and desktop viewports.

---

### Stage 5: Product Media System (Uploads & External Video)
**Objective:** Coexistence of Cloudinary direct uploads, external image links, and video players.

1. **Direct Upload System:**
   - [x] Cloudinary helper (`lib/cloudinary.ts`) with `fetch_format: 'auto'` optimisation.
   - [x] Server-side upload route (`app/api/admin/media/upload/route.ts`) with MIME allow-list and 10 MB image / 100 MB video size limits.
   - [x] Drag-and-drop uploader (`components/admin/MediaUploader.tsx`) with progress and status feedback.
   - [ ] Upload-queue thumbnail previews — currently filename + progress bar only.
2. **External Media & Video Integration:**
   - [x] Automatic detection of YouTube, Vimeo, direct MP4, and external image URLs.
   - [x] Embedded players with fallback poster images.
3. **Gallery Controls:**
   - [x] Storefront gallery with thumbnails, video posters and active-media selection.
   - [x] Primary-media selection in the admin (`ProductForm.tsx` Primary radio).
   - [ ] Drag-and-drop / move up-down media reordering; `sortOrder` is still derived from array index.

---

### Stage 6: WhatsApp Ordering & Social Sharing (Completed & Verified)
**Objective:** Flawless conversational commerce and link shareability.

1. **WhatsApp URL Generation:**
   - [x] Dynamic message formatting incorporating selected variant (e.g. Ring Size 9, 18k Champagne Gold), quantity, total price, and product canonical URL.
   - [x] Cross-platform support (`wa.me` redirecting seamlessly to WhatsApp Mobile App or WhatsApp Web).
   - [x] Template read from CMS `BusinessSettings.whatsappMessage` with live price/quantity recalculation.
2. **Dynamic Social Metadata (Open Graph & Twitter Cards):**
   - [x] `generateMetadata` implementation on product and collection detail pages.
   - [x] Auto-generated `sitemap.xml` and `robots.txt`.
   - [x] Product JSON-LD structured data.
3. **Share Features:**
   - [x] Native Web Share API integration on mobile.
   - [x] Clipboard copy with instant visual confirmation.

---

### Stage 7: CMS Dynamic Content & Business Settings (Partially complete)
**Objective:** Ensure 100% of storefront content is editable without code modification.

1. **Business Settings Editor (`/admin/settings`) — Complete:**
   - [x] Business name, tagline, phone, email, showroom address and opening hours.
   - [x] WhatsApp number and default inquiry message template with placeholder guidance.
   - [x] Currency code (`NGN`, `USD`, `GBP`, `EUR`), currency symbol, delivery and processing information.
   - [x] Social profile links wired through to the storefront footer.
   - [x] Default SEO title and description wired through to the site metadata.
   - [x] All mutations require an authenticated admin session, validate with Zod and write to the activity log.
2. **Homepage Content Editor (`/admin/homepage`) — Not built:**
   - [ ] Hero headline, eyebrow, supporting description, CTA texts and destinations (`WebsiteContent`).
   - [ ] Hero background and brand-story imagery with live previews.
   - [ ] Editorial brand-story heading and paragraph manager.
   - [ ] Read queries for `WebsiteContent` in `lib/storefront.ts` and wiring into `app/(storefront)/page.tsx` (hero copy is currently hardcoded).
3. **Testimonials Manager (`/admin/testimonials`) — Not built:**
   - [ ] Add, edit, publish/unpublish and delete `Testimonial` records with star ratings and photos.
   - [ ] Sort ordering and published/draft status in the admin list.
   - [ ] Render published testimonials on the storefront.
4. **Navigation, FAQ & Banners — Not built:**
   - [ ] `/admin/navigation` editor for `NavigationItem` (parent/child, visibility, new-tab) and wire into the storefront header/footer.
   - [ ] `/admin/faqs` editor for `Faq` and a storefront FAQ section.
   - [ ] `/admin/banners` editor for `PromotionalBanner` and storefront placement.

> All unbuilt Stage 7 items are carried forward into Stage 9.

---

### Stage 8: Quality Assurance, Security & Deployment (In progress)
**Objective:** Verify security, accessibility, Core Web Vitals, and prepare for production launch.

1. **Security Hardening:**
   - [x] Server-side session verification on all mutating Server Actions (`requireAdmin()`) and on the upload API route.
   - [x] Upload MIME allow-list and size limits; Zod validation on all action inputs.
   - [ ] Rate limiting on `/admin/login` (no 429/throttle logic exists yet).
   - [ ] Documented input-sanitization policy beyond Zod (e.g. rich-text and URL fields).
2. **Mobile & Accessibility Testing:**
   - [x] Some `aria-label`s and `min-h-11` touch targets in place.
   - [ ] Recorded screen-reader, keyboard-navigation and 44×44px touch-target audit.
3. **Production Deployment (Vercel):**
   - [x] Repository linked to Vercel (`.vercel/project.json`).
   - [ ] Recorded production deployment and zero-downtime verification.

---

### Stage 9: Remaining Work — Gifts by VF Parity & Launch Readiness (Not started)
**Objective:** Close the content-CMS gap, finish media controls, give admins an in-app help centre, harden login, and document QA/deployment before treating the build as complete.

1. **CMS content editing (highest priority):**
   - [ ] Build `/admin/homepage`, `/admin/testimonials`, `/admin/navigation`, `/admin/faqs` and `/admin/banners` editors for the existing Prisma models.
   - [ ] Add read queries for `WebsiteContent`, `Testimonial`, `Faq`, `NavigationItem` and `PromotionalBanner` to `lib/storefront.ts` (it currently exposes only settings, categories, catalogue, product and sitemap queries).
   - [ ] Wire the new content into storefront pages so no homepage/footer copy is hardcoded.
   - [ ] Add Zod schemas, `requireAdmin()`-guarded actions and activity-log entries for every new editor.
2. **Media management:**
   - [ ] Thumbnail previews in the `MediaUploader.tsx` upload queue.
   - [ ] Drag-and-drop / move up-down reordering in `ProductForm.tsx` (Primary radio already works).
3. **Security & QA:**
   - [ ] Login rate limiting, documented sanitization policy, and a recorded full accessibility audit.
   - [ ] Record the production deployment / zero-downtime check.
4. **Gifts by VF feature parity (reference project `Gifts By VF/`):**
   - [ ] Sales rep portal and referral links (`RepPortal.jsx`).
   - [ ] AI concierge chat widget ("Ask Gifts by VF") — currently only a WhatsApp link.
   - [ ] In-page Category Explorer with filter-clear/jump behaviour — ours uses static cards linking to `/shop?category=`.
   - [ ] Editable site-copy settings (site title, "Why VF", footer text) — no equivalent editor exists.
5. **Admin enablement — in-app help centre (built with Stage 9):**
   - [x] Added `/admin/help`, a protected two-pane help centre with a searchable topic list and a step-by-step article pane.
   - [x] Authored guides as typed data in `lib/admin-guides.ts` (Products, Categories, Collections, Media, Settings, WhatsApp ordering, Storefront, Getting started, Troubleshooting) — no dependency on the unbuilt content CMS.
   - [x] Each step can carry a “Go to page” deep link straight to the relevant admin screen (or the storefront in a new tab).
   - [x] Added contextual “How do I…?” links to every admin page header (`/admin/help?guide=<slug>`) and a Help entry in the admin navigation.
   - [x] Styled the help centre and contextual links with the existing admin design tokens in `app/globals.css`, including responsive/mobile layouts.
   - [ ] Optional phase 2: a “Getting started” checklist card on the dashboard with progress in `localStorage` — deliberately deferred because docs-with-deep-links stay useful as the UI changes.
6. **Plan hygiene:**
   - [x] Corrected stale Stage 5/7/8 checkboxes to match the implemented code.
   - [ ] Work through the Definition of Done checklist (Section 4) once the above is complete.

---

## 3. Future Expansion Roadmap (Phases 2 – 6)

The architecture is prepared for seamless transition into transactional e-commerce in future versions:

- **Phase 2 (Shopping Cart & Accounts):** Cart drawer, persistent user accounts, saved wishlists.
- **Phase 3 (Online Payments):** Paystack & Flutterwave gateway integrations for instant card/bank checkout.
- **Phase 4 (Order Tracking):** Automated order receipts, order statuses (Processing, Shipped, Delivered), and customer tracking links.
- **Phase 5 (Inventory Control):** Stock quantity counters, low-stock notifications, automated out-of-stock transitions.
- **Phase 6 (Business Analytics):** Conversion rate tracking, most viewed pieces, and WhatsApp click analytics.

---

## 4. Definition of Done Checklist

- [x] Storefront displays live database items (no hardcoded catalogue data).
- [x] Admin can log in securely and maintain access via HTTP-only session cookies.
- [x] Admin can create, update, unpublish, and delete products with multiple images/videos.
- [x] WhatsApp ordering button opens with exact product details and selected variants.
- [ ] Social links show custom Open Graph cards on WhatsApp, iMessage, and Twitter. (Metadata implemented; live crawler validation pending Stage 8 QA.)
- [ ] CMS allows editing business WhatsApp number, tagline, and homepage text. (Settings done; homepage-text editor pending Stage 9.)
- [ ] Site is responsive and functional on mobile, tablet, and desktop viewports. (Formal QA pending Stage 8.)
- [ ] Ready for zero-downtime deployment on Vercel. (Project linked; production verification pending Stage 8.)