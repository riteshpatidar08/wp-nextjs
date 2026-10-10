import { useEffect, useState } from 'react'
import { API_URL } from '../lib/config'
import Hero from './Hero'
import FeaturedGrid from './FeaturedGrid'
import Reviews from './Reviews'
import Catalog from './Catalog'

// SLOW ON PURPOSE (LCP): products are fetched in the browser,
// and only AFTER the user request has finished (because this component
// only mounts after <App /> has the user).
export default function Store() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then(setData)
  }, [])

  if (!data) return <p className="muted">Loading products…</p>

  return (
    <>
      <Hero hero={data.hero} />
      <FeaturedGrid products={data.featured} />
      <Reviews />
      <Catalog items={data.catalog} />
    </>
  )
}
