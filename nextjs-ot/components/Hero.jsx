import Image from 'next/image'
import { getProducts } from '../lib/data'

// Step 4 (LCP + CLS) with next/image:
// - resizes the 4000px picture to fit each screen and converts it to WebP
// - width + height reserve the space, so nothing jumps
// - preload tells the browser to start downloading it immediately (it is the LCP element)
// Step 5: the data comes from the server, so the image is already in the first HTML.
export default async function Hero() {
  const { hero } = await getProducts()

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
