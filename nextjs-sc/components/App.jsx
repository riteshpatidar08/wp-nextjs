'use client'
// ↑ The ONLY change from the React version: tells Next.js this file runs in the browser.

import { useEffect, useState } from 'react'
import { API_URL } from '../lib/config'
import Spinner from './Spinner'
import PromoBanner from './PromoBanner'
import Header from './Header'
import Store from './Store'

// Only after that does <Store /> mount and start ITS request (a waterfall).
export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/user`)
      .then((res) => res.json())
      .then(setUser)
  }, [])

  if (!user) return <Spinner />

  return (
    <>
      <PromoBanner />
      <Header user={user} />
      <main className="container">
        <Store />
      </main>
    </>
  )
}
