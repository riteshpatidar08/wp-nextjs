import { useState } from 'react'
import _ from 'lodash'
import moment from 'moment'

// SLOW ON PURPOSE (INP): on EVERY key press this component
// 1. runs a typo-tolerant "fuzzy" match on all 5,000 products,
// 2. sorts the whole list with lodash,
// 3. formats every date twice with moment,
// 4. draws ALL matching rows (up to 5,000) on the screen.
export default function Catalog({ items }) {
  const [query, setQuery] = useState('')

  const matches = items.filter((item) => fuzzyMatch(item.name, query) || fuzzyMatch(item.category, query))
  const results = _.orderBy(matches, ['rating', 'price'], ['desc', 'asc'])

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
      <table>
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
          {results.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>₹{item.price.toLocaleString('en-IN')}</td>
              <td>
                {moment(item.addedOn).format('DD MMM YYYY')} ({moment(item.addedOn).fromNow()})
              </td>
              <td>{item.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// Matches if any word is within one typo of the search text
function fuzzyMatch(text, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const value = text.toLowerCase()
  if (value.includes(q)) return true
  return value.split(' ').some((word) => editDistance(word, q) <= 1)
}

function editDistance(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (row, i) => [i])
  for (let j = 1; j <= b.length; j++) rows[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return rows[a.length][b.length]
}
