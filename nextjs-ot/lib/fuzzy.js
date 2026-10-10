// Same typo-tolerant search as the slow version (kept so the comparison is fair).
// Matches if the text contains the query, or any word is within one typo of it.
export function fuzzyMatch(text, query) {
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
