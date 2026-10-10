import './globals.css'
import {Poppins} from 'next/font/google'
export const metadata = {
  title: 'ShopFast · Next.js (before)',
}

const poppins = Poppins({
  subsets : ["Latin"] ,
  weight : ['400' , '500' , '600'],
  variable  : '--font-poppins'
})
// Same setup as the React version's index.html:
// a web font from another server, and a heavy script loaded in <head>.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* SLOW ON PURPOSE (CLS): text jumps when this font arrives */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" /> */}
        {/* SLOW ON PURPOSE (LCP + INP): heavy third-party script blocks the page */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/chat-widget.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
