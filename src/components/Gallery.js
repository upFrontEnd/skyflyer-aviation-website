import { screenshots } from '../data/screenshots.js'

function screenshotTemplate(shot) {
  return `<li class="gallery__item" role="img" aria-label="${shot.alt}"></li>`
}

export function renderGallery() {
  const items = screenshots.map(screenshotTemplate).join('')

  return `
    <section class="gallery" id="realisation" aria-labelledby="gallery-title">
      <div class="container">
        <h2 class="gallery__title" id="gallery-title">Screenshots</h2>
        <ul class="gallery__grid">
          ${items}
        </ul>
      </div>
    </section>
  `
}
