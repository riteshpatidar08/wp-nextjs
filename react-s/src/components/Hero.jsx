// SLOW ON PURPOSE (LCP + CLS):
// - a 4000px, ~2.6 MB JPEG is sent to every device, even small phones
// - no width/height, so the page jumps when the image finally arrives
// - the browser only discovers this image after two API calls have finished
import Image from 'next/image'
export default function Hero({ hero }) {
  return (
    <section className="hero">
      {/* <img src={hero.image} alt={hero.title} width= {hero.width}></img> */}
      <Image src={hero.image} alt={hero.title} width={hero.width}
height={hero.height} preload  sizes="(max-width: 1100px) 100vw, 1100px" className="hero-img" />
      <div className="hero-text">
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </div>
    </section>
  )
}
