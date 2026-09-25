<script setup>
// Aucune donnée de data/*.js ici, juste un asset importé : Vite transforme
// cet import en une URL vers l'image buildée (avec un hash dans son nom en
// production). C'est le seul "dynamique" du composant, tout le reste du
// template est du HTML statique.
import liveUrl from '../assets/live.png'
</script>

<template>
  <section class="live" aria-labelledby="live-title">
    <div class="container">
      <div class="live__panel">
        <div class="live__head">
          <h2 class="live__title" id="live-title">Live en cours</h2>
        </div>

        <div class="live__content">
          <div class="live__player" role="img" aria-label="Aperçu du stream en direct">
            <span class="live__player-badge">LIVE</span>
          </div>
          <div class="live__info">
            <div class="live__thumb" role="img" aria-label="Miniature de la vidéo en direct"></div>
            <p class="live__text">
              [FR/EN] [FlightFactor February Fly-In] Easyjet - Airbus A-319 Toliss - Paris LFPG ->
              Copenhagen EKCH
            </p>
          </div>
        </div>
        <div class="live__footer">
          <img class="live__badge" :src="liveUrl" alt="Live streaming - Rejoignez-nous sur Twitch" />
        </div>
      </div>
    </div>
  </section>
</template>
