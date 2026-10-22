import { Product } from "@/types"

export const products: Product[] = [
  {
    id: "p1",
    slug: "gold-vermeil-hoops",
    name: "Gold Vermeil Hoops",
    price: 45000,
    currency: "₦",
    category: "jewellery",
    description:
      "Classic medium hoops with a warm glow. Lightweight enough for everyday wear yet striking enough to elevate any look. Crafted with 18k gold vermeil over sterling silver.",
    inStock: true,
    featured: true,
    media: [
      {
        id: "m1",
        type: "image",
        src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
        alt: "Gold vermeil hoops on model",
      },
      {
        id: "m2",
        type: "image",
        src: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1600&auto=format&fit=crop",
        alt: "Close up detail of hoop clasp",
      },
    ],
    tags: ["hoops", "gold", "everyday"],
    createdAt: "2024-01-10",
  },
  {
    id: "p2",
    slug: "chunky-link-necklace",
    name: "Chunky Link Necklace",
    price: 65000,
    currency: "₦",
    category: "jewellery",
    description:
      "A subtle statement piece that draws the eye without overwhelming. Looks striking worn alone or layered with delicate chains. Heavy brass construction with gold plating.",
    inStock: true,
    featured: true,
    media: [
      {
        id: "m3",
        type: "image",
        src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
        alt: "Chunky gold link necklace",
      },
      {
        id: "m4",
        type: "image",
        src: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=1600&auto=format&fit=crop",
        alt: "Necklace detail shot",
      },
    ],
    tags: ["necklace", "statement", "gold"],
    createdAt: "2024-01-12",
  },
  {
    id: "p3",
    slug: "pearl-drop-earrings",
    name: "Pearl Drop Earrings",
    price: 38000,
    currency: "₦",
    category: "jewellery",
    description:
      "Freshwater pearls suspended from a delicate gold bar. Understated elegance — equally suited to boardrooms and celebrations. Each pearl is hand-selected for lustre.",
    inStock: true,
    featured: true,
    media: [
      {
        id: "m5",
        type: "image",
        src: "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?q=80&w=1600&auto=format&fit=crop",
        alt: "Pearl drop earrings on white background",
      },
      {
        id: "m6",
        type: "image",
        src: "https://images.unsplash.com/photo-1573408301185-9519f94f2b8d?q=80&w=1600&auto=format&fit=crop",
        alt: "Earrings worn on model",
      },
    ],
    tags: ["earrings", "pearl", "elegant"],
    createdAt: "2024-01-15",
  },
  {
    id: "p4",
    slug: "layered-chain-bracelet",
    name: "Layered Chain Bracelet",
    price: 28000,
    currency: "₦",
    category: "jewellery",
    description:
      "Three delicate gold chains joined at a single clasp for an effortless layered look. Adjustable fit. A daily essential that pairs well with everything.",
    inStock: true,
    featured: false,
    media: [
      {
        id: "m7",
        type: "image",
        src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1600&auto=format&fit=crop",
        alt: "Layered gold chain bracelet on wrist",
      },
    ],
    tags: ["bracelet", "gold", "layered"],
    createdAt: "2024-01-18",
  },
  {
    id: "p5",
    slug: "signet-ring-oval",
    name: "Oval Signet Ring",
    price: 52000,
    currency: "₦",
    category: "jewellery",
    description:
      "A modern take on the classic signet. Smooth oval face, heavy feel, timeless silhouette. Available in sizes 5–10 — specify your size when ordering via WhatsApp.",
    inStock: true,
    featured: false,
    media: [
      {
        id: "m8",
        type: "image",
        src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop",
        alt: "Gold signet ring on dark background",
      },
    ],
    tags: ["ring", "signet", "gold", "unisex"],
    createdAt: "2024-01-20",
  },
  {
    id: "p6",
    slug: "stud-set-minimalist",
    name: "Minimalist Stud Set",
    price: 22000,
    currency: "₦",
    category: "jewellery",
    description:
      "A set of three pairs: tiny ball, flat disc, and twisted bar. Mix and match for a curated ear stack. Perfect as a gift or a treat for yourself.",
    inStock: false,
    featured: false,
    media: [
      {
        id: "m9",
        type: "image",
        src: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1600&auto=format&fit=crop",
        alt: "Minimalist gold stud earring set",
      },
    ],
    tags: ["studs", "earrings", "set", "minimalist"],
    createdAt: "2024-01-22",
  },
]
