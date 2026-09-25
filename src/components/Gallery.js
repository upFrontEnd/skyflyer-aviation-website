import { screenshots } from '../data/screenshots.js'

const PREVIEW_COUNT = 12

function screenshotTemplate(shot) {
  return `
    <li class="gallery__item">
      <img class="gallery__img" src="${shot.src}" alt="${shot.alt}" loading="lazy" />
    </li>
  `
}

export function renderGallery() {
  const items = screenshots.slice(0, PREVIEW_COUNT).map(screenshotTemplate).join('')

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
