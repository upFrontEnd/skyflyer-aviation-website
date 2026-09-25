export function renderLatestVideo() {
  return `
    <section class="video" aria-labelledby="video-title">
      <div class="container">
        <div class="video__head">
          <h2 class="video__title" id="video-title">La dernière vidéo</h2>
          <a class="btn btn--blue" href="#">Voir toutes les vidéos <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div class="video__frame" role="img" aria-label="Lecteur de la dernière vidéo"></div>
      </div>
    </section>
  `
}
