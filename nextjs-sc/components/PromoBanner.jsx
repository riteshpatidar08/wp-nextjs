import { useEffect, useState } from 'react'


export default function PromoBanner() {
  // const [show, setShow] = useState(false)

  // useEffect(() => {
  //   const timer = setTimeout(() => setShow(true), 2000)
  //   return () => clearTimeout(timer)
  // }, [])

  // if (!show) return null

  return <div className="promo">Festive sale: 20% off everything this week. Use code DIWALI20</div>
}
