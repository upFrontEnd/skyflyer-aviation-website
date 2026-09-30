<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import liveNowAnimation from '../assets/Live now animation.json'
import { useTwitchStream } from '../composables/useTwitchStream.js'

// const TWITCH_CHANNEL = 'airlinerslive'
const TWITCH_CHANNEL = 'londoncontroller'
const hostname = window.location.hostname
const twitchEmbedUrl = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${hostname}&muted=true`
const twitchChatUrl = `https://www.twitch.tv/embed/${TWITCH_CHANNEL}/chat?parent=${hostname}&darkpopout`

const { stream, loading, error } = useTwitchStream(TWITCH_CHANNEL)

// Template ref : `lottieContainer` se lie à l'élément du <template> qui
// porte ref="lottieContainer" — MAIS ce <div> est derrière un
// v-if="stream?.boxArtUrl" (voir plus bas) : il n'existe dans le DOM que
// lorsque le live est détecté, pas dès le montage du composant. onMounted()
// ne s'exécute qu'UNE SEULE FOIS pour tout le composant ; si stream est
// encore null à ce moment (l'appel à l'API Twitch n'a pas encore répondu),
// lottieContainer.value vaut encore `null` et l'animation ne s'initialise
// jamais, même une fois l'élément apparu plus tard. C'était le bug.
//
// watch(lottieContainer, ...) est la bonne solution : contrairement à
// onMounted, il se redéclenche à chaque fois que la valeur du ref change —
// donc à chaque fois que ce <div> apparaît OU disparaît du DOM (le live
// passe online puis offline puis online...). On (re)crée l'animation
// quand le conteneur apparaît, et on la détruit proprement quand il
// disparaît (sinon lottie-web garderait une référence vers un noeud DOM
// déjà retiré par Vue).
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
  playerObserver?.disconnect()
})

// Twitch refuse l'autoplay (même muet) si son iframe n'est pas suffisamment
// visible au moment de son initialisation (cf. "Autoplay disabled... viewport
// visibility" dans la console). Observer toute la <section> ne suffit pas :
// dès que son bord supérieur apparaît (badge/titre), l'observer se déclenche
// avec threshold par défaut (0 = 1px visible), alors que le lecteur plus bas
// dans .live__main est peut-être encore hors écran. On observe donc
// directement .live__main, avec threshold: 0.6 pour attendre qu'une bonne
// partie du bloc (lecteur + vignette) soit réellement visible avant de créer
// l'iframe. `{ once: true }` n'existe pas sur IntersectionObserver : on doit
// disconnect() nous-mêmes après le premier déclenchement.
const playerWrapper = ref(null)
const isPlayerVisible = ref(false)
let playerObserver = null

onMounted(() => {
  playerObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isPlayerVisible.value = true
        playerObserver.disconnect()
      }
    },
    { threshold: 0.6 }
  )
  playerObserver.observe(playerWrapper.value)
})
</script>

<template>
  <section class="live" aria-labelledby="live-title">
    <div class="container">
      <div class="live__panel">
        <div class="live__head">
          <div v-if="stream?.boxArtUrl" class="live__badge-anim" ref="lottieContainer" aria-hidden="true"></div>
          <div v-else class="live__badge-off"></div>
          
          <h2 v-if="stream?.boxArtUrl" class="live__title" id="live-title">Live en cours</h2>
          <h2 v-else class="live__title" id="live-title">Stream Offline</h2>
        </div>

        <div class="live__content">
          <div class="live__main" ref="playerWrapper">
            <iframe
              v-if="isPlayerVisible"
              class="live__player"
              :src="twitchEmbedUrl"
              title="Lecteur Twitch"
              allowfullscreen
            ></iframe>
            <div v-else class="live__player live__player--placeholder" aria-hidden="true"></div>
            <div class="live__info">
              <img
                v-if="stream?.boxArtUrl"
                class="live__thumb"
                :src="stream.boxArtUrl"
                :alt="`Jaquette du jeu ${stream.gameName}`"
              />

              <p v-if="loading" class="live__text">Chargement du live…</p>
              <p v-else-if="stream" class="live__text">{{ stream.title }}</p>
            </div>
          </div>

          <iframe
            class="live__chat"
            :src="twitchChatUrl"
            title="Tchat Twitch"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>
