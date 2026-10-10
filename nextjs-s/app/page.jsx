import App from '../components/App'

// Exactly the same <App /> as the React version.
// Because App.jsx starts with 'use client', everything still runs in the browser:
// moving to Next.js alone does NOT make it fast. Using its features does.
export default function Page() {
  return <App />
}
