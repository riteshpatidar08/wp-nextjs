// SLOW ON PURPOSE: six 2400px images (~1.7 MB each) shown as small cards,
// all downloaded straight away, with no size reserved.
export default function FeaturedGrid({ products }) {
  return (
    <section className="section">
      <h2>Featured</h2>
      <div className="grid">
        {products.map((product) => (
          <article key={product.id} className="card">
            <img src={product.image} alt={product.name} className="card-img" />
            <h3>{product.name}</h3>
            <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
