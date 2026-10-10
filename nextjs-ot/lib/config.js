// The API is now called by the Next.js SERVER, not by the visitor's browser.
// 127.0.0.1 (not "localhost") avoids an IPv6 lookup problem in Node.js.
export const API_URL = process.env.API_URL || 'http://127.0.0.1:4000'
