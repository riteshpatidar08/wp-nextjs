import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

// Step 1 (CLS): Next.js downloads the font at build time, serves it from our own
// site, and sizes the backup font to match, so text does not jump.
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
        {/* Step 2 (INP + LCP): the heavy chat widget now loads AFTER the page, when the browser is idle */}
        <Script src="/chat-widget.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
