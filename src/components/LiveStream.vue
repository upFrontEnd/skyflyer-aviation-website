<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import liveNowAnimation from '../assets/Live now animation.json'
import { useTwitchStream, twitchChannel } from '../composables/useTwitchStream.js'
import { trackEvent } from '../composables/useAnalytics.js'
import { useLocale } from '../composables/useLocale.js'

const hostname = window.location.hostname
const twitchEmbedUrl = computed(() => `https://player.twitch.tv/?channel=${twitchChannel.value}&parent=${hostname}&muted=true`)
const twitchChatUrl = computed(() => `https://www.twitch.tv/embed/${twitchChannel.value}/chat?parent=${hostname}&darkpopout`)

const { stream, loading } = useTwitchStream()
const { locale } = useLocale()

const t = computed(() => locale.value === 'fr' ? {
  liveTitle:    'Live en cours',
  offlineTitle: 'Stream Offline',
  loadBtn:      'Charger le lecteur et le tchat Twitch',
  playerTitle:  'Lecteur Twitch',
  chatTitle:    'Tchat Twitch',
  loading:      'Chargement du live…',
  gameAlt:      (name) => `Jaquette du jeu ${name}`,
  channelLink:  'Suivre sur Twitch',
} : {
  liveTitle:    'Live now',
  offlineTitle: 'Stream Offline',
  loadBtn:      'Load the Twitch player and chat',
  playerTitle:  'Twitch player',
  chatTitle:    'Twitch chat',
  loading:      'Loading stream…',
  gameAlt:      (name) => `Game cover: ${name}`,
  channelLink:  'Follow on Twitch',
})

// isLiveLoaded reste à false tant que le
// visiteur n'a pas cliqué sur la façade (miniature + bouton) : les deux
// iframes ne sont créées qu'à ce moment-là, sur un vrai geste utilisateur
// ce qui permet en plus à l'autoplay muet de Twitch de fonctionner sans
// contrainte de visibilité au chargement.
const isLiveLoaded = ref(false)

// Pas de tchat sur mobile (peu utilisable sur petit écran). Même seuil que
// $bp-tablet dans _variables.scss, où le lecteur et le tchat passent côte à
// côte. v-if plutôt qu'un display: none en CSS : l'iframe n'est pas chargée
// du tout. Suit aussi les changements de largeur (rotation de l'écran).
const desktopQuery = window.matchMedia('(min-width: 768px)')
const showChat = ref(desktopQuery.matches)
const onQueryChange = (e) => { showChat.value = e.matches }
desktopQuery.addEventListener('change', onQueryChange)

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
  desktopQuery.removeEventListener('change', onQueryChange)
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

          <a
            class="live__channel-link"
            href="https://www.twitch.tv/skyflyeraviation/about"
            target="_blank"
            rel="noopener"
            @click="trackEvent('twitch_channel_click', { location: 'live_panel' })"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
              />
            </svg>
            <span>{{ t.channelLink }}</span>
          </a>
        </div>

        <div v-show="stream" class="live__content">
          <button
            v-if="!isLiveLoaded"
            type="button"
            class="live__facade"
            @click="isLiveLoaded = true; trackEvent('twitch_live_click', { channel: twitchChannel })"
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
              v-if="showChat"
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
