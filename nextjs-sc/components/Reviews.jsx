import { useEffect, useState } from 'react'
import { API_URL } from '../lib/config'

// SLOW ON PURPOSE: reviews are fetched only after products have loaded
// (third step of the waterfall), and the section has no reserved height,
// so everything below it jumps when the reviews arrive (CLS).
export default function Reviews() {
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/reviews`)
      .then((res) => res.json())
      .then(setReviews)
  }, [])

  return (
    <section className="section">
      <h2>What customers say</h2>
      {!reviews ? (
        <p className="muted">Loading reviews…</p>
      ) : (
        <div className="reviews">
          {reviews.map((review) => (
            <article key={review.id} className="review">
              <span className="stars">{'★'.repeat(review.rating)}</span> {review.author}
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
