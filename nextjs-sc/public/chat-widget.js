// A FAKE third-party chat widget, like the ones many websites add.
// It deliberately keeps the browser busy for 600 ms when it loads,
// the way heavy real-world widgets, ad scripts and trackers often do.
(function () {
  var start = Date.now()
  while (Date.now() - start < 600) {
    // busy: the browser cannot draw or respond to taps while this runs
  }

  function addButton() {
    var button = document.createElement('button')
    button.textContent = 'Chat with us'
    button.setAttribute('aria-label', 'Open chat')
    button.style.cssText =
      'position:fixed;right:20px;bottom:20px;padding:14px 22px;border:none;border-radius:999px;' +
      'background:#1f6a9e;color:#fff;font-size:16px;box-shadow:0 6px 18px rgba(0,0,0,.2);cursor:pointer;z-index:50'
    button.onclick = function () {
      alert('This is a demo chat widget.')
    }
    document.body.appendChild(button)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton)
  } else {
    addButton()
  }
})()
