;(function () {
  if (location.origin.includes('auto-drawing.com')) {
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerText = `.miit-link{display:inline-block!important;}`
    var s = document.head
    s.appendChild(style)
  }
})()
