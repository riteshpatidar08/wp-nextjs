import { cacheLife, cacheTag } from 'next/cache'
import { connection } from 'next/server'
import { API_URL } from './config'

// Step 5: data is fetched on the server, close to the API, not in the browser.

// Step 7: products are the same for every visitor, so we remember the answer.
// The first request (or the build) calls the API; later visitors get the saved copy instantly.
export async function getProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  const res = await fetch(`${API_URL}/api/products`)
  if (!res.ok) throw new Error('Could not load products. Is the mock API running?')
  return res.json()
}

// The user is different for every visitor, so it is fetched fresh on each request.
// connection() tells Next.js: "wait for a real visitor before running this".
export async function getUser() {
  await connection()
  const res = await fetch(`${API_URL}/api/user`)
  if (!res.ok) throw new Error('Could not load user')
  return res.json()
}

// Reviews should always be fresh, so they are not cached either.
export async function getReviews() {
  await connection()
  const res = await fetch(`${API_URL}/api/reviews`)
  if (!res.ok) throw new Error('Could not load reviews')
  return res.json()
}
