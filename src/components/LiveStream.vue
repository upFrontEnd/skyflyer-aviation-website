<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import liveUrl from '../assets/live.png'
import liveNowAnimation from '../assets/Live now animation.json'
import { useTwitchStream } from '../composables/useTwitchStream.js'
import { useTheme } from '../composables/useTheme.js'

// Chaîne de test pendant le développement (voir README) : à remplacer par
// la vraie chaîne Skyflyer Aviation avant la mise en production.
const TWITCH_CHANNEL = 'londoncontroller'

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

// isDark vient du MÊME composable que le bouton de thème dans Header.vue
// (useTheme() renvoie toujours la même ref partagée, voir composables/useTheme.js) :
// pas besoin de le passer en props depuis un parent commun, n'importe quel
// composant peut le lire directement.
// computed() (et pas une simple const) car cette URL doit se recalculer
// chaque fois qu'isDark change — contrairement à twitchEmbedUrl ci-dessus,
// figée une fois pour toutes après le montage.
const { isDark } = useTheme()
const twitchChatUrl = computed(
  () => `https://www.twitch.tv/embed/${TWITCH_CHANNEL}/chat?parent=${hostname}${isDark.value ? '&darkpopout' : ''}`
)

const { stream, loading, error } = useTwitchStream(TWITCH_CHANNEL)

// Template ref : `lottieContainer` ci-dessous se lie automatiquement à
// l'élément du <template> qui porte ref="lottieContainer", mais seulement
// APRÈS le montage (avant onMounted, sa valeur est encore null). lottie-web
// n'est pas un composant Vue : c'est une lib JS qui a besoin d'un vrai
// noeud DOM pour injecter son rendu (ici en SVG), d'où l'usage direct d'un
// template ref plutôt que d'une prop/donnée réactive classique.
const lottieContainer = ref(null)
let lottieAnimation = null

onMounted(() => {
  lottieAnimation = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: liveNowAnimation
  })
})

// onUnmounted : hook symétrique d'onMounted, appelé juste avant que Vue ne
// retire le composant du DOM. lottie-web crée ses propres écouteurs/timers
// en interne ; sans destroy(), ils continueraient de tourner même après la
// disparition du composant (fuite mémoire) — un nettoyage que Vue ne peut
// pas deviner tout seul puisque lottie-web est extérieur à son système de
// réactivité.
onUnmounted(() => {
  lottieAnimation?.destroy()
})
</script>

<template>
  <section class="live" aria-labelledby="live-title">
    <div class="container">
      <div class="live__panel">
        <div class="live__head">
          <!-- ref="lottieContainer" : lottie-web dessine son SVG à l'intérieur
               de ce <div>, qui reste sinon vide (le rendu n'est pas piloté
               par le template Vue, juste hébergé dedans). -->
          <div class="live__badge-anim" ref="lottieContainer" aria-hidden="true"></div>
          <h2 class="live__title" id="live-title">Live en cours</h2>
        </div>

        <div class="live__content">
          <!--
            .live__main regroupe le lecteur ET la jaquette/titre en une seule
            colonne (empilés), pour que .live__chat, à côté, reste un item de
            grille "simple" dont la hauteur est étirée par .live__content sur
            toute la hauteur de cette colonne (comportement grid par défaut,
            align-items: stretch) — plus besoin de flex: 1 comme avant.
          -->
          <div class="live__main">
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

          <!-- Même paramètre parent que le lecteur vidéo plus haut, même
               raison. &darkpopout dans twitchChatUrl (computed) bascule le
               thème du tchat pour suivre le thème clair/sombre du site. -->
          <iframe
            class="live__chat"
            :src="twitchChatUrl"
            title="Tchat Twitch"
          ></iframe>
        </div>
        <div class="live__footer">
          <img class="live__badge" :src="liveUrl" alt="Live streaming - Rejoignez-nous sur Twitch" />
        </div>
      </div>
    </div>
  </section>
</template>
