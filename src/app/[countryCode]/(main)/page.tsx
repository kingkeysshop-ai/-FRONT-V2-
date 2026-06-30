import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import TrustBadges from "@modules/home/components/trust-badges"
import WhyUs from "@modules/home/components/why-us"
import CategoriesSection from "@modules/home/components/categories-section"
import CtaBanner from "@modules/home/components/cta-banner"
import StatsTerminal from "@components/StatsTerminal"
import NewsletterSignup from "@components/NewsletterSignup"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "KING KEYS - Claves Digitales al Instante",
  description:
    "Licencias originales para Windows, Office, antivirus y gaming. Activación inmediata, precio sin competencia.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <TrustBadges />
      <StatsTerminal />
      <WhyUs />
      <CategoriesSection />
      <FeaturedProducts collections={collections} region={region} />
      <CtaBanner />
      <NewsletterSignup />
    </>
  )
}
