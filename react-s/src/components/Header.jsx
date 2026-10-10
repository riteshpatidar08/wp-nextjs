import moment from 'moment'

// SLOW ON PURPOSE (less code): imports the whole "moment" library
// just to write "3 days ago".
export default function Header({ user }) {
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
