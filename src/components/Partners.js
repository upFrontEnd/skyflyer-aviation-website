import { partners } from '../data/partners.js'

function partnerTemplate(partner) {
  return `
    <li class="partners__item">
      <a href="${partner.href}" aria-label="${partner.name}">
        <span class="partners__badge">100 KTS<br />FLIGHTSIM CLUB</span>
      </a>
    </li>
  `
}

export function renderPartners() {
  const items = partners.map(partnerTemplate).join('')

  return `
    <section class="partners" id="partenaires" aria-labelledby="partners-title">
      <div class="container">
        <h2 class="partners__title" id="partners-title">Partenaires</h2>
        <ul class="partners__grid">
          ${items}
        </ul>
      </div>
    </section>
  `
}
