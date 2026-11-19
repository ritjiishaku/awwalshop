'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Lightbulb,
  MessageCircle,
  Package,
  Search,
  Settings,
  Sparkles,
  Store,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { searchAdminGuides } from '@/lib/admin-guides'
import type { AdminGuide, AdminGuideIcon } from '@/lib/admin-guides'

const guideIcons: Record<AdminGuideIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  products: Package,
  categories: Layers,
  collections: Sparkles,
  media: ImageIcon,
  settings: Settings,
  whatsapp: MessageCircle,
  storefront: Store,
  help: BookOpen,
}

interface HelpCentreProps {
  guides: AdminGuide[]
  selectedSlug: string
}

export default function HelpCentre({ guides, selectedSlug }: HelpCentreProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeSlug, setActiveSlug] = useState(selectedSlug)

  // Keep the article in sync when the URL changes (deep links, back/forward).
  useEffect(() => {
    setActiveSlug(selectedSlug)
  }, [selectedSlug])

  const filteredGuides = useMemo(
    () => searchAdminGuides(guides, query),
    [guides, query]
  )

  const activeGuide = guides.find((guide) => guide.slug === activeSlug) ?? guides[0]

  function selectGuide(slug: string) {
    setActiveSlug(slug)
    router.push(`/admin/help?guide=${encodeURIComponent(slug)}`)
  }

  const ActiveIcon = guideIcons[activeGuide.icon]

  return (
    <div className="aw-help-layout">
      <aside className="aw-help-sidebar surface" aria-label="Help topics">
        <div className="aw-help-search-wrap">
          <Search size={15} aria-hidden="true" className="aw-help-search-icon" />
          <label htmlFor="aw-help-search" className="sr-only">
            Search help guides
          </label>
          <input
            id="aw-help-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search help guides…"
            className="aw-help-search"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="aw-help-search-clear"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <p className="aw-help-list-label" aria-live="polite">
          {filteredGuides.length}{' '}
          {filteredGuides.length === 1 ? 'guide' : 'guides'}
          {query ? ' found' : ''}
        </p>

        {filteredGuides.length === 0 ? (
          <div className="aw-help-empty">
            <BookOpen size={20} />
            <p>No guides match “{query}”.</p>
            <button type="button" onClick={() => setQuery('')}>
              Show all guides
            </button>
          </div>
        ) : (
          <nav className="aw-help-list" aria-label="Guides">
            {filteredGuides.map((guide) => {
              const Icon = guideIcons[guide.icon]
              const isActive = guide.slug === activeGuide.slug
              return (
                <button
                  key={guide.slug}
                  type="button"
                  onClick={() => selectGuide(guide.slug)}
                  aria-current={isActive ? 'page' : undefined}
                  className="aw-help-list-item"
                >
                  <span className="aw-help-list-icon">
                    <Icon size={15} strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="aw-help-list-title">{guide.title}</span>
                    <span className="aw-help-list-summary">{guide.summary}</span>
                  </span>
                </button>
              )
            })}
          </nav>
        )}
      </aside>

      <article className="aw-help-article surface" aria-live="polite">
        <header className="aw-help-article-head">
          <div className="flex items-center gap-2">
            <span className="aw-help-article-icon">
              <ActiveIcon size={17} strokeWidth={1.8} />
            </span>
            <span className="aw-help-category">{activeGuide.category}</span>
          </div>
          <h2 className="aw-help-article-title">{activeGuide.title}</h2>
          <p className="aw-help-article-summary">{activeGuide.summary}</p>
        </header>

        <p className="aw-help-intro">{activeGuide.intro}</p>

        <ol className="aw-help-steps">
          {activeGuide.steps.map((step, index) => (
            <li key={step.title} className="aw-help-step">
              <span className="aw-help-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="aw-help-step-title">{step.title}</h3>
                {step.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="aw-help-step-text">
                    {paragraph}
                  </p>
                ))}
                {step.href && (
                  <Link
                    href={step.href}
                    target={step.external ? '_blank' : undefined}
                    rel={step.external ? 'noopener noreferrer' : undefined}
                    className="aw-help-go"
                  >
                    {step.hrefLabel || 'Go to page'}
                    <ArrowUpRight size={13} />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>

        {activeGuide.tips && activeGuide.tips.length > 0 && (
          <aside className="aw-help-tips">
            <div className="flex items-center gap-2">
              <Lightbulb size={15} />
              <h3>Good to know</h3>
            </div>
            <ul>
              {activeGuide.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </aside>
        )}

        {activeGuide.related && activeGuide.related.length > 0 && (
          <footer className="aw-help-related">
            <p className="aw-help-related-label">Related guides</p>
            <div className="aw-help-related-links">
              {activeGuide.related.map((slug) => {
                const related = guides.find((guide) => guide.slug === slug)
                if (!related) return null
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => selectGuide(slug)}
                    className="aw-help-related-link"
                  >
                    {related.title}
                    <ArrowUpRight size={12} />
                  </button>
                )
              })}
            </div>
          </footer>
        )}
      </article>
    </div>
  )
}
