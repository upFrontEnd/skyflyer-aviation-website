<script setup>
import liveUrl from '../assets/live.png'
import { useTwitchStream } from '../composables/useTwitchStream.js'

// Chaîne de test pendant le développement (voir README) : à remplacer par
// la vraie chaîne Skyflyer Aviation avant la mise en production.
const TWITCH_CHANNEL = 'zerator'

// window.location n'est PAS accessible directement dans un <template> Vue
// (seule une petite liste de globaux comme Math/Date est autorisée) : il
// faut l'exposer explicitement ici pour pouvoir l'utiliser plus bas.
const hostname = window.location.hostname

// Le paramètre parent est exigé par le lecteur Twitch : il doit correspondre
// au domaine qui affiche la page, sinon Twitch refuse d'afficher le stream
// (protection contre l'intégration sur des sites tiers non autorisés).
// hostname s'adapte tout seul : "localhost" en dev, le vrai domaine une fois
// déployé.
const twitchEmbedUrl = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${hostname}&muted=true`

const { stream, loading, error } = useTwitchStream(TWITCH_CHANNEL)
</script>

<template>
  <section class="live" aria-labelledby="live-title">
    <div class="container">
      <div class="live__panel">
        <div class="live__head">
          <h2 class="live__title" id="live-title">Live en cours</h2>
        </div>

        <div class="live__content">
          <iframe
            class="live__player"
            :src="twitchEmbedUrl"
            title="Lecteur Twitch"
            allowfullscreen
          ></iframe>
          <div class="live__info">
            <!-- stream?.boxArtUrl : l'optional chaining évite une erreur si
                 stream est encore null (chargement en cours, ou hors ligne). -->
            <img
              v-if="stream?.boxArtUrl"
              class="live__thumb"
              :src="stream.boxArtUrl"
              :alt="`Jaquette du jeu ${stream.gameName}`"
            />
            <div v-else class="live__thumb" role="img" aria-label="Jeu actuellement joué"></div>

            <p v-if="loading" class="live__text">Chargement du live…</p>
            <p v-else-if="error" class="live__text">Infos du live indisponibles ({{ error }})</p>
            <p v-else-if="stream" class="live__text">{{ stream.title }}</p>
            <p v-else class="live__text">Actuellement hors ligne</p>
          </div>
        </div>
        <div class="live__footer">
          <img class="live__badge" :src="liveUrl" alt="Live streaming - Rejoignez-nous sur Twitch" />
        </div>
      </div>
    </div>
  </section>
</template>
