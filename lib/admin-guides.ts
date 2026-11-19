/**
 * Typed, authored help content for the admin help centre.
 *
 * Kept as plain data (not database content) so the help centre never depends on
 * the CMS editors and adding a new guide is just adding an object to the array.
 * All fields are serialisable so they can be passed into the client UI.
 */

export type AdminGuideIcon =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'collections'
  | 'media'
  | 'settings'
  | 'whatsapp'
  | 'storefront'
  | 'help'

export interface AdminGuideStep {
  title: string
  paragraphs: string[]
  /** Optional deep link to the screen this step talks about. */
  href?: string
  hrefLabel?: string
  /** Opens the deep link in a new tab (used for storefront links). */
  external?: boolean
}

export interface AdminGuide {
  slug: string
  title: string
  category: string
  summary: string
  icon: AdminGuideIcon
  keywords: string[]
  intro: string
  steps: AdminGuideStep[]
  tips?: string[]
  /** Slugs of related guides, shown at the end of the article. */
  related?: string[]
}

export const defaultAdminGuideSlug = 'getting-started'

export const adminGuides: AdminGuide[] = [
  {
    slug: 'getting-started',
    title: 'Getting started with your admin',
    category: 'Basics',
    summary:
      'Learn your way around the dashboard, understand Draft vs Published, and follow the basic workflow for keeping your catalogue up to date.',
    icon: 'dashboard',
    keywords: [
      'start',
      'overview',
      'dashboard',
      'navigation',
      'first time',
      'onboarding',
      'publish',
      'workflow',
    ],
    intro:
      'This is your control room. Everything you change here feeds the public storefront, so a few minutes getting familiar with the layout will save you time later.',
    steps: [
      {
        title: 'Find your way around',
        paragraphs: [
          'The top bar shows the section you are in and gives you quick links to Products, Categories, Collections, Media, Settings and Help. On a phone, tap the menu button to open the same navigation as a drawer.',
          'The dashboard shows how many products are live, how many are still drafts, your categories and collections, plus a short audit trail of recent changes.',
        ],
        href: '/admin',
        hrefLabel: 'Go to dashboard',
      },
      {
        title: 'Understand Draft vs Published',
        paragraphs: [
          'A Draft product is saved but hidden from customers. A Published product is visible on the storefront. New products start as Drafts, so you can prepare them fully before making them live.',
          'Use the status filter on the Products page to see only live or only draft pieces. Changing the Status field in a product and saving is what makes it live.',
        ],
        href: '/admin/products',
        hrefLabel: 'Go to products',
      },
      {
        title: 'Set up the essentials first',
        paragraphs: [
          'Before adding lots of products, open Settings and confirm your business name, WhatsApp number, currency and social links. These details appear across the storefront and in every order message.',
          'Next, create the categories you sell from (for example Fine Jewellery or Kaftans). Products are easier to manage and filter once categories exist.',
        ],
        href: '/admin/settings',
        hrefLabel: 'Go to settings',
      },
      {
        title: 'Follow the everyday workflow',
        paragraphs: [
          'Add media, add categories and collections, create a product, check that it looks right on the storefront, then publish it. When something changes later — a price, a photo, an availability update — edit the same product and save again.',
          'If you ever get stuck on a screen, use the “How do I…?” link in that page header, or open Help from the navigation at any time.',
        ],
        href: '/admin/products/new',
        hrefLabel: 'Create your first product',
      },
    ],
    tips: [
      'Changes are saved by the Save button on each form — there is no autosave.',
      'The Storefront link in the top bar opens the public site in a new tab so you can compare while you work.',
    ],
    related: ['products', 'settings', 'storefront'],
  },
  {
    slug: 'products',
    title: 'Products: add, edit and publish',
    category: 'Catalogue',
    summary:
      'Create a product, set prices and variants, attach media, choose its category and collections, and control whether customers can see it.',
    icon: 'products',
    keywords: [
      'product',
      'create',
      'add',
      'edit',
      'price',
      'discount',
      'sku',
      'publish',
      'duplicate',
      'delete',
      'unpublish',
      'variant',
      'seo',
    ],
    intro:
      'Products are the heart of your catalogue. Each product holds its own copy, pricing, photos, options and visibility settings.',
    steps: [
      {
        title: 'Open the products list',
        paragraphs: [
          'Go to Products from the navigation. You can search by name, SKU or description and filter by status or category. Use the All / Published / Draft tabs to switch views, and the page controls at the bottom if your catalogue is long.',
        ],
        href: '/admin/products',
        hrefLabel: 'Go to products',
      },
      {
        title: 'Start a new product',
        paragraphs: [
          'Click “New product”. Enter a clear product name and a URL-friendly slug (the slug becomes part of the public link). Add a SKU if you use internal references, a short summary for catalogue cards and the full description for the detail page.',
          'Choose the category, set availability (Available, Made to order, Out of stock, Coming soon or Discontinued), then fill in the regular price and an optional discount price. The discounted price is the one customers see.',
        ],
        href: '/admin/products/new',
        hrefLabel: 'Create a product',
      },
      {
        title: 'Add photos and video',
        paragraphs: [
          'In the Media section, upload images or videos with the uploader, or paste an external image, MP4, YouTube or Vimeo URL. Add alt text so customers using screen readers know what the image shows, and a caption where useful.',
          'Select the Primary radio on the image you want as the main catalogue thumbnail. The Media guide has the full details.',
        ],
        href: '/admin/media',
        hrefLabel: 'Read the media guide',
      },
      {
        title: 'Add details, variants and collections',
        paragraphs: [
          'Use Details rows for specifications such as Stone, Metal or Dimensions — each row is a label and a value shown on the product page.',
          'Use Variants when customers must choose an option, for example Ring size or Finish. Each variant has a name, value, optional price adjustment and its own availability. Tick the collections this piece belongs to so it appears in curated edits.',
        ],
      },
      {
        title: 'Publish when it is ready',
        paragraphs: [
          'Leave Status as Draft while you are still working. When the copy, price and media look right, change Status to “Published — live on storefront” and save. To take something down without deleting it, switch it back to Draft.',
          'Featured and New arrival checkboxes highlight the piece on the catalogue. SEO title, description and image control how the product appears in search results and link previews.',
        ],
      },
      {
        title: 'Edit, duplicate or remove later',
        paragraphs: [
          'Click a product name in the list to open its editor and change any field. The actions menu on each row lets you publish, unpublish, toggle featured status, duplicate the product or delete it. Deleting cannot be undone, so duplicate first if you are unsure.',
        ],
        href: '/admin/products',
        hrefLabel: 'Back to products',
      },
    ],
    tips: [
      'A product with no category or no primary image can still be saved, but it will look incomplete on the storefront.',
      'Duplicate a similar product when launching a new colour or size — then change only the fields that differ.',
    ],
    related: ['media', 'categories', 'collections', 'whatsapp-ordering'],
  },
  {
    slug: 'categories',
    title: 'Categories and subcategories',
    category: 'Catalogue',
    summary:
      'Organise your catalogue into categories, nest subcategories, control visibility and arrange the order customers see.',
    icon: 'categories',
    keywords: [
      'category',
      'subcategory',
      'parent',
      'visible',
      'visibility',
      'sort order',
      'banner',
      'taxonomy',
    ],
    intro:
      'Categories are the main way customers browse the shop. You can keep them flat or nest a child category under a parent — for example Jewellery → Rings.',
    steps: [
      {
        title: 'Create a category',
        paragraphs: [
          'Open Categories and click “New category”. Give it a name and a slug, write a short description that appears at the top of the category page, and optionally paste a banner image URL.',
          'Choose a Parent category only if this should appear as a subcategory. Set the sort order — lower numbers appear first — and leave “Visible” enabled if customers should see it.',
        ],
        href: '/admin/categories/new',
        hrefLabel: 'Add a category',
      },
      {
        title: 'Edit or hide a category',
        paragraphs: [
          'Click a category name to edit its details. The row actions let you hide or show it, and delete it when it is no longer needed. Hiding a category keeps it in your admin data but removes it from storefront browsing.',
        ],
        href: '/admin/categories',
        hrefLabel: 'Go to categories',
      },
      {
        title: 'Put products in a category',
        paragraphs: [
          'Categories do not contain products directly — each product selects its category. Open a product, choose the category in the Category field and save. Products then appear under that category in the shop filters.',
        ],
        href: '/admin/products',
        hrefLabel: 'Go to products',
      },
    ],
    tips: [
      'Use short, familiar category names so customers can scan the shop quickly.',
      'If a category looks empty on the storefront, check both that it is Visible and that its products are Published.',
    ],
    related: ['products', 'storefront'],
  },
  {
    slug: 'collections',
    title: 'Curated collections',
    category: 'Merchandising',
    summary:
      'Group products into themed edits such as New Arrivals or Signature Luxury, and place them on the storefront.',
    icon: 'collections',
    keywords: [
      'collection',
      'curate',
      'edit',
      'banner',
      'visible',
      'sort order',
      'merchandising',
    ],
    intro:
      'Collections are editorial groups that cut across categories — ideal for seasonal edits, gift guides or a signature range.',
    steps: [
      {
        title: 'Create a collection',
        paragraphs: [
          'Open Collections and click “New collection”. Add a name, slug and short description, and optionally a banner image URL. Set the sort order to control where it appears among other collections, and keep it Visible when it should be live.',
        ],
        href: '/admin/collections/new',
        hrefLabel: 'Add a collection',
      },
      {
        title: 'Add products to it',
        paragraphs: [
          'Open any product in the product editor and tick this collection in the Collections section, then save. A product can belong to more than one collection.',
        ],
        href: '/admin/products',
        hrefLabel: 'Go to products',
      },
      {
        title: 'Review and manage the collection',
        paragraphs: [
          'Open a collection to see how many products it contains and to change its details. Row actions let you hide, show or delete it. Check the storefront collections area to see the edit as customers will.',
        ],
        href: '/admin/collections',
        hrefLabel: 'Go to collections',
      },
    ],
    tips: [
      'Keep collection names short and evocative — they work like shelf labels in a physical store.',
      'A hidden collection stays in the admin but disappears from the storefront.',
    ],
    related: ['products', 'storefront'],
  },
  {
    slug: 'media',
    title: 'Photos, video and the media library',
    category: 'Assets',
    summary:
      'Upload images and video, paste external media links, choose a primary image and keep your product gallery looking its best.',
    icon: 'media',
    keywords: [
      'media',
      'image',
      'photo',
      'video',
      'upload',
      'supabase',
      'youtube',
      'vimeo',
      'alt text',
      'primary',
      'gallery',
    ],
    intro:
      'You can host media in the admin or link to media that lives elsewhere. Both work anywhere a product gallery is shown.',
    steps: [
      {
        title: 'Upload from your device',
        paragraphs: [
          'Open the Media page to see the shared media library and use the uploader to drag and drop files or browse your device. Uploads are stored in Supabase Storage and show progress and a status message when they finish. The limits are 10 MB per image and 100 MB per video.',
        ],
        href: '/admin/media',
        hrefLabel: 'Go to media library',
      },
      {
        title: 'Use external links',
        paragraphs: [
          'In a product’s Media section you can paste a direct image or MP4 URL, or a YouTube or Vimeo link. The app detects the source and shows the right player or image automatically — useful for large video files.',
        ],
        href: '/admin/products',
        hrefLabel: 'Open a product',
      },
      {
        title: 'Set the main image and descriptions',
        paragraphs: [
          'Choose the Primary radio on the image customers should see first in the catalogue. Add alt text describing what the image shows and a caption if it adds helpful context. For uploaded videos you can paste a poster image URL to show a preview before playback. Save the product to apply the changes.',
        ],
      },
      {
        title: 'Know the current limits',
        paragraphs: [
          'Media order currently follows the order of the entries in the product form; drag-and-drop reordering is not available yet. To rearrange images today, adjust their order in the form and save.',
        ],
      },
    ],
    tips: [
      'Use bright, consistent, square-ish images — they crop best on catalogue cards.',
      'If an upload is rejected, check the file type and size first, then try an external image URL.',
    ],
    related: ['products', 'storefront'],
  },
  {
    slug: 'settings',
    title: 'Business settings',
    category: 'Configuration',
    summary:
      'Update your business identity, contact details, WhatsApp number and message, currency, delivery information, social links and SEO.',
    icon: 'settings',
    keywords: [
      'settings',
      'business',
      'name',
      'tagline',
      'whatsapp',
      'phone',
      'email',
      'address',
      'hours',
      'currency',
      'delivery',
      'social',
      'seo',
    ],
    intro:
      'Settings are global: save a change here and it is used across the whole storefront and in every WhatsApp order message.',
    steps: [
      {
        title: 'Update your business details',
        paragraphs: [
          'Open Settings and check the business name and tagline, contact phone, email, showroom address and opening hours. These appear in the storefront header, footer and contact information.',
        ],
        href: '/admin/settings',
        hrefLabel: 'Go to settings',
      },
      {
        title: 'Set the WhatsApp number and message',
        paragraphs: [
          'Enter the WhatsApp number your customers should reach, including the country code, and edit the default inquiry message. The message supports placeholders such as {productName}, {price}, {variants}, {quantity} and {productUrl} — leave them in place so orders arrive with the right details.',
          'See the WhatsApp ordering guide for a full walkthrough.',
        ],
      },
      {
        title: 'Choose currency and service information',
        paragraphs: [
          'Select the currency code (NGN, USD, GBP or EUR) and the symbol shown with prices. Add delivery and processing information so customers know what to expect before they inquire.',
        ],
      },
      {
        title: 'Add social links and SEO',
        paragraphs: [
          'Paste full profile URLs for Instagram, Facebook, X, TikTok and YouTube to show them in the footer. The default SEO title and description shape how the site appears in search results and shared previews.',
          'Click Save changes. Every save is recorded in the dashboard activity log.',
        ],
      },
    ],
    tips: [
      'Use a WhatsApp Business number that is monitored during your opening hours.',
      'If you change currency, review product prices too — prices are stored as numbers, not converted automatically.',
    ],
    related: ['whatsapp-ordering', 'storefront'],
  },
  {
    slug: 'whatsapp-ordering',
    title: 'How WhatsApp ordering works',
    category: 'Orders',
    summary:
      'Understand the order button on product pages, edit the prefilled message and make sure every inquiry reaches the right number.',
    icon: 'whatsapp',
    keywords: [
      'whatsapp',
      'order',
      'ordering',
      'message',
      'template',
      'placeholder',
      'inquiry',
      'number',
      'checkout',
    ],
    intro:
      'Awwalshop is a catalogue, not an online checkout. Customers build their order on a product page and send it to you on WhatsApp.',
    steps: [
      {
        title: 'See what the customer sees',
        paragraphs: [
          'On a published product page, the customer picks a variant and quantity and taps the WhatsApp order button. The app opens WhatsApp with a prefilled message containing the product name, price, selected variants, quantity and a link back to the product.',
        ],
        href: '/shop',
        hrefLabel: 'View the storefront',
        external: true,
      },
      {
        title: 'Edit the message template',
        paragraphs: [
          'Open Settings and find the WhatsApp message field. Keep the placeholders exactly as written — {productName}, {price}, {variants}, {quantity} and {productUrl} — and write your own wording around them. You can add a greeting or a note about delivery.',
        ],
        href: '/admin/settings',
        hrefLabel: 'Edit the message',
      },
      {
        title: 'Check the destination number',
        paragraphs: [
          'The WhatsApp number in Settings must include the country code. Save the settings, then open a product on the storefront and tap the order button to confirm the message opens in the right chat with the correct details.',
        ],
      },
    ],
    tips: [
      'Text you type outside the placeholders is sent as-is, so proofread before saving.',
      'If a variant price changes, update the product — the message recalculates from the saved product data.',
    ],
    related: ['products', 'settings'],
  },
  {
    slug: 'storefront',
    title: 'What customers see on the storefront',
    category: 'Storefront',
    summary:
      'Preview the public site and understand which admin settings control the homepage, catalogue, filters and product pages.',
    icon: 'storefront',
    keywords: [
      'storefront',
      'shop',
      'preview',
      'homepage',
      'catalogue',
      'filter',
      'search',
      'public',
      'customer',
    ],
    intro:
      'The storefront is the public face of everything you maintain in the admin. Preview it often — it is the quickest way to catch a missing image or a price that looks wrong.',
    steps: [
      {
        title: 'Open the public site',
        paragraphs: [
          'Use the Storefront button in the top bar (or “View storefront” in the navigation drawer). It opens the public shop in a new tab so you can keep the admin open alongside it.',
        ],
        href: '/shop',
        hrefLabel: 'Open the shop',
        external: true,
      },
      {
        title: 'Know what is live',
        paragraphs: [
          'Published products appear in the catalogue and searches. Visible categories and collections become browse filters and curated edits. Your Settings control the business name, tagline, currency, contact details, social links and SEO metadata.',
          'Some homepage copy and promotional content are still being moved into the admin editors; until then those areas are managed in code.',
        ],
      },
      {
        title: 'Check the customer journey',
        paragraphs: [
          'From the shop, try searching, filtering by category or collection, and opening a product. Check its gallery, specifications, variants and WhatsApp button. If something is missing, go back to the matching admin screen: products, categories, collections or settings.',
        ],
        href: '/admin/products',
        hrefLabel: 'Review products',
      },
    ],
    tips: [
      'After publishing changes, refresh the storefront tab — an old tab may still show cached content.',
      'Preview on a phone width too; most customers will browse on mobile.',
    ],
    related: ['products', 'settings', 'getting-started'],
  },
  {
    slug: 'troubleshooting',
    title: 'Common problems and quick fixes',
    category: 'Help',
    summary:
      'A product not showing, media not uploading, prices or WhatsApp messages looking wrong — start here for the usual causes.',
    icon: 'help',
    keywords: [
      'troubleshoot',
      'problem',
      'fix',
      'not showing',
      'missing',
      'upload failed',
      'wrong price',
      'blank',
      'error',
    ],
    intro:
      'Most admin issues come down to a status switch, a missing save or a setting that needs checking. Work through the relevant item below.',
    steps: [
      {
        title: 'My product is not on the storefront',
        paragraphs: [
          'Check the product Status is Published and click Save. Then confirm its category is Visible and that you refreshed the storefront tab. Draft products are intentionally hidden from customers.',
        ],
        href: '/admin/products',
        hrefLabel: 'Go to products',
      },
      {
        title: 'My upload failed or the image is missing',
        paragraphs: [
          'Check the file size (10 MB for images, 100 MB for videos) and that it is a supported image or video type. If it still fails, paste an external image, MP4, YouTube or Vimeo URL in the product Media section instead.',
        ],
        href: '/admin/media',
        hrefLabel: 'Go to media library',
      },
      {
        title: 'Prices or currency look wrong',
        paragraphs: [
          'Prices are stored as numbers and displayed with the currency symbol from Settings. If the symbol is wrong, update the currency and symbol there; if the amount is wrong, edit the product price and discount price.',
        ],
        href: '/admin/settings',
        hrefLabel: 'Go to settings',
      },
      {
        title: 'The WhatsApp message is wrong',
        paragraphs: [
          'Open Settings and make sure the message still contains all five placeholders and that the number includes the country code. Save, then test again from a product page on the storefront.',
        ],
        href: '/admin/settings',
        hrefLabel: 'Check WhatsApp settings',
      },
    ],
    tips: [
      'Always click Save on a form before navigating away — there is no autosave.',
      'The dashboard Recent activity list is useful for confirming a change was actually recorded.',
    ],
    related: ['products', 'media', 'settings', 'whatsapp-ordering'],
  },
]

export function getAdminGuide(slug?: string | null): AdminGuide | undefined {
  if (!slug) return undefined
  return adminGuides.find((guide) => guide.slug === slug)
}

/** Client-side search across titles, summaries, keywords and step content. */
export function searchAdminGuides(guides: AdminGuide[], query: string): AdminGuide[] {
  const term = query.trim().toLowerCase()
  if (!term) return guides

  return guides.filter((guide) => {
    const haystack = [
      guide.title,
      guide.category,
      guide.summary,
      guide.intro,
      ...guide.keywords,
      ...guide.steps.flatMap((step) => [step.title, ...step.paragraphs]),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(term)
  })
}
