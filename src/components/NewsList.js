import { news } from '../data/news.js'

function newsItemTemplate(item) {
  return `
    <article class="news-card">
      <div class="news-card__thumb">
        <span class="news-card__tag news-card__tag--${item.tagVariant}">${item.tag}</span>
      </div>
      <div class="news-card__body">
        <h3 class="news-card__title">${item.title}</h3>
        <span class="news-card__date">${item.date}</span>
      </div>
    </article>
  `
}

export function renderNewsList() {
  const items = news.map(newsItemTemplate).join('')

  return `
    <section class="news" id="actu" aria-labelledby="news-title">
      <div class="container">
        <div class="news__head">
          <h2 class="news__title" id="news-title">Actualités</h2>
          <a class="btn btn--blue" href="#">Voir toutes les actu <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div class="news__grid">
          ${items}
        </div>
      </div>
    </section>
  `
}
