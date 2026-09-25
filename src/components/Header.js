import { navigation } from '../data/navigation.js'

export function renderHeader() {
  const links = navigation
    .map((item) => `<li><a class="header__link" href="${item.href}">${item.label}</a></li>`)
    .join('')

  return `
    <header class="header" id="accueil">
      <div class="header__bar">
        <div class="container header__bar-inner">
          <a class="header__logo" href="#accueil" aria-label="Skyflyer Aviation - accueil">
            <span class="header__logo-icon" aria-hidden="true"></span>
            <span class="header__logo-text">
              <span class="header__logo-title">SKYFLYER</span>
              <span class="header__logo-subtitle">AVIATION</span>
            </span>
          </a>

          <button
            class="header__toggle"
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded="false"
            data-nav-toggle
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav class="header__nav" data-nav>
            <ul class="header__list">
              ${links}
            </ul>
          </nav>
        </div>
      </div>
      <div class="header__hero" aria-hidden="true"></div>
    </header>
  `
}

export function mountHeader() {
  const toggle = document.querySelector('[data-nav-toggle]')
  const nav = document.querySelector('[data-nav]')
  if (!toggle || !nav) return

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('header__nav--open')
    toggle.setAttribute('aria-expanded', String(isOpen))
    toggle.classList.toggle('header__toggle--open', isOpen)
  })

  nav.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('header__nav--open')
      toggle.setAttribute('aria-expanded', 'false')
      toggle.classList.remove('header__toggle--open')
    })
  })
}
