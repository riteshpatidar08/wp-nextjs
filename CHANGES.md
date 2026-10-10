# CHANGES.md: making the Next.js app fast, step by step

You start in **`nextjs-slow/`**. It has exactly the same code as the React app, so it is just as slow.
Apply the steps below **in order**, inside `nextjs-slow/`. After the last step your folder will match
**`nextjs-optimized/`** (use that folder if you get stuck, or if a live demo goes wrong).

Each step says **which Web Vital it fixes**, **what to change**, and **what to say to students**.

| Step | Fix | Helps | Slide it matches |
|---|---|---|---|
| 1 | Load the font with `next/font` | CLS | "Steady fonts" |
| 2 | Load the chat widget later with `next/script` | INP, LCP | "Extras later" |
| 3 | Stop the banner popping in | CLS | "Save space" |
| 4 | Use `next/image` for all pictures | LCP, CLS | "Smaller images" / "Smart pictures" |
| 5 | Fetch data and build the page on the server | LCP | "Build on the server" / "Send less code" |
| 6 | Stream slow parts with `<Suspense>` | LCP | "Show what's ready" |
| 7 | Cache the product data with `"use cache"` | LCP | "Remember answers" |
| 8 | Make search fast: less work in the browser | INP | "Less code" |

> **Always measure a production build, not `npm run dev`.** Dev mode is slow on purpose (it adds
> debugging tools). For each measurement: keep the API running, then `npm run build && npm start`.

---

## Step 0: Measure the "before"

