import PageHeader from '@/components/admin/PageHeader'
import HelpCentre from '@/components/admin/HelpCentre'
import {
  adminGuides,
  defaultAdminGuideSlug,
  getAdminGuide,
} from '@/lib/admin-guides'

interface HelpPageProps {
  searchParams: Promise<{
    guide?: string | string[]
  }>
}

export default async function AdminHelpPage({ searchParams }: HelpPageProps) {
  const { guide } = await searchParams
  const requestedSlug = Array.isArray(guide) ? guide[0] : guide
  const selected =
    getAdminGuide(requestedSlug) ??
    getAdminGuide(defaultAdminGuideSlug) ??
    adminGuides[0]

  return (
    <div>
      <PageHeader
        eyebrow="Support"
        title="Help centre"
        description="Step-by-step guides for running your store. Search a topic, then follow the steps — each one links straight to the screen you need."
      />
      <HelpCentre guides={adminGuides} selectedSlug={selected.slug} />
    </div>
  )
}
