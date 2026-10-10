// Mock "backend" for the workshop. No packages needed: run with `node shared/api/server.mjs`
// Every endpoint waits on purpose, like a real slow backend would.
import http from 'node:http'

const PORT = Number(process.env.PORT || 4000)

// How long each endpoint waits before answering (milliseconds)
const DELAY = {
  user: 800,
  products: 1500,
  reviews: 2500,
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Small seeded random generator, so every run gives the same data
function seeded(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = seeded(42)
const pick = (list) => list[Math.floor(rand() * list.length)]

const adjectives = ['Classic', 'Premium', 'Everyday', 'Handmade', 'Organic', 'Smart', 'Vintage', 'Festive', 'Cotton', 'Silk']
const colours = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Maroon', 'Teal', 'Grey', 'Pink']
const items = [
  ['Kurta', 'Clothing'], ['Saree', 'Clothing'], ['Jacket', 'Clothing'], ['Dupatta', 'Clothing'],
  ['Sneakers', 'Footwear'], ['Sandals', 'Footwear'],
  ['Lamp', 'Home'], ['Mug', 'Home'], ['Bottle', 'Home'],
  ['Headphones', 'Electronics'], ['Watch', 'Electronics'],
  ['Notebook', 'Stationery'], ['Backpack', 'Accessories'], ['Wallet', 'Accessories'],
]

// 5,000 products for the big searchable catalog
const catalog = Array.from({ length: 5000 }, (_, i) => {
  const [noun, category] = pick(items)
  return {
    id: i + 1,
    name: `${pick(adjectives)} ${pick(colours)} ${noun}`,
    category,
    price: Math.round(199 + rand() * 9800),
    rating: Math.round((3 + rand() * 2) * 10) / 10,
    addedOn: new Date(Date.UTC(2024, 0, 1) + Math.floor(rand() * 600) * 86400000).toISOString(),
  }
})

// The big banner at the top. The image is 4000px wide and about 2.6 MB on purpose.
const hero = {
  title: 'Festive Collection 2026',
  subtitle: 'New arrivals for the season, delivered across India.',
  image: '/images/hero.jpg',
  width: 4000,
  height: 2200,
}

// Six featured products. Each image is 2400px and about 1.7 MB on purpose.
const featured = Array.from({ length: 6 }, (_, i) => ({
  id: 9000 + i,
  name: `Featured product ${i + 1}`,
  price: 999 + i * 500,
  image: `/images/product-${i + 1}.jpg`,
  width: 2400,
  height: 2400,
}))

const reviews = [
  { id: 1, author: 'Ananya', rating: 5, text: 'Delivery was quick and the quality is great.' },
  { id: 2, author: 'Rahul', rating: 4, text: 'Good value for money. Size chart was accurate.' },
  { id: 3, author: 'Meera', rating: 5, text: 'Loved the colours, exactly like the photos.' },
  { id: 4, author: 'Arjun', rating: 3, text: 'Product is fine, but the website felt slow on my phone.' },
  { id: 5, author: 'Sana', rating: 4, text: 'Easy returns and helpful support team.' },
  { id: 6, author: 'Vikram', rating: 5, text: 'Ordering again for Diwali gifts.' },
]

function user() {
  return {
    name: 'Priya',
    lastVisit: new Date(Date.now() - 3 * 86400000).toISOString(),
  }
}

const routes = {
  '/api/user': async () => { await sleep(DELAY.user); return user() },
  '/api/products': async () => { await sleep(DELAY.products); return { hero, featured, catalog } },
  '/api/reviews': async () => { await sleep(DELAY.reviews); return reviews },
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const path = new URL(req.url, 'http://localhost').pathname
  const handler = routes[path]
  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }
  const started = Date.now()
  const body = await handler()
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
  console.log(`${req.method} ${path} -> ${Date.now() - started} ms`)
})

server.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`)
  console.log('Endpoints: /api/user (0.8s), /api/products (1.5s), /api/reviews (2.5s)')
})
