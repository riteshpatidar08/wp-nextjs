# ShopFast: React vs Next.js performance demo

A small online shop, built three ways, for a live workshop on Web Vitals.

| Folder | What it is | Runs on |
|---|---|---|
| `react-slow/` | A React app (Vite), **slow on purpose** | http://localhost:4173 |
| `nextjs-slow/` | **The same code** moved into Next.js. Still slow. You fix this one live, using `CHANGES.md` | http://localhost:3000 |
| `nextjs-optimized/` | The finished result after every step in `CHANGES.md`. Your backup if a live step goes wrong | http://localhost:3001 |
| `shared/api/` | A fake backend that answers slowly (0.8 s, 1.5 s, 2.5 s) | http://localhost:4000 |
| `shared/public/` | Large, unoptimized images and a heavy fake "chat widget", copied into each app automatically | |

## What makes the slow version slow

Every problem is on purpose, and each one maps to a Web Vital from the slides:

| Problem in the code | Where | Hurts |
|---|---|---|
| The page is empty until JavaScript loads, then fetches data in a chain: user → products → reviews | `App.jsx`, `Store.jsx`, `Reviews.jsx` | **LCP** |
| A 4000px, 2.6 MB hero image and six 2400px, 1.7 MB product images, sent to every phone | `Hero.jsx`, `FeaturedGrid.jsx` | **LCP** |
| Images have no width/height, so the page jumps when they arrive | `Hero.jsx`, `FeaturedGrid.jsx`, CSS | **CLS** |
| A sale banner pops in at the top after 2 seconds | `PromoBanner.jsx` | **CLS** |
| The font loads from Google's server, so text jumps from Arial to Poppins | `index.html` / `layout.jsx` | **CLS** |
| A "chat widget" script keeps the browser busy for 600 ms, loaded in `<head>` | `chat-widget.js` | **INP**, **LCP** |
| Search re-sorts 5,000 products, formats 10,000 dates and draws up to 5,000 rows on every key press | `Catalog.jsx` | **INP** |
| Whole libraries (lodash, moment) shipped to the browser | `Catalog.jsx`, `Header.jsx` | **INP** |

## You need

- **Node.js 20.9 or newer** (Next.js 16 requires it). Check with `node -v`.
- **Google Chrome** (for Lighthouse and the Performance panel).
- An internet connection for `npm install` and for Google Fonts.

## Run it

Open **four terminals** in this folder.

**1. The fake backend (keep it running the whole time):**
```bash
node shared/api/server.mjs
```

**2. React (slow):**
```bash
cd react-slow
npm install
npm run build
npm run preview          # http://localhost:4173
```

**3. Next.js (before), the one you will fix live:**
```bash
cd nextjs-slow
npm install
npm run build
npm start                # http://localhost:3000
```

**4. Next.js (after), the finished version:**
```bash
cd nextjs-optimized
npm install
npm run build            # the API must be running: this build fetches the products once
npm start                # http://localhost:3001
```

`npm run dev` also works for exploring the code, but **always measure with `build` + `start`/`preview`**.
Dev mode is much slower and gives misleading scores.

## Suggested demo flow (about 45 minutes)

1. **Show the problem (10 min).** Open the React app on a throttled connection
   (DevTools → Network → "Slow 4G"). Point out the spinner, the late hero, the jumping banner,
   and the frozen search box. Run Lighthouse (Mobile) and write down the numbers.
2. **"Just switch to Next.js?" (5 min).** Open `nextjs-slow` (port 3000). Same numbers.
   Key message: *moving to Next.js alone changes nothing; using its features does.*
3. **Fix it live (25 min).** Follow `CHANGES.md` steps 1–8 in `nextjs-slow`. Rebuild and re-measure
   after steps 4, 6 and 8 to show the scores improving.
4. **Compare (5 min).** Fill in the results table at the end of `CHANGES.md`. If time is short,
   jump straight to `nextjs-optimized` (port 3001).

## Measuring tips

- Use an **Incognito window**, so browser extensions don't affect the score.
- Lighthouse → Device **Mobile**: it slows the CPU and network like a mid-range phone, which makes
  differences easy to see.
- Lab tests (Lighthouse) cannot measure INP, because nobody is tapping. They show **Total Blocking Time**
  instead. To see INP, use DevTools → **Performance** → **Live metrics** and type in the search box.
- For the optimized app, **open the page once before measuring**: the first visit resizes the images,
  and later visits reuse the resized copies.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Failed to fetch" or empty page | Start the API: `node shared/api/server.mjs` |
| `nextjs-optimized` build fails with "Could not load products" | The API must be running during `npm run build` |
| Images missing (404) | Run `npm run build` or `npm run dev` once; they copy `shared/public` into the app's `public/` folder |
| Port already in use | Change the port in that app's `package.json` scripts (`-p 3000`, `--port 4173`) |
| `npm install` fails on Next.js | Check `node -v` is 20.9 or newer |
