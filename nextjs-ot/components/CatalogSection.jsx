import { getProducts } from '../lib/data'
import CatalogSearch from './CatalogSearch'

const dateFormat = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })

// Step 8 (INP): the heavy, one-time work now happens on the SERVER:
// sorting 5,000 products and formatting prices and dates.
// The browser receives a ready-made list and only has to filter it.
// (We also dropped the "x days ago" text per row: 5,000 extra date sums for little value.)
export default async function CatalogSection() {
  const { catalog } = await getProducts()

  const rows = [...catalog]
    .sort((a, b) => b.rating - a.rating || a.price - b.price)
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: `₹${item.price.toLocaleString('en-IN')}`,
      added: dateFormat.format(new Date(item.addedOn)),
      rating: item.rating,
    }))

  return <CatalogSearch rows={rows} />
}
