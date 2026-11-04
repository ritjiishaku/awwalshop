/**
 * AWWALSHOP — Database Seed
 * ---------------------------------------------------------------------------
 * Idempotent seed script for the AWWALSHOP catalogue and CMS.
 * Run with: npm run db:seed
 */

import {
  AdminRole,
  MediaSourceType,
  MediaType,
  PrismaClient,
  ProductAvailability,
  ProductStatus,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

// `prisma db seed` loads `.env` before running this file, so DATABASE_URL and
// the ADMIN_* credentials are already available here.
const prisma = new PrismaClient()

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`

// =============================================================================
// CATEGORIES
// =============================================================================

const categoryData = [
  {
    name: 'Fine Jewellery',
    slug: 'fine-jewellery',
    description:
      'Hand-finished rings, necklaces, bracelets and earrings crafted in gold, sterling silver and precious stones.',
    imageUrl: image('photo-1515562141207-7a88fb7ce338'),
    sortOrder: 1,
    children: [
      { name: 'Rings', slug: 'rings', sortOrder: 1 },
      { name: 'Necklaces', slug: 'necklaces', sortOrder: 2 },
      { name: 'Bracelets', slug: 'bracelets', sortOrder: 3 },
      { name: 'Earrings', slug: 'earrings', sortOrder: 4 },
    ],
  },
  {
    name: 'Traditional Attire',
    slug: 'traditional-attire',
    description:
      'Bespoke kaftans, agbadas and aso-oke ensembles tailored for celebrations and enduring elegance.',
    imageUrl: image('photo-1617137968427-85924c800a22'),
    sortOrder: 2,
    children: [
      { name: 'Kaftans', slug: 'kaftans', sortOrder: 1 },
      { name: 'Agbadas', slug: 'agbadas', sortOrder: 2 },
      { name: 'Aso-Oke', slug: 'aso-oke', sortOrder: 3 },
    ],
  },
  {
    name: 'Timepieces',
    slug: 'timepieces',
    description:
      'Fine Swiss-inspired watches selected for precision, presence and quiet luxury.',
    imageUrl: image('photo-1523275335684-37898b6baf30'),
    sortOrder: 3,
    children: [
      { name: "Men's Watches", slug: 'mens-watches', sortOrder: 1 },
      { name: "Women's Watches", slug: 'womens-watches', sortOrder: 2 },
    ],
  },
  {
    name: 'Leather Footwear',
    slug: 'leather-footwear',
    description:
      'Handcrafted leather loafers, sandals and boots made from full-grain hides.',
    imageUrl: image('photo-1549298916-b41d501d3772'),
    sortOrder: 4,
    children: [
      { name: 'Loafers', slug: 'loafers', sortOrder: 1 },
      { name: 'Sandals', slug: 'sandals', sortOrder: 2 },
      { name: 'Boots', slug: 'boots', sortOrder: 3 },
    ],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description:
      'Statement bags, cufflinks and eyewear that complete a considered wardrobe.',
    imageUrl: image('photo-1584917865442-de89df76afd3'),
    sortOrder: 5,
    children: [
      { name: 'Bags', slug: 'bags', sortOrder: 1 },
      { name: 'Cufflinks', slug: 'cufflinks', sortOrder: 2 },
      { name: 'Eyewear', slug: 'eyewear', sortOrder: 3 },
    ],
  },
]

// =============================================================================
// COLLECTIONS
// =============================================================================

const collectionData = [
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'The latest additions to the AWWALSHOP atelier.',
    bannerUrl: image('photo-1490481651871-ab68de25d43d'),
    sortOrder: 1,
  },
  {
    name: 'Signature Luxury',
    slug: 'signature-luxury',
    description:
      'Our most exceptional pieces — limited runs, rare materials, uncompromising craft.',
    bannerUrl: image('photo-1599643478518-a784e5dc4c8f'),
    sortOrder: 2,
  },
  {
    name: 'Best Sellers',
    slug: 'best-sellers',
    description: 'The pieces our clients return to, season after season.',
    bannerUrl: image('photo-1605100804763-247f67b3557e'),
    sortOrder: 3,
  },
]

// =============================================================================
// PRODUCTS
// =============================================================================

interface SeedProduct {
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  sku: string
  categorySlug: string
  regularPrice: number
  discountPrice?: number
  material: string
  colour: string
  size?: string
  weight?: string
  processingTime: string
  deliveryInfo: string
  status: ProductStatus
  availability: ProductAvailability
  isFeatured: boolean
  isNewArrival: boolean
  images: { url: string; alt: string }[]
  variants?: { name: string; value: string; priceModifier?: number }[]
  collections: string[]
  customAttributes?: Record<string, string>
}

const productData: SeedProduct[] = [
  {
    name: 'Aurelia Diamond Halo Ring',
    slug: 'aurelia-diamond-halo-ring',
    shortDescription:
      'An 18k champagne gold solitaire framed by a halo of ethically sourced diamonds.',
    fullDescription:
      'The Aurelia is a study in restraint and radiance. A brilliant-cut centre stone is set in 18k champagne gold and encircled by a delicate halo of pavé diamonds. Each ring is finished by hand in our Lagos atelier and presented in a signature AWWALSHOP keepsake box.',
    sku: 'AW-JW-RNG-001',
    categorySlug: 'rings',
    regularPrice: 1250000,
    discountPrice: 1090000,
    material: '18k Champagne Gold, Lab-Grown Diamonds',
    colour: 'Champagne Gold',
    size: 'Available in sizes 5–12',
    weight: '4.8g',
    processingTime: 'Made to order — 10 to 14 working days',
    deliveryInfo: 'Complimentary insured delivery within Nigeria.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.MADE_TO_ORDER,
    isFeatured: true,
    isNewArrival: true,
    images: [
      { url: image('photo-1605100804763-247f67b3557e'), alt: 'Aurelia diamond halo ring' },
      { url: image('photo-1603561596112-db1d1c7f4b1a'), alt: 'Aurelia ring detail' },
    ],
    variants: [
      { name: 'Ring Size', value: 'Size 6' },
      { name: 'Ring Size', value: 'Size 7' },
      { name: 'Ring Size', value: 'Size 8' },
      { name: 'Ring Size', value: 'Size 9' },
      { name: 'Metal', value: '18k Champagne Gold', priceModifier: 0 },
      { name: 'Metal', value: '18k White Gold', priceModifier: 85000 },
    ],
    collections: ['signature-luxury', 'best-sellers', 'new-arrivals'],
    customAttributes: {
      Stone: '1.0ct brilliant-cut lab-grown diamond',
      Setting: 'Four-prong solitaire with pavé halo',
      Certification: 'IGI certificate included',
    },
  },
  {
    name: 'Ife Gold Layered Necklace',
    slug: 'ife-gold-layered-necklace',
    shortDescription:
      'Three graduated 18k gold chains inspired by the regalia of ancient Ife.',
    fullDescription:
      'A sculptural triple-strand necklace that moves with the wearer. Hand-linked chains in varying gauges create depth and light, fastened with a concealed lobster clasp. Designed to be worn alone or layered with heirloom pieces.',
    sku: 'AW-JW-NCK-002',
    categorySlug: 'necklaces',
    regularPrice: 685000,
    material: '18k Gold Vermeil on Sterling Silver',
    colour: 'Yellow Gold',
    size: '42cm / 46cm / 50cm',
    weight: '18.2g',
    processingTime: 'Ships in 3–5 working days',
    deliveryInfo: 'Complimentary insured delivery within Nigeria.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: true,
    isNewArrival: false,
    images: [
      { url: image('photo-1599643478518-a784e5dc4c8f'), alt: 'Ife gold layered necklace' },
      { url: image('photo-1611652022419-a9419f74343d'), alt: 'Ife necklace close-up' },
    ],
    variants: [
      { name: 'Length', value: '42cm' },
      { name: 'Length', value: '46cm' },
      { name: 'Length', value: '50cm' },
    ],
    collections: ['best-sellers', 'signature-luxury'],
    customAttributes: {
      Finish: 'High-polish',
      Clasp: 'Concealed lobster clasp',
    },
  },
  {
    name: 'Sapphire Drop Earrings',
    slug: 'sapphire-drop-earrings',
    shortDescription:
      'Deep blue sapphires suspended in a fluid gold drop silhouette.',
    fullDescription:
      'Faceted Ceylon sapphires catch the light from every angle in these articulated drop earrings. Set in warm 18k gold with a secure post backing, they transition effortlessly from daytime tailoring to evening wear.',
    sku: 'AW-JW-EAR-003',
    categorySlug: 'earrings',
    regularPrice: 920000,
    material: '18k Gold, Ceylon Sapphires',
    colour: 'Gold / Blue',
    weight: '6.4g',
    processingTime: 'Made to order — 7 to 10 working days',
    deliveryInfo: 'Complimentary insured delivery within Nigeria.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.MADE_TO_ORDER,
    isFeatured: false,
    isNewArrival: true,
    images: [
      { url: image('photo-1535632066927-ab7c9ab60908'), alt: 'Sapphire drop earrings' },
    ],
    collections: ['new-arrivals', 'signature-luxury'],
    customAttributes: {
      Stone: '2.4ct total Ceylon sapphire',
      Backing: 'Secure post with butterfly',
    },
  },
  {
    name: 'Adire Silk Kaftan',
    slug: 'adire-silk-kaftan',
    shortDescription:
      'A floor-length silk kaftan with hand-painted Adire motifs in indigo and ivory.',
    fullDescription:
      'Cut from heavyweight silk and finished with hand-painted Adire patterning, this kaftan is a modern interpretation of a Yoruba classic. The relaxed silhouette is balanced by precise gold-thread embroidery at the neckline and cuffs.',
    sku: 'AW-TA-KFT-004',
    categorySlug: 'kaftans',
    regularPrice: 480000,
    material: '100% Silk with gold-thread embroidery',
    colour: 'Indigo / Ivory',
    size: 'S, M, L, XL, Bespoke',
    processingTime: 'Bespoke — 14 to 21 working days',
    deliveryInfo: 'Worldwide shipping available. Bespoke pieces are final sale.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.MADE_TO_ORDER,
    isFeatured: true,
    isNewArrival: true,
    images: [
      { url: image('photo-1595777457583-95e059d581b8'), alt: 'Adire silk kaftan' },
      { url: image('photo-1583391733956-6c78276477e2'), alt: 'Adire kaftan detail' },
    ],
    variants: [
      { name: 'Size', value: 'S' },
      { name: 'Size', value: 'M' },
      { name: 'Size', value: 'L' },
      { name: 'Size', value: 'XL' },
      { name: 'Size', value: 'Bespoke', priceModifier: 60000 },
    ],
    collections: ['new-arrivals', 'best-sellers'],
    customAttributes: {
      Fabric: 'Heavyweight mulberry silk',
      Care: 'Dry clean only',
      Origin: 'Made in Lagos, Nigeria',
    },
  },
  {
    name: 'Royal Agbada Set',
    slug: 'royal-agbada-set',
    shortDescription:
      'A three-piece agbada in ivory cashmere with tonal embroidery.',
    fullDescription:
      'The Royal Agbada is tailored for presence. Three pieces — flowing outer agbada, inner buba and drawstring sokoto — are cut from soft ivory cashmere and finished with tone-on-tone embroidery at the chest and cuffs.',
    sku: 'AW-TA-AGB-005',
    categorySlug: 'agbadas',
    regularPrice: 890000,
    material: 'Cashmere blend',
    colour: 'Ivory',
    size: 'Bespoke tailoring included',
    processingTime: 'Bespoke — 21 to 28 working days',
    deliveryInfo: 'Worldwide shipping available. Includes one fitting consultation.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.MADE_TO_ORDER,
    isFeatured: true,
    isNewArrival: false,
    images: [
      { url: image('photo-1617137968427-85924c800a22'), alt: 'Royal agbada set' },
      { url: image('photo-1507679799987-c73779587ccf'), alt: 'Agbada tailoring detail' },
    ],
    variants: [
      { name: 'Colour', value: 'Ivory' },
      { name: 'Colour', value: 'Sand' },
      { name: 'Colour', value: 'Deep Espresso', priceModifier: 0 },
    ],
    collections: ['signature-luxury'],
    customAttributes: {
      Pieces: 'Agbada, buba and sokoto',
      Tailoring: 'Made to measure',
      Care: 'Dry clean only',
    },
  },
  {
    name: 'Heritage Aso-Oke Set',
    slug: 'heritage-aso-oke-set',
    shortDescription:
      'Handwoven aso-oke in champagne and espresso, with a matching gele.',
    fullDescription:
      'Woven on traditional narrow looms by master weavers in Iseyin, this aso-oke set celebrates the texture and rhythm of handwoven cloth. The set includes iro, buba, iborun and a matching gele.',
    sku: 'AW-TA-ASO-006',
    categorySlug: 'aso-oke',
    regularPrice: 350000,
    material: 'Handwoven cotton-silk aso-oke',
    colour: 'Champagne / Espresso',
    size: 'One size with adjustable wrap',
    processingTime: 'Ships in 7–10 working days',
    deliveryInfo: 'Complimentary delivery within Lagos.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: false,
    isNewArrival: false,
    images: [
      { url: image('photo-1529139574466-a303027c1d8b'), alt: 'Heritage aso-oke set' },
    ],
    collections: ['best-sellers'],
    customAttributes: {
      Includes: 'Iro, buba, iborun and gele',
      Weave: 'Handwoven narrow-loom',
    },
  },
  {
    name: 'Meridian Automatic Watch',
    slug: 'meridian-automatic-watch',
    shortDescription:
      'A 40mm automatic timepiece with a sunburst espresso dial and sapphire crystal.',
    fullDescription:
      'The Meridian pairs a 40mm brushed steel case with a deep espresso sunburst dial and applied champagne indices. Powered by a Swiss automatic movement with a 42-hour power reserve, it is finished on a hand-stitched leather strap.',
    sku: 'AW-TP-WCH-007',
    categorySlug: 'mens-watches',
    regularPrice: 1450000,
    material: '316L Stainless Steel, Sapphire Crystal, Leather',
    colour: 'Espresso / Steel',
    size: '40mm case, 20mm lug width',
    weight: '78g',
    processingTime: 'Ships in 2–3 working days',
    deliveryInfo: 'Insured worldwide delivery. 2-year international warranty.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: true,
    isNewArrival: false,
    images: [
      { url: image('photo-1523275335684-37898b6baf30'), alt: 'Meridian automatic watch' },
      { url: image('photo-1524805444758-089113d48a6d'), alt: 'Meridian watch dial' },
    ],
    variants: [
      { name: 'Strap', value: 'Espresso Leather' },
      { name: 'Strap', value: 'Steel Bracelet', priceModifier: 95000 },
    ],
    collections: ['signature-luxury', 'best-sellers'],
    customAttributes: {
      Movement: 'Swiss automatic, 42h power reserve',
      'Water Resistance': '100m',
      Case: '40mm brushed stainless steel',
    },
  },
  {
    name: 'Celeste Mother-of-Pearl Watch',
    slug: 'celeste-mother-of-pearl-watch',
    shortDescription:
      'A 32mm rose-gold watch with a mother-of-pearl dial and diamond indices.',
    fullDescription:
      'The Celeste is a quietly luminous everyday piece. A mother-of-pearl dial shifts in colour as it catches the light, framed by a slim rose-gold case and eight diamond hour markers.',
    sku: 'AW-TP-WCH-008',
    categorySlug: 'womens-watches',
    regularPrice: 1180000,
    material: 'Rose Gold PVD Steel, Mother-of-Pearl, Diamonds',
    colour: 'Rose Gold / Pearl',
    size: '32mm case, 16mm lug width',
    processingTime: 'Ships in 2–3 working days',
    deliveryInfo: 'Insured worldwide delivery. 2-year international warranty.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: false,
    isNewArrival: true,
    images: [
      { url: image('photo-1524805444758-089113d48a6d'), alt: 'Celeste mother-of-pearl watch' },
    ],
    collections: ['new-arrivals', 'signature-luxury'],
    customAttributes: {
      Movement: 'Swiss quartz',
      'Water Resistance': '50m',
      Stones: '8 full-cut diamonds',
    },
  },
  {
    name: 'Lagos Leather Penny Loafer',
    slug: 'lagos-leather-penny-loafer',
    shortDescription:
      'Hand-stitched full-grain leather loafers in deep espresso.',
    fullDescription:
      'A modern penny loafer built on a Blake-stitched leather sole. Full-grain calf leather softens with wear, while the hand-stitched apron lends an artisanal finish. Designed for long days and late evenings alike.',
    sku: 'AW-LF-LOF-009',
    categorySlug: 'loafers',
    regularPrice: 320000,
    material: 'Full-grain calf leather',
    colour: 'Deep Espresso',
    size: 'EU 39–46',
    processingTime: 'Ships in 3–5 working days',
    deliveryInfo: 'Complimentary delivery within Nigeria. Free returns within 14 days.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: true,
    isNewArrival: false,
    images: [
      { url: image('photo-1549298916-b41d501d3772'), alt: 'Lagos leather penny loafer' },
      { url: image('photo-1614252369475-531eba835eb1'), alt: 'Loafer sole detail' },
    ],
    variants: [
      { name: 'Size', value: 'EU 39' },
      { name: 'Size', value: 'EU 40' },
      { name: 'Size', value: 'EU 41' },
      { name: 'Size', value: 'EU 42' },
      { name: 'Size', value: 'EU 43' },
      { name: 'Size', value: 'EU 44' },
      { name: 'Size', value: 'EU 45' },
      { name: 'Size', value: 'EU 46' },
    ],
    collections: ['best-sellers'],
    customAttributes: {
      Construction: 'Blake-stitched',
      Sole: 'Leather with rubber heel insert',
      Lining: 'Calf leather',
    },
  },
  {
    name: 'Sahara Suede Sandals',
    slug: 'sahara-suede-sandals',
    shortDescription:
      'Minimalist suede sandals with a moulded cork footbed.',
    fullDescription:
      'Cut from soft suede and set on a contoured cork footbed, the Sahara sandal is designed for warm evenings and effortless travel. Two adjustable straps ensure a secure, comfortable fit.',
    sku: 'AW-LF-SND-010',
    categorySlug: 'sandals',
    regularPrice: 245000,
    material: 'Italian suede, cork, rubber',
    colour: 'Sand',
    size: 'EU 38–45',
    processingTime: 'Ships in 3–5 working days',
    deliveryInfo: 'Complimentary delivery within Nigeria.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: false,
    isNewArrival: false,
    images: [
      { url: image('photo-1603487742131-4160ec999306'), alt: 'Sahara suede sandals' },
    ],
    variants: [
      { name: 'Size', value: 'EU 38' },
      { name: 'Size', value: 'EU 40' },
      { name: 'Size', value: 'EU 42' },
      { name: 'Size', value: 'EU 44' },
    ],
    collections: [],
    customAttributes: {
      Footbed: 'Moulded cork and latex',
      Straps: 'Adjustable suede',
    },
  },
  {
    name: 'Owerri Chelsea Boot',
    slug: 'owerri-chelsea-boot',
    shortDescription:
      'A sharply proportioned Chelsea boot in polished black calfskin.',
    fullDescription:
      'The Owerri boot is built on a sleek elongated last with elastic side gores and a pull tab. Polished black calfskin and a stacked leather heel make it equally at home with tailoring or denim.',
    sku: 'AW-LF-BOT-011',
    categorySlug: 'boots',
    regularPrice: 420000,
    material: 'Polished calfskin, leather sole',
    colour: 'Black',
    size: 'EU 39–46',
    processingTime: 'Ships in 3–5 working days',
    deliveryInfo: 'Complimentary delivery within Nigeria. Free returns within 14 days.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: false,
    isNewArrival: true,
    images: [
      { url: image('photo-1608256246200-53e635b5b65f'), alt: 'Owerri Chelsea boot' },
    ],
    variants: [
      { name: 'Size', value: 'EU 39' },
      { name: 'Size', value: 'EU 41' },
      { name: 'Size', value: 'EU 43' },
      { name: 'Size', value: 'EU 45' },
    ],
    collections: ['new-arrivals'],
    customAttributes: {
      Construction: 'Goodyear welted',
      Sole: 'Leather with rubber top piece',
    },
  },
  {
    name: 'Zaria Structured Tote',
    slug: 'zaria-structured-tote',
    shortDescription:
      'A structured leather tote with champagne hardware and suede lining.',
    fullDescription:
      'The Zaria tote is an everyday carry elevated by considered detail: full-grain leather, champagne hardware and a soft suede interior with a zipped pocket and two card slips. It fits a 14-inch laptop comfortably.',
    sku: 'AW-AC-BAG-012',
    categorySlug: 'bags',
    regularPrice: 560000,
    material: 'Full-grain leather, suede lining',
    colour: 'Cognac',
    size: '34cm W x 27cm H x 14cm D',
    weight: '1.1kg',
    processingTime: 'Ships in 3–5 working days',
    deliveryInfo: 'Complimentary delivery within Nigeria.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: true,
    isNewArrival: false,
    images: [
      { url: image('photo-1584917865442-de89df76afd3'), alt: 'Zaria structured tote' },
      { url: image('photo-1590874103328-eac38a683ce7'), alt: 'Zaria tote interior' },
    ],
    variants: [
      { name: 'Colour', value: 'Cognac' },
      { name: 'Colour', value: 'Deep Espresso' },
      { name: 'Colour', value: 'Black' },
    ],
    collections: ['best-sellers', 'signature-luxury'],
    customAttributes: {
      Hardware: 'Champagne gold-tone',
      Interior: 'Suede with zip pocket',
      Capacity: 'Fits 14-inch laptop',
    },
  },
  {
    name: 'Onyx Cufflink Set',
    slug: 'onyx-cufflink-set',
    shortDescription:
      'Black onyx cufflinks set in champagne gold, presented in a leather case.',
    fullDescription:
      'A pair of hand-polished black onyx cufflinks with champagne gold bezels and a swivel closure. Presented in a compact leather travel case.',
    sku: 'AW-AC-CUF-013',
    categorySlug: 'cufflinks',
    regularPrice: 165000,
    material: 'Black onyx, 18k gold vermeil',
    colour: 'Onyx / Gold',
    processingTime: 'Ships in 2–3 working days',
    deliveryInfo: 'Complimentary delivery within Nigeria.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.AVAILABLE,
    isFeatured: false,
    isNewArrival: false,
    images: [
      { url: image('photo-1622434641406-a158123450f9'), alt: 'Onyx cufflink set' },
    ],
    collections: [],
    customAttributes: {
      Closure: 'Swivel bar',
      Presentation: 'Leather travel case',
    },
  },
  {
    name: 'Harmattan Acetate Sunglasses',
    slug: 'harmattan-acetate-sunglasses',
    shortDescription:
      'Hand-polished acetate frames with smoke lenses and gold temple detail.',
    fullDescription:
      'A classic square silhouette cut from Italian acetate and hand-polished over several days. Smoke-tinted lenses offer category 3 UV protection, while gold temple cores add a discreet signature.',
    sku: 'AW-AC-EYE-014',
    categorySlug: 'eyewear',
    regularPrice: 185000,
    material: 'Italian acetate, CR-39 lenses',
    colour: 'Espresso Tortoise',
    size: '52-20-145',
    processingTime: 'Ships in 2–3 working days',
    deliveryInfo: 'Complimentary delivery within Nigeria.',
    status: ProductStatus.PUBLISHED,
    availability: ProductAvailability.OUT_OF_STOCK,
    isFeatured: false,
    isNewArrival: true,
    images: [
      { url: image('photo-1511499767150-a48a237f0083'), alt: 'Harmattan acetate sunglasses' },
    ],
    collections: ['new-arrivals'],
    customAttributes: {
      Protection: 'Category 3 UV400',
      Hinges: 'Gold-core riveted',
    },
  },
]

// =============================================================================
// TESTIMONIALS / FAQ / NAVIGATION / CONTENT
// =============================================================================

const testimonials = [
  {
    customerName: 'Amina O.',
    testimonialText:
      'The Aurelia ring exceeded every expectation. The packaging alone felt like an event, and the team guided me through sizing on WhatsApp within minutes.',
    rating: 5,
    isPublished: true,
    sortOrder: 1,
  },
  {
    customerName: 'Tunde A.',
    testimonialText:
      'My agbada was tailored to perfection and arrived ahead of schedule. I have never received so many compliments at an event.',
    rating: 5,
    isPublished: true,
    sortOrder: 2,
  },
  {
    customerName: 'Chiamaka E.',
    testimonialText:
      'Beautiful craftsmanship and genuinely thoughtful service. The Ife necklace is now my everyday piece — it layers beautifully.',
    rating: 5,
    isPublished: true,
    sortOrder: 3,
  },
]

const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'Browse the catalogue and select “Order via WhatsApp” on any product. Your inquiry is pre-filled with the piece, variant, quantity and price. Our concierge will confirm availability, delivery and payment details.',
    sortOrder: 1,
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes. We ship worldwide via insured courier partners. Delivery timelines and duties are confirmed by our concierge before dispatch.',
    sortOrder: 2,
  },
  {
    question: 'Can I request a bespoke piece?',
    answer:
      'Absolutely. Bespoke tailoring, sizing and stone selection are available across jewellery and traditional attire. Start a WhatsApp conversation and our team will guide you through the process.',
    sortOrder: 3,
  },
  {
    question: 'What is your return policy?',
    answer:
      'Ready-to-wear pieces may be returned within 14 days in unused condition. Bespoke and made-to-order pieces are final sale. Please contact our concierge to initiate a return.',
    sortOrder: 4,
  },
  {
    question: 'How should I care for my pieces?',
    answer:
      'Store jewellery in its pouch away from moisture and perfumes. Dry clean tailored pieces only. Leather footwear should be treated with a neutral conditioner and rested between wears.',
    sortOrder: 5,
  },
]

const navigationItems = [
  { label: 'Catalogue', href: '/shop', sortOrder: 1 },
]

const websiteContent = [
  {
    section: 'hero',
    key: 'eyebrow',
    value: 'Modern African Luxury',
    type: 'text',
  },
  {
    section: 'hero',
    key: 'headline',
    value: 'Elegance in Every Detail.',
    type: 'text',
  },
  {
    section: 'hero',
    key: 'description',
    value:
      'Discover curated jewellery, fine timepieces and bespoke traditional attire — crafted for those who understand that true luxury lives in the details.',
    type: 'textarea',
  },
  {
    section: 'hero',
    key: 'primaryCtaText',
    value: 'Explore the Catalogue',
    type: 'text',
  },
  {
    section: 'hero',
    key: 'primaryCtaUrl',
    value: '/shop',
    type: 'text',
  },
  {
    section: 'hero',
    key: 'secondaryCtaText',
    value: 'Book a Consultation',
    type: 'text',
  },
  {
    section: 'hero',
    key: 'secondaryCtaUrl',
    value: 'https://wa.me/2348000000000',
    type: 'text',
  },
  {
    section: 'hero',
    key: 'imageUrl',
    value: image('photo-1599643478518-a784e5dc4c8f'),
    type: 'image',
  },
  {
    section: 'brand-story',
    key: 'heading',
    value: 'A House Built on Heritage',
    type: 'text',
  },
  {
    section: 'brand-story',
    key: 'body',
    value:
      'AWWALSHOP was founded on a simple conviction: that African craft deserves a place among the world’s most considered luxury houses. We work directly with artisans across Nigeria and beyond, pairing time-honoured techniques with a modern, editorial eye. Every piece is selected for the way it feels, the way it lasts, and the way it tells a story.',
    type: 'textarea',
  },
  {
    section: 'brand-story',
    key: 'imageUrl',
    value: image('photo-1617137968427-85924c800a22'),
    type: 'image',
  },
]

// =============================================================================
// SEED
// =============================================================================

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@awwalshop.com').toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    throw new Error('ADMIN_PASSWORD must be set before seeding an admin account.')
  }
  const passwordHash = await bcrypt.hash(password, 12)

  const existing = await prisma.adminUser.findUnique({ where: { email } })

  const admin = existing
    ? await prisma.adminUser.update({
        where: { email },
        data: { name: 'Awwalshop Administrator', passwordHash, role: AdminRole.SUPER_ADMIN },
      })
    : await prisma.adminUser.create({
        data: {
          name: 'Awwalshop Administrator',
          email,
          passwordHash,
          role: AdminRole.SUPER_ADMIN,
        },
      })

  console.log(`  ✓ Admin account ready: ${admin.email}`)
  return admin
}

async function seedCategories() {
  const categoryIds = new Map<string, string>()

  for (const category of categoryData) {
    const parent = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder,
        isVisible: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder,
        isVisible: true,
      },
    })
    categoryIds.set(category.slug, parent.id)

    for (const child of category.children) {
      const childCategory = await prisma.category.upsert({
        where: { slug: child.slug },
        update: {
          name: child.name,
          parentId: parent.id,
          sortOrder: child.sortOrder,
          isVisible: true,
        },
        create: {
          name: child.name,
          slug: child.slug,
          parentId: parent.id,
          sortOrder: child.sortOrder,
          isVisible: true,
        },
      })
      categoryIds.set(child.slug, childCategory.id)
    }
  }

  console.log(`  ✓ ${categoryIds.size} categories seeded`)
  return categoryIds
}

async function seedCollections() {
  const collectionIds = new Map<string, string>()

  for (const collection of collectionData) {
    const record = await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: {
        name: collection.name,
        description: collection.description,
        bannerUrl: collection.bannerUrl,
        sortOrder: collection.sortOrder,
        isVisible: true,
      },
      create: {
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        bannerUrl: collection.bannerUrl,
        sortOrder: collection.sortOrder,
        isVisible: true,
      },
    })
    collectionIds.set(collection.slug, record.id)
  }

  console.log(`  ✓ ${collectionIds.size} collections seeded`)
  return collectionIds
}

async function seedProducts(
  categoryIds: Map<string, string>,
  collectionIds: Map<string, string>
) {
  for (const product of productData) {
    const categoryId = categoryIds.get(product.categorySlug)
    if (!categoryId) {
      throw new Error(`Unknown category slug: ${product.categorySlug}`)
    }

    const media = product.images.map((mediaItem, index) => ({
      mediaType: MediaType.IMAGE,
      sourceType: MediaSourceType.EXTERNAL_URL,
      url: mediaItem.url,
      altText: mediaItem.alt,
      sortOrder: index,
      isPrimary: index === 0,
    }))

    const variants = (product.variants ?? []).map((variant, index) => ({
      name: variant.name,
      value: variant.value,
      priceModifier: variant.priceModifier ?? 0,
      availability: ProductAvailability.AVAILABLE,
      sortOrder: index,
    }))

    const collections = product.collections
      .map((slug, index) => {
        const collectionId = collectionIds.get(slug)
        if (!collectionId) throw new Error(`Unknown collection slug: ${slug}`)
        return { collectionId, sortOrder: index }
      })

    const sharedData = {
      name: product.name,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      sku: product.sku,
      categoryId,
      regularPrice: product.regularPrice,
      discountPrice: product.discountPrice ?? null,
      currency: 'NGN',
      showPrice: true,
      material: product.material,
      colour: product.colour,
      size: product.size ?? null,
      weight: product.weight ?? null,
      processingTime: product.processingTime,
      deliveryInfo: product.deliveryInfo,
      customAttributes: product.customAttributes ?? undefined,
      status: product.status,
      availability: product.availability,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      seoTitle: `${product.name} | AWWALSHOP`,
      seoDescription: product.shortDescription,
      seoImage: product.images[0]?.url,
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...sharedData,
        media: { deleteMany: {}, create: media },
        variants: { deleteMany: {}, create: variants },
        collections: { deleteMany: {}, create: collections },
      },
      create: {
        ...sharedData,
        slug: product.slug,
        media: { create: media },
        variants: { create: variants },
        collections: { create: collections },
      },
    })
  }

  console.log(`  ✓ ${productData.length} products seeded`)
}

async function seedBusinessSettings() {
  const existing = await prisma.businessSettings.findFirst()

  const data = {
    businessName: 'AWWALSHOP',
    tagline: 'Elegance in Every Detail.',
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+2348000000000',
    whatsappMessage:
      'Hello Awwalshop, I am interested in ordering: Product: {productName} Price: {price} {variants}Quantity: {quantity} Product link: {productUrl} Please provide more information about availability and delivery.',
    contactPhone: '+234 800 000 0000',
    email: 'concierge@awwalshop.com',
    address: 'Victoria Island, Lagos, Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    socialLinks: {
      instagram: 'https://instagram.com/awwalshop',
      facebook: 'https://facebook.com/awwalshop',
      twitter: 'https://x.com/awwalshop',
    },
    deliveryInfo:
      'Complimentary insured delivery within Nigeria. Worldwide shipping available and quoted at checkout.',
    processingInfo:
      'Ready-to-wear pieces ship within 3–5 working days. Made-to-order and bespoke pieces are crafted in 10–28 working days.',
    openingHours: {
      weekdays: '9:00 AM – 6:00 PM',
      saturday: '10:00 AM – 4:00 PM',
      sunday: 'Closed',
    },
    seoTitle: 'AWWALSHOP — Elegance in Every Detail',
    seoDescription:
      'Discover premium jewellery, bespoke native attire, timepieces and lifestyle products at AWWALSHOP. Modern African Luxury.',
  }

  if (existing) {
    await prisma.businessSettings.update({ where: { id: existing.id }, data })
  } else {
    await prisma.businessSettings.create({ data })
  }

  console.log('  ✓ Business settings seeded')
}

async function seedTestimonials() {
  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { customerName: testimonial.customerName },
    })
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: testimonial })
    } else {
      await prisma.testimonial.create({ data: testimonial })
    }
  }
  console.log(`  ✓ ${testimonials.length} testimonials seeded`)
}

async function seedFaqs() {
  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } })
    if (existing) {
      await prisma.faq.update({
        where: { id: existing.id },
        data: { ...faq, isPublished: true },
      })
    } else {
      await prisma.faq.create({ data: { ...faq, isPublished: true } })
    }
  }
  console.log(`  ✓ ${faqs.length} FAQs seeded`)
}

async function seedNavigation() {
  await prisma.navigationItem.deleteMany({
    where: { label: { notIn: navigationItems.map((item) => item.label) } },
  })

  for (const item of navigationItems) {
    // Match on label so seed changes (like a corrected destination) update the
    // existing link instead of creating a duplicate.
    const existing = await prisma.navigationItem.findFirst({
      where: { label: item.label },
    })
    if (existing) {
      await prisma.navigationItem.update({
        where: { id: existing.id },
        data: { ...item, isVisible: true },
      })
    } else {
      await prisma.navigationItem.create({ data: { ...item, isVisible: true } })
    }
  }
  console.log(`  ✓ ${navigationItems.length} navigation items seeded`)
}

async function seedWebsiteContent() {
  for (const content of websiteContent) {
    await prisma.websiteContent.upsert({
      where: { section_key: { section: content.section, key: content.key } },
      update: { value: content.value, type: content.type },
      create: content,
    })
  }
  console.log(`  ✓ ${websiteContent.length} homepage content blocks seeded`)
}

async function main() {
  console.log('\n▸ Seeding AWWALSHOP database…\n')

  const admin = await seedAdmin()
  const categoryIds = await seedCategories()
  const collectionIds = await seedCollections()
  await seedProducts(categoryIds, collectionIds)
  await seedBusinessSettings()
  await seedTestimonials()
  await seedFaqs()
  await seedNavigation()
  await seedWebsiteContent()

  await prisma.adminActivity.create({
    data: {
      adminId: admin.id,
      action: 'SEED',
      entityType: 'Database',
      description: 'Initial catalogue, CMS content and business settings seeded.',
    },
  })

  console.log('\n✓ Seed complete.\n')
  console.log(`  Admin login: ${admin.email}`)
  console.log('  Password:    (value of ADMIN_PASSWORD in .env.local)\n')
}

main()
  .catch((error) => {
    console.error('\n✗ Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
