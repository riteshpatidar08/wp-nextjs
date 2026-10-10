// Step 6: grey boxes shown while slow parts stream in.
// They are about the same size as the real content, so nothing jumps (CLS).
export function ReviewsSkeleton() {
  return (
    <section className="section" aria-busy="true">
      <h2>What customers say</h2>
      <div className="reviews">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton review-skeleton" />
        ))}
      </div>
    </section>
  )
}