1. Start the API (in its own terminal, from the project root): `node shared/api/server.mjs`
2. In `nextjs-slow/`: `npm install`, then `npm run build && npm start` (opens on http://localhost:3000)
3. Open http://localhost:3000 in Chrome, in an **Incognito window** (extensions can skew results).
4. Open DevTools (F12) → **Lighthouse** → Device: **Mobile** → Category: **Performance** → **Analyze**.
5. Note the **Performance score, LCP, CLS** and **Total Blocking Time** (lab tests use TBT instead of INP).
6. For INP: DevTools → **Performance** panel → look at **Live metrics**, then type "kurta" quickly in
   the search box. Watch the INP number go red.

**Say to students:** "This is the same code as the React app. Moving to Next.js did nothing by itself.
The speed comes from using Next.js features. Let's add them one by one."

---

## Step 1: Steady fonts with `next/font` (fixes CLS)

**Problem:** the font comes from Google's server. Text first shows in Arial, then jumps when
Poppins arrives, because the two fonts are different sizes.

**Change `app/layout.jsx`:** remove the Google Fonts `<link>` and load the font with `next/font`.

```jsx
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: 'ShopFast · Next.js (after)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* the <link> to fonts.googleapis.com is GONE */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/chat-widget.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Change `app/globals.css`:** in the `body` rule, use the font that `next/font` set up:

```css
body {
  margin: 0;
  font-family: var(--font-poppins), Arial, sans-serif;   /* was: 'Poppins', Arial, sans-serif */
  color: #1b2333;
  background: #f7f6f2;
}
```

**Why it works:** Next.js downloads the font at build time and serves it from your own site (no trip
to another server). It also resizes the backup font to match Poppins, so text does not jump.

---

## Step 2: Load the chat widget later with `next/script` (fixes INP, helps LCP)

**Problem:** `chat-widget.js` sits in `<head>`. The browser must download and run it (600 ms of
busy work) **before** it can show anything, and the page cannot react to taps while it runs.

**Change `app/layout.jsx`:** delete the whole `<head>…</head>` block and add `<Script>` at the end of
`<body>`:

```jsx
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: 'ShopFast · Next.js (after)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        {children}
        <Script src="/chat-widget.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
```

**Why it works:** `strategy="lazyOnload"` waits until the page has loaded and the browser is idle.
The widget still appears, it just no longer gets in the way of the page.

---

## Step 3: Stop the banner popping in (fixes CLS)

**Problem:** the sale banner appears at the top after 2 seconds and pushes everything down.
Imagine trying to tap "Search" and the page jumps.

**Replace `components/PromoBanner.jsx`:**

```jsx
// The banner is part of the page from the first moment, so it never pushes content down.
export default function PromoBanner() {
  return <div className="promo">Festive sale: 20% off everything this week. Use code DIWALI20</div>
}
```

**Why it works:** content that is there from the start cannot shift anything.
*If a banner really must arrive late*, reserve its space instead, e.g. wrap it in
`<div style={{ minHeight: 52 }}>…</div>`, so the page does not move when it appears.

---

## Step 4: Smart pictures with `next/image` (fixes LCP and CLS)

**Problem:** every phone downloads a 4000px, 2.6 MB hero and six 2400px, 1.7 MB product images.
They have no width or height, so the page jumps when each one arrives.

**Replace `components/Hero.jsx`:**

```jsx
import Image from 'next/image'

export default function Hero({ hero }) {
  return (
    <section className="hero">
      <Image
        src={hero.image}
        alt={hero.title}
        width={hero.width}
        height={hero.height}
        sizes="(max-width: 1100px) 100vw, 1100px"
        preload
        className="hero-img"
      />
      <div className="hero-text">
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </div>
    </section>
  )
}
```

**Replace `components/FeaturedGrid.jsx`:**

```jsx
import Image from 'next/image'

export default function FeaturedGrid({ products }) {
  return (
    <section className="section">
      <h2>Featured</h2>
      <div className="grid">
        {products.map((product) => (
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
```

**Change `app/globals.css`:** add `height: auto` to both image rules:

```css
.hero-img { display: block; width: 100%; height: auto; }
.card-img { display: block; width: 100%; height: auto; }
```

**Why it works:**
- `sizes` lets Next.js send a small image to a phone and a bigger one to a laptop, in WebP format.
- `width` + `height` let the browser reserve the right space before the image arrives (no jump).
- `preload` (Next.js 16; it replaced the old `priority` prop) starts downloading the hero image early.
- Product cards are lazy-loaded by default: they download only when you scroll near them.

**Say to students:** "Open DevTools → Network → Img and compare the sizes. Megabytes became kilobytes.
But the hero still appears late, because the page still waits for two API calls in the browser.
The next step fixes that."

---

## Step 5: Build the page on the server (fixes LCP, sends less code)

This is the biggest change. Instead of the browser fetching data after the JavaScript loads,
**the server fetches the data and sends a finished page.**

**5a. Replace `lib/config.js`** (the API is now called by the server, not the browser):

```js
// 127.0.0.1 (not "localhost") avoids an IPv6 lookup problem in Node.js.
export const API_URL = process.env.API_URL || 'http://127.0.0.1:4000'
```

**5b. Create `lib/data.js`:**

```js
import { connection } from 'next/server'
import { API_URL } from './config'

export async function getProducts() {
  await connection()
  const res = await fetch(`${API_URL}/api/products`)
  if (!res.ok) throw new Error('Could not load products. Is the mock API running?')
  return res.json()
}

export async function getUser() {
  await connection()
  const res = await fetch(`${API_URL}/api/user`)
  if (!res.ok) throw new Error('Could not load user')
  return res.json()
}

export async function getReviews() {
  await connection()
  const res = await fetch(`${API_URL}/api/reviews`)
  if (!res.ok) throw new Error('Could not load reviews')
  return res.json()
}
```

(`connection()` means "run this for each real visitor". In Step 7 we take it out of `getProducts`
and cache the products instead.)

**5c. Replace `app/page.jsx`** (now a server component: there is no `'use client'`):

```jsx
import PromoBanner from '../components/PromoBanner'
import Header from '../components/Header'
import Hero from '../components/Hero'
import FeaturedGrid from '../components/FeaturedGrid'
import Reviews from '../components/Reviews'
import CatalogSection from '../components/CatalogSection'

export default function Page() {
  return (
    <>
      <PromoBanner />
      <Header />
      <main className="container">
        <Hero />
        <FeaturedGrid />
        <Reviews />
        <CatalogSection />
      </main>
    </>
  )
}
```

**5d. Replace `components/Header.jsx`:**

```jsx
import moment from 'moment'
import { getUser } from '../lib/data'

// moment is still used, but only on the SERVER, so it sends 0 KB to the browser.
export default async function Header() {
  const user = await getUser()
  return (
    <header className="site-header">
      <div className="container header-row">
        <p className="logo">ShopFast</p>
        <p className="greeting">
          Hi, {user.name} · last visit {moment(user.lastVisit).fromNow()}
        </p>
      </div>
    </header>
  )
}
```

**5e. In `components/Hero.jsx` and `components/FeaturedGrid.jsx`**, let each component fetch its
own data on the server. Change only the first lines:

```jsx
// Hero.jsx
import Image from 'next/image'
import { getProducts } from '../lib/data'

export default async function Hero() {
  const { hero } = await getProducts()
  // ...the rest stays exactly as in Step 4
```

```jsx
// FeaturedGrid.jsx
import Image from 'next/image'
import { getProducts } from '../lib/data'

export default async function FeaturedGrid() {
  const { featured: products } = await getProducts()
  // ...the rest stays exactly as in Step 4
```

**5f. Replace `components/Reviews.jsx`:**

```jsx
import { getReviews } from '../lib/data'

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
```

**5g. Create `components/CatalogSection.jsx`** (server: gets the data, hands it to the search box):

```jsx
import { getProducts } from '../lib/data'
import Catalog from './Catalog'

export default async function CatalogSection() {
  const { catalog } = await getProducts()
  return <Catalog items={catalog} />
}
```

**5h. In `components/Catalog.jsx`**, add this as the very first line (the search box needs the browser):

```jsx
'use client'
```

**5i. Delete** `components/App.jsx`, `components/Store.jsx` and `components/Spinner.jsx`. They are not needed any more.

**Why it works:** the three requests now run **at the same time on the server** (about 2.5 s,
the slowest one) instead of one after another in the browser (0.8 + 1.5 + 2.5 = 4.8 s, plus the
JavaScript download). The HTML arrives complete, so the browser finds the hero image straight away.

**Say to students:** "Open View Source. Before, it was an empty page. Now the products are in the HTML.
But we still wait 2.5 s for the slow reviews before ANYTHING shows. Let's fix that."

---

## Step 6: Show what's ready with `<Suspense>` (fixes LCP)

**Problem:** the server waits for the slowest request (reviews, 2.5 s) before sending the page.

**6a. Create `components/Skeletons.jsx`:**

```jsx
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
```

**6b. In `app/page.jsx`**, wrap `<Reviews />` in `<Suspense>`:

```jsx
import { Suspense } from 'react'
import { ReviewsSkeleton } from '../components/Skeletons'
// ...other imports stay the same

        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews />
        </Suspense>
```

**6c. Replace `components/Header.jsx`**, so the logo shows at once and only the greeting waits:

```jsx
import { Suspense } from 'react'
import moment from 'moment'
import { getUser } from '../lib/data'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-row">
        <p className="logo">ShopFast</p>
        <Suspense fallback={<span className="skeleton skeleton-text" aria-label="Loading greeting" />}>
          <Greeting />
        </Suspense>
      </div>
    </header>
  )
}

async function Greeting() {
  const user = await getUser()
  return (
    <p className="greeting">
      Hi, {user.name} · last visit {moment(user.lastVisit).fromNow()}
    </p>
  )
}
```

**6d. Add to `app/globals.css`** (you can delete the old `.spinner` rules):

```css
.skeleton { background: #ebe8df; border-radius: 12px; }
.skeleton-text { display: inline-block; width: 220px; height: 18px; border-radius: 6px; vertical-align: middle; }
.review-skeleton { min-height: 96px; }
```

**Why it works:** the server sends the page in pieces. Everything that is ready goes first, with grey
boxes where the slow parts will be. When the reviews arrive, they **stream into the same page** and
replace the grey boxes. The boxes are the same size as the real content, so nothing jumps.

---

## Step 7: Remember answers with `"use cache"` (fixes LCP)

**Problem:** every visitor still waits 1.5 s for the products, even though they are the same for everyone.

**7a. Replace `next.config.mjs`:**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

**7b. In `lib/data.js`**, change only `getProducts` (keep `getUser` and `getReviews` as they are), and
add the `next/cache` import at the top:

```js
import { cacheLife, cacheTag } from 'next/cache'
import { connection } from 'next/server'
import { API_URL } from './config'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  const res = await fetch(`${API_URL}/api/products`)
  if (!res.ok) throw new Error('Could not load products. Is the mock API running?')
  return res.json()
}
```

**Important:** the API must be running while you run `npm run build`, because Next.js now fetches the
products once, at build time.

**Why it works:** the products are fetched once and remembered for hours. Next.js also pre-builds
everything outside a `<Suspense>` box (banner, header frame, hero, featured, catalog) into a
**ready-made page** that is sent instantly. Only the greeting and reviews are filled in per visitor.
If products change, a server action can call `updateTag('products')` to refresh the saved copy.

**Say to students:** "Run `npm run build` and look at the route table: the page is now marked as
partially prerendered. Most of the page is ready before anyone asks for it."

---

## Step 8: Fast search (fixes INP)

**Problem:** every key press filters 5,000 products, sorts them with lodash, formats 10,000 dates with
moment, and draws up to 5,000 table rows. The input freezes.

**8a. Create `lib/fuzzy.js`** (the same typo-tolerant search, moved out of the component). Copy the
`fuzzyMatch` and `editDistance` functions from the bottom of `components/Catalog.jsx` into it, and put
`export` in front of `function fuzzyMatch`. (Or copy `lib/fuzzy.js` from `nextjs-optimized/`.)

**8b. Replace `components/CatalogSection.jsx`.** Do the one-time work on the server:

```jsx
import { getProducts } from '../lib/data'
import CatalogSearch from './CatalogSearch'

const dateFormat = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })

export default async function CatalogSection() {
  const { catalog } = await getProducts()

  const rows = [...catalog]
    .sort((a, b) => b.rating - a.rating || a.price - b.price)
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: `₹${item.price.toLocaleString('en-IN')}`,
      added: dateFormat.format(new Date(item.addedOn)),
      rating: item.rating,
    }))

  return <CatalogSearch rows={rows} />
}
```

**8c. Create `components/CatalogSearch.jsx`:**

```jsx
'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { fuzzyMatch } from '../lib/fuzzy'

const SHOW = 50

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
```

**8d. Delete `components/Catalog.jsx`**, then remove lodash (nothing uses it any more):

```bash
npm uninstall lodash
```

(Keep `moment`: the greeting still uses it, but only on the server, so it costs the browser nothing.)

**Why it works:**
- Sorting and formatting happen **once on the server**, not on every key press in the browser.
- `useDeferredValue` keeps typing smooth: the letter appears instantly, the list catches up a moment later.
- Drawing 50 rows instead of 5,000 is roughly 100 times less work for the browser.
- No lodash or moment code is downloaded by the browser.

---

## Step 9: Measure the "after"

Keep the API running, then in `nextjs-slow/` run `npm run build && npm start`. **Open the page once
first** (the first visit resizes the images; later visits reuse them). Then run Lighthouse (Mobile)
again in Incognito, and try the search box with the Performance panel's Live metrics open.

Fill this in live with your class:

| | React (slow) | Next.js (before) | Next.js (after) |
|---|---|---|---|
| Performance score | [__] | [__] | [__] |
| LCP | [__] | [__] | [__] |
| CLS | [__] | [__] | [__] |
| Total Blocking Time | [__] | [__] | [__] |
| INP (typing "kurta") | [__] | [__] | [__] |
| Hero image size (Network tab) | [__] | [__] | [__] |

Numbers change from computer to computer, so measure on the machine you will present from.

---

## Bonus ideas (if you have time)

- **Next page, early:** add a second page (e.g. `app/about/page.jsx`) and link to it with
  `import Link from 'next/link'` → `<Link href="/about">About</Link>`. Next.js prepares the page
  as soon as the link is visible, so the click feels instant.
- **React Compiler:** `npm install -D babel-plugin-react-compiler`, then add `reactCompiler: true` to
  `next.config.mjs`. It memoizes components automatically, so fewer re-renders.
- **Load heavy widgets only when needed:** `next/dynamic` can load a big component (a chart, a map)
  only when it is shown.
