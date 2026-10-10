import { Suspense } from 'react'
import PromoBanner from '../components/PromoBanner'
import Header from '../components/Header'
import Hero from '../components/Hero'
import FeaturedGrid from '../components/FeaturedGrid'
import Reviews from '../components/Reviews'
import CatalogSection from '../components/CatalogSection'
import { ReviewsSkeleton } from '../components/Skeletons'

// Step 5: this page is now a SERVER component (no 'use client').
// The server fetches the data and sends finished HTML.
export default function Page() {
  return (
    <>
      <PromoBanner />
      <Header />
      <main className="container">
        <Hero />
        <FeaturedGrid />
        {/* Step 6: the slow reviews stream in later; everything else shows right away */}
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews />
        </Suspense>
        <CatalogSection />
      </main>
    </>
  )
}
