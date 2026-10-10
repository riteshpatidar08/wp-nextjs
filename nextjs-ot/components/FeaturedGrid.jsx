import Image from 'next/image'
import { getProducts } from '../lib/data'

// Step 4: small cards get small images (about 200-400px instead of 2400px),
// and they only download when the visitor scrolls near them (lazy loading is the default).
export default async function FeaturedGrid() {
  const { featured } = await getProducts()

  return (
    <section className="section">
      <h2>Featured</h2>
      <div className="grid">
        {featured.map((product) => (
          <article key={product.id} className="card">
            <Image
              src={product.image}
              alt={product.name}
              width={product.width}
              height={product.height}
              sizes="(max-width: 600px) 50vw, 200px"
              className="card-img"
            />
            <h3>{product.name}</h3>
            <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
