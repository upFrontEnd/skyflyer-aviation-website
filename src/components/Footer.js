import { socialLinks } from '../data/social.js'

function socialTemplate(social) {
  return `
    <a class="footer__social-link" href="${social.href}" aria-label="${social.label}" target="_blank" rel="noopener">
      <span class="footer__social-icon footer__social-icon--${social.id}" aria-hidden="true"></span>
    </a>
  `
}

export function renderFooter() {
  const links = socialLinks.map(socialTemplate).join('')
  const year = new Date().getFullYear()

  return `
    <footer class="footer">
      <div class="container">
        <p class="footer__lead">Rejoignez moi sur mes réseaux sociaux</p>
        <div class="footer__social">
          ${links}
        </div>
        <p class="footer__copy">Skyflyer Aviation © ${year}</p>
      </div>
    </footer>
  `
}
