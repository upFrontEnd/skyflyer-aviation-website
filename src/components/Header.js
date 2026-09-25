import { navigation } from '../data/navigation.js'
import logoUrl from '../assets/logo.png'
import waveUrl from '../assets/bg-header.png'

export function renderHeader() {
  const links = navigation
    .map((item) => `<li><a class="header__link" href="${item.href}">${item.label}</a></li>`)
    .join('')

  return `
    <header class="header" id="accueil">
      <div class="header__hero">
        <div class="container header__bar">
          <a class="header__logo" href="#accueil" aria-label="Skyflyer Aviation - accueil">
            <img class="header__logo-img" src="${logoUrl}" alt="Skyflyer Aviation" />
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
        <img class="header__wave" src="${waveUrl}" alt="" aria-hidden="true" />
      </div>
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
