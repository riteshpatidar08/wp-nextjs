import { getReviews } from '../lib/data'

// Step 5: fetched on the server, at the same time as everything else (no waterfall).
// Step 6: page.jsx wraps this in <Suspense>, so the rest of the page does not wait for it.
export default async function Reviews() {
  const reviews = await getReviews()

  return (
    <section className="section">
      <h2>What customers say</h2>
      <div className="reviews">
        {reviews.map((review) => (
          <article key={review.id} className="review">
            <span className="stars">{'★'.repeat(review.rating)}</span> {review.author}
            <p>{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
