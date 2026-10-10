// SLOW ON PURPOSE (LCP + CLS):
import Image from 'next/image'
// - a 4000px, ~2.6 MB JPEG is sent to every device, even small phones
// - no width/height, so the page jumps when the image finally arrives
// - the browser only discovers this image after two API calls have finished
export default function Hero({ hero }) {
  return (
    <section className="hero">
      <Image src={hero.image} height={1000} width={1000} alt={hero.title} className="hero-img" />
      <div className="hero-text">
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </div>
    </section>
  )
}
