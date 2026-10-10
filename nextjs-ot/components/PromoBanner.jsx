// Step 3 (CLS): the banner is part of the page from the very first moment,
// so it never pops in and pushes the page down.
// It is a server component now: no timer, no JavaScript sent to the browser.
export default function PromoBanner() {
  return <div className="promo">Festive sale: 20% off everything this week. Use code DIWALI20</div>
}
