<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import liveNowAnimation from '../assets/Live now animation.json'
import { useTwitchStream, TWITCH_CHANNEL } from '../composables/useTwitchStream.js'
import { trackEvent } from '../composables/useAnalytics.js'
import { useLocale } from '../composables/useLocale.js'

const hostname = window.location.hostname
const twitchEmbedUrl = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${hostname}&muted=true`
const twitchChatUrl = `https://www.twitch.tv/embed/${TWITCH_CHANNEL}/chat?parent=${hostname}&darkpopout`

const { stream, loading, error } = useTwitchStream()
const { locale } = useLocale()

const t = computed(() => locale.value === 'fr' ? {
  liveTitle:    'Live en cours',
  offlineTitle: 'Stream Offline',
  loadBtn:      'Charger le lecteur et le tchat Twitch',
  playerTitle:  'Lecteur Twitch',
  chatTitle:    'Tchat Twitch',
  loading:      'Chargement du live…',
  gameAlt:      (name) => `Jaquette du jeu ${name}`,
} : {
  liveTitle:    'Live now',
  offlineTitle: 'Stream Offline',
  loadBtn:      'Load the Twitch player and chat',
  playerTitle:  'Twitch player',
  chatTitle:    'Twitch chat',
  loading:      'Loading stream…',
  gameAlt:      (name) => `Game cover: ${name}`,
})

// isLiveLoaded reste à false tant que le
// visiteur n'a pas cliqué sur la façade (miniature + bouton) : les deux
// iframes ne sont créées qu'à ce moment-là, sur un vrai geste utilisateur
// ce qui permet en plus à l'autoplay muet de Twitch de fonctionner sans
// contrainte de visibilité au chargement.
const isLiveLoaded = ref(false)

const lottieContainer = ref(null)
let lottieAnimation = null

watch(lottieContainer, (container) => {
  lottieAnimation?.destroy()
  lottieAnimation = container
    ? lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: liveNowAnimation
      })
    : null
})

// onUnmounted : filet de sécurité si LiveStream.vue tout entier était un
// jour retiré du DOM pendant que l'animation tourne encore.
onUnmounted(() => {
  lottieAnimation?.destroy()
})
</script>

<template>
  <section class="live" aria-labelledby="live-title">
    <div class="container">
      <div class="live__panel">
        <div class="live__head" :class="{ 'live__head--offline': !stream }">
          <div v-if="stream?.boxArtUrl" class="live__badge-anim" ref="lottieContainer" aria-hidden="true"></div>
          <div v-else class="live__badge-off"></div>

          <h2 v-if="stream?.boxArtUrl" class="live__title" id="live-title">{{ t.liveTitle }}</h2>
          <h2 v-else class="live__title" id="live-title">{{ t.offlineTitle }}</h2>
        </div>

        <div v-show="stream" class="live__content">
          <button
            v-if="!isLiveLoaded"
            type="button"
            class="live__facade"
            @click="isLiveLoaded = true; trackEvent('twitch_live_click', { channel: TWITCH_CHANNEL })"
          >
            <!--
              thumbnailUrl : vraie capture du live, réactualisée toutes les
              60s par useTwitchStream (voir withCacheBust) — contrairement à
              boxArtUrl (jaquette du jeu, fixe), elle donne l'impression que
              la façade est "vivante" sans jamais charger le vrai lecteur.
            -->
            <img v-if="stream?.thumbnailUrl" class="live__facade-bg" :src="stream.thumbnailUrl" alt="" aria-hidden="true" />
            <span class="live__facade-overlay">
              <span class="live__facade-play" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
              </span>
              <span class="live__facade-label">
                {{ stream ? stream.title : t.loadBtn }}
              </span>
            </span>
          </button>

          <template v-else>
            <div class="live__main">
              <iframe
                class="live__player"
                :src="twitchEmbedUrl"
                :title="t.playerTitle"
                allowfullscreen
              ></iframe>
              <div class="live__info">
                <img
                  v-if="stream?.boxArtUrl"
                  class="live__thumb"
                  :src="stream.boxArtUrl"
                  :alt="t.gameAlt(stream.gameName)"
                />

                <p v-if="loading" class="live__text">{{ t.loading }}</p>
                <p v-else-if="stream" class="live__text">{{ stream.title }}</p>
              </div>
            </div>

            <iframe
              class="live__chat"
              :src="twitchChatUrl"
              :title="t.chatTitle"
            ></iframe>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
