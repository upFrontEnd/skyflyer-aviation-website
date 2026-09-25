export function renderLiveStream() {
  return `
    <section class="live" aria-labelledby="live-title">
      <div class="container">
        <div class="live__head">
          <h2 class="live__title" id="live-title">Live en cours</h2>
          <a class="btn btn--purple" href="#">Voir tous les lives <span aria-hidden="true">&rarr;</span></a>
        </div>

        <div class="live__panel">
          <div class="live__content">
            <div class="live__player" role="img" aria-label="Aperçu du stream en direct">
              <span class="live__player-badge">LIVE</span>
              <div class="live__cam" role="img" aria-label="Webcam du streamer"></div>
            </div>
            <div class="live__info">
              <div class="live__thumb" role="img" aria-label="Miniature de la vidéo en direct"></div>
              <p class="live__text">
                [FR/EN] [FlightFactor February Fly-In] Easyjet - Airbus A-319 Toliss - Paris LFPG -&gt;
                Copenhagen EKCH
              </p>
            </div>
          </div>
          <div class="live__footer">
            <div class="live__status">
              <span class="live__status-label">LIVE</span>
              <span class="live__status-sub">STREAMING</span>
            </div>
            <span class="live__dot" aria-hidden="true"></span>
            <a class="live__cta" href="#" target="_blank" rel="noopener">Rejoignez-nous sur Twitch</a>
          </div>
        </div>
      </div>
    </section>
  `
}
