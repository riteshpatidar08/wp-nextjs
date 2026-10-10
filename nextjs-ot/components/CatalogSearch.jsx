'use client'
// This is the ONLY part of the page that needs to run in the browser: the search box.

import { useDeferredValue, useMemo, useState } from 'react'
import { fuzzyMatch } from '../lib/fuzzy'

const SHOW = 50

// Step 8 (INP):
// - useDeferredValue: the letter you type appears instantly; the list updates
//   a moment later in the background, without freezing the input
// - only the first 50 matches are drawn, instead of up to 5,000 table rows
// - no lodash and no moment in the browser any more
export default function CatalogSearch({ rows }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(
    () => rows.filter((row) => fuzzyMatch(row.name, deferredQuery) || fuzzyMatch(row.category, deferredQuery)),
    [rows, deferredQuery]
  )

  return (
    <section className="section">
      <h2>All products ({results.length.toLocaleString('en-IN')})</h2>
      <input
        className="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search 5,000 products… try typing “kurta”"
        aria-label="Search products"
      />
      <table style={{ opacity: query !== deferredQuery ? 0.6 : 1 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Added</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {results.slice(0, SHOW).map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.category}</td>
              <td>{row.price}</td>
              <td>{row.added}</td>
              <td>{row.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length > SHOW && (
        <p className="muted">
          Showing the top {SHOW} of {results.length.toLocaleString('en-IN')}. Type more to narrow it down.
        </p>
      )}
    </section>
  )
}
