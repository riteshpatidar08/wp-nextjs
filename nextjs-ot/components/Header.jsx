import { Suspense } from 'react'
import moment from 'moment'
import { getUser } from '../lib/data'

// Step 6: the header frame (logo) shows instantly.
// Only the personal greeting waits for the user request, in its own Suspense box.
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

// Step 5: "moment" is still used here, but only on the SERVER.
// Server components send zero JavaScript to the browser, so it costs visitors nothing.
async function Greeting() {
  const user = await getUser()
  return (
    <p className="greeting">
      Hi, {user.name} · last visit {moment(user.lastVisit).fromNow()}
    </p>
  )
}
